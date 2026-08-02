/* =====================================
   TRUSTNOVA BANK
   ADMIN OPEN ACCOUNT
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const admin = await requireAdminAuth();

    if (!admin) {
        return;
    }

    setupOpenAccountForm();
    setupLogout();

    await loadCustomers();

});


/* =====================================
   SETUP FORM
===================================== */

function setupOpenAccountForm() {

    const form =
        document.getElementById(
            "openAccountForm"
        );

    if (!form) {
        return;
    }


    form.addEventListener(
        "submit",
        handleOpenAccount
    );

}


/* =====================================
   LOAD CUSTOMERS
===================================== */

async function loadCustomers() {

    const customerSelect =
        document.getElementById(
            "user_id"
        );

    if (!customerSelect) {
        return;
    }


    try {

        const {
            data: users,
            error
        } = await supabase
            .from("users")
            .select(
                "user_id, first_name, last_name, email"
            )
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        customerSelect.innerHTML = `
            <option value="">
                Select Customer
            </option>
        `;


        (users || []).forEach(user => {

            const option =
                document.createElement(
                    "option"
                );


            const name =
                `${user.first_name || ""} ${user.last_name || ""}`
                    .trim();


            option.value =
                user.user_id;


            option.textContent =
                `${name || "Customer"} — ${user.email || ""}`;


            customerSelect.appendChild(
                option
            );

        });

    }

    catch (error) {

        console.error(
            "Customer loading error:",
            error
        );

        customerSelect.innerHTML = `
            <option value="">
                Unable to load customers
            </option>
        `;

    }

}


/* =====================================
   CREATE ACCOUNT
===================================== */

async function handleOpenAccount(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const userId =
        getValue(
            "user_id"
        );


    const accountName =
        getValue(
            "account_name"
        );


    const accountType =
        getValue(
            "account_type"
        );


    const currency =
        getValue(
            "currency"
        ) || "USD";


    const branch =
        getValue(
            "branch"
        );


    const openingBalance =
        Number(
            getValue(
                "balance"
            ) || 0
        );


    if (!userId) {

        alert(
            "Please select a customer."
        );

        return;
    }


    if (!accountType) {

        alert(
            "Please select an account type."
        );

        return;
    }


    if (
        !Number.isFinite(
            openingBalance
        ) ||
        openingBalance < 0
    ) {

        alert(
            "Please enter a valid opening balance."
        );

        return;
    }


    const submitButton =
        form.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled =
            true;

        submitButton.textContent =
            "Opening Account...";

    }


    try {

        /* =====================================
           GENERATE ACCOUNT NUMBER
        ===================================== */

        const accountNumber =
            generateAccountNumber();


        /* =====================================
           CREATE ACCOUNT
        ===================================== */

        const {
            data: account,
            error
        } = await supabase
            .from("accounts")
            .insert({
                user_id: userId,
                account_number:
                    accountNumber,
                account_name:
                    accountName ||
                    "Customer Account",
                account_type:
                    accountType,
                balance:
                    openingBalance,
                status:
                    "Active",
                currency:
                    currency.toUpperCase(),
                branch:
                    branch || null,
                opened_date:
                    new Date().toISOString()
            })
            .select()
            .single();


        if (error) {
            throw error;
        }


        alert(
            "Account opened successfully."
        );


        console.log(
            "Account created:",
            account
        );


        form.reset();


        const accountNumberElement =
            document.getElementById(
                "generatedAccountNumber"
            );


        if (accountNumberElement) {

            accountNumberElement.textContent =
                account.account_number ||
                accountNumber;

        }


    }

    catch (error) {

        console.error(
            "Account creation error:",
            error
        );


        alert(
            "Unable to open the account. Please try again."
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Open Account";

        }

    }

}


/* =====================================
   GENERATE ACCOUNT NUMBER
===================================== */

function generateAccountNumber() {

    const timestamp =
        Date.now()
            .toString()
            .slice(-8);


    const random =
        Math.floor(
            1000 +
            Math.random() * 9000
        );


    return (
        timestamp +
        random
    );

}


/* =====================================
   GET INPUT VALUE
===================================== */

function getValue(
    elementId
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return "";
    }


    return String(
        element.value || ""
    ).trim();

}


/* =====================================
   LOGOUT
===================================== */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (!logoutButton) {
        return;
    }


    logoutButton.addEventListener(
        "click",
        adminLogout
    );

}

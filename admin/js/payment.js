/* =====================================
   TRUSTNOVA BANK
   ADMIN PAYMENT MANAGEMENT
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const admin = await requireAdminAuth();

    if (!admin) {
        return;
    }

    setupPaymentForm();
    setupLogout();

    await loadAccounts();

});


/* =====================================
   SETUP PAYMENT FORM
===================================== */

function setupPaymentForm() {

    const form =
        document.getElementById(
            "paymentForm"
        );

    if (!form) {
        return;
    }

    form.addEventListener(
        "submit",
        handlePayment
    );

}


/* =====================================
   LOAD CUSTOMER ACCOUNTS
===================================== */

async function loadAccounts() {

    const accountSelect =
        document.getElementById(
            "account_id"
        );

    if (!accountSelect) {
        return;
    }


    try {

        const {
            data: accounts,
            error
        } = await supabase
            .from("accounts")
            .select(
                "account_id, account_number, account_name, account_type, currency, status"
            )
            .order(
                "opened_date",
                {
                    ascending: false
                }
            );


        if (error) {
            throw error;
        }


        accountSelect.innerHTML = `
            <option value="">
                Select Account
            </option>
        `;


        (accounts || []).forEach(
            account => {

                const option =
                    document.createElement(
                        "option"
                    );


                option.value =
                    account.account_id;


                option.textContent =
                    `${maskAccountNumber(
                        account.account_number
                    )} — ${
                        account.account_name ||
                        account.account_type ||
                        "Account"
                    }`;


                if (
                    String(
                        account.status ||
                        ""
                    ).toLowerCase() !==
                    "active"
                ) {

                    option.disabled =
                        true;

                }


                accountSelect.appendChild(
                    option
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Account loading error:",
            error
        );


        accountSelect.innerHTML = `
            <option value="">
                Unable to load accounts
            </option>
        `;

    }

}


/* =====================================
   HANDLE PAYMENT
===================================== */

async function handlePayment(
    event
) {

    event.preventDefault();


    const form =
        event.currentTarget;


    const accountId =
        getValue(
            "account_id"
        );


    const amount =
        Number(
            getValue(
                "amount"
            )
        );


    const transactionType =
        getValue(
            "transaction_type"
        ) || "Payment";


    const description =
        getValue(
            "description"
        );


    const currency =
        getValue(
            "currency"
        ) || "USD";


    /* =====================================
       VALIDATION
    ===================================== */

    if (!accountId) {

        alert(
            "Please select an account."
        );

        return;
    }


    if (
        !Number.isFinite(amount) ||
        amount <= 0
    ) {

        alert(
            "Please enter a valid payment amount."
        );

        return;
    }


    if (!description) {

        alert(
            "Please enter a payment description."
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
            "Processing...";

    }


    try {

        /* =====================================
           CREATE TRANSACTION RECORD
        ===================================== */

        const {
            data: transaction,
            error
        } = await supabase
            .from("transactions")
            .insert({
                account_id:
                    accountId,

                amount:
                    amount,

                transaction_type:
                    transactionType,

                description:
                    description,

                status:
                    "Pending",

                currency:
                    currency.toUpperCase(),

                transaction_date:
                    new Date().toISOString()
            })
            .select()
            .single();


        if (error) {
            throw error;
        }


        console.log(
            "Payment transaction created:",
            transaction
        );


        alert(
            "Payment request created successfully."
        );


        form.reset();


    }

    catch (error) {

        console.error(
            "Payment creation error:",
            error
        );


        alert(
            "Unable to create the payment request. Please try again."
        );

    }

    finally {

        if (submitButton) {

            submitButton.disabled =
                false;

            submitButton.textContent =
                "Create Payment";

        }

    }

}


/* =====================================
   GET VALUE
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
   MASK ACCOUNT NUMBER
===================================== */

function maskAccountNumber(
    value
) {

    if (!value) {
        return "Account";
    }


    const number =
        String(value);


    if (number.length <= 4) {
        return number;
    }


    return (
        "**** **** " +
        number.slice(-4)
    );

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

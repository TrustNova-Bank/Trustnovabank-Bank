/* =====================================
   TRUSTNOVA BANK
   CUSTOMER DASHBOARD
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadDashboard();

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }

});


/* =====================================
   LOAD DASHBOARD
===================================== */

async function loadDashboard() {

    try {

        /* ---------------------------------
           1. CHECK SUPABASE LOGIN
        --------------------------------- */

        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();


        if (userError || !userData?.user) {

            window.location.href = "login.html";

            return;
        }


        const authUser = userData.user;


        /* ---------------------------------
           2. LOAD CUSTOMER PROFILE
           
           Registration stores the Supabase
           Auth ID in users.auth_user_id.
        --------------------------------- */

        const {
            data: profile,
            error: profileError
        } = await supabase
            .from("users")
            .select("*")
            .eq("auth_user_id", authUser.id)
            .maybeSingle();


        if (profileError) {

            console.error(
                "Profile error:",
                profileError
            );

            throw profileError;
        }


        if (!profile) {

            alert(
                "Customer profile could not be found."
            );

            await supabase.auth.signOut();

            window.location.href = "login.html";

            return;
        }


        /* ---------------------------------
           3. DISPLAY CUSTOMER INFORMATION
        --------------------------------- */

        displayProfile(profile);


        /* ---------------------------------
           4. LOAD CUSTOMER ACCOUNT
           
           IMPORTANT:
           accounts.user_id must correspond
           to public.users.user_id.
        --------------------------------- */

        const {
            data: account,
            error: accountError
        } = await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", profile.user_id)
            .maybeSingle();


        if (accountError) {

            console.error(
                "Account error:",
                accountError
            );

            throw accountError;
        }


        /* ---------------------------------
           5. DISPLAY ACCOUNT
        --------------------------------- */

        if (account) {

            displayAccount(account);

            await loadRecentTransactions(
                account.account_id
            );

        } else {

            displayNoAccount();

        }

    }

    catch (error) {

        console.error(
            "Dashboard loading error:",
            error
        );

        alert(
            "Unable to load your dashboard. Please try again."
        );

    }

}


/* =====================================
   DISPLAY PROFILE
===================================== */

function displayProfile(profile) {

    const fullName =
        `${profile.first_name || ""} ${profile.last_name || ""}`
        .trim();


    /* Name */

    setText(
        "user_name",
        fullName || "Customer"
    );


    /* Email */

    setText(
        "user_email",
        profile.email || "Not available"
    );


    /* Nationality */

    setText(
        "user_nationality",
        profile.nationality || "Not provided"
    );


    /* Customer status */

    setText(
        "user_status",
        profile.status || "Active"
    );


    /* Profile photo */

    const photo =
        document.getElementById("user_photo");


    if (
        photo &&
        profile.profile_photo
    ) {

        photo.src =
            profile.profile_photo;

    }

}


/* =====================================
   DISPLAY ACCOUNT
===================================== */

function displayAccount(account) {

    const money =
        new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    /* Balance */

    setText(
        "balance",
        money.format(
            Number(account.balance) || 0
        )
    );


    /* Account number */

    let accountNumber =
        account.account_number || "";


    accountNumber =
        String(accountNumber);


    if (accountNumber.length > 4) {

        accountNumber =
            "**** **** " +
            accountNumber.slice(-4);

    }


    setText(
        "account_number",
        accountNumber || "Not available"
    );


    /* Account type */

    setText(
        "account_type",
        account.account_type || "Standard"
    );


    /* Account status */

    setText(
        "user_status",
        account.status || "Active"
    );

}


/* =====================================
   NO ACCOUNT
===================================== */

function displayNoAccount() {

    setText(
        "balance",
        "$0.00"
    );


    setText(
        "account_number",
        "Not available"
    );


    setText(
        "account_type",
        "No account"
    );


    setText(
        "user_status",
        "Pending"
    );


    const transactionList =
        document.getElementById(
            "transactionList"
        );


    if (transactionList) {

        transactionList.innerHTML = `
            <tr>
                <td colspan="3">
                    No banking account is currently associated
                    with your profile.
                </td>
            </tr>
        `;

    }

}


/* =====================================
   LOAD RECENT TRANSACTIONS
===================================== */

async function loadRecentTransactions(
    accountId
) {

    const transactionList =
        document.getElementById(
            "transactionList"
        );


    if (!transactionList) {
        return;
    }


    try {

        const {
            data: transactions,
            error
        } = await supabase
            .from("transactions")
            .select("*")
            .eq("account_id", accountId)
            .order(
                "transaction_date",
                {
                    ascending: false
                }
            )
            .limit(5);


        if (error) {
            throw error;
        }


        transactionList.innerHTML = "";


        if (
            !transactions ||
            transactions.length === 0
        ) {

            transactionList.innerHTML = `
                <tr>
                    <td colspan="3">
                        No transactions yet.
                    </td>
                </tr>
            `;

            return;
        }


        const money =
            new Intl.NumberFormat(
                "en-US",
                {
                    style: "currency",
                    currency: "USD"
                }
            );


        transactions.forEach(
            transaction => {

                const row =
                    document.createElement("tr");


                const description =
                    transaction.description ||
                    "Bank transaction";


                const amount =
                    money.format(
                        Number(transaction.amount) || 0
                    );


                const status =
                    transaction.status ||
                    "Pending";


                row.innerHTML = `
                    <td>
                        ${escapeHTML(description)}
                    </td>

                    <td>
                        ${amount}
                    </td>

                    <td>
                        ${escapeHTML(status)}
                    </td>
                `;


                transactionList.appendChild(row);

            }
        );

    }

    catch (error) {

        console.error(
            "Transaction loading error:",
            error
        );


        transactionList.innerHTML = `
            <tr>
                <td colspan="3">
                    Unable to load recent transactions.
                </td>
            </tr>
        `;

    }

}


/* =====================================
   LOGOUT
===================================== */

async function logout() {

    try {

        await supabase.auth.signOut();

        localStorage.removeItem("user");

        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

        window.location.href =
            "login.html";

    }

}


/* =====================================
   HELPER
===================================== */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(elementId);


    if (element) {

        element.textContent =
            value;

    }

}


/* =====================================
   BASIC HTML ESCAPING
===================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}

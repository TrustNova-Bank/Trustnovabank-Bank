/* =====================================
   TRUSTNOVA BANK
   CUSTOMER TRANSACTION HISTORY
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener(
            "click",
            logout
        );
    }

    await loadTransactions();

});


/* =====================================
   LOAD TRANSACTIONS
===================================== */

async function loadTransactions() {

    try {

        /* ===============================
           1. CHECK AUTHENTICATION
        =============================== */

        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();


        if (
            userError ||
            !userData?.user
        ) {

            window.location.href =
                "login.html";

            return;
        }


        const authUser =
            userData.user;


        /* ===============================
           2. LOAD CUSTOMER PROFILE
        =============================== */

        const {
            data: profile,
            error: profileError
        } = await supabase
            .from("users")
            .select("*")
            .eq(
                "auth_user_id",
                authUser.id
            )
            .maybeSingle();


        if (profileError) {

            console.error(
                "Profile error:",
                profileError
            );

            throw profileError;
        }


        if (!profile) {

            await supabase.auth.signOut();

            window.location.href =
                "login.html";

            return;
        }


        /* ===============================
           3. LOAD CUSTOMER ACCOUNT
        =============================== */

        const {
            data: account,
            error: accountError
        } = await supabase
            .from("accounts")
            .select("*")
            .eq(
                "user_id",
                profile.user_id
            )
            .maybeSingle();


        if (accountError) {

            console.error(
                "Account error:",
                accountError
            );

            throw accountError;
        }


        /* ===============================
           4. NO ACCOUNT
        =============================== */

        if (!account) {

            displayNoTransactions();

            return;
        }


        /* ===============================
           5. LOAD TRANSACTIONS
        =============================== */

        const {
            data: transactions,
            error: transactionError
        } = await supabase
            .from("transactions")
            .select("*")
            .eq(
                "account_id",
                account.account_id
            )
            .order(
                "transaction_date",
                {
                    ascending: false
                }
            );


        if (transactionError) {

            console.error(
                "Transaction error:",
                transactionError
            );

            throw transactionError;
        }


        displayTransactions(
            transactions || []
        );

    }

    catch (error) {

        console.error(
            "Transaction loading error:",
            error
        );

        displayError();

    }

}


/* =====================================
   DISPLAY TRANSACTIONS
===================================== */

function displayTransactions(
    transactions
) {

    const table =
        document.getElementById(
            "transactionList"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    /* ===============================
       TOTAL TRANSACTIONS
    =============================== */

    const totalElement =
        document.getElementById(
            "totalTransactions"
        );


    if (totalElement) {

        totalElement.textContent =
            transactions.length;

    }


    let totalCredits = 0;
    let totalDebits = 0;


    /* ===============================
       NO TRANSACTIONS
    =============================== */

    if (
        transactions.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No transactions available.
                </td>
            </tr>
        `;


        updateSummary(
            totalCredits,
            totalDebits
        );


        return;
    }


    /* ===============================
       MONEY FORMAT
    =============================== */

    const money =
        new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    /* ===============================
       BUILD TABLE
    =============================== */

    transactions.forEach(
        transaction => {

            const amount =
                Number(
                    transaction.amount
                ) || 0;


            const type =
                String(
                    transaction.transaction_type ||
                    ""
                ).toLowerCase();


            const isCredit =
                type.includes("deposit") ||
                type.includes("credit") ||
                type.includes("received") ||
                type.includes("refund");


            if (isCredit) {

                totalCredits += amount;

            } else {

                totalDebits += amount;

            }


            /* Date */

            const date =
                transaction.transaction_date
                    ? new Date(
                        transaction.transaction_date
                    ).toLocaleDateString(
                        "en-US",
                        {
                            year: "numeric",
                            month: "short",
                            day: "numeric"
                        }
                    )
                    : "—";


            /* Description */

            const description =
                transaction.description ||
                "Bank transaction";


            /* Transaction type */

            const displayType =
                transaction.transaction_type ||
                (
                    isCredit
                        ? "Credit"
                        : "Debit"
                );


            /* Status */

            const status =
                transaction.status ||
                "Pending";


            /* Create row */

            const row =
                document.createElement(
                    "tr"
                );


            row.innerHTML = `

                <td>
                    ${escapeHTML(date)}
                </td>

                <td>
                    ${escapeHTML(description)}
                </td>

                <td>
                    ${escapeHTML(displayType)}
                </td>

                <td>
                    ${money.format(amount)}
                </td>

                <td>
                    ${escapeHTML(status)}
                </td>

            `;


            table.appendChild(row);

        }
    );


    /* ===============================
       UPDATE SUMMARY
    =============================== */

    updateSummary(
        totalCredits,
        totalDebits
    );

}


/* =====================================
   UPDATE SUMMARY
===================================== */

function updateSummary(
    credits,
    debits
) {

    const money =
        new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    const creditsElement =
        document.getElementById(
            "totalCredits"
        );


    const debitsElement =
        document.getElementById(
            "totalDebits"
        );


    if (creditsElement) {

        creditsElement.textContent =
            money.format(credits);

    }


    if (debitsElement) {

        debitsElement.textContent =
            money.format(debits);

    }

}


/* =====================================
   NO TRANSACTIONS
===================================== */

function displayNoTransactions() {

    const table =
        document.getElementById(
            "transactionList"
        );


    if (table) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No transactions available.
                </td>
            </tr>
        `;

    }


    const total =
        document.getElementById(
            "totalTransactions"
        );


    if (total) {

        total.textContent = "0";

    }


    updateSummary(
        0,
        0
    );

}


/* =====================================
   ERROR MESSAGE
===================================== */

function displayError() {

    const table =
        document.getElementById(
            "transactionList"
        );


    if (table) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load transactions.
                </td>
            </tr>
        `;

    }


    const total =
        document.getElementById(
            "totalTransactions"
        );


    if (total) {

        total.textContent = "0";

    }


    updateSummary(
        0,
        0
    );

}


/* =====================================
   LOGOUT
===================================== */

async function logout() {

    try {

        await supabase.auth.signOut();

        localStorage.removeItem(
            "user"
        );

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
   HTML SAFETY
===================================== */

function escapeHTML(value) {

    return String(value)
        .replace(
            /&/g,
            "&amp;"
        )
        .replace(
            /</g,
            "&lt;"
        )
        .replace(
            />/g,
            "&gt;"
        )
        .replace(
            /"/g,
            "&quot;"
        )
        .replace(
            /'/g,
            "&#039;"
        );

}

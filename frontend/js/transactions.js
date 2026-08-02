/* =====================================
   TRUSTNOVA BANK
   CUSTOMER TRANSACTION HISTORY
===================================== */

document.addEventListener("DOMContentLoaded", async () => {
    await loadTransactions();

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", logout);
    }
});


/* =====================================
   LOAD TRANSACTIONS
===================================== */

async function loadTransactions() {

    try {

        /* Check authentication */
        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            window.location.href = "login.html";
            return;
        }

        const authUser = userData.user;


        /* Find customer account */
        const {
            data: account,
            error: accountError
        } = await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", authUser.id)
            .maybeSingle();


        if (accountError) {
            throw accountError;
        }


        if (!account) {

            displayNoTransactions();

            return;
        }


        /* Load transactions */
        const {
            data: transactions,
            error: transactionError
        } = await supabase
            .from("transactions")
            .select("*")
            .eq("account_id", account.account_id)
            .order("transaction_date", {
                ascending: false
            });


        if (transactionError) {
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

function displayTransactions(transactions) {

    const table =
        document.getElementById(
            "transactionList"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    /* Update total count */
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


    /* No transactions */
    if (transactions.length === 0) {

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


    const money =
        new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    transactions.forEach(transaction => {

        const amount =
            Number(transaction.amount) || 0;


        const type =
            String(
                transaction.transaction_type || ""
            ).toLowerCase();


        /*
         * Determine whether transaction
         * is a credit or debit.
         */

        const isCredit =
            type.includes("deposit") ||
            type.includes("credit") ||
            type.includes("received");


        if (isCredit) {
            totalCredits += amount;
        } else {
            totalDebits += amount;
        }


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


        const description =
            transaction.description ||
            "Bank transaction";


        const displayType =
            transaction.transaction_type ||
            (isCredit ? "Credit" : "Debit");


        const status =
            transaction.status ||
            "Pending";


        const row =
            document.createElement("tr");


        row.innerHTML = `
            <td>${escapeHTML(date)}</td>

            <td>${escapeHTML(description)}</td>

            <td>${escapeHTML(displayType)}</td>

            <td>
                ${money.format(amount)}
            </td>

            <td>
                ${escapeHTML(status)}
            </td>
        `;


        table.appendChild(row);

    });


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


    updateSummary(0, 0);
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
   HTML SAFETY
===================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

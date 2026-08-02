/* =====================================
   TRUSTNOVA BANK
   ADMIN DASHBOARD
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const admin =
        await requireAdminAuth();

    if (!admin) {
        return;
    }

    await loadDashboardStats();

    await loadRecentTransactions();

    setupLogout();

});


/* =====================================
   LOAD DASHBOARD STATISTICS
===================================== */

async function loadDashboardStats() {

    try {

        /* =====================================
           TOTAL USERS
        ===================================== */

        const {
            count: userCount,
            error: userError
        } = await supabase
            .from("users")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );

        if (userError) {
            throw userError;
        }


        /* =====================================
           TOTAL ACCOUNTS
        ===================================== */

        const {
            count: accountCount,
            error: accountError
        } = await supabase
            .from("accounts")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );

        if (accountError) {
            throw accountError;
        }


        /* =====================================
           TOTAL TRANSACTIONS
        ===================================== */

        const {
            count: transactionCount,
            error: transactionError
        } = await supabase
            .from("transactions")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );

        if (transactionError) {
            throw transactionError;
        }


        /* =====================================
           TOTAL SUPPORT TICKETS
        ===================================== */

        const {
            count: ticketCount,
            error: ticketError
        } = await supabase
            .from("support_tickets")
            .select(
                "*",
                {
                    count: "exact",
                    head: true
                }
            );

        if (ticketError) {
            throw ticketError;
        }


        /* =====================================
           DISPLAY COUNTS
        ===================================== */

        setText(
            "totalUsers",
            userCount || 0
        );


        setText(
            "totalAccounts",
            accountCount || 0
        );


        setText(
            "totalTransactions",
            transactionCount || 0
        );


        setText(
            "totalTickets",
            ticketCount || 0
        );

    }

    catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );

        setText(
            "totalUsers",
            "—"
        );

        setText(
            "totalAccounts",
            "—"
        );

        setText(
            "totalTransactions",
            "—"
        );

        setText(
            "totalTickets",
            "—"
        );

    }

}


/* =====================================
   LOAD RECENT TRANSACTIONS
===================================== */

async function loadRecentTransactions() {

    const table =
        document.getElementById(
            "transactionList"
        );

    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="5">
                Loading transactions...
            </td>
        </tr>
    `;


    try {

        const {
            data: transactions,
            error
        } = await supabase
            .from("transactions")
            .select("*")
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


        table.innerHTML = "";


        if (
            !transactions ||
            transactions.length === 0
        ) {

            table.innerHTML = `
                <tr>
                    <td colspan="5">
                        No transactions found.
                    </td>
                </tr>
            `;

            return;
        }


        transactions.forEach(
            transaction => {

                const row =
                    document.createElement(
                        "tr"
                    );


                const date =
                    formatDate(
                        transaction.transaction_date
                    );


                const description =
                    transaction.description ||
                    "Bank transaction";


                const type =
                    transaction.transaction_type ||
                    "Transaction";


                const amount =
                    formatMoney(
                        transaction.amount,
                        transaction.currency
                    );


                const status =
                    transaction.status ||
                    "Pending";


                row.innerHTML = `

                    <td>
                        ${escapeHTML(date)}
                    </td>

                    <td>
                        ${escapeHTML(
                            description
                        )}
                    </td>

                    <td>
                        ${escapeHTML(type)}
                    </td>

                    <td>
                        ${escapeHTML(amount)}
                    </td>

                    <td>
                        ${escapeHTML(status)}
                    </td>

                `;


                table.appendChild(
                    row
                );

            }
        );

    }

    catch (error) {

        console.error(
            "Recent transactions error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="5">
                    Unable to load recent transactions.
                </td>
            </tr>
        `;

    }

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
        async () => {

            try {

                await supabase.auth.signOut();

            }

            catch (error) {

                console.error(
                    "Admin logout error:",
                    error
                );

            }


            window.location.href =
                "admin-login.html";

        }
    );

}


/* =====================================
   SET TEXT
===================================== */

function setText(
    elementId,
    value
) {

    const element =
        document.getElementById(
            elementId
        );


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(
    amount,
    currency = "USD"
) {

    const value =
        Number(amount) || 0;


    const currencyCode =
        String(
            currency || "USD"
        ).toUpperCase();


    try {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: currencyCode
            }
        ).format(
            value
        );

    }

    catch (error) {

        return (
            value.toFixed(2) +
            " " +
            currencyCode
        );

    }

}


/* =====================================
   FORMAT DATE
===================================== */

function formatDate(
    value
) {

    if (!value) {
        return "—";
    }


    const date =
        new Date(value);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";
    }


    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* =====================================
   HTML ESCAPING
===================================== */

function escapeHTML(
    value
) {

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

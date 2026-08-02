/* =====================================
   TRUSTNOVA BANK
   ADMIN TRANSACTION MANAGEMENT
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const admin = await requireAdminAuth();

    if (!admin) {
        return;
    }

    await loadAdminTransactions();

    setupTransactionSearch();

    setupLogout();

});


/* =====================================
   LOAD TRANSACTIONS
===================================== */

async function loadAdminTransactions(
    searchTerm = ""
) {

    const table =
        document.getElementById(
            "transactionList"
        );

    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="7">
                Loading transactions...
            </td>
        </tr>
    `;


    try {

        let query = supabase
            .from("transactions")
            .select("*")
            .order(
                "transaction_date",
                {
                    ascending: false
                }
            );


        const search =
            String(searchTerm)
                .trim();


        if (search) {

            const safeSearch =
                search.replace(
                    /[%_]/g,
                    ""
                );


            query = query.or(
                `description.ilike.%${safeSearch}%,transaction_type.ilike.%${safeSearch}%,status.ilike.%${safeSearch}%`
            );

        }


        const {
            data: transactions,
            error
        } = await query;


        if (error) {
            throw error;
        }


        displayTransactions(
            transactions || []
        );

    }

    catch (error) {

        console.error(
            "Admin transaction loading error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load transaction records.
                </td>
            </tr>
        `;

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


    const totalElement =
        document.getElementById(
            "totalTransactions"
        );


    if (totalElement) {

        totalElement.textContent =
            transactions.length;

    }


    if (transactions.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
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


            const amount =
                formatMoney(
                    transaction.amount,
                    transaction.currency
                );


            const type =
                transaction.transaction_type ||
                "Transaction";


            const description =
                transaction.description ||
                "Bank transaction";


            const status =
                transaction.status ||
                "Pending";


            row.innerHTML = `

                <td>
                    ${escapeHTML(
                        transaction.transaction_id ||
                        "—"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        transaction.account_id ||
                        "—"
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        date
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        description
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        type
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        amount
                    )}
                </td>

                <td>
                    ${escapeHTML(
                        status
                    )}
                </td>

            `;


            table.appendChild(row);

        }
    );

}


/* =====================================
   SEARCH
===================================== */

function setupTransactionSearch() {

    const searchInput =
        document.getElementById(
            "transactionSearch"
        );


    if (!searchInput) {
        return;
    }


    let searchTimer;


    searchInput.addEventListener(
        "input",
        () => {

            clearTimeout(
                searchTimer
            );


            searchTimer =
                setTimeout(
                    () => {

                        loadAdminTransactions(
                            searchInput.value
                        );

                    },
                    300
                );

        }
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
        ).format(value);

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

function formatDate(value) {

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

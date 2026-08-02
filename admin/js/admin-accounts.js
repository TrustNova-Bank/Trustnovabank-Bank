/* =====================================
   TRUSTNOVA BANK
   ADMIN ACCOUNT MANAGEMENT
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const admin = await requireAdminAuth();

    if (!admin) {
        return;
    }

    await loadAccounts();

    setupAccountSearch();
    setupLogout();

});


/* =====================================
   LOAD ACCOUNTS
===================================== */

async function loadAccounts(searchTerm = "") {

    const table =
        document.getElementById("accountList");

    if (!table) {
        return;
    }

    table.innerHTML = `
        <tr>
            <td colspan="9">
                Loading accounts...
            </td>
        </tr>
    `;

    try {

        let query = supabase
            .from("accounts")
            .select("*")
            .order(
                "opened_date",
                {
                    ascending: false
                }
            );

        const search =
            String(searchTerm).trim();

        if (search) {

            const safeSearch =
                search.replace(/[%_]/g, "");

            query = query.or(
                `account_number.ilike.%${safeSearch}%,account_name.ilike.%${safeSearch}%,account_type.ilike.%${safeSearch}%,status.ilike.%${safeSearch}%`
            );
        }

        const {
            data: accounts,
            error
        } = await query;

        if (error) {
            throw error;
        }

        displayAccounts(
            accounts || []
        );

    }

    catch (error) {

        console.error(
            "Account loading error:",
            error
        );

        table.innerHTML = `
            <tr>
                <td colspan="9">
                    Unable to load account records.
                </td>
            </tr>
        `;
    }
}


/* =====================================
   DISPLAY ACCOUNTS
===================================== */

function displayAccounts(accounts) {

    const table =
        document.getElementById(
            "accountList"
        );

    if (!table) {
        return;
    }

    table.innerHTML = "";

    const totalElement =
        document.getElementById(
            "totalAccounts"
        );

    if (totalElement) {

        totalElement.textContent =
            accounts.length;

    }

    if (accounts.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="9">
                    No accounts found.
                </td>
            </tr>
        `;

        return;
    }


    accounts.forEach(account => {

        const row =
            document.createElement("tr");


        const accountNumber =
            maskAccountNumber(
                account.account_number
            );


        const balance =
            formatMoney(
                account.balance,
                account.currency
            );


        const openedDate =
            formatDate(
                account.opened_date ||
                account.created_at
            );


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    account.account_id || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    account.user_id || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    accountNumber
                )}
            </td>

            <td>
                ${escapeHTML(
                    account.account_name ||
                    "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    account.account_type ||
                    "Standard"
                )}
            </td>

            <td>
                ${escapeHTML(
                    balance
                )}
            </td>

            <td>
                ${escapeHTML(
                    account.currency ||
                    "USD"
                )}
            </td>

            <td>
                ${escapeHTML(
                    account.status ||
                    "Active"
                )}
            </td>

            <td>
                ${escapeHTML(
                    openedDate
                )}
            </td>

        `;

        table.appendChild(row);

    });

}


/* =====================================
   ACCOUNT SEARCH
===================================== */

function setupAccountSearch() {

    const searchInput =
        document.getElementById(
            "accountSearch"
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

                        loadAccounts(
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
   MASK ACCOUNT NUMBER
===================================== */

function maskAccountNumber(value) {

    if (!value) {
        return "—";
    }


    const accountNumber =
        String(value);


    if (accountNumber.length <= 4) {
        return accountNumber;
    }


    return (
        "**** **** " +
        accountNumber.slice(-4)
    );

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(
    amount,
    currency = "USD"
) {

    const numericAmount =
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
            numericAmount
        );

    }

    catch (error) {

        return (
            numericAmount.toFixed(2) +
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

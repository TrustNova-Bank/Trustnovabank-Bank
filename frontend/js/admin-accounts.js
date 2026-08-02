/* =====================================
   TRUSTNOVA BANK
   ADMIN ACCOUNT MANAGEMENT
   SUPABASE
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const admin =
        await requireAdminAuth();

    if (!admin) {
        return;
    }

    await loadAccounts();

    setupLogout();

});


/* =====================================
   LOAD ACCOUNTS
===================================== */

async function loadAccounts() {

    const accountTable =
        document.getElementById("accountList");

    if (!accountTable) {
        return;
    }

    try {

        const {
            data: accounts,
            error
        } = await supabase
            .from("accounts")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


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

        accountTable.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load accounts.
                </td>
            </tr>
        `;
    }
}


/* =====================================
   DISPLAY ACCOUNTS
===================================== */

function displayAccounts(accounts) {

    const accountTable =
        document.getElementById("accountList");

    if (!accountTable) {
        return;
    }


    accountTable.innerHTML = "";


    updateAccountCount(
        accounts.length
    );


    if (accounts.length === 0) {

        accountTable.innerHTML = `
            <tr>
                <td colspan="7">
                    No customer accounts found.
                </td>
            </tr>
        `;

        return;
    }


    accounts.forEach(account => {

        const row =
            document.createElement("tr");


        const accountId =
            account.account_id ?? "—";


        const userId =
            account.user_id ?? "—";


        const accountNumber =
            account.account_number
                ? maskAccountNumber(
                    account.account_number
                )
                : "—";


        const accountType =
            account.account_type ||
            "Standard";


        const balance =
            formatCurrency(
                account.balance
            );


        const status =
            account.status ||
            "Active";


        const createdAt =
            formatDate(
                account.created_at
            );


        row.innerHTML = `

            <td>
                ${escapeHTML(accountId)}
            </td>

            <td>
                ${escapeHTML(userId)}
            </td>

            <td>
                ${escapeHTML(accountNumber)}
            </td>

            <td>
                ${escapeHTML(accountType)}
            </td>

            <td>
                ${escapeHTML(balance)}
            </td>

            <td>
                ${escapeHTML(status)}
            </td>

            <td>
                ${escapeHTML(createdAt)}
            </td>

        `;


        accountTable.appendChild(row);

    });

}


/* =====================================
   UPDATE ACCOUNT COUNT
===================================== */

function updateAccountCount(count) {

    const element =
        document.getElementById(
            "totalAccounts"
        );

    if (element) {

        element.textContent =
            count;
    }
}


/* =====================================
   SEARCH ACCOUNTS
===================================== */

function searchAccounts() {

    const searchInput =
        document.getElementById(
            "accountSearch"
        );


    const rows =
        document.querySelectorAll(
            "#accountList tr"
        );


    if (!searchInput) {
        return;
    }


    const searchValue =
        searchInput.value
            .trim()
            .toLowerCase();


    rows.forEach(row => {

        const text =
            row.textContent
                .toLowerCase();


        row.style.display =
            text.includes(searchValue)
                ? ""
                : "none";

    });

}


/* =====================================
   MASK ACCOUNT NUMBER
===================================== */

function maskAccountNumber(
    accountNumber
) {

    const value =
        String(accountNumber);


    if (value.length <= 4) {
        return value;
    }


    return (
        "**** **** " +
        value.slice(-4)
    );
}


/* =====================================
   FORMAT CURRENCY
===================================== */

function formatCurrency(
    amount
) {

    const value =
        Number(amount) || 0;


    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: "USD"
        }
    ).format(value);
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


    if (Number.isNaN(date.getTime())) {
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
   LOGOUT
===================================== */

function setupLogout() {

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            adminLogout
        );

    }
}


/* =====================================
   HTML SAFETY
===================================== */

function escapeHTML(value) {

    return String(value ?? "")
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

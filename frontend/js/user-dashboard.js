/* =====================================
   TRUSTNOVA BANK
   CUSTOMER USER DASHBOARD
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const authenticated =
        await checkCustomerAuthentication();

    if (!authenticated) {
        return;
    }

    await loadUserDashboard();

    setupLogout();

});

/* =====================================
   CHECK CUSTOMER AUTHENTICATION
===================================== */

async function checkCustomerAuthentication() {

    try {

        const {
            data,
            error
        } = await supabase.auth.getUser();

        if (
            error ||
            !data?.user
        ) {

            window.location.href =
                "login.html";

            return false;
        }

        return true;

    }

    catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        window.location.href =
            "login.html";

        return false;

    }

}

/* =====================================
   LOAD USER DASHBOARD
===================================== */

async function loadUserDashboard() {

    try {

        const {
            data: authData
        } = await supabase.auth.getUser();

        const authUser =
            authData?.user;

        if (!authUser) {
            return;
        }

        /* =====================================
           LOAD CUSTOMER PROFILE
        ===================================== */

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
            throw profileError;
        }

        if (!profile) {

            showMessage(
                "Customer profile could not be found."
            );

            return;
        }

        displayProfile(
            profile
        );

        /* =====================================
           LOAD CUSTOMER ACCOUNT
        ===================================== */

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
            throw accountError;
        }

        if (!account) {

            displayNoAccount();

            return;
        }

        displayAccount(
            account
        );

        /* =====================================
           LOAD RECENT TRANSACTIONS
        ===================================== */

        await loadRecentTransactions(
            account.account_id
        );

    }

    catch (error) {

        console.error(
            "User dashboard error:",
            error
        );

        showMessage(
            "Unable to load the dashboard."
        );

    }

}

/* =====================================
   DISPLAY PROFILE
===================================== */

function displayProfile(
    profile
) {

    const fullName =
        `${profile.first_name || ""} ${profile.last_name || ""}`
            .trim();

    setText(
        "user_name",
        fullName || "Customer"
    );

    setText(
        "user_email",
        profile.email ||
        "Not available"
    );

    setText(
        "user_nationality",
        profile.nationality ||
        "Not provided"
    );

    setText(
        "customer_id",
        profile.user_id ||
        "Not available"
    );

    setText(
        "user_status",
        profile.status ||
        "Active"
    );

    const photo =
        document.getElementById(
            "user_photo"
        );

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

function displayAccount(
    account
) {

    const currency =
        account.currency ||
        "USD";

    const balance =
        formatMoney(
            account.balance,
            currency
        );

    setText(
        "account_balance",
        balance
    );

    setText(
        "account_number",
        maskAccountNumber(
            account.account_number
        )
    );

    setText(
        "account_type",
        account.account_type ||
        "Standard"
    );

    setText(
        "account_status",
        account.status ||
        "Active"
    );

    setText(
        "account_currency",
        currency
    );

    setText(
        "account_branch",
        account.branch ||
        "Not available"
    );

    setText(
        "account_name",
        account.account_name ||
        "Customer Account"
    );

    setText(
        "account_opened",
        formatDate(
            account.opened_date ||
            account.created_at
        )
    );

}

/* =====================================
   NO ACCOUNT
===================================== */

function displayNoAccount() {

    setText(
        "account_balance",
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
        "account_status",
        "Pending"
    );

    setText(
        "account_currency",
        "—"
    );

    setText(
        "account_branch",
        "—"
    );

    setText(
        "account_name",
        "No account"
    );

    setText(
        "account_opened",
        "—"
    );

    const transactionList =
        document.getElementById(
            "transactionList"
        );

    if (transactionList) {

        transactionList.innerHTML = `
            <tr>
                <td colspan="5">
                    No banking account is
                    associated with your profile.
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
            .eq(
                "account_id",
                accountId
            )
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
                    <td colspan="5">
                        No transactions yet.
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

                transactionList.appendChild(
                    row
                );

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
        logout
    );

}

async function logout() {

    try {

        await supabase.auth.signOut();

    }

    catch (error) {

        console.error(
            "Logout error:",
            error
        );

    }

    localStorage.removeItem(
        "user"
    );

    window.location.href =
        "login.html";

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
   MASK ACCOUNT NUMBER
===================================== */

function maskAccountNumber(
    value
) {

    if (!value) {
        return "Not available";
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
   MESSAGE
===================================== */

function showMessage(
    message
) {

    const messageElement =
        document.getElementById(
            "dashboardMessage"
        );

    if (messageElement) {

        messageElement.textContent =
            message;

        return;
    }

    console.warn(
        message
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

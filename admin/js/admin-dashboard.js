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

    displayAdmin(admin);

    await loadDashboardStatistics();

    const logoutButton =
        document.getElementById("logoutButton");

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            adminLogout
        );

    }

});


/* =====================================
   DISPLAY ADMIN
===================================== */

function displayAdmin(admin) {

    const name =
        admin.name ||
        admin.email ||
        "Administrator";

    setText(
        "admin_name",
        name
    );

    setText(
        "admin_email",
        admin.email || "Not available"
    );

    setText(
        "admin_role",
        admin.role ||
        "Administrator"
    );

}


/* =====================================
   LOAD DASHBOARD STATISTICS
===================================== */

async function loadDashboardStatistics() {

    try {

        /* ===============================
           TOTAL CUSTOMERS
        =============================== */

        const {
            count: userCount,
            error: userError
        } = await supabase
            .from("users")
            .select(
                "user_id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (userError) {
            throw userError;
        }


        setText(
            "total_users",
            userCount ?? 0
        );


        /* ===============================
           TOTAL ACCOUNTS
        =============================== */

        const {
            count: accountCount,
            error: accountError
        } = await supabase
            .from("accounts")
            .select(
                "account_id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (accountError) {
            throw accountError;
        }


        setText(
            "total_accounts",
            accountCount ?? 0
        );


        /* ===============================
           TOTAL TRANSACTIONS
        =============================== */

        const {
            count: transactionCount,
            error: transactionError
        } = await supabase
            .from("transactions")
            .select(
                "transaction_id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (transactionError) {
            throw transactionError;
        }


        setText(
            "total_transactions",
            transactionCount ?? 0
        );


        /* ===============================
           SUPPORT TICKETS
        =============================== */

        const {
            count: ticketCount,
            error: ticketError
        } = await supabase
            .from("support_tickets")
            .select(
                "ticket_id",
                {
                    count: "exact",
                    head: true
                }
            );


        if (ticketError) {
            throw ticketError;
        }


        setText(
            "total_tickets",
            ticketCount ?? 0
        );


    }

    catch (error) {

        console.error(
            "Dashboard statistics error:",
            error
        );


        setText(
            "total_users",
            "—"
        );

        setText(
            "total_accounts",
            "—"
        );

        setText(
            "total_transactions",
            "—"
        );

        setText(
            "total_tickets",
            "—"
        );

    }

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

/* =====================================
   TRUSTNOVA BANK
   ADMIN CUSTOMER MANAGEMENT
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    const admin =
        await requireAdminAuth();

    if (!admin) {
        return;
    }

    await loadUsers();

    setupUserSearch();

    setupLogout();

});


/* =====================================
   LOAD USERS
===================================== */

async function loadUsers(searchTerm = "") {

    const table =
        document.getElementById(
            "userList"
        );

    if (!table) {
        return;
    }


    table.innerHTML = `
        <tr>
            <td colspan="7">
                Loading customers...
            </td>
        </tr>
    `;


    try {

        let query = supabase
            .from("users")
            .select("*")
            .order(
                "created_at",
                {
                    ascending: false
                }
            );


        /* =====================================
           SEARCH
        ===================================== */

        const search =
            String(searchTerm)
                .trim();


        if (search) {

            const safeSearch =
                search
                    .replace(/[%_]/g, "");


            query = query.or(
                `first_name.ilike.%${safeSearch}%,last_name.ilike.%${safeSearch}%,email.ilike.%${safeSearch}%,phone.ilike.%${safeSearch}%`
            );

        }


        const {
            data: users,
            error
        } = await query;


        if (error) {
            throw error;
        }


        displayUsers(
            users || []
        );


    }

    catch (error) {

        console.error(
            "Customer loading error:",
            error
        );


        table.innerHTML = `
            <tr>
                <td colspan="7">
                    Unable to load customer records.
                </td>
            </tr>
        `;

    }

}


/* =====================================
   DISPLAY USERS
===================================== */

function displayUsers(users) {

    const table =
        document.getElementById(
            "userList"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    const totalElement =
        document.getElementById(
            "totalUsers"
        );


    if (totalElement) {

        totalElement.textContent =
            users.length;

    }


    if (users.length === 0) {

        table.innerHTML = `
            <tr>
                <td colspan="7">
                    No customers found.
                </td>
            </tr>
        `;

        return;
    }


    users.forEach(user => {

        const row =
            document.createElement("tr");


        const fullName =
            `${user.first_name || ""} ${user.last_name || ""}`
                .trim();


        const createdAt =
            formatDate(
                user.created_at
            );


        const status =
            user.status ||
            "Active";


        row.innerHTML = `

            <td>
                ${escapeHTML(
                    user.user_id || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    fullName || "Customer"
                )}
            </td>

            <td>
                ${escapeHTML(
                    user.email || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    user.phone || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    user.nationality || "—"
                )}
            </td>

            <td>
                ${escapeHTML(
                    status
                )}
            </td>

            <td>
                ${escapeHTML(
                    createdAt
                )}
            </td>

        `;


        table.appendChild(row);

    });

}


/* =====================================
   SEARCH
===================================== */

function setupUserSearch() {

    const searchInput =
        document.getElementById(
            "userSearch"
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

                        loadUsers(
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
   DATE FORMAT
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

/* =====================================
   TRUSTNOVA BANK
   ADMIN AUTHENTICATION
   SUPABASE
===================================== */


/* =====================================
   REQUIRE ADMIN AUTHENTICATION
===================================== */

async function requireAdminAuth() {

    try {

        /* Check Supabase session */

        const {
            data: sessionData,
            error: sessionError
        } = await supabase.auth.getSession();


        if (
            sessionError ||
            !sessionData?.session
        ) {

            redirectToAdminLogin();

            return null;
        }


        const authUser =
            sessionData.session.user;


        if (!authUser) {

            redirectToAdminLogin();

            return null;
        }


        /* =====================================
           CHECK ADMIN RECORD
        ===================================== */

        const {
            data: admin,
            error: adminError
        } = await supabase
            .from("admins")
            .select("*")
            .eq(
                "auth_user_id",
                authUser.id
            )
            .maybeSingle();


        if (adminError) {

            console.error(
                "Admin authentication error:",
                adminError
            );

            redirectToAdminLogin();

            return null;
        }


        if (!admin) {

            console.error(
                "Authenticated user is not an administrator."
            );

            await supabase.auth.signOut();

            redirectToAdminLogin();

            return null;
        }


        /* =====================================
           CHECK ADMIN STATUS
        ===================================== */

        if (
            admin.status &&
            String(admin.status).toLowerCase() !== "active"
        ) {

            alert(
                "Your administrator account is not active."
            );

            await supabase.auth.signOut();

            redirectToAdminLogin();

            return null;
        }


        /* =====================================
           SAVE SAFE ADMIN INFORMATION
        ===================================== */

        localStorage.setItem(
            "admin",
            JSON.stringify({
                admin_id: admin.admin_id,
                email: admin.email,
                name: admin.name || "",
                role: admin.role || "Administrator"
            })
        );


        return admin;

    }

    catch (error) {

        console.error(
            "Unexpected admin authentication error:",
            error
        );

        redirectToAdminLogin();

        return null;
    }
}


/* =====================================
   ADMIN LOGOUT
===================================== */

async function adminLogout() {

    try {

        await supabase.auth.signOut();

    }

    catch (error) {

        console.error(
            "Admin logout error:",
            error
        );

    }

    finally {

        localStorage.removeItem(
            "admin"
        );

        window.location.href =
            "admin-login.html";
    }
}


/* =====================================
   REDIRECT TO ADMIN LOGIN
===================================== */

function redirectToAdminLogin() {

    const currentPage =
        window.location.pathname
            .split("/")
            .pop();


    if (
        currentPage !==
        "admin-login.html"
    ) {

        window.location.href =
            "admin-login.html";
    }
}

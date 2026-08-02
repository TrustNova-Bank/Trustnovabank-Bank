/* =====================================
   TRUSTNOVA BANK
   AUTHENTICATION HELPERS
   SUPABASE
===================================== */


/* =====================================
   GET CURRENT AUTHENTICATED USER
===================================== */

async function getCurrentUser() {

    try {

        const {
            data,
            error
        } = await supabase.auth.getUser();


        if (error) {

            console.error(
                "Authentication error:",
                error
            );

            return null;
        }


        return data?.user || null;

    }

    catch (error) {

        console.error(
            "Unexpected authentication error:",
            error
        );

        return null;
    }
}


/* =====================================
   REQUIRE CUSTOMER LOGIN
===================================== */

async function requireCustomerAuth() {

    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "login.html";

        return null;
    }


    return user;
}


/* =====================================
   REQUIRE ADMIN LOGIN
===================================== */

async function requireAdminAuth() {

    const user =
        await getCurrentUser();


    if (!user) {

        window.location.href =
            "admin-login.html";

        return null;
    }


    try {

        const {
            data: admin,
            error
        } = await supabase
            .from("admins")
            .select("*")
            .eq(
                "auth_user_id",
                user.id
            )
            .maybeSingle();


        if (error) {

            console.error(
                "Admin authentication error:",
                error
            );

            await supabase.auth.signOut();

            window.location.href =
                "admin-login.html";

            return null;
        }


        if (!admin) {

            await supabase.auth.signOut();

            window.location.href =
                "admin-login.html";

            return null;
        }


        if (
            admin.status &&
            String(admin.status).toLowerCase() !== "active"
        ) {

            await supabase.auth.signOut();

            alert(
                "This administrator account is not active."
            );

            window.location.href =
                "admin-login.html";

            return null;
        }


        return admin;

    }

    catch (error) {

        console.error(
            "Unexpected admin authentication error:",
            error
        );

        await supabase.auth.signOut();

        window.location.href =
            "admin-login.html";

        return null;
    }
}


/* =====================================
   CUSTOMER LOGOUT
===================================== */

async function customerLogout() {

    try {

        await supabase.auth.signOut();

        localStorage.removeItem("user");

        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(
            "Customer logout error:",
            error
        );

        window.location.href =
            "login.html";
    }
}


/* =====================================
   ADMIN LOGOUT
===================================== */

async function adminLogout() {

    try {

        await supabase.auth.signOut();

        localStorage.removeItem("admin");

        window.location.href =
            "admin-login.html";

    }

    catch (error) {

        console.error(
            "Admin logout error:",
            error
        );

        window.location.href =
            "admin-login.html";
    }
}


/* =====================================
   CHECK CUSTOMER SESSION
===================================== */

async function checkCustomerSession() {

    const user =
        await getCurrentUser();

    return !!user;
}


/* =====================================
   CHECK ADMIN SESSION
===================================== */

async function checkAdminSession() {

    const user =
        await getCurrentUser();


    if (!user) {
        return false;
    }


    const {
        data: admin,
        error
    } = await supabase
        .from("admins")
        .select("admin_id, status")
        .eq(
            "auth_user_id",
            user.id
        )
        .maybeSingle();


    if (
        error ||
        !admin
    ) {
        return false;
    }


    if (
        admin.status &&
        String(admin.status).toLowerCase() !== "active"
    ) {
        return false;
    }


    return true;
}

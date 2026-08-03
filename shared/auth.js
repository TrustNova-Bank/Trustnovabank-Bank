/* =====================================
   TRUSTNOVA BANK
   SHARED AUTHENTICATION UTILITIES
===================================== */


/* =====================================
   REQUIRE CUSTOMER AUTHENTICATION
===================================== */

async function requireCustomerAuth(
    redirect = "../frontend/login.html"
) {

    try {

        const {
            data,
            error
        } = await supabase.auth.getUser();


        if (
            error ||
            !data ||
            !data.user
        ) {

            window.location.href =
                redirect;

            return null;
        }


        return data.user;

    }

    catch (error) {

        console.error(
            "Customer authentication error:",
            error
        );


        window.location.href =
            redirect;

        return null;

    }

}


/* =====================================
   REQUIRE ADMIN AUTHENTICATION
===================================== */

async function requireAdminAuth(
    redirect = "../admin/admin-login.html"
) {

    try {

        const {
            data,
            error
        } = await supabase.auth.getUser();


        if (
            error ||
            !data ||
            !data.user
        ) {

            window.location.href =
                redirect;

            return null;
        }


        const authUser =
            data.user;


        /* =====================================
           VERIFY ADMIN RECORD
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
                "Admin verification error:",
                adminError
            );

            window.location.href =
                redirect;

            return null;

        }


        if (!admin) {

            console.warn(
                "Authenticated user is not an administrator."
            );

            await supabase.auth.signOut();

            window.location.href =
                redirect;

            return null;

        }


        return admin;

    }

    catch (error) {

        console.error(
            "Admin authentication error:",
            error
        );


        window.location.href =
            redirect;

        return null;

    }

}


/* =====================================
   GET CURRENT USER
===================================== */

async function getCurrentUser() {

    try {

        const {
            data,
            error
        } = await supabase.auth.getUser();


        if (error) {
            throw error;
        }


        return data?.user || null;

    }

    catch (error) {

        console.error(
            "Get current user error:",
            error
        );

        return null;

    }

}


/* =====================================
   SIGN OUT
===================================== */

async function signOut(
    redirect = "../frontend/login.html"
) {

    try {

        const {
            error
        } = await supabase.auth.signOut();


        if (error) {
            throw error;
        }

    }

    catch (error) {

        console.error(
            "Sign out error:",
            error
        );

    }


    localStorage.removeItem(
        "user"
    );


    window.location.href =
        redirect;

}


/* =====================================
   AUTH STATE LISTENER
===================================== */

function watchAuthState(
    callback
) {

    if (
        typeof callback !==
        "function"
    ) {

        return null;

    }


    return supabase.auth.onAuthStateChange(
        (
            event,
            session
        ) => {

            callback(
                event,
                session
            );

        }
    );

}

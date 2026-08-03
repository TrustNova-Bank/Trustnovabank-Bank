/* =====================================
   TRUSTNOVA BANK
   SHARED AUTHENTICATION
===================================== */

/**
 * Get the currently authenticated user.
 */
async function getCurrentUser() {

    try {

        const {
            data,
            error
        } = await supabase.auth.getUser();

        if (error) {
            console.error(
                "Get user error:",
                error
            );

            return null;
        }

        return data?.user || null;

    } catch (error) {

        console.error(
            "Authentication error:",
            error
        );

        return null;
    }
}


/**
 * Require a customer to be authenticated.
 *
 * Returns the authenticated user or redirects
 * to the customer login page.
 */
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


/**
 * Require an authenticated admin.
 *
 * The database remains the authority for admin
 * authorization through the RLS policies.
 */
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
            data,
            error
        } = await supabase
            .from("user_roles")
            .select("role")
            .eq(
                "user_id",
                user.id
            )
            .eq(
                "role",
                "admin"
            )
            .maybeSingle();

        if (error) {

            console.error(
                "Admin authorization error:",
                error
            );

            window.location.href =
                "admin-login.html";

            return null;
        }

        if (!data) {

            window.location.href =
                "admin-login.html";

            return null;
        }

        return user;

    } catch (error) {

        console.error(
            "Admin authentication error:",
            error
        );

        window.location.href =
            "admin-login.html";

        return null;
    }
}


/**
 * Sign out the current user.
 */
async function signOutUser() {

    try {

        const {
            error
        } = await supabase.auth.signOut();

        if (error) {
            throw error;
        }

        localStorage.removeItem("user");

        return true;

    } catch (error) {

        console.error(
            "Sign out error:",
            error
        );

        return false;
    }
}


/**
 * Listen for authentication changes.
 */
function listenForAuthChanges(
    callback
) {

    const {
        data
    } = supabase.auth.onAuthStateChange(
        (event, session) => {

            if (
                typeof callback ===
                "function"
            ) {

                callback(
                    event,
                    session
                );
            }

        }
    );

    return data?.subscription || null;
}

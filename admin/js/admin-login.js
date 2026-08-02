/* =====================================
   TRUSTNOVA BANK
   ADMIN LOGIN
   SUPABASE AUTHENTICATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("adminLoginForm");

    if (!loginForm) {
        console.error("adminLoginForm was not found.");
        return;
    }


    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const emailElement =
            document.getElementById("adminEmail");

        const passwordElement =
            document.getElementById("adminPassword");

        const loginButton =
            document.getElementById("adminLoginButton");

        const messageElement =
            document.getElementById("adminLoginMessage");


        if (!emailElement || !passwordElement) {

            showMessage(
                "Admin login form is not configured correctly.",
                "error"
            );

            return;
        }


        const email =
            emailElement.value
                .trim()
                .toLowerCase();

        const password =
            passwordElement.value;


        if (!email || !password) {

            showMessage(
                "Please enter your email and password.",
                "error"
            );

            return;
        }


        if (loginButton) {

            loginButton.disabled = true;

            loginButton.textContent =
                "Signing in...";

        }


        try {

            /* =====================================
               1. SUPABASE AUTHENTICATION
            ===================================== */

            const {
                data: authData,
                error: authError
            } =
                await supabase.auth.signInWithPassword({
                    email: email,
                    password: password
                });


            if (authError) {

                console.error(
                    "Admin authentication error:",
                    authError
                );

                showMessage(
                    "Invalid admin email or password.",
                    "error"
                );

                return;
            }


            const authUser =
                authData?.user;


            if (!authUser) {

                showMessage(
                    "Admin login could not be completed.",
                    "error"
                );

                return;
            }


            /* =====================================
               2. CHECK ADMIN PROFILE
            ===================================== */

            const {
                data: admin,
                error: adminError
            } =
                await supabase
                    .from("admins")
                    .select("*")
                    .eq(
                        "auth_user_id",
                        authUser.id
                    )
                    .maybeSingle();


            if (adminError) {

                console.error(
                    "Admin profile error:",
                    adminError
                );

                await supabase.auth.signOut();

                showMessage(
                    "Unable to verify administrator access.",
                    "error"
                );

                return;
            }


            /* =====================================
               3. ADMIN NOT FOUND
            ===================================== */

            if (!admin) {

                await supabase.auth.signOut();

                showMessage(
                    "Administrator access is not authorized.",
                    "error"
                );

                return;
            }


            /* =====================================
               4. CHECK ADMIN STATUS
            ===================================== */

            if (
                admin.status &&
                String(admin.status).toLowerCase() !== "active"
            ) {

                await supabase.auth.signOut();

                showMessage(
                    "This administrator account is not active.",
                    "error"
                );

                return;
            }


            /* =====================================
               5. SAVE NON-SENSITIVE ADMIN DATA
            ===================================== */

            localStorage.setItem(
                "admin",
                JSON.stringify({
                    admin_id: admin.admin_id,
                    auth_user_id: admin.auth_user_id,
                    email: admin.email || authUser.email,
                    role: admin.role || "admin",
                    status: admin.status || "Active"
                })
            );


            /* =====================================
               6. LOGIN SUCCESS
            ===================================== */

            showMessage(
                "Login successful. Redirecting...",
                "success"
            );


            window.location.href =
                "admin.html";

        }


        catch (error) {

            console.error(
                "Unexpected admin login error:",
                error
            );

            showMessage(
                "Unable to complete admin login. Please try again.",
                "error"
            );

        }


        finally {

            if (loginButton) {

                loginButton.disabled = false;

                loginButton.textContent =
                    "Sign In";

            }

        }

    });


    /* =====================================
       MESSAGE HELPER
    ===================================== */

    function showMessage(message, type) {

        const messageElement =
            document.getElementById(
                "adminLoginMessage"
            );


        if (!messageElement) {
            return;
        }


        messageElement.textContent =
            message;


        messageElement.className =
            "admin-login-message " +
            `admin-login-${type}`;

    }

});

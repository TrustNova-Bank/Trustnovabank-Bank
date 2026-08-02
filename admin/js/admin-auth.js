/* =====================================
   TRUSTNOVA BANK
   ADMIN AUTHENTICATION
   SUPABASE
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const adminLoginForm =
        document.getElementById("adminLoginForm");

    if (!adminLoginForm) {
        console.error("adminLoginForm was not found.");
        return;
    }


    adminLoginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const emailElement =
                document.getElementById("email");

            const passwordElement =
                document.getElementById("password");


            if (!emailElement || !passwordElement) {

                alert(
                    "Admin login form is not configured correctly."
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

                alert(
                    "Please enter your email and password."
                );

                return;
            }


            const submitButton =
                adminLoginForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
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
                    await supabase.auth
                        .signInWithPassword({

                            email: email,

                            password: password

                        });


                if (authError) {

                    console.error(
                        "Admin authentication error:",
                        authError
                    );

                    alert(
                        "Invalid administrator email or password."
                    );

                    return;
                }


                const authUser =
                    authData?.user;


                if (!authUser) {

                    alert(
                        "Administrator login could not be completed."
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

                    alert(
                        "Your account was authenticated, but your administrator profile could not be loaded."
                    );

                    return;
                }


                /* =====================================
                   3. ADMIN NOT FOUND
                ===================================== */

                if (!admin) {

                    await supabase.auth.signOut();

                    alert(
                        "Administrator account not found."
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

                    alert(
                        "This administrator account is not active."
                    );

                    return;
                }


                /* =====================================
                   5. SAVE ADMIN SESSION INFORMATION
                ===================================== */

                localStorage.setItem(
                    "admin",
                    JSON.stringify({
                        auth_user_id: authUser.id,
                        admin_id: admin.admin_id,
                        email: authUser.email
                    })
                );


                /* =====================================
                   6. LOGIN SUCCESS
                ===================================== */

                alert(
                    "Administrator login successful!"
                );


                window.location.href =
                    "admin-dashboard.html";

            }


            catch (error) {

                console.error(
                    "Unexpected admin login error:",
                    error
                );

                alert(
                    "Unable to complete administrator login. Please try again."
                );

            }


            finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Login";

                }

            }

        }
    );

});

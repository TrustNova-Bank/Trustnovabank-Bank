/* =====================================
   TRUSTNOVA BANK
   CUSTOMER LOGIN
   SUPABASE AUTHENTICATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) {
        console.error("loginForm was not found.");
        return;
    }


    loginForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =====================================
               FORM ELEMENTS
            ===================================== */

            const emailElement =
                document.getElementById("email");

            const passwordElement =
                document.getElementById("password");

            const submitButton =
                loginForm.querySelector(
                    'button[type="submit"]'
                );


            if (
                !emailElement ||
                !passwordElement
            ) {

                alert(
                    "Login form is not configured correctly."
                );

                return;
            }


            /* =====================================
               GET VALUES
            ===================================== */

            const email =
                emailElement.value
                    .trim()
                    .toLowerCase();

            const password =
                passwordElement.value;


            /* =====================================
               VALIDATION
            ===================================== */

            if (!email) {

                alert(
                    "Please enter your email address."
                );

                emailElement.focus();

                return;
            }


            if (!password) {

                alert(
                    "Please enter your password."
                );

                passwordElement.focus();

                return;
            }


            /* =====================================
               DISABLE LOGIN BUTTON
            ===================================== */

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
                        "Supabase authentication error:",
                        authError
                    );

                    alert(
                        "Invalid email or password."
                    );

                    return;
                }


                const authUser =
                    authData?.user;


                if (!authUser) {

                    alert(
                        "Login could not be completed."
                    );

                    return;
                }


                /* =====================================
                   2. LOAD CUSTOMER PROFILE
                ===================================== */

                const {
                    data: profile,
                    error: profileError
                } =
                    await supabase
                        .from("users")
                        .select("*")
                        .eq(
                            "auth_user_id",
                            authUser.id
                        )
                        .maybeSingle();


                if (profileError) {

                    console.error(
                        "Customer profile error:",
                        profileError
                    );

                    await supabase.auth.signOut();

                    alert(
                        "Your account was authenticated, but your customer profile could not be loaded."
                    );

                    return;
                }


                /* =====================================
                   3. PROFILE NOT FOUND
                ===================================== */

                if (!profile) {

                    await supabase.auth.signOut();

                    alert(
                        "Customer profile not found. Please contact support."
                    );

                    return;
                }


                /* =====================================
                   4. SAVE NON-SENSITIVE PROFILE DATA
                ===================================== */

                localStorage.setItem(
                    "user",
                    JSON.stringify(profile)
                );


                /* =====================================
                   5. REDIRECT
                ===================================== */

                window.location.href =
                    "dashboard.html";

            }


            catch (error) {

                console.error(
                    "Unexpected login error:",
                    error
                );

                alert(
                    "Unable to complete login. Please try again."
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

/* =====================================
   TRUSTNOVA BANK
   CUSTOMER REGISTRATION
   SUPABASE AUTHENTICATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const registerForm =
        document.getElementById("registerForm");

    if (!registerForm) {
        console.error("registerForm was not found.");
        return;
    }


    registerForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =====================================
               FORM ELEMENTS
            ===================================== */

            const firstNameElement =
                document.getElementById("first_name");

            const lastNameElement =
                document.getElementById("last_name");

            const emailElement =
                document.getElementById("email");

            const phoneElement =
                document.getElementById("phone");

            const nationalityElement =
                document.getElementById("nationality");

            const passwordElement =
                document.getElementById("password");


            if (
                !firstNameElement ||
                !lastNameElement ||
                !emailElement ||
                !phoneElement ||
                !nationalityElement ||
                !passwordElement
            ) {

                alert(
                    "Registration form fields are missing."
                );

                return;
            }


            /* =====================================
               GET VALUES
            ===================================== */

            const first_name =
                firstNameElement.value.trim();

            const last_name =
                lastNameElement.value.trim();

            const email =
                emailElement.value
                    .trim()
                    .toLowerCase();

            const phone =
                phoneElement.value.trim();

            const nationality =
                nationalityElement.value.trim();

            const password =
                passwordElement.value;


            /* =====================================
               VALIDATION
            ===================================== */

            if (
                !first_name ||
                !last_name ||
                !email ||
                !phone ||
                !nationality ||
                !password
            ) {

                alert(
                    "Please complete all required fields."
                );

                return;
            }


            if (password.length < 6) {

                alert(
                    "Password must contain at least 6 characters."
                );

                passwordElement.focus();

                return;
            }


            /* =====================================
               SUBMIT BUTTON
            ===================================== */

            const submitButton =
                registerForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Creating Account...";

            }


            try {

                /* =====================================
                   1. CREATE SUPABASE AUTH ACCOUNT
                ===================================== */

                const {
                    data: authData,
                    error: authError
                } =
                    await supabase.auth.signUp({

                        email: email,

                        password: password

                    });


                if (authError) {

                    console.error(
                        "Supabase Auth error:",
                        authError
                    );

                    alert(
                        authError.message
                    );

                    return;
                }


                const authUser =
                    authData?.user;


                if (!authUser) {

                    alert(
                        "Registration could not be completed."
                    );

                    return;
                }


                /* =====================================
                   2. CHECK CUSTOMER PROFILE
                ===================================== */

                const {
                    data: existingProfile,
                    error: existingProfileError
                } =
                    await supabase
                        .from("users")
                        .select("user_id")
                        .eq(
                            "auth_user_id",
                            authUser.id
                        )
                        .maybeSingle();


                if (existingProfileError) {

                    console.error(
                        "Profile lookup error:",
                        existingProfileError
                    );

                    alert(
                        "The authentication account was created, but the customer profile could not be checked."
                    );

                    return;
                }


                /* =====================================
                   3. CREATE CUSTOMER PROFILE
                ===================================== */

                if (!existingProfile) {

                    const {
                        data: profile,
                        error: profileError
                    } =
                        await supabase
                            .from("users")
                            .insert([{

                                auth_user_id:
                                    authUser.id,

                                first_name:
                                    first_name,

                                last_name:
                                    last_name,

                                email:
                                    email,

                                phone:
                                    phone,

                                nationality:
                                    nationality,

                                status:
                                    "Active",

                                created_at:
                                    new Date().toISOString()

                            }])
                            .select(
                                "user_id"
                            )
                            .single();


                    if (profileError) {

                        console.error(
                            "Customer profile error:",
                            profileError
                        );

                        alert(
                            "Your login account was created, but your customer profile could not be created."
                        );

                        return;
                    }


                    console.log(
                        "Customer profile created:",
                        profile
                    );

                }


                /* =====================================
                   4. SAVE BASIC SESSION INFORMATION
                ===================================== */

                localStorage.setItem(
                    "user",
                    JSON.stringify({

                        id:
                            authUser.id,

                        email:
                            authUser.email

                    })
                );


                /* =====================================
                   5. EMAIL CONFIRMATION
                ===================================== */

                if (!authData.session) {

                    alert(
                        "Registration successful. Please check your email and confirm your account before signing in."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                /* =====================================
                   6. REGISTRATION COMPLETE
                ===================================== */

                alert(
                    "Registration successful!"
                );


                window.location.href =
                    "dashboard.html";


            }


            catch (error) {

                console.error(
                    "Unexpected registration error:",
                    error
                );

                alert(
                    "Registration failed. Please try again."
                );

            }


            finally {

                if (submitButton) {

                    submitButton.disabled =
                        false;

                    submitButton.textContent =
                        "Create Account";

                }

            }

        }
    );

});

/* =====================================
   TRUSTNOVA BANK
   CUSTOMER LOGIN
   SUPABASE AUTH + CUSTOMER PROFILE
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("loginForm");

    if (!loginForm) {
        console.error("loginForm was not found.");
        return;
    }


    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();


        const emailElement =
            document.getElementById("email");

        const passwordElement =
            document.getElementById("password");


        if (!emailElement || !passwordElement) {

            alert(
                "Login form fields are missing."
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
            loginForm.querySelector(
                'button[type="submit"]'
            );


        if (submitButton) {
            submitButton.disabled = true;
        }


        try {

            /* =====================================
               1. SUPABASE AUTHENTICATION
            ===================================== */

            const {
                data: authData,
                error: authError
            } = await supabase.auth.signInWithPassword({

                email: email,

                password: password

            });


            if (authError) {

                console.error(
                    "Supabase login error:",
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
            } = await supabase
                .from("users")
                .select("*")
                .eq("auth_user_id", authUser.id)
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


            if (!profile) {

                await supabase.auth.signOut();

                alert(
                    "Customer profile not found. Please contact support."
                );

                return;
            }


            /* =====================================
               3. SAVE CUSTOMER PROFILE
               
               Password is NEVER stored here.
            ===================================== */

            localStorage.setItem(
                "user",
                JSON.stringify(profile)
            );


            /* =====================================
               4. LOGIN SUCCESS
            ===================================== */

            alert(
                "Login successful!"
            );


            window.location.href =
                "dashboard.html";

        }


        catch (error) {

            console.error(
                "Unexpected login error:",
                error
            );

            alert(
                "Login failed. Please try again."
            );

        }


        finally {

            if (submitButton) {
                submitButton.disabled = false;
            }

        }

    });

});

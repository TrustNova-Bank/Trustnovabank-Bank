document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("homeLoginForm");

    if (!loginForm) {
        console.error("homeLoginForm was not found.");
        return;
    }


    loginForm.addEventListener("submit", async (e) => {

        e.preventDefault();


        const emailElement =
            document.getElementById("loginEmail");

        const passwordElement =
            document.getElementById("loginPassword");


        if (!emailElement || !passwordElement) {

            console.error(
                "Login fields were not found."
            );

            alert(
                "Login form is not configured correctly."
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

            /*
             * Authenticate through Supabase Auth.
             *
             * Do NOT compare the password against
             * public.users.password_hash.
             */

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


            /*
             * Find the matching customer profile.
             */

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
                    "Customer profile not found."
                );

                return;
            }


            /*
             * Save the customer profile.
             *
             * Never save the password.
             */

            localStorage.setItem(
                "user",
                JSON.stringify(profile)
            );


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

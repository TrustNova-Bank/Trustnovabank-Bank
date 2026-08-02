document.addEventListener("DOMContentLoaded", () => {

    const loginForm = document.getElementById("homeLoginForm");

    if (!loginForm) {
        console.error("homeLoginForm was not found.");
        return;
    }

    loginForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const emailElement = document.getElementById("loginEmail");
        const passwordElement = document.getElementById("loginPassword");

        if (!emailElement || !passwordElement) {
            alert("Login form is not configured correctly.");
            return;
        }

        const email = emailElement.value.trim().toLowerCase();
        const password = passwordElement.value;

        if (!email || !password) {
            alert("Please enter your email and password.");
            return;
        }

        const submitButton = loginForm.querySelector(
            'button[type="submit"]'
        );

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Signing in...";
        }

        try {

            const {
                data: authData,
                error: authError
            } = await supabase.auth.signInWithPassword({
                email: email,
                password: password
            });

            if (authError) {
                console.error("Supabase login error:", authError);
                alert("Invalid email or password.");
                return;
            }

            const authUser = authData?.user;

            if (!authUser) {
                alert("Login could not be completed.");
                return;
            }

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

                alert("Customer profile not found.");

                return;
            }

            localStorage.setItem(
                "user",
                JSON.stringify(profile)
            );

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(
                "Unexpected login error:",
                error
            );

            alert("Login failed. Please try again.");

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Login";
            }

        }

    });

});

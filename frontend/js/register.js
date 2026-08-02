document.addEventListener("DOMContentLoaded", () => {

    const registerForm = document.getElementById("registerForm");

    if (!registerForm) {
        console.error("registerForm was not found.");
        return;
    }

    registerForm.addEventListener("submit", async (event) => {

        event.preventDefault();

        const firstNameElement =
            document.getElementById("first_name");

        const lastNameElement =
            document.getElementById("last_name");

        const emailElement =
            document.getElementById("email");

        const phoneElement =
            document.getElementById("phone");

        const passwordElement =
            document.getElementById("password");

        if (
            !firstNameElement ||
            !lastNameElement ||
            !emailElement ||
            !phoneElement ||
            !passwordElement
        ) {
            alert("Registration form fields are missing.");
            return;
        }

        const first_name = firstNameElement.value.trim();
        const last_name = lastNameElement.value.trim();
        const email = emailElement.value.trim().toLowerCase();
        const phone = phoneElement.value.trim();
        const password = passwordElement.value;

        if (
            !first_name ||
            !last_name ||
            !email ||
            !phone ||
            !password
        ) {
            alert("Please complete all required fields.");
            return;
        }

        if (password.length < 6) {
            alert("Password must contain at least 6 characters.");
            return;
        }

        const submitButton =
            registerForm.querySelector('button[type="submit"]');

        if (submitButton) {
            submitButton.disabled = true;
            submitButton.textContent = "Creating Account...";
        }

        try {

            const {
                data: authData,
                error: authError
            } = await supabase.auth.signUp({
                email: email,
                password: password
            });

            if (authError) {
                console.error("Supabase Auth error:", authError);
                alert(authError.message);
                return;
            }

            const authUser = authData?.user;

            if (!authUser) {
                alert("Registration could not be completed.");
                return;
            }

            const {
                data: existingProfile,
                error: existingProfileError
            } = await supabase
                .from("users")
                .select("user_id")
                .eq("auth_user_id", authUser.id)
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

            if (!existingProfile) {

                const {
                    data: profile,
                    error: profileError
                } = await supabase
                    .from("users")
                    .insert([{
                        auth_user_id: authUser.id,
                        first_name: first_name,
                        last_name: last_name,
                        email: email,
                        phone: phone,
                        status: "Active",
                        created_at: new Date().toISOString()
                    }])
                    .select("user_id")
                    .single();

                if (profileError) {
                    console.error(
                        "Customer profile error:",
                        profileError
                    );

                    alert(
                        "Your login account was created, but the customer profile could not be created."
                    );

                    return;
                }

                console.log(
                    "Customer profile created:",
                    profile
                );
            }

            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: authUser.id,
                    email: authUser.email
                })
            );

            if (!authData.session) {

                alert(
                    "Registration successful. Please check your email and confirm your account before signing in."
                );

                window.location.href = "login.html";
                return;
            }

            alert("Registration successful!");

            window.location.href = "dashboard.html";

        } catch (error) {

            console.error(
                "Unexpected registration error:",
                error
            );

            alert(
                "Registration failed. Please try again."
            );

        } finally {

            if (submitButton) {
                submitButton.disabled = false;
                submitButton.textContent = "Create Account";
            }

        }

    });

});

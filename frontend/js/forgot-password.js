/* =====================================
   TRUSTNOVA BANK
   CUSTOMER PASSWORD RESET
   SUPABASE AUTHENTICATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const resetForm =
        document.getElementById("resetForm");

    if (!resetForm) {
        console.error("resetForm was not found.");
        return;
    }


    resetForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const emailElement =
                document.getElementById("email");


            if (!emailElement) {

                alert(
                    "Email field is missing."
                );

                return;
            }


            const email =
                emailElement.value
                    .trim()
                    .toLowerCase();


            if (!email) {

                alert(
                    "Please enter your email address."
                );

                emailElement.focus();

                return;
            }


            const submitButton =
                resetForm.querySelector(
                    'button[type="submit"]'
                );


            if (submitButton) {

                submitButton.disabled = true;

                submitButton.textContent =
                    "Sending...";
            }


            try {

                /* =====================================
                   SEND PASSWORD RESET EMAIL
                ===================================== */

                const {
                    error
                } = await supabase.auth
                    .resetPasswordForEmail(
                        email,
                        {
                            redirectTo:
                                window.location.origin +
                                "/frontend/login.html"
                        }
                    );


                if (error) {

                    console.error(
                        "Password reset error:",
                        error
                    );

                    alert(
                        "Unable to send the password reset email. Please try again."
                    );

                    return;
                }


                /* =====================================
                   SUCCESS
                ===================================== */

                alert(
                    "Password reset instructions have been sent to your email."
                );


                resetForm.reset();


            }

            catch (error) {

                console.error(
                    "Unexpected password reset error:",
                    error
                );

                alert(
                    "Something went wrong. Please try again."
                );

            }

            finally {

                if (submitButton) {

                    submitButton.disabled = false;

                    submitButton.textContent =
                        "Reset Password";

                }

            }

        }
    );

});

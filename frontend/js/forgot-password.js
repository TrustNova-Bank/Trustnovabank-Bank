/* =====================================
   TRUSTNOVA BANK
   FORGOT PASSWORD
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("forgotPasswordForm");

    if (!form) {
        console.error("forgotPasswordForm was not found.");
        return;
    }

    form.addEventListener(
        "submit",
        handleForgotPassword
    );
});


async function handleForgotPassword(event) {

    event.preventDefault();

    const email =
        document.getElementById("email")?.value.trim();

    const message =
        document.getElementById("forgotPasswordMessage");

    if (!email) {

        showMessage(
            message,
            "Please enter your email address.",
            true
        );

        return;
    }

    setLoading(true);

    try {

        /*
         * Replace this with your actual deployed
         * password-reset page URL when ready.
         */
        const redirectTo =
            `${window.location.origin}/frontend/update-password.html`;

        const {
            error
        } = await supabase.auth.resetPasswordForEmail(
            email,
            {
                redirectTo
            }
        );

        if (error) {
            throw error;
        }

        showMessage(
            message,
            "If an account exists for this email, a password-reset email has been sent.",
            false
        );

    } catch (error) {

        console.error(
            "Password reset error:",
            error
        );

        showMessage(
            message,
            "Unable to process the password-reset request. Please try again.",
            true
        );

    } finally {

        setLoading(false);
    }
}


function setLoading(isLoading) {

    const button =
        document.querySelector(
            '#forgotPasswordForm button[type="submit"]'
        );

    if (!button) {
        return;
    }

    button.disabled =
        isLoading;

    button.textContent =
        isLoading
            ? "Sending..."
            : "Reset Password";
}


function showMessage(
    element,
    text,
    isError
) {

    if (!element) {
        return;
    }

    element.textContent =
        text;

    element.classList.toggle(
        "error",
        Boolean(isError)
    );

    element.classList.toggle(
        "success",
        !isError
    );
}

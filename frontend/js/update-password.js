/* =====================================
   TRUSTNOVA BANK
   UPDATE PASSWORD
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form =
        document.getElementById("updatePasswordForm");

    if (!form) {
        console.error(
            "updatePasswordForm was not found."
        );
        return;
    }

    form.addEventListener(
        "submit",
        handlePasswordUpdate
    );
});


async function handlePasswordUpdate(event) {

    event.preventDefault();

    const password =
        document.getElementById(
            "password"
        )?.value;

    const confirmPassword =
        document.getElementById(
            "confirmPassword"
        )?.value;

    const message =
        document.getElementById(
            "updatePasswordMessage"
        );

    if (!password || !confirmPassword) {

        showMessage(
            message,
            "Please complete both password fields.",
            true
        );

        return;
    }

    if (password !== confirmPassword) {

        showMessage(
            message,
            "The passwords do not match.",
            true
        );

        return;
    }

    if (password.length < 8) {

        showMessage(
            message,
            "Your password must be at least 8 characters.",
            true
        );

        return;
    }

    setLoading(true);

    try {

        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();

        if (userError || !userData?.user) {

            throw new Error(
                "Your password-reset session is no longer valid."
            );
        }

        const {
            error
        } = await supabase.auth.updateUser({
            password
        });

        if (error) {
            throw error;
        }

        showMessage(
            message,
            "Your password has been updated successfully.",
            false
        );

        setTimeout(() => {

            window.location.href =
                "login.html";

        }, 1500);

    } catch (error) {

        console.error(
            "Password update error:",
            error
        );

        showMessage(
            message,
            "Unable to update your password. Please request a new reset link.",
            true
        );

    } finally {

        setLoading(false);
    }
}


function setLoading(isLoading) {

    const button =
        document.querySelector(
            '#updatePasswordForm button[type="submit"]'
        );

    if (!button) {
        return;
    }

    button.disabled =
        isLoading;

    button.textContent =
        isLoading
            ? "Updating..."
            : "Update Password";
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

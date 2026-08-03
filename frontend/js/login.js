/* =====================================
   TRUSTNOVA BANK
   CUSTOMER LOGIN
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
        handleLogin
    );
});


async function handleLogin(event) {

    event.preventDefault();

    const emailInput =
        document.getElementById("email");

    const passwordInput =
        document.getElementById("password");

    const message =
        document.getElementById("loginMessage");

    if (!emailInput || !passwordInput) {
        console.error(
            "Login fields were not found."
        );
        return;
    }

    const email =
        emailInput.value.trim();

    const password =
        passwordInput.value;

    if (!email || !password) {

        showLoginMessage(
            message,
            "Please enter your email and password.",
            true
        );

        return;
    }

    setLoginLoading(true);

    try {

        const {
            data,
            error
        } = await supabase.auth.signInWithPassword({
            email,
            password
        });

        if (error) {
            throw error;
        }

        if (!data?.user) {
            throw new Error(
                "Unable to establish your account session."
            );
        }

        showLoginMessage(
            message,
            "Login successful. Redirecting...",
            false
        );

        window.location.href =
            "../frontend/dashboard.html";

    } catch (error) {

        console.error(
            "Customer login error:",
            error
        );

        showLoginMessage(
            message,
            getLoginErrorMessage(error),
            true
        );

    } finally {

        setLoginLoading(false);
    }
}


function setLoginLoading(isLoading) {

    const button =
        document.querySelector(
            '#loginForm button[type="submit"]'
        );

    if (!button) {
        return;
    }

    button.disabled =
        isLoading;

    button.textContent =
        isLoading
            ? "Signing in..."
            : "Login";
}


function showLoginMessage(
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


function getLoginErrorMessage(error) {

    const message =
        String(
            error?.message || ""
        ).toLowerCase();

    if (
        message.includes("invalid login") ||
        message.includes("invalid credentials")
    ) {
        return "Incorrect email or password.";
    }

    if (
        message.includes("email not confirmed")
    ) {
        return "Please confirm your email before signing in.";
    }

    if (
        message.includes("too many requests")
    ) {
        return "Too many login attempts. Please try again later.";
    }

    return "Unable to sign in. Please check your details and try again.";
}

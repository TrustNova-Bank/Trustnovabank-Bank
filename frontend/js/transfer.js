/* =====================================
   TRUSTNOVA BANK
   TRANSFER FORM
   FRONTEND VALIDATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const transferForm =
        document.getElementById("transferForm");

    if (!transferForm) {
        console.error("transferForm was not found.");
        return;
    }


    const recipientName =
        document.getElementById("recipient_name");

    const accountNumber =
        document.getElementById("account_number");

    const bankName =
        document.getElementById("bank_name");

    const amountElement =
        document.getElementById("amount");

    const currencyElement =
        document.getElementById("currency");

    const descriptionElement =
        document.getElementById("description");

    const submitButton =
        transferForm.querySelector(
            'button[type="submit"]'
        );


    transferForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* ===============================
               CHECK FORM ELEMENTS
            =============================== */

            if (
                !recipientName ||
                !accountNumber ||
                !bankName ||
                !amountElement ||
                !currencyElement ||
                !descriptionElement
            ) {

                console.error(
                    "One or more transfer fields are missing."
                );

                alert(
                    "The transfer form is not configured correctly."
                );

                return;
            }


            /* ===============================
               GET VALUES
            =============================== */

            const recipient =
                recipientName.value.trim();

            const account =
                accountNumber.value.trim();

            const bank =
                bankName.value.trim();

            const amount =
                Number(amountElement.value);

            const currency =
                currencyElement.value;

            const description =
                descriptionElement.value.trim();


            /* ===============================
               VALIDATION
            =============================== */

            if (!recipient) {

                alert(
                    "Please enter the recipient name."
                );

                recipientName.focus();

                return;
            }


            if (!account) {

                alert(
                    "Please enter the recipient account number."
                );

                accountNumber.focus();

                return;
            }


            if (!bank) {

                alert(
                    "Please enter the bank name."
                );

                bankName.focus();

                return;
            }


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid transfer amount."
                );

                amountElement.focus();

                return;
            }


            if (!currency) {

                alert(
                    "Please select a currency."
                );

                currencyElement.focus();

                return;
            }


            /* ===============================
               CHECK AUTHENTICATION
            =============================== */

            if (
                typeof supabase === "undefined"
            ) {

                console.error(
                    "Supabase client is unavailable."
                );

                alert(
                    "The banking service is not configured."
                );

                return;
            }


            if (submitButton) {
                submitButton.disabled = true;
            }


            try {

                const {
                    data: userData,
                    error: userError
                } =
                    await supabase.auth.getUser();


                if (
                    userError ||
                    !userData?.user
                ) {

                    alert(
                        "Please log in before making a transfer."
                    );

                    window.location.href =
                        "login.html";

                    return;
                }


                /* ===============================
                   TRANSFER REQUEST
                   
                   No balance is changed here.
                   The secure backend will process
                   the actual transfer later.
                =============================== */

                const transferRequest = {

                    recipient_name:
                        recipient,

                    account_number:
                        account,

                    bank_name:
                        bank,

                    amount:
                        amount,

                    currency:
                        currency,

                    description:
                        description ||
                        "Money transfer"

                };


                console.log(
                    "Validated transfer request:",
                    transferRequest
                );


                alert(
                    "Transfer details have been validated. Secure transfer processing will be connected to the backend next."
                );


            }

            catch (error) {

                console.error(
                    "Transfer error:",
                    error
                );

                alert(
                    "Unable to process the transfer request."
                );

            }

            finally {

                if (submitButton) {
                    submitButton.disabled = false;
                }

            }

        }
    );


    /* ===============================
       LOGOUT
    =============================== */

    const logoutButton =
        document.getElementById(
            "logoutButton"
        );


    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            async () => {

                try {

                    await supabase.auth.signOut();

                    localStorage.removeItem("user");

                    window.location.href =
                        "login.html";

                }

                catch (error) {

                    console.error(
                        "Logout error:",
                        error
                    );

                }

            }
        );

    }

});

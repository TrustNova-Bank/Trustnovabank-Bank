/* =====================================
   TRUSTNOVA BANK
   TRANSFER FORM
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const transferForm =
        document.getElementById("transferForm");

    if (!transferForm) {
        console.error(
            "transferForm was not found."
        );
        return;
    }


    transferForm.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            /* =====================================
               GET FORM ELEMENTS
            ===================================== */

            const recipientName =
                document.getElementById(
                    "recipientName"
                );

            const accountNumber =
                document.getElementById(
                    "accountNumber"
                );

            const bankName =
                document.getElementById(
                    "bankName"
                );

            const amountElement =
                document.getElementById(
                    "amount"
                );

            const descriptionElement =
                document.getElementById(
                    "description"
                );


            if (
                !recipientName ||
                !accountNumber ||
                !bankName ||
                !amountElement ||
                !descriptionElement
            ) {

                alert(
                    "Transfer form is not configured correctly."
                );

                return;
            }


            /* =====================================
               GET VALUES
            ===================================== */

            const recipient =
                recipientName.value.trim();

            const account =
                accountNumber.value.trim();

            const bank =
                bankName.value.trim();

            const amount =
                Number(
                    amountElement.value
                );

            const description =
                descriptionElement.value.trim();


            /* =====================================
               VALIDATION
            ===================================== */

            if (!recipient) {

                alert(
                    "Please enter the recipient name."
                );

                return;
            }


            if (!account) {

                alert(
                    "Please enter the recipient account number."
                );

                return;
            }


            if (!bank) {

                alert(
                    "Please enter the bank name."
                );

                return;
            }


            if (
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                alert(
                    "Please enter a valid transfer amount."
                );

                return;
            }


            /* =====================================
               DISABLE BUTTON
            ===================================== */

            const submitButton =
                transferForm.querySelector(
                    'button[type="submit"]'
                );

            if (submitButton) {
                submitButton.disabled = true;
            }


            try {

                /* =====================================
                   CHECK LOGIN
                ===================================== */

                const {
                    data: userData,
                    error: userError
                } =
                    await supabase.auth.getUser();


                if (
                    userError ||
                    !userData?.user
                ) {

                    window.location.href =
                        "login.html";

                    return;
                }


                /*
                 * At this stage the frontend has
                 * collected and validated the
                 * transfer request.
                 *
                 * The actual movement of money should
                 * be performed by a secure backend
                 * transaction.
                 */


                const transferRequest = {

                    recipient_name:
                        recipient,

                    account_number:
                        account,

                    bank_name:
                        bank,

                    amount:
                        amount,

                    description:
                        description ||
                        "Money transfer"

                };


                console.log(
                    "Transfer request:",
                    transferRequest
                );


                /*
                 * Backend transfer processing will
                 * be connected here later.
                 */


                alert(
                    "Transfer details are valid. The secure transfer service is not connected yet."
                );


            }

            catch (error) {

                console.error(
                    "Transfer error:",
                    error
                );

                alert(
                    "Unable to process the transfer."
                );

            }

            finally {

                if (submitButton) {
                    submitButton.disabled = false;
                }

            }

        }
    );

});

/* =====================================
   TRUSTNOVA BANK
   SHARED UTILITY FUNCTIONS
===================================== */


/* =====================================
   SET TEXT
===================================== */

function setText(elementId, value) {

    const element =
        document.getElementById(elementId);

    if (element) {
        element.textContent = value ?? "";
    }

}


/* =====================================
   GET VALUE
===================================== */

function getValue(elementId) {

    const element =
        document.getElementById(elementId);

    if (!element) {
        return "";
    }

    return String(
        element.value || ""
    ).trim();

}


/* =====================================
   FORMAT MONEY
===================================== */

function formatMoney(
    amount,
    currency = "USD"
) {

    const value =
        Number(amount) || 0;

    const currencyCode =
        String(
            currency || "USD"
        ).toUpperCase();

    try {

        return new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: currencyCode
            }
        ).format(value);

    } catch (error) {

        return (
            value.toFixed(2) +
            " " +
            currencyCode
        );

    }

}


/* =====================================
   FORMAT DATE
===================================== */

function formatDate(value) {

    if (!value) {
        return "—";
    }

    const date =
        new Date(value);

    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "—";
    }

    return date.toLocaleDateString(
        "en-US",
        {
            year: "numeric",
            month: "short",
            day: "numeric"
        }
    );

}


/* =====================================
   MASK ACCOUNT NUMBER
===================================== */

function maskAccountNumber(value) {

    if (!value) {
        return "Not available";
    }

    const accountNumber =
        String(value);

    if (accountNumber.length <= 4) {
        return accountNumber;
    }

    return (
        "**** **** " +
        accountNumber.slice(-4)
    );

}


/* =====================================
   HTML ESCAPING
===================================== */

function escapeHTML(value) {

    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================
   SHOW MESSAGE
===================================== */

function showMessage(
    message,
    elementId = "message"
) {

    const element =
        document.getElementById(
            elementId
        );

    if (element) {

        element.textContent =
            message;

        return;

    }

    console.warn(message);

}


/* =====================================
   DISABLE BUTTON
===================================== */

function setButtonLoading(
    button,
    loading,
    loadingText = "Processing..."
) {

    if (!button) {
        return;
    }

    if (loading) {

        button.disabled = true;

        button.dataset.originalText =
            button.textContent;

        button.textContent =
            loadingText;

    } else {

        button.disabled = false;

        button.textContent =
            button.dataset.originalText ||
            "Submit";

    }

}


/* =====================================
   DEBOUNCE
===================================== */

function debounce(
    callback,
    delay = 300
) {

    let timeout;

    return function (...args) {

        clearTimeout(timeout);

        timeout =
            setTimeout(
                () => callback.apply(this, args),
                delay
            );

    };

}

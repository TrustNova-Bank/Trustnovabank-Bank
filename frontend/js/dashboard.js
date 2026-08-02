/* =====================================
   TRUSTNOVA BANK
   CUSTOMER DASHBOARD
===================================== */

document.addEventListener("DOMContentLoaded", async () => {
    await loadDashboard();
});


/* =====================================
   LOAD DASHBOARD
===================================== */

async function loadDashboard() {

    try {

        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();

        if (userError || !userData?.user) {
            window.location.href = "login.html";
            return;
        }

        const authUser = userData.user;


        /* =====================================
           LOAD CUSTOMER PROFILE
        ===================================== */

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
                "Profile loading error:",
                profileError
            );

            alert("Unable to load your customer profile.");
            return;
        }


        if (!profile) {
            alert("Customer profile not found.");
            return;
        }


        displayProfile(profile);


        /* =====================================
           LOAD CUSTOMER ACCOUNT
        ===================================== */

        const {
            data: account,
            error: accountError
        } = await supabase
            .from("accounts")
            .select("*")
            .eq("user_id", profile.user_id)
            .maybeSingle();


        if (accountError) {

            console.error(
                "Account loading error:",
                accountError
            );

            displayAccount(null);

        } else {

            displayAccount(account);

        }


        /* =====================================
           LOAD TRANSACTIONS
        ===================================== */

        if (account?.account_id) {

            await loadTransactions(
                account.account_id
            );

        } else {

            displayNoTransactions();

        }

    }

    catch (error) {

        console.error(
            "Dashboard error:",
            error
        );

        alert(
            "Unable to load your dashboard."
        );

    }
}


/* =====================================
   DISPLAY PROFILE
===================================== */

function displayProfile(profile) {

    const name =
        document.getElementById("user_name");

    if (name) {

        name.textContent =
            `${profile.first_name || ""} ${profile.last_name || ""}`.trim();

    }


    const email =
        document.getElementById("user_email");

    if (email) {

        email.textContent =
            profile.email || "";

    }


    const nationality =
        document.getElementById("user_nationality");

    if (nationality) {

        nationality.textContent =
            profile.nationality
                ? `Nationality: ${profile.nationality}`
                : "Nationality: Not provided";

    }


    const status =
        document.getElementById("user_status");

    if (status) {

        status.textContent =
            profile.status || "Active";

    }


    const photo =
        document.getElementById("user_photo");

    if (
        photo &&
        profile.profile_photo
    ) {

        photo.src =
            profile.profile_photo;

    }
}


/* =====================================
   DISPLAY ACCOUNT
===================================== */

function displayAccount(account) {

    const money =
        new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    const balance =
        document.getElementById("balance");

    const accountNumber =
        document.getElementById("account_number");

    const accountType =
        document.getElementById("account_type");


    if (!account) {

        if (balance) {
            balance.textContent = "$0.00";
        }

        if (accountNumber) {
            accountNumber.textContent =
                "Not assigned";
        }

        if (accountType) {
            accountType.textContent =
                "No account";
        }

        return;
    }


    if (balance) {

        balance.textContent =
            money.format(
                Number(account.balance || 0)
            );

    }


    if (accountNumber) {

        const number =
            String(
                account.account_number || ""
            );

        accountNumber.textContent =
            number
                ? `**** **** ${number.slice(-4)}`
                : "Not assigned";

    }


    if (accountType) {

        accountType.textContent =
            account.account_type || "Account";

    }
}


/* =====================================
   LOAD TRANSACTIONS
===================================== */

async function loadTransactions(accountId) {

    const list =
        document.getElementById(
            "transactionList"
        );

    if (!list) {
        return;
    }


    const {
        data: transactions,
        error
    } = await supabase
        .from("transactions")
        .select("*")
        .eq("account_id", accountId)
        .order(
            "transaction_date",
            {
                ascending: false
            }
        )
        .limit(5);


    if (error) {

        console.error(
            "Transaction loading error:",
            error
        );

        displayNoTransactions();
        return;

    }


    if (
        !transactions ||
        transactions.length === 0
    ) {

        displayNoTransactions();
        return;

    }


    const money =
        new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    list.innerHTML = "";


    transactions.forEach(
        (transaction) => {

            const row =
                document.createElement("tr");

            const description =
                document.createElement("td");

            const amount =
                document.createElement("td");

            const status =
                document.createElement("td");


            description.textContent =
                transaction.description ||
                "Transaction";


            amount.textContent =
                money.format(
                    Number(
                        transaction.amount || 0
                    )
                );


            status.textContent =
                transaction.status ||
                "Pending";


            row.appendChild(description);
            row.appendChild(amount);
            row.appendChild(status);

            list.appendChild(row);

        }
    );
}


/* =====================================
   NO TRANSACTIONS
===================================== */

function displayNoTransactions() {

    const list =
        document.getElementById(
            "transactionList"
        );

    if (!list) {
        return;
    }


    list.innerHTML = `
        <tr>
            <td colspan="3">
                No transactions yet
            </td>
        </tr>
    `;
}


/* =====================================
   LOGOUT
===================================== */

async function logout() {

    await supabase.auth.signOut();

    localStorage.removeItem("user");

    window.location.href =
        "login.html";
}

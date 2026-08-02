/* =====================================
   TRUSTNOVA BANK
   CUSTOMER TRANSACTION HISTORY
===================================== */

document.addEventListener("DOMContentLoaded", async () => {
    await loadTransactions();
});


/* =====================================
   LOAD TRANSACTIONS
===================================== */

async function loadTransactions() {

    try {

        /* =====================================
           1. CHECK AUTHENTICATION
        ===================================== */

        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();


        if (
            userError ||
            !userData?.user
        ) {

            window.location.href =
                "login.html";

            return;
        }


        const authUser =
            userData.user;


        /* =====================================
           2. LOAD CUSTOMER PROFILE
        ===================================== */

        const {
            data: profile,
            error: profileError
        } = await supabase
            .from("users")
            .select("user_id")
            .eq(
                "auth_user_id",
                authUser.id
            )
            .maybeSingle();


        if (profileError) {

            console.error(
                "Profile error:",
                profileError
            );

            alert(
                "Unable to load your customer profile."
            );

            return;
        }


        if (!profile) {

            alert(
                "Customer profile not found."
            );

            return;
        }


        /* =====================================
           3. LOAD CUSTOMER ACCOUNT
        ===================================== */

        const {
            data: account,
            error: accountError
        } = await supabase
            .from("accounts")
            .select("*")
            .eq(
                "user_id",
                profile.user_id
            )
            .maybeSingle();


        if (accountError) {

            console.error(
                "Account error:",
                accountError
            );

            alert(
                "Unable to load your account."
            );

            return;
        }


        /* =====================================
           NO ACCOUNT YET
        ===================================== */

        if (!account) {

            displayTransactions([]);

            return;
        }


        /* =====================================
           4. LOAD TRANSACTIONS
        ===================================== */

        const {
            data: transactions,
            error: transactionError
        } = await supabase
            .from("transactions")
            .select("*")
            .eq(
                "account_id",
                account.account_id
            )
            .order(
                "transaction_date",
                {
                    ascending: false
                }
            );


        if (transactionError) {

            console.error(
                "Transaction error:",
                transactionError
            );

            alert(
                "Unable to load transactions."
            );

            return;
        }


        displayTransactions(
            transactions || []
        );

    }

    catch (error) {

        console.error(
            "Unexpected transaction error:",
            error
        );

        alert(
            "Unable to load transactions."
        );
    }
}


/* =====================================
   DISPLAY TRANSACTIONS
===================================== */

function displayTransactions(
    transactions
) {

    const table =
        document.getElementById(
            "transactionList"
        );


    if (!table) {
        return;
    }


    table.innerHTML = "";


    const money =
        new Intl.NumberFormat(
            "en-US",
            {
                style: "currency",
                currency: "USD"
            }
        );


    if (
        !transactions ||
        transactions.length === 0
    ) {

        table.innerHTML = `
            <tr>
                <td colspan="5">
                    No transactions available
                </td>
            </tr>
        `;

        return;
    }


    transactions.forEach(
        (transaction) => {

            const row =
                document.createElement("tr");


            const dateCell =
                document.createElement("td");

            const descriptionCell =
                document.createElement("td");

            const typeCell =
                document.createElement("td");

            const amountCell =
                document.createElement("td");

            const statusCell =
                document.createElement("td");


            /* DATE */

            if (transaction.transaction_date) {

                dateCell.textContent =
                    new Date(
                        transaction.transaction_date
                    ).toLocaleDateString(
                        "en-US"
                    );

            } else {

                dateCell.textContent =
                    "—";

            }


            /* DESCRIPTION */

            descriptionCell.textContent =
                transaction.description ||
                "Transaction";


            /* TYPE */

            typeCell.textContent =
                transaction.type ||
                "—";


            /* AMOUNT */

            amountCell.textContent =
                money.format(
                    Number(
                        transaction.amount || 0
                    )
                );


            /* STATUS */

            statusCell.textContent =
                transaction.status ||
                "Pending";


            row.appendChild(dateCell);
            row.appendChild(descriptionCell);
            row.appendChild(typeCell);
            row.appendChild(amountCell);
            row.appendChild(statusCell);


            table.appendChild(row);

        }
    );
}

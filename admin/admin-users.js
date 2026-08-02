<!DOCTYPE html>
<html lang="en">

<head>

    <meta charset="UTF-8">

    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >

    <title>Admin Users | TrustNova Bank</title>

    <!-- Admin CSS -->
    <link
        rel="stylesheet"
        href="css/admin-style.css"
    >

    <!-- Font Awesome -->
    <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css"
    >

</head>


<body>


<!-- =====================================
     ADMIN HEADER
===================================== -->

<header class="admin-header">

    <div class="admin-brand">

        <img
            src="images/logo.png"
            alt="TrustNova Bank"
        >

        <div>

            <h1>
                TrustNova Bank
            </h1>

            <span>
                Administration
            </span>

        </div>

    </div>


    <div class="admin-header-right">

        <span class="admin-label">

            <i class="fas fa-user-shield"></i>

            Administrator

        </span>


        <button
            type="button"
            id="logoutButton"
            class="logout-button"
        >

            <i class="fas fa-sign-out-alt"></i>

            Logout

        </button>

    </div>

</header>



<!-- =====================================
     ADMIN LAYOUT
===================================== -->

<div class="admin-layout">


    <!-- =================================
         SIDEBAR
    ================================== -->

    <aside class="admin-sidebar">

        <nav>


            <a href="admin-dashboard.html">

                <i class="fas fa-chart-line"></i>

                Dashboard

            </a>


            <a
                href="admin-users.html"
                class="active"
            >

                <i class="fas fa-users"></i>

                Customers

            </a>


            <a href="admin-accounts.html">

                <i class="fas fa-university"></i>

                Accounts

            </a>


            <a href="admin-transactions.html">

                <i class="fas fa-exchange-alt"></i>

                Transactions

            </a>


            <a href="open-accounts.html">

                <i class="fas fa-folder-plus"></i>

                Open Accounts

            </a>


            <a href="payment.html">

                <i class="fas fa-credit-card"></i>

                Payments

            </a>


        </nav>

    </aside>



    <!-- =================================
         MAIN CONTENT
    ================================== -->

    <main class="admin-main">


        <!-- PAGE HEADER -->

        <div class="page-header">


            <div>

                <h2>
                    Customer Management
                </h2>

                <p>
                    View registered TrustNova Bank customers.
                </p>

            </div>


            <div class="account-counter">

                <i class="fas fa-users"></i>

                <span>
                    Total Customers:
                </span>

                <strong id="totalUsers">
                    0
                </strong>

            </div>


        </div>



        <!-- =================================
             SEARCH
        ================================== -->

        <section class="admin-card">


            <div class="search-container">


                <label for="userSearch">

                    <i class="fas fa-search"></i>

                    Search Customers

                </label>


                <input
                    type="search"
                    id="userSearch"
                    name="userSearch"
                    placeholder="Search by name, email, or phone..."
                    autocomplete="off"
                >


            </div>


        </section>



        <!-- =================================
             CUSTOMER TABLE
        ================================== -->

        <section class="admin-card">


            <div class="table-header">


                <div>

                    <h3>
                        Registered Customers
                    </h3>

                    <p>
                        Customer accounts currently registered in the system.
                    </p>

                </div>


            </div>



            <div class="table-wrapper">


                <table class="admin-table">


                    <thead>

                        <tr>

                            <th>
                                Customer ID
                            </th>

                            <th>
                                Full Name
                            </th>

                            <th>
                                Email
                            </th>

                            <th>
                                Phone
                            </th>

                            <th>
                                Nationality
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Registered
                            </th>

                        </tr>

                    </thead>



                    <tbody id="userList">


                        <tr>

                            <td colspan="7">

                                Loading customers...

                            </td>

                        </tr>


                    </tbody>


                </table>


            </div>


        </section>


    </main>


</div>



<!-- =====================================
     FOOTER
===================================== -->

<footer class="admin-footer">

    <p>
        &copy; 2026 TrustNova Bank.
        All Rights Reserved.
    </p>

    <p>
        Secure Administration Portal
    </p>

</footer>



<!-- =====================================
     JAVASCRIPT
===================================== -->

<!-- Supabase Library -->
<script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>

<!-- Admin Supabase Configuration -->
<script src="js/supabase.js"></script>

<!-- Authentication -->
<script src="js/auth.js"></script>

<!-- Admin Authentication -->
<script src="js/admin-auth.js"></script>

<!-- Customer Management -->
<script src="js/admin-users.js"></script>


</body>

</html>

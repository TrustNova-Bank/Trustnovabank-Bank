/* =====================================
   TRUSTNOVA BANK
   ADMIN LOGIN
   SUPABASE AUTHENTICATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    const loginForm =
        document.getElementById("adminLoginForm");


    if (!loginForm) {

        console.error(
            "adminLoginForm was not found."
        );

        return;
    }


    loginForm.addEventListener(
        "submit",
        handleAdminLogin
    );

});


/* =====================================
   ADMIN LOGIN
===================================== */

async function handleAdminLogin(event) {

    event.preventDefault();


    const emailElement =
        document.getElementById(
            "adminEmail"
        );


    const passwordElement =
        document.getElementById(
            "adminPassword"
        );


    if (
        !emailElement ||
        !passwordElement
    ) {

        alert(
            "Admin login form is not configured correctly."
        );

        return;
    }


    const email =
        emailElement.value
            .trim()
            .toLowerCase();


    const password =
        passwordElement.value;


    if (!email) {

        alert(
            "Please enter your email address."
        );

        emailElement.focus();

        return;
    }


    if (!password) {

        alert(
            "Please enter your password."
        );

        passwordElement.focus();

        return;
    }


    const submitButton =
        loginForm.querySelector(
            'button[type="submit"]'
        );


    if (submitButton) {

        submitButton.disabled = true;

        submitButton.textContent =
            "Signing in...";

    }


    try {

        /* =====================================
           1. SUPABASE AUTHENTICATION
        ===================================== */

        const {
            data: authData,
            error: authError
        } =
            await supabase.auth
                .signInWithPassword({

                    email: email,

                    password: password

                });


        if (authError) {

            console.error(
                "Admin authentication error:",
                authError
            );

            alert(
                "Invalid administrator email or password."
            );

            return;
        }


        const authUser =
            authData?.user;


        if (!authUser) {

            alert(
                "Administrator login could not be completed."
            );

            return;
        }


        /* =====================================
           2. VERIFY ADMIN RECORD
        ===================================== */

        const {
            data: admin,
            error: adminError
        } =
            await supabase
                .from("admins")
                .select("*")
                .eq(
                    "auth_user_id",
                    authUser.id
                )
                .maybeSingle();


        if (adminError) {

            console.error(
                "Admin profile error:",
                adminError
            );

            await supabase.auth.signOut();

            alert(
                "Your login was authenticated, but your administrator profile could not be verified."
            );

            return;
        }


        /* =====================================
           3. ADMIN NOT FOUND
        ===================================== */

        if (!admin) {

            await supabase.auth.signOut();

            localStorage.removeItem(
                "admin"
            );

            alert(
                "You are not authorized to access the administrator portal."
            );

            return;
        }


        /* =====================================
           4. CHECK ADMIN STATUS
        ===================================== */

        const adminStatus =
            String(
                admin.status || "Active"
            ).toLowerCase();


        if (
            adminStatus !== "active"
        ) {

            await supabase.auth.signOut();

            localStorage.removeItem(
                "admin"
            );

            alert(
                "Your administrator account is not active."
            );

            return;
        }


        /* =====================================
           5. SAVE NON-SENSITIVE ADMIN DATA
        ===================================== */

        localStorage.setItem(
            "admin",
            JSON.stringify({

                admin_id:
                    admin.admin_id || null,

                email:
                    admin.email ||
                    authUser.email ||
                    email,

                name:
                    admin.name || "",

                role:
                    admin.role ||
                    "Administrator"

            })
        );


        /* =====================================
           6. SUCCESS
        ===================================== */

        window.location.href =
            "admin-dashboard.html";

    }


    catch (error) {

        console.error(
            "Unexpected admin login error:",
            error
        );

        await supabase.auth.signOut();

        alert(
            "Unable to complete administrator login. Please try again."
        );

    }


    finally {

        if (submitButton) {

            submitButton.disabled = false;

            submitButton.textContent =
                "Admin Login";

        }

    }

}

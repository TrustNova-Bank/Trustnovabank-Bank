/* =====================================
   TRUSTNOVA BANK
   CUSTOMER PROFILE
   SUPABASE AUTHENTICATION
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadProfile();

    const updateButton =
        document.getElementById("updateProfileButton");

    const logoutButton =
        document.getElementById("logoutButton");


    /* ===============================
       UPDATE PROFILE BUTTON
    =============================== */

    if (updateButton) {

        updateButton.addEventListener(
            "click",
            updateProfile
        );

    }


    /* ===============================
       LOGOUT BUTTON
    =============================== */

    if (logoutButton) {

        logoutButton.addEventListener(
            "click",
            logout
        );

    }

});


/* =====================================
   LOAD CUSTOMER PROFILE
===================================== */

async function loadProfile() {

    try {

        const {
            data: userData,
            error: userError
        } = await supabase.auth.getUser();


        /* ===============================
           CHECK AUTHENTICATION
        =============================== */

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


        /* ===============================
           LOAD CUSTOMER PROFILE
        =============================== */

        const {
            data: profile,
            error: profileError
        } = await supabase

            .from("users")

            .select("*")

            .eq(
                "auth_user_id",
                authUser.id
            )

            .maybeSingle();


        if (profileError) {

            console.error(
                "Profile loading error:",
                profileError
            );

            alert(
                "Unable to load your profile."
            );

            return;

        }


        if (!profile) {

            alert(
                "Customer profile not found."
            );

            return;

        }


        /* ===============================
           DISPLAY PROFILE
        =============================== */

        setText(
            "profile_name",
            `${profile.first_name || ""} ${profile.last_name || ""}`.trim()
        );


        setText(
            "profile_email",
            profile.email || authUser.email || "Not available"
        );


        setText(
            "profile_first_name",
            profile.first_name || "Not provided"
        );


        setText(
            "profile_last_name",
            profile.last_name || "Not provided"
        );


        setText(
            "profile_email_value",
            profile.email || authUser.email || "Not available"
        );


        setText(
            "profile_phone",
            profile.phone || "Not provided"
        );


        setText(
            "profile_nationality",
            profile.nationality || "Not provided"
        );


        setText(
            "profile_status",
            profile.status || "Active"
        );


        /* ===============================
           CUSTOMER ID
        =============================== */

        setText(
            "profile_customer_id",
            profile.user_id || "Not available"
        );


        /* ===============================
           CREATED DATE
        =============================== */

        if (profile.created_at) {

            const createdDate =
                new Date(profile.created_at);

            setText(
                "profile_created_at",
                createdDate.toLocaleDateString(
                    "en-US",
                    {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                    }
                )
            );

        } else {

            setText(
                "profile_created_at",
                "Not available"
            );

        }


        /* ===============================
           PROFILE PHOTO
        =============================== */

        const photo =
            document.getElementById(
                "user_photo"
            );


        if (
            photo &&
            profile.profile_photo
        ) {

            photo.src =
                profile.profile_photo;

        }

    }

    catch (error) {

        console.error(
            "Unexpected profile error:",
            error
        );

        alert(
            "Unable to load your profile."
        );

    }

}


/* =====================================
   SET TEXT CONTENT
===================================== */

function setText(id, value) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value ?? "";

    }

}


/* =====================================
   UPDATE PROFILE
===================================== */

async function updateProfile() {

    try {

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


        /*
         * The current profile page is
         * display-only, so we don't
         * pretend that the displayed
         * fields are editable.
         *
         * A proper edit-profile form
         * can be added separately.
         */

        alert(
            "Profile editing will be available from the account settings."
        );

    }

    catch (error) {

        console.error(
            "Profile update error:",
            error
        );

        alert(
            "Unable to update your profile."
        );

    }

}


/* =====================================
   LOGOUT
===================================== */

async function logout() {

    try {

        const {
            error
        } =
            await supabase.auth.signOut();


        if (error) {

            console.error(
                "Logout error:",
                error
            );

        }


        localStorage.removeItem(
            "user"
        );


        window.location.href =
            "login.html";

    }

    catch (error) {

        console.error(
            "Unexpected logout error:",
            error
        );

        window.location.href =
            "login.html";

    }

}

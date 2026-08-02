/* =====================================
   TRUSTNOVA BANK
   CUSTOMER PROFILE
===================================== */

document.addEventListener("DOMContentLoaded", async () => {

    await loadProfile();

    const updateButton =
        document.getElementById("updateProfile");

    if (updateButton) {
        updateButton.addEventListener(
            "click",
            updateProfile
        );
    }
});


/* =====================================
   LOAD PROFILE
===================================== */

async function loadProfile() {

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
                "Profile error:",
                profileError
            );

            alert("Unable to load your profile.");
            return;
        }


        if (!profile) {
            alert("Customer profile not found.");
            return;
        }


        setValue(
            "first_name",
            profile.first_name
        );

        setValue(
            "last_name",
            profile.last_name
        );

        setValue(
            "email",
            profile.email
        );

        setValue(
            "phone",
            profile.phone
        );

        setValue(
            "nationality",
            profile.nationality
        );


        const photo =
            document.getElementById(
                "profile_photo"
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
            "Unable to load profile."
        );
    }
}


/* =====================================
   SET INPUT VALUE
===================================== */

function setValue(id, value) {

    const element =
        document.getElementById(id);

    if (element) {
        element.value =
            value || "";
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


        const first_name =
            getValue("first_name");

        const last_name =
            getValue("last_name");

        const phone =
            getValue("phone");

        const nationality =
            getValue("nationality");


        if (!first_name || !last_name) {

            alert(
                "First name and last name are required."
            );

            return;
        }


        const {
            error: updateError
        } = await supabase
            .from("users")
            .update({

                first_name:
                    first_name,

                last_name:
                    last_name,

                phone:
                    phone,

                nationality:
                    nationality

            })
            .eq(
                "auth_user_id",
                authUser.id
            );


        if (updateError) {

            console.error(
                "Profile update error:",
                updateError
            );

            alert(
                updateError.message
            );

            return;
        }


        alert(
            "Profile updated successfully."
        );


        await loadProfile();

    }

    catch (error) {

        console.error(
            "Unexpected update error:",
            error
        );

        alert(
            "Unable to update your profile."
        );
    }
}


/* =====================================
   GET INPUT VALUE
===================================== */

function getValue(id) {

    const element =
        document.getElementById(id);

    return element
        ? element.value.trim()
        : "";
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

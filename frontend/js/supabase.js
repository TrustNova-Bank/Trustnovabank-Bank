/* =====================================
   TRUSTNOVA BANK
   SUPABASE CONFIGURATION
===================================== */


/* =====================================
   SUPABASE PROJECT
===================================== */

const SUPABASE_URL =
    "https://uiltkhacgipmjrlgsnvb.supabase.co";


/* =====================================
   SUPABASE PUBLISHABLE KEY
===================================== */

const SUPABASE_PUBLISHABLE_KEY =
    "sb_publishable_FUPiaEMQmlO0X7CtZlZU-Q_PjCC3mGD";


/* =====================================
   CHECK SUPABASE LIBRARY
===================================== */

if (
    typeof window.supabase === "undefined"
) {

    console.error(
        "Supabase library was not loaded."
    );

    throw new Error(
        "Supabase library must be loaded before js/supabase.js."
    );

}


/* =====================================
   CREATE SUPABASE CLIENT
===================================== */

const supabase =
    window.supabase.createClient(
        SUPABASE_URL,
        SUPABASE_PUBLISHABLE_KEY
    );


/* =====================================
   CONFIRM CONFIGURATION
===================================== */

console.log(
    "TrustNova Bank Supabase client initialized."
);

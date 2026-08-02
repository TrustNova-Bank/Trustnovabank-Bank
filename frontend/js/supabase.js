/* =====================================
   TRUSTNOVA BANK
   SUPABASE CONFIGURATION
===================================== */

const supabaseUrl =
    "https://uiltkhacgipmjrlgsnvb.supabase.co";

const supabaseKey =
    "sb_publishable_FUPiaEMQmlO0X7CtZlZU-Q_PjCC3mGD";


/* =====================================
   CREATE SUPABASE CLIENT
===================================== */

const supabase =
    window.supabase.createClient(
        supabaseUrl,
        supabaseKey
    );

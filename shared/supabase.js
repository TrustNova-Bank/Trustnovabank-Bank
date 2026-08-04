const SUPABASE_URL =

    "https://ftcmobswvxyhcheabtet.supabase.co";

const SUPABASE_PUBLISHABLE_KEY =

    "sb_publishable_8n4fnNTInYP5fR1Z4e706Q_Z-n913B8";

const supabase =

    window.supabase.createClient(

        SUPABASE_URL,

        SUPABASE_PUBLISHABLE_KEY,

        {

            auth: {

                autoRefreshToken: true,

                persistSession: true,

                detectSessionInUrl: true

            }

        }

    )

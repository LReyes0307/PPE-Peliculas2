import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabasePublishableKey = import.meta.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabasePublishableKey) {
	throw new Error(
		'Configura SUPABASE_URL y SUPABASE_PUBLISHABLE_KEY en el archivo .env.',
	);
}

export const supabase = createClient(supabaseUrl, supabasePublishableKey);

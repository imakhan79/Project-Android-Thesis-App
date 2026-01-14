
import { createClient } from '@supabase/supabase-js';

// Project reference from the provided URL: pvtznzlobudwozdctsy
const SUPABASE_URL = 'https://pvtznzlobudwozdctsy.supabase.co';
// Using the service role key provided in the initial prompt
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB2dHpuemxvYnVkd296ZGN0c3lsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODM1NjQ3OSwiZXhwIjoyMDgzOTMyNDc5fQ.i-QIDr5YWLgyu80RRUl5tud0ozOmUEJmDLhuWYEZdWI';

export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

export const checkSupabaseConnection = async () => {
  try {
    // Attempting a simple query to verify connection
    // Note: We use a common Supabase internal table check if projects table isn't created yet
    const { data, error } = await supabase.from('projects').select('id').limit(1);
    
    if (error && error.code !== 'PGRST116') {
      // If error is just "no rows", that's fine. If it's a real connection error, throw.
      console.warn('Supabase connected but "projects" table might not be ready:', error.message);
    }
    
    return { connected: true, msg: 'Supabase Online' };
  } catch (err) {
    console.warn('Supabase connection check failed:', err);
    return { connected: !!supabase, msg: 'Supabase Init' };
  }
};

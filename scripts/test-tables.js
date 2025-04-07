const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

const testTables = async () => {
  try {
    const { data: projects, error } = await supabase
      .from('projects')
      .select('*')
      .limit(1);

    if (error) {
      console.error('❌ Erreur lors de la requête :', error);
    } else {
      console.log('✅ La table projects existe et est accessible');
      console.log('Données :', projects);
    }
  } catch (error) {
    console.error('❌ Erreur :', error);
  }
};

testTables(); 
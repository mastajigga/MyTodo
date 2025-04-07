const https = require('https');

const options = {
  hostname: 'eahjdvmpmqwnupsqnxjz.supabase.co',
  path: '/rest/v1/sql',
  method: 'POST',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2MzMxOSwiZXhwIjoyMDU5NTM5MzE5fQ.1IrHCnJbJuh6Fk2FaQAqSZsP7M2Pr1OYMzt8ABBKg6U',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2MzMxOSwiZXhwIjoyMDU5NTM5MzE5fQ.1IrHCnJbJuh6Fk2FaQAqSZsP7M2Pr1OYMzt8ABBKg6U',
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  }
};

const req = https.request(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data);
  });
});

const createTableSQL = {
  query: `
    CREATE TABLE IF NOT EXISTS todos (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      completed BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `
};

req.write(JSON.stringify(createTableSQL));
req.end(); 
const https = require('https');

const options = {
  hostname: 'eahjdvmpmqwnupsqnxjz.supabase.co',
  path: '/rest/v1/todos',
  headers: {
    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2MzMxOSwiZXhwIjoyMDU5NTM5MzE5fQ.1IrHCnJbJuh6Fk2FaQAqSZsP7M2Pr1OYMzt8ABBKg6U',
    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVhaGpkdm1wbXF3bnVwc3FueGp6Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0Mzk2MzMxOSwiZXhwIjoyMDU5NTM5MzE5fQ.1IrHCnJbJuh6Fk2FaQAqSZsP7M2Pr1OYMzt8ABBKg6U',
    'Prefer': 'return=representation'
  }
};

https.get(options, (res) => {
  let data = '';
  
  res.on('data', (chunk) => {
    data += chunk;
  });
  
  res.on('end', () => {
    console.log('Status Code:', res.statusCode);
    console.log('Headers:', res.headers);
    console.log('Body:', data);
  });
}).on('error', (e) => {
  console.error('Error:', e);
}); 
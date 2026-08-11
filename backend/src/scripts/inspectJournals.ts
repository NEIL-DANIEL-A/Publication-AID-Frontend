import 'dotenv/config';
import { Client } from 'pg';

async function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    console.error('DATABASE_URL is not set in .env');
    return;
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('Connected to database. Querying tables...');
    
    // Query list of tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    console.log('Tables in public schema:', tablesRes.rows.map(r => r.table_name));

    // If journals table exists, query its columns
    const journalsExists = tablesRes.rows.some(r => r.table_name === 'journals');
    if (journalsExists) {
      console.log('Journals table exists! Querying columns...');
      const colsRes = await client.query(`
        SELECT column_name, data_type, is_nullable
        FROM information_schema.columns
        WHERE table_name = 'journals'
      `);
      console.log('Journals columns:');
      console.table(colsRes.rows);

      // Query sample row
      const sampleRes = await client.query(`SELECT * FROM journals LIMIT 3`);
      console.log('Sample journals rows:', sampleRes.rows);
    } else {
      console.log('journals table does NOT exist in public schema!');
    }
  } catch (err) {
    console.error('Error connecting/querying database:', err);
  } finally {
    await client.end();
  }
}

main();

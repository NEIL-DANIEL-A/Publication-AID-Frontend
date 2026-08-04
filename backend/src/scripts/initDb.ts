import 'dotenv/config';
import { initializeDatabase } from '../services/dbInit';

async function main() {
  console.log('Running database schema initialization script...');
  const success = await initializeDatabase();
  if (success) {
    console.log('Done!');
    process.exit(0);
  } else {
    console.error('Failed to initialize database.');
    process.exit(1);
  }
}

main();

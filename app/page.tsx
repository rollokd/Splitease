const { Pool } = require('pg');

// Create a new pool instance using the connection details from your .env file
const pool = new Pool({
  user: process.env.POSTGRES_USER,
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DATABASE,
  password: process.env.POSTGRES_PASSWORD,
  port: 5432, // Default PostgreSQL port
});

async function queryDatabase() {
  try {
    // Connect to the database
    const client = await pool.connect();

    // Execute your query
    const res = await client.query('SELECT * FROM users;');

    console.log(res.rows);

    // Release the client back to the pool
    client.release();
  } catch (error) {
    console.error('Error querying the database:', error);
  }
}

queryDatabase();




export default function Home() {
  return (
    <>
    <div>Hello</div>
    </>
  );
}

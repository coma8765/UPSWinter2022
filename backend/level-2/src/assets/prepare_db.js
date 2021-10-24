import { Client } from "pg";
import fs from "fs";

const sql = fs.readFileSync('create_db.sql');

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: {
      rejectUnauthorized: false
  }
});

client.connect();

client.query(sql, function(err, result){
  if(err){
      console.log('error: ', err);
      process.exit(1);
  }
  process.exit(0);
});
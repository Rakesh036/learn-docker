import express from 'express';
import pkg from 'pg';
import { createClient } from 'redis';

const { Pool } = pkg;
const app = express();

// PostgreSQL connection
const pgPool = new Pool({
    user: 'postgres',
    // host: 'postgres-db', // service name from docker-compose
    host: 'localhost',
    database: 'mydb',
    password: 'postgres',
    port: 5431,
});

pgPool.connect()
    .then(() => console.log('✅ Connected to PostgreSQL'))
    .catch(err => console.error('❌ PostgreSQL connection error', err));

// Redis connection
const redisClient = createClient({
    url: 'redis://localhost:6379' // or 'redis://127.0.0.1:6379'
});



redisClient.on('error', (err) => console.error('❌ Redis connection error', err));
redisClient.connect()
    .then(() => console.log('✅ Connected to Redis'));

app.get('/', async (req, res) => {
    console.log('Request received at /');

    // Optional: Test Redis & PG
    await redisClient.set('greeting', 'Hello, Redis!');
    const greeting = await redisClient.get('greeting');

    const pgResult = await pgPool.query('SELECT NOW()');

    res.json({
        message: 'Hello, Docker!',
        redis: greeting,
        postgresTime: pgResult.rows[0].now,
    });
});

app.listen(3000, () => {
    console.log('🚀 Server is running on port 3000');
});

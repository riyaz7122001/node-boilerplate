import express, { Application } from 'express';
import cors from 'cors'
import { FRONTEND_URL } from './secrets';
import compression from 'compression';
import cookieParser from 'cookie-parser';

const app: Application = express()

app.use(express.json())
app.use(cors({
    origin: [FRONTEND_URL!, 'http://localhost:5173', 'http://localhost:4173', 'https://localhost:5173', 'https://localhost:4173'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization', 'x-csrf'],
    methods: ['GET', 'POST', 'PUT', 'DELETE']
}));

app.use(cookieParser())
app.use(compression());

export default app;
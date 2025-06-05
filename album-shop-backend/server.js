import express, { json } from "express";
import cors from "cors";

// Debug logging setup
const DEBUG = true;
const log = (message, data = null) => {
    if (DEBUG) {
        console.log(`[DEBUG] ${new Date().toISOString()} - ${message}`);
        if (data) console.log(data);
    }
};

log('Initializing Express application...');
const app = express();

console.log("erver is starting on port", process.env.PORT);

// Middleware logging
app.use((req, res, next) => {
    log(`Incoming ${req.method} request to ${req.url}`);
    next();
});

app.use(json()); // Allows JSON body parsing
log('JSON body parsing middleware enabled');

app.use(cors({
    origin: 'https://album-shop-frontend-production.up.railway.app', // * In production, replace with your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
})); // Handles CORS for frontend requests
log('CORS middleware configured');

// Import API routes
import albumRoutes from "./routes/albums.js";
import statisticsRoutes from "./routes/statistics.js";
import authRoutes from "./routes/auth.js";
import shoppingListRoutes from './routes/shoppingList.js';


app.use("/api/albums", albumRoutes);
app.use("/api/statistics", statisticsRoutes);
app.use("/api/auth", authRoutes);
app.use('/api/shopping-list', shoppingListRoutes);
log('Album and statistics routes registered');

app.get("/", (req, res) => {
    log('Root endpoint accessed');
    res.send("Album Shop RESTful API is running!");
});

// Add health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ status: "healthy" });
});

const PORT = process.env.PORT || 3000;
log(`Environment PORT value: ${process.env.PORT}`);

// Create server with error handling
const server = app.listen(PORT, '0.0.0.0', () => {
    log(`Server successfully started on port ${PORT}`);
    log('Available endpoints:');
    log('- GET  /');
    log('- GET  /health');
    log('- GET  /api/albums');
    log('- POST /api/albums');
    log('- GET  /api/albums/:id');
    log('- PUT  /api/albums/:id');
    log('- DELETE /api/albums/:id');
    log('- GET  /api/statistics/album-stats');
});

// Add error handling
server.on('error', (error) => {
    log(`Server error: ${error.message}`);
    if (error.code === 'EADDRINUSE') {
        log(`Port ${PORT} is already in use`);
    }
    process.exit(1);
});

// Handle process termination
process.on('SIGTERM', () => {
    log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        log('Server closed');
        process.exit(0);
    });
});

process.on('uncaughtException', (error) => {
    log(`Uncaught Exception: ${error.message}`);
    log(error.stack);
    server.close(() => {
        process.exit(1);
    });
});

export default app;

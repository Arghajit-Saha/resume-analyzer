const express = require('express');
const mongoose = require('mongoose');
const healthRouter = express.Router();

healthRouter.get("/", async (req, res) => {
    const healthInfo = {
        status: 'UP',
        timestamp: new Date().toISOString(),
        uptime: `${process.uptime().toFixed(2)} seconds`,
        system: {
            memoryUsage: `${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB`,
            nodeVersion: process.version
        },
        services: {
            database: 'UNKNOWN'
        }
    };

    try {
        if (mongoose.connection.readyState === 1) {
            healthInfo.services.database = 'UP';
        } else {
            throw new Error('Database is not connected');
        }

        res.status(200).json(healthInfo);

    } catch (error) {
        healthInfo.status = 'DOWN';
        healthInfo.services.database = 'DOWN';
        healthInfo.error = error.message;
        
        res.status(503).json(healthInfo);
    }
});

module.exports = healthRouter;
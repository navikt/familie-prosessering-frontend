const express = require('express');
const path = require('path');
const fs = require('fs');

const delayMs = 20;
const app = express();

const lesMockFil = filnavn => {
    try {
        return fs.readFileSync(path.join(__dirname, '/mock/' + filnavn), 'UTF-8');
    } catch (err) {
        throw err;
    }
};

app.get('/familie-ks-mottak/api/task', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`tasks-feilede.json`)), delayMs);
});

app.get('/user/profile', (req, res) => {
    res.send({
        displayName: 'Test Testersen',
    });
});

app.get('/services', (req, res) => {
    res.send({
        data: [
            {
                displayName: 'KS mottak',
                id: 'familie-ks-mottak',
                proxyPath: '/familie-ks-mottak/api',
            },
        ],
        status: 'SUKSESS',
    });
});

module.exports = app;

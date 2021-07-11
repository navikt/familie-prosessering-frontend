const express = require('express');
const path = require('path');
const fs = require('fs');

const delayMs = 20;
const app = express();

const lesMockFil = (filnavn) => {
    try {
        return fs.readFileSync(path.join(__dirname, '/mock/' + filnavn), 'UTF-8');
    } catch (err) {
        throw err;
    }
};

app.get('/familie-ks-mottak/api/task/v2', (req, res) => {
    //res.status(500).send()
    setTimeout(() => res.send(lesMockFil(`tasks-feilede2.json`)), delayMs);
});

app.get('/familie-ks-mottak/api/task/logg/:id', (req, res) => {
    setTimeout(() => res.send(lesMockFil(`tasks-logg.json`)), delayMs);
});

app.put('/familie-ks-mottak/api/task/rekjorAlle', (req, res) => {
    res.send({
        status: 'SUKSESS',
        melding: 'Innhenting av data var vellykket',
        data: {},
    });
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

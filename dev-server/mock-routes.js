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

const services = [
    {
        displayName: 'Klage',
        id: 'familie-klage',
        gruppe: 'FELLES',
        proxyPath: '/familie-klage/api',
    },
    {
        displayName: 'EF mottak',
        id: 'familie-ef-mottak',
        gruppe: 'EF',
        proxyPath: '/familie-ef-mottak/api',
    },
    {
        displayName: 'EF sak',
        id: 'familie-ef-sak',
        gruppe: 'EF',
        proxyPath: '/familie-ef-sak/api',
    },
    {
        displayName: 'EF iverksett',
        id: 'familie-ef-iverksett',
        gruppe: 'EF',
        proxyPath: '/familie-ef-iverksett/api',
    },
    {
        displayName: 'Barnetrygd sak',
        id: 'familie-ba-sak',
        gruppe: 'BAKS',
        proxyPath: '/familie-ba-sak/api',
    },
    {
        displayName: 'Kontantstøtte sak',
        id: 'familie-ks-sak',
        gruppe: 'BAKS',
        proxyPath: '/familie-ks-sak/api',
    },
    {
        displayName: 'BAKS mottak',
        id: 'familie-baks-mottak',
        gruppe: 'BAKS',
        proxyPath: '/familie-baks-mottak/api',
    },
];

const oppfolgingPerService = {
    'familie-klage': { antallFeilet: 1, antallManuellOppfølging: 0 },
    'familie-ef-mottak': { antallFeilet: 3, antallManuellOppfølging: 0 },
    'familie-ef-sak': { antallFeilet: 2, antallManuellOppfølging: 0 },
    'familie-ef-iverksett': { antallFeilet: 0, antallManuellOppfølging: 0 },
    'familie-ba-sak': { antallFeilet: 4, antallManuellOppfølging: 0 },
    'familie-ks-sak': { antallFeilet: 0, antallManuellOppfølging: 2 },
    'familie-baks-mottak': { antallFeilet: 0, antallManuellOppfølging: 0 },
};

const registrerTjeneste = (service) => {
    const base = service.proxyPath;

    app.get(`${base}/task/antall-feilet-og-manuell-oppfolging`, (req, res) => {
        const oppf = oppfolgingPerService[service.id] || {
            antallFeilet: 0,
            antallManuellOppfølging: 0,
        };
        setTimeout(
            () =>
                res.send({
                    status: 'SUKSESS',
                    melding: 'OK',
                    data: oppf,
                }),
            delayMs
        );
    });

    app.get(`${base}/task/v2`, (req, res) => {
        setTimeout(() => res.send(lesMockFil('tasks-feilede2.json')), delayMs);
    });

    app.get(`${base}/task/callId/:callId`, (req, res) => {
        setTimeout(() => res.send(lesMockFil('tasks-feilede2.json')), delayMs);
    });

    app.get(`${base}/task/type/alle`, (req, res) => {
        res.send({
            status: 'SUKSESS',
            melding: 'OK',
            data: ['hentJournalpostIdFraJoarkTask', 'journalførSøknad', 'sendTilSak'],
        });
    });

    app.get(`${base}/task/logg/:id`, (req, res) => {
        setTimeout(() => res.send(lesMockFil('tasks-logg.json')), delayMs);
    });

    app.get(`${base}/task/:id`, (req, res) => {
        const tasks = JSON.parse(lesMockFil('tasks-feilede2.json')).data.tasks;
        const task =
            tasks.find((t) => String(t.id) === String(req.params.id)) || tasks[0];
        setTimeout(
            () =>
                res.send({
                    status: 'SUKSESS',
                    melding: 'OK',
                    data: task,
                }),
            delayMs
        );
    });

    app.put(`${base}/task/rekjorAlle`, (req, res) => {
        res.send({ status: 'SUKSESS', melding: 'OK', data: {} });
    });

    app.put(`${base}/task/rekjor`, (req, res) => {
        res.send({ status: 'SUKSESS', melding: 'OK', data: {} });
    });
};

services.forEach(registrerTjeneste);

app.get('/user/profile', (req, res) => {
    res.send({
        displayName: 'Test Testersen',
    });
});

app.get('/services', (req, res) => {
    res.send({
        data: services,
        status: 'SUKSESS',
    });
});

module.exports = app;

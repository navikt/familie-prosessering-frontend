// TODO: Mock-data for visuell styling-test. Fjern/rydd opp før merge til main.
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

const ressurs = (data) => ({ data, status: 'SUKSESS' });

// TODO: Dummy services for å reprodusere boksene fra skjermbildet. Fjern før merge.
const dummyServices = [
    { displayName: 'Klage', id: 'familie-klage', gruppe: 'FELLES', proxyPath: '/familie-klage/api' },
    { displayName: 'EF mottak', id: 'familie-ef-mottak', gruppe: 'EF', proxyPath: '/familie-ef-mottak/api' },
    { displayName: 'EF sak', id: 'familie-ef-sak', gruppe: 'EF', proxyPath: '/familie-ef-sak/api' },
    { displayName: 'EF personhendelse', id: 'familie-ef-personhendelse', gruppe: 'EF', proxyPath: '/familie-ef-personhendelse/api' },
    { displayName: 'EF iverksett', id: 'familie-ef-iverksett', gruppe: 'EF', proxyPath: '/familie-ef-iverksett/api' },
    { displayName: 'Barnetrygd sak', id: 'familie-ba-sak', gruppe: 'BAKS', proxyPath: '/familie-ba-sak/api' },
    { displayName: 'Kontantstøtte sak', id: 'familie-ks-sak', gruppe: 'BAKS', proxyPath: '/familie-ks-sak/api' },
    { displayName: 'BAKS mottak', id: 'familie-baks-mottak', gruppe: 'BAKS', proxyPath: '/familie-baks-mottak/api' },
    { displayName: 'Barnehagelister API', id: 'familie-ba-skolepenger', gruppe: 'BAKS', proxyPath: '/familie-ba-skolepenger/api' },
];

// TODO: Dummy tellinger per service for å vise alle ikon-tilstander (rød X / mop / grønn check). Fjern før merge.
const dummyTellingerPerService = {
    'familie-klage': { antallFeilet: 1, antallManuellOppfølging: 0 },
    'familie-ef-mottak': { antallFeilet: 0, antallManuellOppfølging: 0 },
    'familie-ef-sak': { antallFeilet: 0, antallManuellOppfølging: 1 },
    'familie-ef-personhendelse': { antallFeilet: 0, antallManuellOppfølging: 0 },
    'familie-ef-iverksett': { antallFeilet: 5, antallManuellOppfølging: 0 },
    'familie-ba-sak': { antallFeilet: 22, antallManuellOppfølging: 0 },
    'familie-ks-sak': { antallFeilet: 0, antallManuellOppfølging: 0 },
    'familie-baks-mottak': { antallFeilet: 0, antallManuellOppfølging: 0 },
    'familie-ba-skolepenger': { antallFeilet: 0, antallManuellOppfølging: 3 },
};

app.get('/services', (req, res) => {
    res.send(ressurs(dummyServices));
});

app.get('/user/profile', (req, res) => {
    res.send({ displayName: 'Test Testersen' });
});

// TODO: Generisk catch-all for alle services så vi kan klikke rundt. Fjern når ekte backend er på plass.
app.get('/:service/api/task/antall-feilet-og-manuell-oppfolging', (req, res) => {
    const telling = dummyTellingerPerService[req.params.service] ?? {
        antallFeilet: 0,
        antallManuellOppfølging: 0,
    };
    setTimeout(() => res.send(ressurs(telling)), delayMs);
});

app.get('/:service/api/task/v2', (req, res) => {
    setTimeout(() => res.send(lesMockFil('tasks-feilede2.json')), delayMs);
});

app.get('/:service/api/task/logg/:id', (req, res) => {
    setTimeout(() => res.send(lesMockFil('tasks-logg.json')), delayMs);
});

app.get('/:service/api/task/type/alle', (req, res) => {
    res.send(
        ressurs([
            'hentJournalpostIdFraJoarkTask',
            'sendTilSak',
            'iverksettMotOppdrag',
            'mottaFødselshendelse',
        ])
    );
});

app.put('/:service/api/task/rekjorAlle', (req, res) => {
    res.send({
        status: 'SUKSESS',
        melding: 'Innhenting av data var vellykket',
        data: {},
    });
});

app.put('/:service/api/task/rekjor', (req, res) => {
    res.send(ressurs({}));
});

module.exports = app;

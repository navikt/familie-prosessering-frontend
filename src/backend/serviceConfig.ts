export interface IService {
    clientId: string;
    displayName: string;
    proxyPath: string;
    id: string;
    proxyUrl: string;
    statistikk?: boolean;
}

let proxyUrls: { [key: string]: string } = {};
if (process.env.ENV === 'local') {
    proxyUrls = {
        barnetrygd_mottak: 'http://localhost:8090',
        barnetrygd_sak: 'http://localhost:8089',
        enslig_mottak: 'http://localhost:8092',
        kontantstøtte_mottak: 'http://localhost:8084',
    };
} else {
    proxyUrls = {
        barnetrygd_mottak: `https://familie-ba-mottak.${process.env.ENV}-fss-pub.nais.io`,
        barnetrygd_sak: `https://familie-ba-sak.${process.env.ENV}-fss-pub.nais.io`,
        enslig_mottak: `https://familie-ef-mottak.${process.env.ENV}-fss-pub.nais.io`,
        enslig_sak: `http://familie-ef-sak`,
        enslig_iverksett: `http://familie-ef-iverksett`,
        kontantstøtte_mottak: `https://familie-ks-mottak.${process.env.ENV}-fss-pub.nais.io`,
        tilbake: `https://familie-tilbake.${process.env.ENV}-fss-pub.nais.io`,
    };
}

export const serviceConfig: IService[] = [
    {
        clientId: process.env.KS_MOTTAK_CLIENT_ID,
        displayName: 'Kontantstøtte mottak',
        id: 'familie-ks-mottak',
        proxyPath: '/familie-ks-mottak/api',
        proxyUrl: proxyUrls.kontantstøtte_mottak,
    },
    {
        clientId: process.env.BA_MOTTAK_CLIENT_ID,
        displayName: 'Barnetrygd mottak',
        id: 'familie-ba-mottak',
        proxyPath: '/familie-ba-mottak/api',
        proxyUrl: proxyUrls.barnetrygd_mottak,
    },
    {
        clientId: process.env.BA_SAK_CLIENT_ID,
        displayName: 'Barnetrygd sak',
        id: 'familie-ba-sak',
        proxyPath: '/familie-ba-sak/api',
        proxyUrl: proxyUrls.barnetrygd_sak,
    },
    {
        clientId: process.env.EF_MOTTAK_CLIENT_ID,
        displayName: 'Alene med barn - mottak',
        id: 'familie-ef-mottak',
        proxyPath: '/familie-ef-mottak/api',
        proxyUrl: proxyUrls.enslig_mottak,
        statistikk: false,
    },
    {
        clientId: process.env.EF_SAK_CLIENT_ID,
        displayName: 'Alene med barn - sak',
        id: 'familie-ef-sak',
        proxyPath: '/familie-ef-sak/api',
        proxyUrl: proxyUrls.enslig_sak,
    },
    {
        clientId: process.env.EF_IVERKSETT_CLIENT_ID,
        displayName: 'Alene med barn - iverksett',
        id: 'familie-ef-iverksett',
        proxyPath: '/familie-ef-iverksett/api',
        proxyUrl: proxyUrls.enslig_iverksett,
    },
    {
        clientId: process.env.FAMILIE_TILBAKE_CLIENT_ID,
        displayName: 'Tilbakekreving',
        id: 'familie-tilbake',
        proxyPath: '/familie-tilbake/api',
        proxyUrl: proxyUrls.tilbake,
    },
];

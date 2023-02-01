export interface IService {
    scope?: string;
    cluster: 'gcp' | 'fss';
    displayName: string;
    proxyPath: string;
    id: string;
    proxyUrl: string;
}

let proxyUrls: { [key: string]: string } = {};
if (process.env.ENV === 'local') {
    proxyUrls = {
        barnetrygd_sak: 'http://localhost:8089',
        enslig_mottak: 'http://localhost:8092',
        enslig_sak: 'http://localhost:8093',
        enslig_iverksett: 'http://localhost:8094',
        tilbake: 'http://localhost:8030',
        klage: 'http://localhost:8094',
        kontantstøtte_sak: 'http://localhost:8083',
        barnetrygd_migrering: 'http://localhost:8098',
        baks_mottak: 'http://localhost:8090',
    };
} else {
    proxyUrls = {
        barnetrygd_sak: `http://familie-ba-sak`,
        enslig_mottak: `http://familie-ef-mottak`,
        enslig_sak: `http://familie-ef-sak`,
        enslig_iverksett: `http://familie-ef-iverksett`,
        kontantstøtte_sak: `http://familie-ks-sak`,
        tilbake: `http://familie-tilbake`,
        klage: `http://familie-klage`,
        barnetrygd_migrering: `http://familie-ba-migrering`,
        baks_mottak: `http://familie-baks-mottak`,
    };
}

export const utledScope = (appId: string, cluster: 'gcp' | 'fss') => {
    if (process.env.ENV === 'local' && process.env.OVERRIDE_SCOPE) {
        return process.env.OVERRIDE_SCOPE;
    }
    const env = process.env.ENV === 'local' ? 'dev' : process.env.ENV;
    return `api://${env}-${cluster}.teamfamilie.${appId}/.default`;
};

export const serviceConfig: IService[] = [
    {
        cluster: 'gcp',
        displayName: 'Barnetrygd sak',
        id: 'familie-ba-sak',
        proxyPath: '/familie-ba-sak/api',
        proxyUrl: proxyUrls.barnetrygd_sak,
    },
    {
        cluster: 'gcp',
        displayName: 'Kontantstøtte sak',
        id: 'familie-ks-sak',
        proxyPath: '/familie-ks-sak/api',
        proxyUrl: proxyUrls.kontantstøtte_sak,
    },
    {
        cluster: 'gcp',
        displayName: 'Barnetrygd migrering',
        id: 'familie-ba-migrering',
        proxyPath: '/familie-ba-migrering/api',
        proxyUrl: proxyUrls.barnetrygd_migrering,
    },
    {
        cluster: 'gcp',
        displayName: 'Alene med barn - mottak',
        id: 'familie-ef-mottak',
        proxyPath: '/familie-ef-mottak/api',
        proxyUrl: proxyUrls.enslig_mottak,
    },
    {
        cluster: 'gcp',
        displayName: 'Tilbakekreving',
        id: 'familie-tilbake',
        proxyPath: '/familie-tilbake/api',
        proxyUrl: proxyUrls.tilbake,
    },
    {
        cluster: 'gcp',
        displayName: 'Klage',
        id: 'familie-klage',
        proxyPath: '/familie-klage/api',
        proxyUrl: proxyUrls.klage,
    },
    {
        cluster: 'gcp',
        displayName: 'Alene med barn - sak',
        id: 'familie-ef-sak',
        proxyPath: '/familie-ef-sak/api',
        proxyUrl: proxyUrls.enslig_sak,
    },
    {
        cluster: 'gcp',
        displayName: 'Alene med barn - iverksett',
        id: 'familie-ef-iverksett',
        proxyPath: '/familie-ef-iverksett/api',
        proxyUrl: proxyUrls.enslig_iverksett,
    },
    {
        cluster: 'gcp',
        displayName: 'BAKS mottak',
        id: 'familie-baks-mottak',
        proxyPath: '/familie-baks-mottak/api',
        proxyUrl: proxyUrls.baks_mottak,
    },
];

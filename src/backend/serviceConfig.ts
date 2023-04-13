export interface IService {
    scope?: string;
    cluster: 'gcp' | 'fss';
    teamname: 'teamfamilie' | 'teamdagpenger';
    displayName: string;
    proxyPath: string;
    id: string;
    gruppe: 'EF' | 'BAKS' | 'FELLES' | 'DP';
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
        dp_iverksett: 'http://localhost:8080',
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
        dp_iverksett: 'http://dp-iverksett',
    };
}

export const utledScope = (
    appId: string,
    cluster: 'gcp' | 'fss',
    team: 'teamfamilie' | 'teamdagpenger'
) => {
    if (process.env.ENV === 'local' && process.env.OVERRIDE_SCOPE) {
        return process.env.OVERRIDE_SCOPE;
    }
    const env = process.env.ENV === 'local' ? 'dev' : process.env.ENV;
    return `api://${env}-${cluster}.${team}.${appId}/.default`;
};

export const serviceConfig: IService[] = [
    {
        cluster: 'gcp',
        displayName: 'Barnetrygd sak',
        id: 'familie-ba-sak',
        gruppe: 'BAKS',
        proxyPath: '/familie-ba-sak/api',
        proxyUrl: proxyUrls.barnetrygd_sak,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'Kontantstøtte sak',
        id: 'familie-ks-sak',
        gruppe: 'BAKS',
        proxyPath: '/familie-ks-sak/api',
        proxyUrl: proxyUrls.kontantstøtte_sak,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'Barnetrygd migrering',
        id: 'familie-ba-migrering',
        gruppe: 'BAKS',
        proxyPath: '/familie-ba-migrering/api',
        proxyUrl: proxyUrls.barnetrygd_migrering,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'EF mottak',
        id: 'familie-ef-mottak',
        gruppe: 'EF',
        proxyPath: '/familie-ef-mottak/api',
        proxyUrl: proxyUrls.enslig_mottak,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'Tilbakekreving',
        id: 'familie-tilbake',
        gruppe: 'FELLES',
        proxyPath: '/familie-tilbake/api',
        proxyUrl: proxyUrls.tilbake,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'Klage',
        id: 'familie-klage',
        gruppe: 'FELLES',
        proxyPath: '/familie-klage/api',
        proxyUrl: proxyUrls.klage,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'EF sak',
        id: 'familie-ef-sak',
        gruppe: 'EF',
        proxyPath: '/familie-ef-sak/api',
        proxyUrl: proxyUrls.enslig_sak,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'EF iverksett',
        id: 'familie-ef-iverksett',
        gruppe: 'EF',
        proxyPath: '/familie-ef-iverksett/api',
        proxyUrl: proxyUrls.enslig_iverksett,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'BAKS mottak',
        id: 'familie-baks-mottak',
        gruppe: 'BAKS',
        proxyPath: '/familie-baks-mottak/api',
        proxyUrl: proxyUrls.baks_mottak,
        teamname: 'teamfamilie',
    },
    {
        cluster: 'gcp',
        displayName: 'DP Iverksett',
        id: 'dp-iverksett',
        gruppe: 'DP',
        proxyPath: '/dp-iverksett/api',
        proxyUrl: proxyUrls.dp_iverksett,
        teamname: 'teamdagpenger',
    },
];

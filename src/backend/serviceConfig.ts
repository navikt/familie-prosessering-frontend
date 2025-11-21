import { Team } from './teamconfig';

export interface IService {
    scope?: string;
    cluster: 'gcp' | 'fss';
    teamname: Team;
    displayName: string;
    proxyPath: string;
    id: string;
    gruppe: 'EF' | 'BAKS' | 'FELLES';
    proxyUrl: string;
}

interface ProxyUrls {
    barnetrygd_sak: string;
    enslig_mottak: string;
    enslig_sak: string;
    enslig_personhendelse: string;
    enslig_iverksett: string;
    klage: string;
    kontantstøtte_sak: string;
    barnehagelister_api: string;
    baks_mottak: string;
    tilleggsstonader_sak: string;
    tilleggsstonader_søknad: string;
    tilleggsstonader_klage: string;
    gjenlevende_sak: string;
}

let proxyUrls: ProxyUrls;

if (process.env.ENV === 'local') {
    proxyUrls = {
        barnetrygd_sak: 'http://localhost:8089',
        enslig_mottak: 'http://localhost:8092',
        enslig_sak: 'http://localhost:8093',
        enslig_personhendelse: 'http://localhost:8081',
        enslig_iverksett: 'http://localhost:8094',
        klage: 'http://localhost:8094',
        kontantstøtte_sak: 'http://localhost:8083',
        barnehagelister_api: 'http://localhost:8096',
        baks_mottak: 'http://localhost:8090',
        tilleggsstonader_sak: 'http://localhost:8101',
        tilleggsstonader_søknad: 'http://localhost:8001',
        tilleggsstonader_klage: 'http://localhost:8090',
        gjenlevende_sak: 'http://localhost:8030',
    };
} else if (process.env.ENV === 'lokalt-mot-preprod') {
    proxyUrls = {
        barnetrygd_sak: `https://familie-ba-sak.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        enslig_mottak: `https://familie-ef-mottak.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        enslig_sak: `https://familie-ef-sak.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        enslig_personhendelse: `https://familie-ef-personhendelse.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        enslig_iverksett: `https://familie-ef-iverksett.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        kontantstøtte_sak: `https://familie-ks-sak.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        barnehagelister_api: 'https://familie-ks-barnehagelister.intern.dev.nav.no', // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        klage: `https://familie-klage.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        baks_mottak: `https://familie-baks-mottak.intern.dev.nav.no`, // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        tilleggsstonader_sak: 'https://tilleggsstonader-sak.intern.dev.nav.no', // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        tilleggsstonader_søknad: 'https://tilleggsstonader-soknad-api.intern.dev.nav.no', // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        tilleggsstonader_klage: 'https://tilleggsstonader-klage.intern.dev.nav.no', // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
        gjenlevende_sak: 'https://gjenlevende-bs-sak.intern.dev.nav.no', // familie-prosessering-lokalt må legges til under inbound access policy i app-dev-gcp.yaml
    };
} else {
    proxyUrls = {
        barnetrygd_sak: `http://familie-ba-sak`,
        enslig_mottak: `http://familie-ef-mottak`,
        enslig_sak: `http://familie-ef-sak`,
        enslig_personhendelse: `http://familie-ef-personhendelse`,
        enslig_iverksett: `http://familie-ef-iverksett`,
        kontantstøtte_sak: `http://familie-ks-sak`,
        barnehagelister_api: 'http://familie-ks-barnehagelister',
        klage: `http://familie-klage`,
        baks_mottak: `http://familie-baks-mottak`,
        tilleggsstonader_sak: 'http://tilleggsstonader-sak',
        tilleggsstonader_søknad: 'http://tilleggsstonader-soknad-api',
        tilleggsstonader_klage: 'http://tilleggsstonader-klage',
        gjenlevende_sak: `http://gjenlevende-bs-sak`,
    };
}

export const utledScope = (appId: string, cluster: 'gcp' | 'fss', team: Team) => {
    if (
        (process.env.ENV === 'local' || process.env.ENV === 'lokalt-mot-preprod') &&
        process.env.OVERRIDE_SCOPE
    ) {
        return process.env.OVERRIDE_SCOPE;
    }
    const env =
        process.env.ENV === 'local' || process.env.ENV === 'lokalt-mot-preprod'
            ? 'dev'
            : process.env.ENV;
    return `api://${env}-${cluster}.${team}.${appId}/.default`;
};

export const serviceConfig: { [key in Team]: IService[] } = {
    teamfamilie: [
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
            displayName: 'EF mottak',
            id: 'familie-ef-mottak',
            gruppe: 'EF',
            proxyPath: '/familie-ef-mottak/api',
            proxyUrl: proxyUrls.enslig_mottak,
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
            displayName: 'EF personhendelse',
            id: 'familie-ef-personhendelse',
            gruppe: 'EF',
            proxyPath: '/familie-ef-personhendelse/api',
            proxyUrl: proxyUrls.enslig_personhendelse,
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
            displayName: 'Barnehagelister API',
            id: 'familie-ks-barnehagelister',
            gruppe: 'BAKS',
            proxyPath: '/familie-ks-barnehagelister/api',
            proxyUrl: proxyUrls.barnehagelister_api,
            teamname: 'teamfamilie',
        },
    ],
    tilleggsstonader: [
        {
            cluster: 'gcp',
            displayName: 'Sak',
            id: 'tilleggsstonader-sak',
            gruppe: 'FELLES',
            proxyPath: '/tilleggsstonader-sak/api',
            proxyUrl: proxyUrls.tilleggsstonader_sak,
            teamname: 'tilleggsstonader',
        },
        {
            cluster: 'gcp',
            displayName: 'Søknad',
            id: 'tilleggsstonader-soknad-api',
            gruppe: 'FELLES',
            proxyPath: '/tilleggsstonader-soknad/api',
            proxyUrl: proxyUrls.tilleggsstonader_søknad,
            teamname: 'tilleggsstonader',
        },
        {
            cluster: 'gcp',
            displayName: 'Klage',
            id: 'tilleggsstonader-klage',
            gruppe: 'FELLES',
            proxyPath: '/tilleggsstonader-klage/api',
            proxyUrl: proxyUrls.tilleggsstonader_klage,
            teamname: 'tilleggsstonader',
        },
    ],
    etterlatte: [
        {
            cluster: 'gcp',
            displayName: 'Etterlatte',
            id: 'gjenlevende-bs-sak',
            gruppe: 'FELLES',
            proxyPath: '/etterlatte/api',
            proxyUrl: proxyUrls.gjenlevende_sak,
            teamname: 'etterlatte',
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
            displayName: 'EF sak',
            id: 'familie-ef-sak',
            gruppe: 'EF',
            proxyPath: '/familie-ef-sak/api',
            proxyUrl: proxyUrls.enslig_sak,
            teamname: 'teamfamilie',
        },
        {
            cluster: 'gcp',
            displayName: 'EF personhendelse',
            id: 'familie-ef-personhendelse',
            gruppe: 'EF',
            proxyPath: '/familie-ef-personhendelse/api',
            proxyUrl: proxyUrls.enslig_personhendelse,
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
    ],
};

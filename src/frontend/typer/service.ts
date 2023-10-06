export interface IService {
    displayName: string;
    id: string;
    gruppe: IServiceGruppe;
    proxyPath: string;
}

export enum IServiceGruppe {
    FELLES = 'FELLES',
    EF = 'EF',
    BAKS = 'BAKS',
    DP = 'DP',
}

export interface IOppfølgingstask {
    serviceId: string;
    harMottattSvar: boolean;
    antallTilOppfølging: number;
}

export interface AntallTaskerMedStatusFeiletOgManuellOppfølging {
    serviceId: string;
    harMottattSvar: boolean;
    antallFeilet: number;
    antallManuellOppfølging: number;
}

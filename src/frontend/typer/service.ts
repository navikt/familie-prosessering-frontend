export interface IService {
    displayName: string;
    id: string;
    proxyPath: string;
}

export interface IOppfølgingstask {
    serviceId: string;
    harMottattSvar: boolean;
    antallTilOppfølging: number;
}

// Enum
export enum avvikstyper {
    ANNET = 'ANNET',
    DUPLIKAT = 'DUPLIKAT',
}

export enum taskStatus {
    AVVIKSHÅNDTERT = 'AVVIKSHÅNDTERT',
    BEHANDLER = 'BEHANDLER',
    FEILET = 'FEILET',
    FERDIG = 'FERDIG',
    KLAR_TIL_PLUKK = 'KLAR_TIL_PLUKK',
    MANUELL_OPPFØLGING = 'MANUELL_OPPFØLGING',
    PLUKKET = 'PLUKKET',
    UBEHANDLET = 'UBEHANDLET',
}

export enum loggType {
    BEHANDLER = 'BEHANDLER',
    FEILET = 'FEILET',
    FERDIG = 'FERDIG',
    KLAR_TIL_PLUKK = 'KLAR_TIL_PLUKK',
    MANUELL_OPPFØLGING = 'MANUELL_OPPFØLGING',
    PLUKKET = 'PLUKKET',
    UBEHANDLET = 'UBEHANDLET',
}

export enum taskTyper {
    hentJournalpostIdFraJoarkTask = 'hentJournalpostIdFraJoarkTask',
    hentSaksnummerFraJoark = 'hentSaksnummerFraJoark',
    iverksettMotOppdrag = 'iverksettMotOppdrag',
    journalførSøknad = 'journalførSøknad',
    mottaFødselshendelse = 'mottaFødselshendelse',
    sendMeldingTilDittNav = 'sendMeldingTilDittNav',
    sendSøknadTilSak = 'sendSøknadTilSak',
    sendTilSak = 'sendTilSak',
    statusFraOppdrag = 'statusFraOppdrag',
}

// Tekster
type ITaskTypeTekster = {
    [key in taskTyper]: string;
};

export const taskTypeTekster: ITaskTypeTekster = {
    hentJournalpostIdFraJoarkTask: 'Hent journalpost id fra joark',
    hentSaksnummerFraJoark: 'Hent saksnummer fra joark',
    iverksettMotOppdrag: 'Iverksett mot oppdrag',
    journalførSøknad: 'Journalfør søknad',
    mottaFødselshendelse: 'Motta fødselshendelse',
    sendMeldingTilDittNav: 'Send melding til ditt NAV',
    sendSøknadTilSak: 'Send søknad til sak',
    sendTilSak: 'Send til sak',
    statusFraOppdrag: 'Hent status fra oppdrag',
};

type ITaskStatusTekster = {
    [key in taskStatus]: string;
};

export const taskStatusTekster: ITaskStatusTekster = {
    AVVIKSHÅNDTERT: 'Avvikshåndtert',
    BEHANDLER: 'Behandler',
    FEILET: 'Feilet',
    FERDIG: 'Ferdig',
    KLAR_TIL_PLUKK: 'Klar til plukk',
    MANUELL_OPPFØLGING: 'Manuell oppfølging',
    PLUKKET: 'Plukket',
    UBEHANDLET: 'Ubehandlet',
};

// Interface
export interface ITask {
    avvikstype: avvikstyper;
    callId: string;
    id: number;
    logg: ITaskLogg[];
    metadata: {
        [key: string]: string;
    };
    opprettetTidspunkt: string;
    payload: string;
    status: taskStatus;
    triggerTid: string;
    taskStepType: taskTyper;
}

export interface ITaskLogg {
    endretAv: string;
    melding?: string;
    node: string;
    opprettetTidspunkt: string;
    type: loggType;
}

export interface IAvvikshåndteringDTO {
    taskId: string;
    årsak: string;
    avvikstype: avvikstyper;
}

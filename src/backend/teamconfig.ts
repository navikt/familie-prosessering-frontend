import dotenv from 'dotenv';

dotenv.config();
export type Team = 'teamfamilie' | 'tilleggsstonader' | 'tilbake' | 'etterlatte';

interface Teamconfig {
    host: string;
    team: Team;
}

const config: { [key in Team]: Teamconfig } = {
    teamfamilie: { team: 'teamfamilie', host: 'familie-prosessering' },
    tilleggsstonader: { team: 'tilleggsstonader', host: 'tilleggsstonader-prosessering' },
    tilbake: { team: 'tilbake', host: 'tilbakekreving-prosessering' },
    etterlatte: { team: 'etterlatte', host: 'etterlatte-prosessering' },
};

const getTeamconfig = (): Teamconfig => {
    const team = process.env.NAIS_NAMESPACE as Team;
    switch (team) {
        case 'teamfamilie':
        case 'tilbake':
        case 'etterlatte':
        case 'tilleggsstonader':
            return config[team];
        default:
            throw Error(`Har ikke config for team=${team}`);
    }
};

export const teamconfig = getTeamconfig();

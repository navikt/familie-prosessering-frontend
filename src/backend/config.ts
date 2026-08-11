import type { IApi, ISessionKonfigurasjon } from '@navikt/familie-backend';
import { logError } from '@navikt/familie-logging';
import type { IService } from './serviceConfig.js';
import { utledScope } from './serviceConfig.js';
import { teamconfig } from './teamconfig.js';

// Miljøvariabler
const Environment = () => {
    if (process.env.ENV === 'local' || process.env.ENV === 'lokalt-mot-preprod') {
        return {
            frontendPath: 'src/frontend',
            namespace: 'local',
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            frontendPath: 'dist_frontend',
            namespace: 'preprod',
        };
    }

    return {
        frontendPath: 'dist_frontend',
        namespace: 'production',
    };
};

const env = Environment();

export const oboConfig = (service: IService): IApi => {
    return {
        clientId: service.id,
        scopes: service.scope
            ? [service.scope]
            : [utledScope(service.id, service.cluster, service.teamname)],
    };
};

const cookieSecret = process.env.SESSION_SECRET;
const host = teamconfig.host;
if (!cookieSecret) {
    logError(`Mangler påkrevd miljøvariabel 'SESSION_SECRET'`);
    process.exit(1);
}
export const sessionConfig: ISessionKonfigurasjon = {
    cookieSecret: cookieSecret,
    navn: host,
    secureCookie: process.env.ENV !== 'local' && process.env.ENV !== 'lokalt-mot-preprod',
};

export const frontendPath = env.frontendPath;

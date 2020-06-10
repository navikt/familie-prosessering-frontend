import { ISessionKonfigurasjon } from '@navikt/familie-backend';

// Miljøvariabler
const Environment = () => {
    if (process.env.ENV === 'local') {
        return {
            buildPath: '../frontend_development',
            namespace: 'local',
        };
    } else if (process.env.ENV === 'preprod') {
        return {
            buildPath: '../frontend_production',
            namespace: 'preprod',
        };
    }

    return {
        buildPath: '../frontend_production',
        namespace: 'production',
    };
};

const env = Environment();

export const sessionConfig: ISessionKonfigurasjon = {
    cookieSecret: process.env.PROSESSERING_SESSION_SECRET,
    navn: 'familie-prosessering',
    secureCookie: process.env.ENV === 'local' ? false : true,
};

export const buildPath = env.buildPath;

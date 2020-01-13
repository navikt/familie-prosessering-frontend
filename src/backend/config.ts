import {
    IOIDCStrategyOptionWithRequest,
    ISessionKonfigurasjon,
    ITokenRequest,
} from '@navikt/familie-backend/lib/typer';

// Generer auth config basert på miljø
interface IConfig {
    allowHttpForRedirectUrl: boolean;
    cookieDomain: string;
    logoutUri: string;
    redirectUrl: string;
    tenant: string;
}

const hentPassportConfig = () => {
    let config: IConfig = {
        allowHttpForRedirectUrl: false,
        cookieDomain: '',
        logoutUri: '',
        redirectUrl: '',
        tenant: '',
    };

    const host = 'familie-prosessering';
    switch (process.env.ENV) {
        case 'local':
            config = {
                allowHttpForRedirectUrl: true,
                cookieDomain: 'localhost',
                logoutUri: `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=http:\\\\localhost:8000`,
                redirectUrl: 'http://localhost:8000/auth/openid/callback',
                tenant: 'navq.onmicrosoft.com',
            };
            break;
        case 'preprod':
            config = {
                allowHttpForRedirectUrl: false,
                cookieDomain: `${host}.nais.preprod.local`,
                logoutUri: `https://login.microsoftonline.com/navq.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.nais.preprod.local`,
                redirectUrl: `https://${host}.nais.preprod.local/auth/openid/callback`,
                tenant: 'navq.onmicrosoft.com',
            };
            break;
        case 'production':
            config = {
                allowHttpForRedirectUrl: false,
                cookieDomain: `${host}.nais.adeo.no`,
                logoutUri: `https://login.microsoftonline.com/navno.onmicrosoft.com/oauth2/logout?post_logout_redirect_uri=https:\\\\${host}.nais.adeo.no`,
                redirectUrl: `https://${host}.nais.adeo.no/auth/openid/callback`,
                tenant: 'navno.onmicrosoft.com',
            };
            break;
        default:
            break;
    }

    return {
        ...config,
        clientID: process.env.CLIENT_ID ? process.env.CLIENT_ID : 'invalid',
        clientSecret: process.env.CLIENT_SECRET ? process.env.CLIENT_SECRET : '',
        identityMetadata: `https://login.microsoftonline.com/${config.tenant}/v2.0/.well-known/openid-configuration`,
        tokenURI: `https://login.microsoftonline.com/${config.tenant}/oauth2/v2.0/token`,
        useCookieInsteadOfSession: false,
        validateIssuer: true,
    };
};

// Sett opp config mot felles backend skall
export const nodeConfig = hentPassportConfig();
export const sessionConfig: ISessionKonfigurasjon = {
    cookieSecret: process.env.SESSION_SECRET,
    navn: 'familie-ks-mottak',
    sessionSecret: process.env.SESSION_SECRET,
};

export const saksbehandlerTokenConfig: ITokenRequest = {
    clientId: nodeConfig.clientID,
    clientSecret: nodeConfig.clientSecret,
    redirectUrl: nodeConfig.redirectUrl,
    scope: `${nodeConfig.clientID}/.default`,
    tokenUri: nodeConfig.tokenURI,
};

export const oboTokenConfig: ITokenRequest = {
    clientId: nodeConfig.clientID,
    clientSecret: nodeConfig.clientSecret,
    redirectUrl: nodeConfig.redirectUrl,
    scope: process.env.KS_MOTTAK_SCOPE,
    tokenUri: nodeConfig.tokenURI,
};

export const passportConfig: IOIDCStrategyOptionWithRequest = {
    allowHttpForRedirectUrl: nodeConfig.allowHttpForRedirectUrl,
    clientID: nodeConfig.clientID,
    clientSecret: nodeConfig.clientSecret,
    identityMetadata: nodeConfig.identityMetadata,
    loggingLevel: 'warn',
    passReqToCallback: true,
    redirectUrl: nodeConfig.redirectUrl,
    responseMode: 'form_post',
    responseType: 'code',
    scope: 'profile offline_access',
    useCookieInsteadOfSession: nodeConfig.useCookieInsteadOfSession,
    validateIssuer: nodeConfig.validateIssuer,
};

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

export const buildPath = env.buildPath;
export const namespace = env.namespace;

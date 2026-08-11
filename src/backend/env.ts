export const erLokal = (): boolean =>
    ['local', 'lokalt-mot-preprod'].includes(process.env.ENV ?? '');
export const erDev = (): boolean => process.env.ENV === 'dev';
export const erProd = (): boolean => process.env.ENV === 'prod';

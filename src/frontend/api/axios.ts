import type { Ressurs } from '@navikt/familie-typer';
import { byggFeiletRessurs, RessursStatus } from '@navikt/familie-typer';
import type { AxiosRequestConfig, AxiosResponse } from 'axios';
import axios, { type AxiosError } from 'axios';

axios.defaults.baseURL = window.location.origin;
export const preferredAxios = axios;

export const axiosRequest = async <T>(config: AxiosRequestConfig): Promise<Ressurs<T>> => {
    return preferredAxios
        .request(config)
        .then((response: AxiosResponse<Ressurs<T>>) => {
            const responsRessurs: Ressurs<T> = response.data;

            let typetRessurs: Ressurs<T> = {
                status: RessursStatus.IKKE_HENTET,
            };

            switch (responsRessurs.status) {
                case RessursStatus.SUKSESS:
                    typetRessurs = {
                        data: responsRessurs.data,
                        status: RessursStatus.SUKSESS,
                    };
                    break;
                case RessursStatus.IKKE_TILGANG:
                    typetRessurs = {
                        frontendFeilmelding: responsRessurs.frontendFeilmelding ?? 'Ikke tilgang',
                        status: RessursStatus.IKKE_TILGANG,
                    };
                    break;
                case RessursStatus.FEILET:
                    typetRessurs = {
                        frontendFeilmelding:
                            responsRessurs.frontendFeilmelding ?? 'En feil har oppstått!',
                        status: RessursStatus.FEILET,
                    };
                    break;
                default:
                    typetRessurs = {
                        frontendFeilmelding: 'En feil har oppstått!',
                        status: RessursStatus.FEILET,
                    };
                    break;
            }

            return typetRessurs;
        })
        .catch((_error: AxiosError) => {
            return byggFeiletRessurs<T>('Ukjent api feil');
        });
};

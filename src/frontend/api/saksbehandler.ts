import type { ISaksbehandler } from '@navikt/familie-typer';
import { preferredAxios } from './axios';

export const hentInnloggetBruker = (): Promise<ISaksbehandler> => {
    return preferredAxios.get(`/user/profile`).then((response) => {
        return response.data;
    });
};

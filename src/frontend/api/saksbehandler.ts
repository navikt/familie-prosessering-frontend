import { preferredAxios } from './axios';
import type { ISaksbehandler } from '@navikt/familie-typer';

export const hentInnloggetBruker = (): Promise<ISaksbehandler> => {
    return preferredAxios.get(`/user/profile`).then((response) => {
        return response.data;
    });
};

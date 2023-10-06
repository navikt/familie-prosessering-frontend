import { useEffect, useState } from 'react';
import { hentTaskerSomHarFeiletEllerErTilManuellOppfølging } from '../api/service';
import { AntallTaskerMedStatusFeiletOgManuellOppfølging, IService } from '../typer/service';

export const useHentTaskerSomHarFeiletEllerErTilManuellOppfølging = (service: IService[]) => {
    const [taskerFeiletOgManuellOppfølging, settTaskerFeiletOgManuellOppfølging] = useState<
        Record<string, AntallTaskerMedStatusFeiletOgManuellOppfølging>
    >({});

    useEffect(() => {
        service.map((service) => {
            hentTaskerSomHarFeiletEllerErTilManuellOppfølging(service).then((response) => {
                settTaskerFeiletOgManuellOppfølging((prevState) => {
                    return { ...prevState, [service.id]: response };
                });
            });
        });
    }, [service]);

    return { taskerFeiletOgManuellOppfølging };
};

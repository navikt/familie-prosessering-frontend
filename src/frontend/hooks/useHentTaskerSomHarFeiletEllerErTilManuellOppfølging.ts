import { useEffect, useState } from 'react';
import { hentTaskerSomHarFeiletEllerErTilManuellOppfølging } from '../api/service';
import { AntallTaskerMedStatusFeiletOgManuellOppfølging, IService } from '../typer/service';

export const useHentTaskerSomHarFeiletEllerErTilManuellOppfølging = (services: IService[]) => {
    const [taskerFeiletOgManuellOppfølging, settTaskerFeiletOgManuellOppfølging] = useState<
        Record<string, AntallTaskerMedStatusFeiletOgManuellOppfølging>
    >({});

    const hentData = async () => {
        for (const service of services) {
            const response = await hentTaskerSomHarFeiletEllerErTilManuellOppfølging(service);
            settTaskerFeiletOgManuellOppfølging((prevState) => ({
                ...prevState,
                [service.id]: response,
            }));
        }
    };

    useEffect(() => {
        hentData();
    }, []);

    return { taskerFeiletOgManuellOppfølging };
};

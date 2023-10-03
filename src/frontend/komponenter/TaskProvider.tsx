import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { Location, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import {
    avvikshåndterTask,
    hentTasks,
    hentTasksSomErFerdigNåMenFeiletFør,
    kommenterTask,
    rekjørTask,
} from '../api/task';
import {
    Fagsystem,
    IAvvikshåndteringDTO,
    IKommentarDTO,
    ITaskResponse,
    TaskStatus,
} from '../typer/task';
import { useServiceContext } from './ServiceContext';

const getQueryParamStatusFilter = (location: Location): TaskStatus => {
    const status = new URLSearchParams(location.search).get('statusFilter') as TaskStatus;
    return status || TaskStatus.FEILET;
};

const getQueryParamSide = (location: Location): number => {
    const queryParamSideAsString = new URLSearchParams(location.search).get('side');
    return queryParamSideAsString ? parseInt(queryParamSideAsString, 10) : 0;
};

const getQueryParamTaskType = (location: Location): string => {
    const taskType = new URLSearchParams(location.search).get('taskType');
    return taskType || '';
};

const [TaskProvider, useTaskContext] = constate(() => {
    const { valgtService } = useServiceContext();
    const navigate = useNavigate();
    const location = useLocation();

    const [tasks, settTasks] = useState<Ressurs<ITaskResponse>>(byggTomRessurs());
    const [statusFilter, settStatusFilter] = useState<TaskStatus>(
        getQueryParamStatusFilter(location)
    );
    const [fagsystemFilter, settFagsystemFilter] = useState<Fagsystem>(Fagsystem.ALLE);
    const [side, settSide] = useState<number>(getQueryParamSide(location));
    const [type, settTypeFilter] = useState<string>(getQueryParamTaskType(location));

    const hentEllerOppdaterTasks = () => {
        if (valgtService) {
            hentTasks(valgtService, statusFilter, side, type).then((res) => settTasks(res));
        }
    };

    useEffect(() => {
        hentEllerOppdaterTasks();
    }, [valgtService, statusFilter, side, type]);

    useEffect(() => {
        if (
            getQueryParamStatusFilter(location) !== statusFilter ||
            getQueryParamSide(location) !== side ||
            getQueryParamTaskType(location) !== type
        ) {
            navigate(
                `${location.pathname}?statusFilter=${statusFilter}&side=${side}&taskType=${type}`
            );
        }
    }, [statusFilter, side, type, history]);

    const rekjørTasks = (id?: number) => {
        const rekjørAlleTasks = id === undefined || id === null;
        if (
            valgtService &&
            statusFilter &&
            (!rekjørAlleTasks ||
                statusFilter === TaskStatus.MANUELL_OPPFØLGING ||
                statusFilter === TaskStatus.FEILET)
        ) {
            rekjørTask(valgtService, statusFilter, id).then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    hentEllerOppdaterTasks();
                }
            });
        }
    };

    const avvikshåndter = (data: IAvvikshåndteringDTO) => {
        if (valgtService) {
            avvikshåndterTask(valgtService, data).then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    hentEllerOppdaterTasks();
                }
            });
        }
    };

    const leggTilKommentar = (
        data: IKommentarDTO,
        onSuccess: (response: Ressurs<string>) => void,
        onError: (err: string) => void
    ) => {
        if (valgtService) {
            kommenterTask(valgtService, data).then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    hentEllerOppdaterTasks();
                    onSuccess(response);
                } else if (response.status === RessursStatus.FEILET) {
                    onError(response.frontendFeilmelding);
                }
            });
        }
    };

    const tasksSomErFerdigNåMenFeiletFør = () => {
        if (valgtService) {
            hentTasksSomErFerdigNåMenFeiletFør(valgtService).then((res) => settTasks(res));
        }
    };

    return {
        tasks,
        side,
        settSide,
        statusFilter,
        settStatusFilter,
        type,
        settTypeFilter,
        rekjørTasks,
        avvikshåndter,
        leggTilKommentar,
        tasksSomErFerdigNåMenFeiletFør,
        hentEllerOppdaterTasks,
        fagsystemFilter,
        settFagsystemFilter,
    };
});

export { TaskProvider, useTaskContext };

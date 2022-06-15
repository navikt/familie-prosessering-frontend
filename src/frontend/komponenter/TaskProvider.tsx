import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { Location, useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { avvikshåndterTask, hentTasks, kommenterTask, rekjørTask } from '../api/task';
import {
    IAvvikshåndteringDTO,
    IKommentarDTO,
    ITask,
    ITaskResponse,
    taskStatus,
} from '../typer/task';
import { useServiceContext } from './ServiceContext';

const getQueryParamStatusFilter = (location: Location): taskStatus => {
    const status = new URLSearchParams(location.search).get('statusFilter') as taskStatus;
    return status || taskStatus.FEILET;
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
    const [statusFilter, settStatusFilter] = useState<taskStatus>(
        getQueryParamStatusFilter(location)
    );
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
                statusFilter === taskStatus.MANUELL_OPPFØLGING ||
                statusFilter === taskStatus.FEILET)
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

    const kommenter = (
        data: IKommentarDTO,
        onSuccess = (response: Ressurs<string>) => {},
        onError = (err: string) => {}
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
        kommenter,
    };
});

export { TaskProvider, useTaskContext };

import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { Location, useLocation } from 'react-router';
import { useNavigate, useParams } from 'react-router-dom';
import {
    avvikshåndterTask,
    hentTask,
    hentTasks,
    hentTasksMedCallId,
    hentTasksSomErFerdigNåMenFeiletFør,
    kommenterTask,
    rekjørTask,
} from '../api/task';
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

const getParamTaskId = (): number | undefined => {
    const { taskId } = useParams();
    return taskId ? parseInt(taskId, 10) : undefined;
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
    const [taskId, settTaskId] = useState<number | undefined>(getParamTaskId());
    const [callId, settCallId] = useState<string | undefined>();
    const [task, settTask] = useState<Ressurs<ITask>>(byggTomRessurs());

    const hentEllerOppdaterTasks = () => {
        console.log(taskId, callId);
        if (valgtService) {
            if (taskId) {
                hentTask(valgtService, taskId).then(settTask);
            } else if (callId) {
                hentTasksMedCallId(valgtService, callId).then(settTasks);
            } else {
                hentTasks(valgtService, statusFilter, side, type).then(settTasks);
            }
        }
    };

    useEffect(() => {
        hentEllerOppdaterTasks();
    }, [valgtService, statusFilter, side, type, taskId, callId]);

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
        settTaskId,
        settCallId,
        task,
        statusFilter,
        settStatusFilter,
        type,
        settTypeFilter,
        rekjørTasks,
        avvikshåndter,
        leggTilKommentar,
        tasksSomErFerdigNåMenFeiletFør,
        hentEllerOppdaterTasks,
    };
});

export { TaskProvider, useTaskContext };

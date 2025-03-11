import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import constate from 'constate';
import { useEffect, useState } from 'react';
import { Location, useLocation } from 'react-router';
import { useNavigate, useParams } from 'react-router-dom';
import {
    avvikshåndterTask,
    hentAlleTasktyper,
    hentTask,
    hentTasks,
    hentTasksMedCallId,
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
    ITask,
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

const useGetParamTaskId = (): number | undefined => {
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
    const [statusFilter, settStatusFilter] = useState<TaskStatus>(
        getQueryParamStatusFilter(location)
    );
    const [fagsystemFilter, settFagsystemFilter] = useState<Fagsystem>(Fagsystem.ALLE);
    const [side, settSide] = useState<number>(getQueryParamSide(location));
    const [type, settTypeFilter] = useState<string>(getQueryParamTaskType(location));
    const [typer, settTyper] = useState<string[]>([]);
    const [taskId, settTaskId] = useState<number | undefined>(useGetParamTaskId());
    const [callId, settCallId] = useState<string | undefined>();
    const [task, settTask] = useState<Ressurs<ITask>>(byggTomRessurs());

    const hentEllerOppdaterTasks = () => {
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
        settFagsystemFilter(Fagsystem.ALLE);
    }, [valgtService]);

    useEffect(() => {
        if (valgtService !== undefined) {
            hentAlleTasktyper(valgtService).then((response) => {
                if (response.status === RessursStatus.SUKSESS) {
                    settTyper(response.data);
                }
            });
        }
    }, [valgtService]);

    useEffect(() => {
        hentEllerOppdaterTasks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
        // eslint-disable-next-line react-hooks/exhaustive-deps
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
            rekjørTask(valgtService, statusFilter, type, id).then((response) => {
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
        fagsystemFilter,
        settFagsystemFilter,
        typer,
    };
});

export { TaskProvider, useTaskContext };

import { IService } from '../typer/service';
import {
    IAvvikshåndteringDTO,
    ITask,
    ITaskResponse,
    ITaskLogg,
    TaskStatus,
    IKommentarDTO,
} from '../typer/task';
import { axiosRequest } from './axios';
import { Ressurs } from '@navikt/familie-typer';

export const hentTasks = (
    valgtService: IService,
    statusFilter: TaskStatus,
    side: number,
    type: string
): Promise<Ressurs<ITaskResponse>> => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: any =
        statusFilter !== TaskStatus.ALLE
            ? {
                  status: statusFilter,
                  page: side,
              }
            : { page: side };
    if (type !== '') {
        params.type = type;
    }
    return axiosRequest({
        params,
        method: 'GET',
        url: `${valgtService.proxyPath}/task/v2`,
    });
};

export const hentTasksMedCallId = (
    valgtService: IService,
    callId: string
): Promise<Ressurs<ITaskResponse>> => {
    return axiosRequest({
        method: 'GET',
        url: `${valgtService.proxyPath}/task/callId/${callId}`,
    });
};

export const hentTask = (valgtService: IService, taskId: number): Promise<Ressurs<ITask>> => {
    return axiosRequest({
        method: 'GET',
        url: `${valgtService.proxyPath}/task/${taskId}`,
    });
};

export const hentAlleTasktyper = (valgtService: IService): Promise<Ressurs<string[]>> => {
    return axiosRequest({
        method: 'GET',
        url: `${valgtService.proxyPath}/task/type/alle`,
    });
};

export const hentTasksSomErFerdigNåMenFeiletFør = (
    valgtService: IService
): Promise<Ressurs<ITaskResponse>> => {
    return axiosRequest({
        method: 'GET',
        url: `${valgtService.proxyPath}/task/ferdigNaaFeiletFoer`,
    });
};

export const hentTaskLogg = (valgtService: IService, id: number): Promise<Ressurs<ITaskLogg[]>> => {
    return axiosRequest({
        method: 'GET',
        url: `${valgtService.proxyPath}/task/logg/${id}`,
    });
};

export const rekjørTask = (
    valgtService: IService,
    statusFilter: TaskStatus,
    taskId?: number
): Promise<Ressurs<ITask[]>> => {
    if (taskId) {
        return axiosRequest({
            method: 'PUT',
            url: `${valgtService.proxyPath}/task/rekjor${taskId ? `?taskId=${taskId}` : ''}`,
        });
    } else {
        return axiosRequest({
            headers: {
                status: statusFilter,
            },
            method: 'PUT',
            url: `${valgtService.proxyPath}/task/rekjorAlle`,
        });
    }
};

export const avvikshåndterTask = (
    valgtService: IService,
    avvikshåndteringDTO: IAvvikshåndteringDTO
): Promise<Ressurs<ITask[]>> => {
    return axiosRequest({
        data: {
            avvikstype: avvikshåndteringDTO.avvikstype,
            årsak: avvikshåndteringDTO.årsak,
        },
        method: 'PUT',
        url: `${valgtService.proxyPath}/task/avvikshaandter?taskId=${avvikshåndteringDTO.taskId}`,
    });
};

export const kommenterTask = (
    valgtService: IService,
    kommentarDTO: IKommentarDTO
): Promise<Ressurs<string>> => {
    return axiosRequest({
        data: {
            settTilManuellOppfølging: kommentarDTO.settTilManuellOppfølging,
            kommentar: kommentarDTO.kommentar,
        },
        method: 'PUT',
        url: `${valgtService.proxyPath}/task/kommenter?taskId=${kommentarDTO.taskId}`,
    });
};

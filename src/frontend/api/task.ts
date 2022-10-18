import { IService } from '../typer/service';
import {
    IAvvikshåndteringDTO,
    ITask,
    ITaskResponse,
    ITaskLogg,
    taskStatus,
    IKommentarDTO,
} from '../typer/task';
import { axiosRequest } from './axios';
import { Ressurs } from '@navikt/familie-typer';

export const hentTasks = (
    valgtService: IService,
    statusFilter: taskStatus,
    side: number,
    type: string
): Promise<Ressurs<ITaskResponse>> => {
    const params: any =
        statusFilter !== taskStatus.ALLE
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
    statusFilter: taskStatus,
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

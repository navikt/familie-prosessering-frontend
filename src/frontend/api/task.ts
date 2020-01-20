import { Ressurs } from '../typer/ressurs';
import { IService } from '../typer/service';
import { IAvvikshåndteringDTO, ITask, taskStatus } from '../typer/task';
import { axiosRequest } from './axios';

export const hentTasks = (
    valgtService: IService,
    statusFilter: taskStatus
): Promise<Ressurs<ITask[]>> => {
    return axiosRequest({
        headers: {
            status: statusFilter,
        },
        method: 'GET',
        url: `${valgtService.proxyPath}/task`,
    });
};

export const rekjørTask = (
    valgtService: IService,
    statusFilter: taskStatus,
    taskId?: string
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

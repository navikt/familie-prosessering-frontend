import AlertStripe from 'nav-frontend-alertstriper';
import { Knapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';
import { Systemtittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { RessursStatus } from '../../typer/ressurs';
import { IService } from '../../typer/service';
import { taskStatus } from '../../typer/task';
import {
    actions as serviceActions,
    useServiceContext,
    useServiceDispatch,
} from '../ServiceProvider';
import { actions as taskActions, useTaskContext, useTaskDispatch } from '../TaskProvider';
import TaskListe from './TaskListe';

interface IProps {
    serviceId: string;
}

const Tasks: React.FunctionComponent<IProps> = ({ serviceId }) => {
    const tasks = useTaskContext().tasks;
    const statusFilter = useTaskContext().statusFilter;
    const tasksDispatcher = useTaskDispatch();
    const valgtService: IService | undefined = useServiceContext().valgtService;
    const serviceDispatch = useServiceDispatch();
    const services = useServiceContext().services;

    if (valgtService === undefined) {
        if (services.status === RessursStatus.SUKSESS) {
            serviceDispatch({
                payload: services.data.find((service: IService) => service.id === serviceId),
                type: serviceActions.SETT_VALGT_SERVICE,
            });
        }
        return <div />;
    } else {
        switch (tasks.status) {
            case RessursStatus.SUKSESS:
                return (
                    <React.Fragment>
                        <div className={'tasks__topbar'}>
                            <Systemtittel children={`Tasks for ${valgtService.displayName}`} />

                            {statusFilter === taskStatus.FEILET && (
                                <Knapp
                                    mini={true}
                                    onClick={() =>
                                        tasksDispatcher({
                                            payload: true,
                                            type: taskActions.REKJØR_ALLE_TASKS,
                                        })
                                    }
                                >
                                    Rekjør alle tasks
                                </Knapp>
                            )}

                            <Select
                                onChange={event =>
                                    tasksDispatcher({
                                        payload: event.target.value,
                                        type: taskActions.SETT_FILTER,
                                    })
                                }
                                value={statusFilter}
                                label={'Vis saker med status'}
                            >
                                {Object.keys(taskStatus).map(status => {
                                    return (
                                        <option key={status} value={status}>
                                            {status}
                                        </option>
                                    );
                                })}
                            </Select>
                        </div>

                        <br />
                        <TaskListe tasksDTO={tasks.data} />
                    </React.Fragment>
                );
            case RessursStatus.HENTER:
                return <AlertStripe children={`Laster tasker`} type={'info'} />;
            case RessursStatus.FEILET:
                return (
                    <AlertStripe
                        children={`Innhenting av feilede tasker feilet. Feilmelding: ${tasks.melding}`}
                        type={'feil'}
                    />
                );
            default:
                return <div />;
        }
    }
};

export default Tasks;

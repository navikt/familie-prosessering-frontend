import { AxiosError } from 'axios';
import * as React from 'react';
import { useHistory, useLocation } from 'react-router';
import { avvikshåndterTask, hentTasks, hentTasks2, rekjørTask } from '../api/task';
import { IService } from '../typer/service';
import {
    IAvvikshåndteringDTO,
    ITask,
    ITaskLogg,
    ITaskLogger,
    ITaskResponse,
    taskStatus,
} from '../typer/task';
import { useServiceContext } from './ServiceProvider';
import * as moment from 'moment';
import { Ressurs, RessursStatus, byggTomRessurs } from '@navikt/familie-typer';

export enum actions {
    AVVIKSHÅNDTER_TASK = 'AVVIKSHÅNDTER_TASK',
    HENT_TASKS = 'HENT_TASKS',
    HENT_TASKS_FEILET = 'HENT_TASKS_FEILET',
    HENT_TASKS_SUKSESS = 'HENT_TASKS_SUKSESS',
    REKJØR_ALLE_TASKS = 'REKJØR_ALLE_TASKS',
    REKJØR_TASK = 'REKJØR_TASK',
    SETT_FILTER = 'SETT_FILTER',
    HENT_TASK_LOGG = 'HENT_TASK_LOGG',
}

interface IAction {
    payload?: any;
    type: actions;
}

type Dispatch = (action: IAction) => void;

interface IState {
    avvikshåndteringDTO: IAvvikshåndteringDTO | undefined;
    rekjørAlle: boolean;
    rekjørId: string;
    statusFilter?: taskStatus;
    tasks: Ressurs<ITaskResponse>;
    logg: ITaskLogger;
}

const TaskStateContext = React.createContext<IState | undefined>(undefined);
const TaskDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const TaskReducer = (state: IState, action: IAction): IState => {
    switch (action.type) {
        case actions.AVVIKSHÅNDTER_TASK: {
            return {
                ...state,
                avvikshåndteringDTO: action.payload,
            };
        }
        case actions.HENT_TASKS: {
            return {
                ...state,
                tasks: {
                    status: RessursStatus.HENTER,
                },
            };
        }
        case actions.HENT_TASKS_SUKSESS: {
            return {
                ...state,
                tasks: action.payload.tasks,
                logg: action.payload.logg,
            };
        }
        case actions.HENT_TASKS_FEILET: {
            return {
                ...state,
                tasks: action.payload,
            };
        }
        case actions.REKJØR_ALLE_TASKS: {
            return {
                ...state,
                rekjørAlle: action.payload,
            };
        }
        case actions.REKJØR_TASK: {
            return {
                ...state,
                rekjørId: action.payload,
            };
        }
        case actions.SETT_FILTER: {
            return {
                ...state,
                statusFilter: action.payload,
            };
        }
        case actions.HENT_TASK_LOGG: {
            if (state.tasks.status === RessursStatus.SUKSESS) {
                return {
                    ...state,
                    logg: {
                        ...state.logg,
                        [action.payload.id]: action.payload.data,
                    },
                };
            } else {
                return state;
            }
        }
        default: {
            throw new Error(`Uhåndtert action type: ${action.type}`);
        }
    }
};

const TaskProvider: React.FC = ({ children }) => {
    const history = useHistory();
    const location = useLocation();

    const queryParamStatusFilter = new URLSearchParams(location.search).get(
        'statusFilter'
    ) as taskStatus;

    const valgtService: IService | undefined = useServiceContext().valgtService;
    const [state, dispatch] = React.useReducer(TaskReducer, {
        avvikshåndteringDTO: undefined,
        rekjørAlle: false,
        statusFilter: queryParamStatusFilter ? queryParamStatusFilter : taskStatus.FEILET,
        rekjørId: '',
        tasks: byggTomRessurs<ITaskResponse>(),
        logg: {},
    });

    React.useEffect(() => {
        if (queryParamStatusFilter !== state.statusFilter) {
            history.replace({
                pathname: location.pathname,
                search: '?statusFilter=' + state.statusFilter,
            });
        }
    }, [state.statusFilter, history]);

    React.useEffect(() => {
        internHentTasks();
    }, [state.statusFilter, valgtService]);

    const internHentTasks = () => {
        if (valgtService && state.statusFilter) {
            dispatch({ type: actions.HENT_TASKS });
            hentTasks2(valgtService, state.statusFilter).then(
                (response: Ressurs<ITaskResponse>) => {
                    if (response.status === RessursStatus.SUKSESS) {
                        dispatch({
                            payload: {
                                tasks: response,
                                logg: byggTomRessurs<ITaskLogger>(),
                            },
                            type: actions.HENT_TASKS_SUKSESS,
                        });
                    } else if (state.statusFilter) {
                        hentTasks(valgtService, state.statusFilter).then(
                            (responseV1: Ressurs<ITask[]>) => {
                                if (responseV1.status === RessursStatus.SUKSESS) {
                                    const getLogg = (logger?: ITaskLogg[]) => {
                                        if (logger && logger.length > 0) {
                                            return logger[0].opprettetTidspunkt;
                                        } else {
                                            return undefined;
                                        }
                                    };
                                    const logg: ITaskLogger = responseV1.data.reduce(
                                        (map, task) => {
                                            // @ts-ignore
                                            map[task.id] = task.logg.sort((a, b) =>
                                                moment(b.opprettetTidspunkt).diff(
                                                    moment(a.opprettetTidspunkt)
                                                )
                                            );
                                            return map;
                                        },
                                        {}
                                    );
                                    const tasks = {
                                        ...responseV1,
                                        data: {
                                            tasks: responseV1.data.map((task) => ({
                                                ...task,
                                                sistKjørt: getLogg(logg[task.id]),
                                            })),
                                        },
                                    };
                                    dispatch({
                                        payload: {
                                            tasks,
                                            logg,
                                        },
                                        type: actions.HENT_TASKS_SUKSESS,
                                    });
                                } else {
                                    // eventuell feilhåndtering
                                }
                            }
                        );
                    }
                }
            );
        }
    };

    React.useEffect(() => {
        if (valgtService && (state.rekjørAlle || state.rekjørId !== '') && state.statusFilter) {
            rekjørTask(valgtService, state.statusFilter, !state.rekjørAlle ? state.rekjørId : '')
                .then(() => {
                    internHentTasks();
                })
                .catch((error: AxiosError) => {
                    // tslint:disable-next-line: no-console
                    console.log('Rekjøring av task feilet');
                });

            dispatch({
                payload: '',
                type: actions.REKJØR_TASK,
            });

            dispatch({
                payload: false,
                type: actions.REKJØR_ALLE_TASKS,
            });
        }
    }, [state.rekjørId, state.rekjørAlle]);

    React.useEffect(() => {
        if (valgtService && state.avvikshåndteringDTO !== undefined) {
            avvikshåndterTask(valgtService, state.avvikshåndteringDTO)
                .then(() => {
                    internHentTasks();
                })
                .catch((error: AxiosError) => {
                    // tslint:disable-next-line: no-console
                    console.log('Avvikshåndtering av task feilet');
                });
        }
    }, [state.avvikshåndteringDTO]);

    return (
        <TaskStateContext.Provider value={state}>
            <TaskDispatchContext.Provider value={dispatch}>{children}</TaskDispatchContext.Provider>
        </TaskStateContext.Provider>
    );
};

const useTaskContext = () => {
    const context = React.useContext(TaskStateContext);
    if (context === undefined) {
        throw new Error('useTaskContext må brukes inne i en TaskContext');
    }
    return context;
};

const useTaskDispatch = () => {
    const context = React.useContext(TaskDispatchContext);
    if (context === undefined) {
        throw new Error('useTaskDispatch må brukes inne i en TaskContext');
    }
    return context;
};

export { TaskProvider, useTaskContext, useTaskDispatch };

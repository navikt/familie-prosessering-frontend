import { AxiosError } from 'axios';
import * as React from 'react';
import { avvikshåndterTask, hentTasks, rekjørTask } from '../api/task';
import { byggFeiletRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';
import { IService } from '../typer/service';
import { IAvvikshåndteringDTO, ITask, taskStatus } from '../typer/task';
import { useServiceContext } from './ServiceProvider';

export enum actions {
    AVVIKSHÅNDTER_TASK = 'AVVIKSHÅNDTER_TASK',
    HENT_TASKS = 'HENT_TASKS',
    HENT_TASKS_FEILET = 'HENT_TASKS_FEILET',
    HENT_TASKS_SUKSESS = 'HENT_TASKS_SUKSESS',
    REKJØR_ALLE_TASKS = 'REKJØR_ALLE_TASKS',
    REKJØR_TASK = 'REKJØR_TASK',
    SETT_FILTER = 'SETT_FILTER',
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
    statusFilter: taskStatus;
    tasks: Ressurs<ITask[]>;
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
                tasks: action.payload,
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
        default: {
            throw new Error(`Uhåndtert action type: ${action.type}`);
        }
    }
};

const TaskProvider: React.StatelessComponent = ({ children }) => {
    const valgtService: IService | undefined = useServiceContext().valgtService;
    const [state, dispatch] = React.useReducer(TaskReducer, {
        avvikshåndteringDTO: undefined,
        rekjørAlle: false,
        rekjørId: '',
        statusFilter: taskStatus.FEILET,
        tasks: byggTomRessurs<ITask[]>(),
    });

    const internHentTasks = () => {
        if (valgtService) {
            hentTasks(valgtService, state.statusFilter)
                .then((tasks: Ressurs<ITask[]>) => {
                    dispatch({
                        payload: tasks,
                        type: actions.HENT_TASKS_SUKSESS,
                    });
                })
                .catch((error: AxiosError) => {
                    dispatch({
                        payload: byggFeiletRessurs('Ukent feil ved innhenting av Task', error),
                        type: actions.HENT_TASKS_FEILET,
                    });
                });
        }
    };

    React.useEffect(() => {
        dispatch({ type: actions.HENT_TASKS });
        internHentTasks();
    }, [state.statusFilter, valgtService]);

    React.useEffect(() => {
        if (valgtService && (state.rekjørAlle || state.rekjørId !== '')) {
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

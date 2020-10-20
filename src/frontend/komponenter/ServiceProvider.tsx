import { AxiosError } from 'axios';
import * as React from 'react';
import { useHistory } from 'react-router';
import { hentServices } from '../api/service';
import { IService } from '../typer/service';
import { Ressurs, RessursStatus, byggTomRessurs, byggFeiletRessurs } from '@navikt/familie-typer';

export enum actions {
    HENT_SERVICES = 'HENT_SERVICES',
    HENT_SERVICES_SUKSESS = 'HENT_SERVICES_SUKSESS',
    HENT_SERVICES_FEILET = 'HENT_SERVICES_FEILET',
    SETT_VALGT_SERVICE = 'SETT_VALGT_SERVICE',
}

interface IAction {
    payload?: any;
    type: actions;
}

export type Dispatch = (action: IAction) => void;

interface IState {
    services: Ressurs<IService[]>;
    valgtService: IService | undefined;
}

const ServiceStateContext = React.createContext<IState | undefined>(undefined);
const ServiceDispatchContext = React.createContext<Dispatch | undefined>(undefined);

const ServiceReducer = (state: IState, action: IAction): IState => {
    switch (action.type) {
        case actions.HENT_SERVICES: {
            return {
                ...state,
                services: {
                    status: RessursStatus.HENTER,
                },
            };
        }
        case actions.HENT_SERVICES_SUKSESS: {
            return {
                ...state,
                services: action.payload,
            };
        }
        case actions.HENT_SERVICES_FEILET: {
            return {
                ...state,
                services: action.payload,
            };
        }
        case actions.SETT_VALGT_SERVICE: {
            return {
                ...state,
                valgtService: action.payload,
            };
        }
        default: {
            throw new Error(`Uhåndtert action type: ${action.type}`);
        }
    }
};

const ServiceProvider: React.StatelessComponent = ({ children }) => {
    const serviceId = useHistory().location.pathname.split('/')[2];

    const [state, dispatch] = React.useReducer(ServiceReducer, {
        services: byggTomRessurs<IService[]>(),
        valgtService: undefined,
    });

    React.useEffect(() => {
        dispatch({ type: actions.HENT_SERVICES });
        hentServices()
            .then((services: Ressurs<IService[]>) => {
                dispatch({
                    payload: services,
                    type: actions.HENT_SERVICES_SUKSESS,
                });

                if (services.status === RessursStatus.SUKSESS) {
                    dispatch({
                        payload: services.data.find(
                            (apiService: IService) => apiService.id === serviceId
                        ),
                        type: actions.SETT_VALGT_SERVICE,
                    });
                }
            })
            .catch((error: AxiosError) => {
                dispatch({
                    payload: byggFeiletRessurs('Ukent feil ved henting av services'),
                    type: actions.HENT_SERVICES_FEILET,
                });
            });
    }, []);

    return (
        <ServiceStateContext.Provider value={state}>
            <ServiceDispatchContext.Provider value={dispatch}>
                {children}
            </ServiceDispatchContext.Provider>
        </ServiceStateContext.Provider>
    );
};

const useServiceContext = () => {
    const context = React.useContext(ServiceStateContext);
    if (context === undefined) {
        throw new Error('useServiceContext må brukes inne i en ServiceContext');
    }
    return context;
};

const useServiceDispatch = () => {
    const context = React.useContext(ServiceDispatchContext);
    if (context === undefined) {
        throw new Error('useServiceDispatch må brukes inne i en ServiceContext');
    }
    return context;
};

export { ServiceProvider, useServiceContext, useServiceDispatch };

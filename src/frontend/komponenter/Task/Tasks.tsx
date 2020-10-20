import AlertStripe from 'nav-frontend-alertstriper';
import * as React from 'react';
import { RessursStatus } from '@navikt/familie-typer';
import { useTaskContext } from '../TaskProvider';
import TaskListe from './TaskListe';
import TopBar from '../Felleskomponenter/TopBar/TopBar';

const Tasks: React.FunctionComponent = () => {
    const tasks = useTaskContext().tasks;

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'tasks'}>
                    <TopBar />

                    <br />
                    <TaskListe tasks={tasks.data.tasks} />
                </div>
            );
        case RessursStatus.HENTER:
            return <AlertStripe children={`Laster tasker`} type={'info'} />;
        case RessursStatus.IKKE_TILGANG:
            return (
                <AlertStripe
                    children={`Ikke tilgang til tasker: ${tasks.frontendFeilmelding}`}
                    type={'advarsel'}
                />
            );
        case RessursStatus.FEILET:
            return (
                <AlertStripe
                    children={`Innhenting av tasker feilet: ${tasks.frontendFeilmelding}`}
                    type={'feil'}
                />
            );
        default:
            return <div />;
    }
};

export default Tasks;

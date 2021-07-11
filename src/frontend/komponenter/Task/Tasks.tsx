import AlertStripe from 'nav-frontend-alertstriper';
import * as React from 'react';
import { RessursStatus } from '@navikt/familie-typer';
import Paginering from '../Felleskomponenter/Paginering/Paginering';
import TaskListe from './TaskListe';
import TopBar from '../Felleskomponenter/TopBar/TopBar';
import { useTaskContext } from '../TaskProvider';

const Tasks: React.FunctionComponent = () => {
    const { tasks } = useTaskContext();

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'tasks'}>
                    <TopBar />

                    <br />
                    <Paginering />
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

import { Alert } from '@navikt/ds-react';
import * as React from 'react';
import { RessursStatus } from '@navikt/familie-typer';
import TaskListe from './TaskListe';
import TopBar from '../Felleskomponenter/TopBar/TopBar';
import { useTaskContext } from '../TaskProvider';
import TaskFiltrering from './TaskFiltrering';

const Tasks: React.FunctionComponent = () => {
    const { tasks } = useTaskContext();

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'side'}>
                    <TopBar />
                    <TaskFiltrering tasks={tasks.data.tasks} />
                    <TaskListe tasks={tasks.data.tasks} />
                </div>
            );
        case RessursStatus.HENTER:
            return <Alert variant={'info'}>Laster tasker</Alert>;
        case RessursStatus.IKKE_TILGANG:
            return (
                <Alert variant={'warning'}>
                    Ikke tilgang til tasker: ${tasks.frontendFeilmelding}
                </Alert>
            );
        case RessursStatus.FEILET:
            return (
                <Alert variant={'error'}>
                    Innhenting av tasker feilet: ${tasks.frontendFeilmelding}
                </Alert>
            );
        default:
            return <div />;
    }
};

export default Tasks;

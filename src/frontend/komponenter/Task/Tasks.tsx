import { Alert } from '@navikt/ds-react';
import * as React from 'react';
import { RessursStatus } from '@navikt/familie-typer';
import Paginering from '../Felleskomponenter/Paginering/Paginering';
import TaskListe from './TaskListe';
import TopBar from '../Felleskomponenter/TopBar/TopBar';
import { useTaskContext } from '../TaskProvider';
import TaskFiltrering from './TaskFiltrering';

const Tasks: React.FunctionComponent = () => {
    const { tasks } = useTaskContext();

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <div className={'component-container'}>
                    <TopBar />
                    <TaskFiltrering tasks={tasks.data.tasks} />
                    <Paginering />
                    <TaskListe tasks={tasks.data.tasks} />
                </div>
            );
        case RessursStatus.HENTER:
            return <Alert children={`Laster tasker`} variant={'info'} />;
        case RessursStatus.IKKE_TILGANG:
            return (
                <Alert
                    children={`Ikke tilgang til tasker: ${tasks.frontendFeilmelding}`}
                    variant={'warning'}
                />
            );
        case RessursStatus.FEILET:
            return (
                <Alert
                    children={`Innhenting av tasker feilet: ${tasks.frontendFeilmelding}`}
                    variant={'error'}
                />
            );
        default:
            return <div />;
    }
};

export default Tasks;

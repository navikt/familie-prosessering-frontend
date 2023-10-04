import { Alert, Heading } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import * as React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useServiceContext } from '../ServiceContext';
import { useTaskContext } from '../TaskProvider';
import TaskListe from './TaskListe';
import TaskPanel from './TaskPanel';

const TaskMedId: React.FC = () => {
    const { settCallId, tasks } = useTaskContext();
    const { valgtService } = useServiceContext();
    const { callId } = useParams();
    useEffect(() => {
        settCallId(callId);
        // Fjern taskId når man går ut av dette skjermbildet
        return () => {
            settCallId(undefined);
        };
    }, []);

    switch (tasks.status) {
        case RessursStatus.SUKSESS:
            return (
                <div style={{ margin: '0 2em' }}>
                    <Heading size={'large'}>
                        {valgtService ? valgtService.displayName : ''} - CallId: {callId}
                    </Heading>
                    <TaskListe tasks={tasks.data.tasks} />
                </div>
            );
        case RessursStatus.HENTER:
            return <Alert variant={'info'}>Laster tasker</Alert>;
        case RessursStatus.IKKE_TILGANG:
            return (
                <Alert variant={'warning'}>
                    Ikke tilgang til tasker: {tasks.frontendFeilmelding}
                </Alert>
            );
        case RessursStatus.FEILET:
            return (
                <Alert variant={'error'}>
                    Innhenting av tasker feilet: {tasks.frontendFeilmelding}
                </Alert>
            );
        default:
            return <div />;
    }
};
export default TaskMedId;

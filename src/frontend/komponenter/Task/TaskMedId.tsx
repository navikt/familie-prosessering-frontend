import { Alert, Heading } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import * as React from 'react';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useServiceContext } from '../ServiceContext';
import { useTaskContext } from '../TaskProvider';
import TaskPanel from './TaskPanel';

const TaskMedId: React.FC = () => {
    const { settTaskId, task } = useTaskContext();
    const { valgtService } = useServiceContext();
    const { taskId } = useParams();
    useEffect(() => {
        settTaskId(taskId ? parseInt(taskId, 10) : undefined);
        // Fjern taskId når man går ut av dette skjermbildet
        return () => {
            settTaskId(undefined);
        };
    }, []);

    switch (task.status) {
        case RessursStatus.SUKSESS:
            return (
                <div style={{ margin: '0 2em' }}>
                    <Heading size={'large'}>
                        {valgtService ? valgtService.displayName : ''} - TaskId: {task.data.id}
                    </Heading>
                    <TaskPanel task={task.data} />
                </div>
            );
        case RessursStatus.HENTER:
            return <Alert variant={'info'}>Laster tasker</Alert>;
        case RessursStatus.IKKE_TILGANG:
            return (
                <Alert variant={'warning'}>
                    Ikke tilgang til tasker: {task.frontendFeilmelding}
                </Alert>
            );
        case RessursStatus.FEILET:
            return (
                <Alert variant={'error'}>
                    Innhenting av tasker feilet: {task.frontendFeilmelding}
                </Alert>
            );
        default:
            return <div />;
    }
};
export default TaskMedId;

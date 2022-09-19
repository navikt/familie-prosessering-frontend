import { Alert, BodyShort } from '@navikt/ds-react';
import * as moment from 'moment';
import * as React from 'react';
import { ITask } from '../../typer/task';
import { useTaskContext } from '../TaskProvider';
import TaskPanel from './TaskPanel';

interface IProps {
    tasks: ITask[];
}

const TaskListe: React.FC<IProps> = ({ tasks }) => {
    const { statusFilter, type } = useTaskContext();

    return tasks.length > 0 ? (
        <React.Fragment>
            <BodyShort>Viser {tasks.length} tasker</BodyShort>

            {tasks
                .sort((a, b) => moment(b.opprettetTidspunkt).diff(a.opprettetTidspunkt))
                .map((task) => {
                    return <TaskPanel key={task.id} task={task} />;
                })}
        </React.Fragment>
    ) : (
        <Alert variant={'info'}>
            Ingen tasker med status {statusFilter}
            {type ? ` av type {type}` : ''}
        </Alert>
    );
};

export default TaskListe;

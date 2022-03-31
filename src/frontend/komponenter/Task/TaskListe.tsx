import * as moment from 'moment';
import AlertStripe from 'nav-frontend-alertstriper';
import { Element } from 'nav-frontend-typografi';
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
            <Element children={`Viser ${tasks.length} tasker`} />

            {tasks
                .sort((a, b) => moment(b.opprettetTidspunkt).diff(a.opprettetTidspunkt))
                .map((task) => {
                    return <TaskPanel key={task.id} task={task} />;
                })}
        </React.Fragment>
    ) : (
        <AlertStripe
            type={'info'}
            children={`Ingen tasker med status ${statusFilter}${type ? ` av type ${type}` : ''}`}
        />
    );
};

export default TaskListe;

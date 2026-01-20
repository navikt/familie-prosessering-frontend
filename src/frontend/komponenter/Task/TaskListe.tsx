import { Alert, BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';
import * as moment from 'moment';
import * as React from 'react';
import { Fagsystem, ITask, stringTilFagsystem } from '../../typer/task';
import { useTaskContext } from '../TaskProvider';
import TaskPanel from './TaskPanel';

interface IProps {
    tasks: ITask[];
}

const TaskListe: React.FC<IProps> = ({ tasks }) => {
    const { statusFilter, typeFilter, fagsystemFilter, henterTasks } = useTaskContext();

    const skalViseTask = (task: ITask): boolean => {
        switch (fagsystemFilter) {
            case Fagsystem.ALLE:
                return true;
            case Fagsystem.UKJENT:
                return (
                    task.metadata.fagsystem === undefined || task.metadata.fagsystem === 'UKJENT'
                );
            default:
                return stringTilFagsystem[task.metadata.fagsystem] === fagsystemFilter;
        }
    };

    if (henterTasks) {
        return (
            <HStack justify="center">
                <VStack gap="4">
                    <Loader size="3xlarge" title="Henter tasker" />
                    <BodyShort>Henter tasker...</BodyShort>
                </VStack>
            </HStack>
        );
    }

    return tasks.length > 0 ? (
        <React.Fragment>
            <BodyShort>Viser {tasks.length} tasker</BodyShort>

            {tasks
                .sort((a, b) => moment(b.sistKjørt).diff(a.sistKjørt))
                .filter((task) => skalViseTask(task))
                .map((task) => {
                    return <TaskPanel key={task.id} task={task} />;
                })}
        </React.Fragment>
    ) : (
        <Alert variant={'info'}>
            Ingen tasker med status {statusFilter}
            {typeFilter ? ` av type ${typeFilter}` : ''}
        </Alert>
    );
};

export default TaskListe;

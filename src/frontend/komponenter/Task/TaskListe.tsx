import { Alert, BodyShort, HStack, Loader, VStack } from '@navikt/ds-react';
import * as moment from 'moment';
import * as React from 'react';
import { Fagsystem, ITask, stringTilFagsystem } from '../../typer/task';
import { useTaskContext } from '../TaskProvider';
import Paginering from '../Felleskomponenter/Paginering/Paginering';
import TaskPanel from './TaskPanel';

interface IProps {
    tasks: ITask[];
    visPaginering?: boolean;
}

const TaskListe: React.FC<IProps> = ({ tasks, visPaginering = true }) => {
    const { statusFilter, typeFilter, fagsystemFilter, henterTasks, side } = useTaskContext();

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

    if (tasks.length === 0) {
        return (
            <Alert variant={'info'}>
                Ingen tasker {statusFilter !== 'ALLE' ? `med status ${statusFilter}` : ''}
                {typeFilter ? ` av type ${typeFilter}` : ''}
            </Alert>
        );
    }

    const sorterte = [...tasks]
        .sort((a, b) => moment(b.sistKjørt).diff(a.sistKjørt))
        .filter((task) => skalViseTask(task));

    return (
        <>
            <div className={'liste-header'}>
                <div className={'liste-header__venstre'}>
                    <strong className={'liste-header__antall'}>
                        Viser {sorterte.length} task{sorterte.length === 1 ? '' : 's'}
                    </strong>
                    {visPaginering && <span className={'liste-header__side'}>Side {side + 1}</span>}
                </div>
                {visPaginering && <Paginering />}
            </div>

            {sorterte.map((task) => (
                <TaskPanel key={task.id} task={task} />
            ))}
        </>
    );
};

export default TaskListe;

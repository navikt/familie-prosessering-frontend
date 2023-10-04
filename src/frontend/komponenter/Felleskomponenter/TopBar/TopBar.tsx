import { Button, Checkbox, Heading, Select } from '@navikt/ds-react';
import React, { FC, useState } from 'react';
import { TaskStatus, taskStatusTekster } from '../../../typer/task';
import { useServiceContext } from '../../ServiceContext';
import { useTaskContext } from '../../TaskProvider';

const TopBar: FC = () => {
    const {
        statusFilter,
        rekjørTasks,
        settStatusFilter,
        tasksSomErFerdigNåMenFeiletFør,
        hentEllerOppdaterTasks,
    } = useTaskContext();
    const { valgtService } = useServiceContext();
    const [visFeilaMenFerdig, setVisFeilaMenFerdig] = useState(false);

    return (
        <div className={'topbar'}>
            <Heading size={'large'}>
                Tasks for {valgtService ? valgtService.displayName : ''}
            </Heading>

            {(statusFilter === TaskStatus.FEILET ||
                statusFilter === TaskStatus.MANUELL_OPPFØLGING) && (
                <Button size={'small'} variant={'secondary'} onClick={() => rekjørTasks()}>
                    Rekjør alle tasks
                </Button>
            )}

            {statusFilter === TaskStatus.FERDIG && (
                <Checkbox
                    id={'feila-men-ferdig-checkbox'}
                    checked={visFeilaMenFerdig}
                    onChange={() => {
                        setVisFeilaMenFerdig(!visFeilaMenFerdig);
                        if (!visFeilaMenFerdig) {
                            tasksSomErFerdigNåMenFeiletFør();
                        } else {
                            hentEllerOppdaterTasks();
                        }
                    }}
                >
                    Vis de som feila, men nå er ferdige
                </Checkbox>
            )}
            <Select
                onChange={(event) => settStatusFilter(event.target.value as TaskStatus)}
                value={statusFilter}
                label={'Vis saker med status'}
            >
                {Object.values(TaskStatus).map((status: TaskStatus) => {
                    return (
                        <option key={status} value={status}>
                            {taskStatusTekster[status]}
                        </option>
                    );
                })}
            </Select>
        </div>
    );
};

export default TopBar;

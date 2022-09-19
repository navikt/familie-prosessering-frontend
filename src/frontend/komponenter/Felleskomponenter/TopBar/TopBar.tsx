import { Button, Heading, Select } from '@navikt/ds-react';
import React, { FC } from 'react';
import { taskStatus, taskStatusTekster } from '../../../typer/task';
import { useServiceContext } from '../../ServiceContext';
import { useTaskContext } from '../../TaskProvider';

const TopBar: FC = () => {
    const { statusFilter, rekjørTasks, settStatusFilter } = useTaskContext();
    const { valgtService } = useServiceContext();

    return (
        <div className={'topbar'}>
            <Heading size={'large'}>
                Tasks for {valgtService ? valgtService.displayName : ''}
            </Heading>

            {(statusFilter === taskStatus.FEILET ||
                statusFilter === taskStatus.MANUELL_OPPFØLGING) && (
                <Button size={'small'} variant={'secondary'} onClick={() => rekjørTasks()}>
                    Rekjør alle tasks
                </Button>
            )}

            <Select
                onChange={(event) => settStatusFilter(event.target.value as taskStatus)}
                value={statusFilter}
                label={'Vis saker med status'}
            >
                {Object.values(taskStatus).map((status: taskStatus) => {
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

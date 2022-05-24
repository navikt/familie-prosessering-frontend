import { Systemtittel } from 'nav-frontend-typografi';
import React, { FC } from 'react';
import { useTaskContext } from '../../TaskProvider';
import { useServiceContext } from '../../ServiceContext';
import { taskStatus, taskStatusTekster } from '../../../typer/task';
import { Knapp } from 'nav-frontend-knapper';
import { Select } from 'nav-frontend-skjema';

const TopBar: FC = () => {
    const { statusFilter, rekjørTasks, settStatusFilter } = useTaskContext();
    const { valgtService } = useServiceContext();

    return (
        <div className={'topbar'}>
            <Systemtittel children={`Tasks for ${valgtService ? valgtService.displayName : ''}`} />

            {(statusFilter === taskStatus.FEILET ||
                statusFilter === taskStatus.MANUELL_OPPFØLGING) && (
                <Knapp mini={true} onClick={() => rekjørTasks()}>
                    Rekjør alle tasks
                </Knapp>
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

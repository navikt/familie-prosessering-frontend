import { Button, Checkbox, Heading, Search, Select } from '@navikt/ds-react';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { taskStatus, taskStatusTekster } from '../../../typer/task';
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
    const navigate = useNavigate();

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

            {statusFilter === taskStatus.FERDIG && (
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
            <div className={'søk'}>
                <Select
                    onChange={(event) => settStatusFilter(event.target.value as taskStatus)}
                    value={statusFilter}
                    label={'Status'}
                >
                    {Object.values(taskStatus).map((status: taskStatus) => {
                        return (
                            <option key={status} value={status}>
                                {taskStatusTekster[status]}
                            </option>
                        );
                    })}
                </Select>
                <Search
                    label="Søk på callId"
                    variant="secondary"
                    hideLabel={false}
                    onSearchClick={(verdi) => {
                        navigate(`/service/${valgtService?.id}/tasker-med-call-id/${verdi}`);
                    }}
                />
            </div>
        </div>
    );
};

export default TopBar;

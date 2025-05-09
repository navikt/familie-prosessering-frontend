import { Button, Checkbox, Heading, Search, Select } from '@navikt/ds-react';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TaskStatus, taskStatusTekster } from '../../../typer/task';
import { useServiceContext } from '../../ServiceContext';
import { useTaskContext } from '../../TaskProvider';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';

const TopBar: FC = () => {
    const {
        statusFilter,
        rekjørTasks,
        settStatusFilter,
        tasksSomErFerdigNåMenFeiletFør,
        hentEllerOppdaterTasks,
        typeFilter,
        typer,
        settTypeFilter,
    } = useTaskContext();
    const { valgtService } = useServiceContext();
    const [visFeilaMenFerdig, setVisFeilaMenFerdig] = useState(false);
    const navigate = useNavigate();

    return (
        <div className={'topbar'}>
            <Heading size={'large'}>
                Tasks for {valgtService ? valgtService.displayName : ''}
            </Heading>

            {(statusFilter === TaskStatus.FEILET ||
                statusFilter === TaskStatus.MANUELL_OPPFØLGING) && (
                <Button
                    icon={<ArrowCirclepathIcon fontSize="1.5rem" />}
                    style={{
                        display: 'flex',
                        alignSelf: 'flex-end',
                    }}
                    variant={'secondary'}
                    onClick={() => rekjørTasks()}
                >
                    Rekjør tasks
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
            <div className={'søk'}>
                <Select
                    onChange={(event) => settStatusFilter(event.target.value as TaskStatus)}
                    value={statusFilter}
                    label={'Status'}
                    style={{ width: '12rem' }}
                >
                    {Object.values(TaskStatus).map((status: TaskStatus) => {
                        return (
                            <option key={status} value={status}>
                                {taskStatusTekster[status]}
                            </option>
                        );
                    })}
                </Select>
                <Select
                    onChange={(event) => settTypeFilter(event.target.value)}
                    value={typeFilter}
                    label={'Type'}
                    style={{ width: '12rem' }}
                >
                    <option key={'alle'} value={''}>
                        Alle
                    </option>

                    {typer.map((type: string) => {
                        return (
                            <option key={type} value={type}>
                                {type}
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

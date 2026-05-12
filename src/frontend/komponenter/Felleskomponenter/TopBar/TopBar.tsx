import { Button, Search, Select } from '@navikt/ds-react';
import classNames from 'classnames';
import { ArrowCirclepathIcon } from '@navikt/aksel-icons';
import React, { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
        typeFilter,
        typer,
        settTypeFilter,
    } = useTaskContext();
    const { valgtService } = useServiceContext();
    const [visFeilaMenFerdig, setVisFeilaMenFerdig] = useState(false);
    const navigate = useNavigate();

    const kanRekjøreAlle =
        statusFilter === TaskStatus.FEILET || statusFilter === TaskStatus.MANUELL_OPPFØLGING;

    return (
        <>
            <button className={'tilbake-lenke'} onClick={() => navigate('/')}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                    <path
                        d="M10 4l-4 4 4 4"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                Tilbake til oversikt
            </button>

            <header className={'side-header'}>
                <div>
                    <h1 className={'navds-heading navds-heading--large side-header__tittel'}>
                        Tasks for {valgtService ? valgtService.displayName : ''}
                    </h1>
                    <p className={'side-header__ingress'}>
                        Kjør, inspiser og feilsøk tasks i tjenesten.
                    </p>
                </div>
                {kanRekjøreAlle && (
                    <Button
                        icon={<ArrowCirclepathIcon fontSize="1.25rem" aria-hidden="true" />}
                        variant={'primary'}
                        onClick={() => rekjørTasks()}
                    >
                        Rekjør alle tasks
                    </Button>
                )}
            </header>

            <div className={'filterbar'}>
                <Select
                    onChange={(event) => settStatusFilter(event.target.value as TaskStatus)}
                    value={statusFilter}
                    label={'Status'}
                >
                    {Object.values(TaskStatus).map((status: TaskStatus) => (
                        <option key={status} value={status}>
                            {taskStatusTekster[status]}
                        </option>
                    ))}
                </Select>
                <Select
                    onChange={(event) => settTypeFilter(event.target.value)}
                    value={typeFilter}
                    label={'Type'}
                >
                    <option key={'alle'} value={''}>
                        Alle
                    </option>
                    {typer.map((type: string) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </Select>
                <Search
                    label="Søk på callId"
                    variant="secondary"
                    hideLabel={false}
                    onSearchClick={(verdi) => {
                        navigate(`/service/${valgtService?.id}/tasker-med-call-id/${verdi}`);
                    }}
                />
                {statusFilter === TaskStatus.FERDIG && (
                    <label
                        className={classNames('toggle-chip', visFeilaMenFerdig && 'aktiv')}
                        htmlFor={'feila-men-ferdig-checkbox'}
                    >
                        <input
                            id={'feila-men-ferdig-checkbox'}
                            type={'checkbox'}
                            checked={visFeilaMenFerdig}
                            onChange={() => {
                                const neste = !visFeilaMenFerdig;
                                setVisFeilaMenFerdig(neste);
                                if (neste) {
                                    tasksSomErFerdigNåMenFeiletFør();
                                } else {
                                    hentEllerOppdaterTasks();
                                }
                            }}
                        />
                        <span className={'toggle-chip__bryter'} aria-hidden={'true'} />
                        Vis feilede som nå er ferdige
                    </label>
                )}
            </div>
        </>
    );
};

export default TopBar;

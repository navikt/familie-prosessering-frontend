import { Radio, RadioGroup } from '@navikt/ds-react';
import * as React from 'react';
import { useTaskContext } from '../TaskProvider';
import { ITask, stringTilFagsystem } from '../../typer/task';

const utledFagsystem = (fagsystem: string | undefined) => {
    switch (fagsystem) {
        case undefined:
        case 'UKJENT':
            return 'UKJENT';
        default:
            return fagsystem;
    }
};

const utledFagsystemer = (tasks: ITask[]) => [
    ...new Set(tasks.map((task) => utledFagsystem(task.metadata.fagsystem))),
];

interface Props {
    tasks: ITask[];
}

const TaskFiltrering: React.FunctionComponent<Props> = ({ tasks }) => {
    const { fagsystemFilter, settFagsystemFilter } = useTaskContext();

    const fagsystemer = utledFagsystemer(tasks);
    const skalViseFagsystemFilter = fagsystemer.length > 1;

    if (!skalViseFagsystemFilter) {
        return <></>;
    }

    return (
        <RadioGroup
            legend="Vis tasker med fagsystem"
            onChange={(fagsystem: string) => settFagsystemFilter(stringTilFagsystem[fagsystem])}
            value={fagsystemFilter}
        >
            <div className={'flex-rad'}>
                <Radio key={'alle'} value={'ALLE'}>
                    ALLE
                </Radio>
                {fagsystemer.map((fs) => {
                    return (
                        <Radio key={fs} value={fs}>
                            {fs}
                        </Radio>
                    );
                })}
            </div>
        </RadioGroup>
    );
};

export default TaskFiltrering;

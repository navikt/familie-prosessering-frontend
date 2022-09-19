import { BodyShort, Label } from '@navikt/ds-react';
import * as React from 'react';

interface IProps {
    innhold: string;
    label: string;
}

const TaskElement: React.FC<IProps> = ({ innhold, label }) => {
    return (
        <div className={'taskelement'}>
            <Label size={'small'}>{label}:&nbsp;</Label>
            <BodyShort size={'small'}>{innhold}</BodyShort>
        </div>
    );
};

export default TaskElement;

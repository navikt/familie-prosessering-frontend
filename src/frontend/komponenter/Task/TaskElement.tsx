import { BodyShort, Label } from '@navikt/ds-react';
import * as React from 'react';

interface IProps {
    innhold: React.ReactNode;
    label: string;
}

const TaskElement: React.FC<IProps> = ({ innhold, label }) => {
    return (
        <div className="taskelement">
            <Label as="p" size="small">
                {label}:&nbsp;
            </Label>
            <BodyShort size="small" className="taskelement--innhold">
                {innhold}
            </BodyShort>
        </div>
    );
};

export default TaskElement;

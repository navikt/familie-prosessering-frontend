import { Element, Normaltekst } from 'nav-frontend-typografi';
import * as React from 'react';

interface IProps {
    innhold: string;
    label: string;
}

const TaskElement: React.FC<IProps> = ({ innhold, label }) => {
    return (
        <div className={'taskelement'}>
            <Element children={`${label}:`} />
            <Normaltekst children={innhold} />
        </div>
    );
};

export default TaskElement;

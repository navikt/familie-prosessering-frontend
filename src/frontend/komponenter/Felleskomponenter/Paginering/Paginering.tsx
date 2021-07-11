import { Knapp } from 'nav-frontend-knapper';
import { UndertekstBold } from 'nav-frontend-typografi';
import * as React from 'react';
import { useTaskContext } from '../../TaskProvider';
import { FC } from 'react';

const Paginering: FC = () => {
    const { side, settSide } = useTaskContext();
    return (
        <div>
            <Knapp onClick={() => settSide(side - 1)} mini={true} disabled={side <= 0}>
                Forrige
            </Knapp>
            <Knapp onClick={() => settSide(side + 1)} mini={true}>
                Neste
            </Knapp>
            <UndertekstBold>Side: {side}</UndertekstBold>
        </div>
    );
};

export default Paginering;

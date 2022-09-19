import { BodyShort, Button } from '@navikt/ds-react';
import React, { FC } from 'react';
import { useTaskContext } from '../../TaskProvider';

const Paginering: FC = () => {
    const { side, settSide } = useTaskContext();
    return (
        <div>
            <Button
                variant={'secondary'}
                onClick={() => settSide(side - 1)}
                size={'medium'}
                disabled={side <= 0}
            >
                Forrige
            </Button>
            <Button variant={'secondary'} onClick={() => settSide(side + 1)} size={'medium'}>
                Neste
            </Button>
            <BodyShort>Side: {side}</BodyShort>
        </div>
    );
};

export default Paginering;

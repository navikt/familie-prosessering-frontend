import React, { FC } from 'react';
import { useTaskContext } from '../../TaskProvider';

const Paginering: FC = () => {
    const { side, settSide } = useTaskContext();
    return (
        <div className={'paginering'} role={'group'} aria-label={'Paginering'}>
            <button
                className={'paginering__knapp'}
                onClick={() => settSide(side - 1)}
                disabled={side <= 0}
            >
                ‹ Forrige
            </button>
            <span className={'paginering__side'}>Side {side + 1}</span>
            <button className={'paginering__knapp'} onClick={() => settSide(side + 1)}>
                Neste ›
            </button>
        </div>
    );
};

export default Paginering;

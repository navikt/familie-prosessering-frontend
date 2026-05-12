import classNames from 'classnames';
import React, { FC } from 'react';
import { useTaskContext } from '../../TaskProvider';

interface IProps {
    kompakt?: boolean;
}

const Paginering: FC<IProps> = ({ kompakt = false }) => {
    const { side, settSide } = useTaskContext();
    return (
        <div
            className={classNames('paginering', kompakt && 'paginering--kompakt')}
            role={'group'}
            aria-label={'Paginering'}
        >
            <button
                className={'paginering__knapp'}
                onClick={() => settSide(side - 1)}
                disabled={side <= 0}
                aria-label={'Forrige side'}
            >
                {kompakt ? '‹' : '‹ Forrige'}
            </button>
            <span className={'paginering__side'}>{kompakt ? side + 1 : `Side ${side + 1}`}</span>
            <button
                className={'paginering__knapp'}
                onClick={() => settSide(side + 1)}
                aria-label={'Neste side'}
            >
                {kompakt ? '›' : 'Neste ›'}
            </button>
        </div>
    );
};

export default Paginering;

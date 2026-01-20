import { BodyShort, Button, HStack, VStack } from '@navikt/ds-react';
import React, { FC } from 'react';
import { useTaskContext } from '../../TaskProvider';

const Paginering: FC = () => {
    const { side, settSide } = useTaskContext();
    return (
        <VStack gap="4">
            <HStack gap="2">
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
            </HStack>
            <BodyShort>Side: {side}</BodyShort>
        </VStack>
    );
};

export default Paginering;

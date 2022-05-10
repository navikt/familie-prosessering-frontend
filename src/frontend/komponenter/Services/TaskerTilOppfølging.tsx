import { Button, Popover } from '@navikt/ds-react';
import Icon from 'nav-frontend-ikoner-assets/lib';
import React, { useRef, useState } from 'react';
import { IOppfølgingstask } from '../../typer/service';

export interface TaskerTilOppfølgingProps {
    taskerTilOppfølging: IOppfølgingstask;
}

export const TaskerTilOppfølging: React.FC<TaskerTilOppfølgingProps> = ({
    taskerTilOppfølging,
}) => {
    const iconRef = useRef(null);
    const [åpen, settÅpen] = useState(false);
    const ikonType = utledIkonType(taskerTilOppfølging);

    return (
        <>
            <Button
                ref={iconRef}
                key={taskerTilOppfølging.serviceId}
                variant={'tertiary'}
                size={'small'}
                onClick={() => settÅpen(!åpen)}
            >
                <Icon kind={ikonType} />
            </Button>
            <Popover
                open={åpen}
                onClose={() => settÅpen(!åpen)}
                anchorEl={iconRef.current}
                placement="bottom"
            >
                <Popover.Content>{utledTekst(taskerTilOppfølging)}</Popover.Content>
            </Popover>
        </>
    );
};

const utledIkonType = (taskerTilOppfølging: IOppfølgingstask): string => {
    if (!taskerTilOppfølging.harMottattSvar) {
        return 'advarsel-sirkel-fyll';
    } else if (
        taskerTilOppfølging.harMottattSvar &&
        taskerTilOppfølging.antallTilOppfølging === 0
    ) {
        return 'ok-sirkel-fyll';
    } else if (taskerTilOppfølging.harMottattSvar && taskerTilOppfølging.antallTilOppfølging > 0) {
        return 'feil-sirkel-fyll';
    } else {
        return 'help-circle';
    }
};

const utledTekst = (taskerTilOppfølging: IOppfølgingstask): string => {
    if (!taskerTilOppfølging.harMottattSvar) {
        return 'Kunne ikke hente ut tasker som trenger oppfølging for denne tjenesten';
    } else if (
        taskerTilOppfølging.harMottattSvar &&
        taskerTilOppfølging.antallTilOppfølging === 0
    ) {
        return 'Ingen tasker som trenger oppfølging';
    } else if (taskerTilOppfølging.harMottattSvar && taskerTilOppfølging.antallTilOppfølging > 0) {
        return `${taskerTilOppfølging.antallTilOppfølging} tasker som trenger oppfølging`;
    } else {
        return 'Noe er galt';
    }
};

export default TaskerTilOppfølging;

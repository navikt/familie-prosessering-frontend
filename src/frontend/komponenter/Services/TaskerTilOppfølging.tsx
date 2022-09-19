import { Button, Popover } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { IOppfølgingstask } from '../../typer/service';
import { WarningColored, SuccessColored, ErrorColored, InformationColored } from '@navikt/ds-icons';

export interface TaskerTilOppfølgingProps {
    taskerTilOppfølging: IOppfølgingstask;
}

export const TaskerTilOppfølging: React.FC<TaskerTilOppfølgingProps> = ({
    taskerTilOppfølging,
}) => {
    const iconRef = useRef(null);
    const [åpen, settÅpen] = useState(false);
    const Ikon = utledIkonType(taskerTilOppfølging);

    return (
        <>
            <Button
                ref={iconRef}
                key={taskerTilOppfølging.serviceId}
                variant={'tertiary'}
                onClick={() => settÅpen(!åpen)}
                icon={<Ikon />}
            ></Button>
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

const utledIkonType = (taskerTilOppfølging: IOppfølgingstask) => {
    if (!taskerTilOppfølging.harMottattSvar) {
        return WarningColored;
    } else if (
        taskerTilOppfølging.harMottattSvar &&
        taskerTilOppfølging.antallTilOppfølging === 0
    ) {
        return SuccessColored;
    } else if (taskerTilOppfølging.harMottattSvar && taskerTilOppfølging.antallTilOppfølging > 0) {
        return ErrorColored;
    } else {
        return InformationColored;
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

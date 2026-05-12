import { Button, Popover } from '@navikt/ds-react';
import React, { useState } from 'react';
import { AntallTaskerMedStatusFeiletOgManuellOppfølging, IService } from '../../typer/service';
import { Danger500, Success500, Warning500, Info500 } from '@navikt/ds-tokens/dist/tokens';
import {
    ExclamationmarkTriangleFillIcon,
    CheckmarkCircleFillIcon,
    XMarkOctagonFillIcon,
    InformationSquareFillIcon,
    BucketMopFillIcon,
} from '@navikt/aksel-icons';

export interface TaskerTilOppfølgingProps {
    service: IService;
    servicer: IService[];
    taskerFeiletOgManuellOppfølging: AntallTaskerMedStatusFeiletOgManuellOppfølging;
}

export const TaskerTilOppfølging: React.FC<TaskerTilOppfølgingProps> = ({
    taskerFeiletOgManuellOppfølging,
}) => {
    const [ankerElement, settAnkerElement] = useState<HTMLButtonElement | null>(null);
    const [åpen, settÅpen] = useState(false);

    const IkonType = utledIkonType(taskerFeiletOgManuellOppfølging);

    return (
        <div className={'varsel-wrapper'}>
            <Button
                ref={settAnkerElement}
                key={taskerFeiletOgManuellOppfølging.serviceId}
                variant={'tertiary'}
                onClick={() => settÅpen(!åpen)}
                icon={
                    <IkonType.ikon
                        width={'2rem'}
                        height={'2rem'}
                        style={{ color: IkonType.farge }}
                    />
                }
            />
            <Popover
                open={åpen}
                onClose={() => settÅpen(!åpen)}
                anchorEl={ankerElement}
                placement="bottom"
            >
                <Popover.Content>{utledTekst(taskerFeiletOgManuellOppfølging)}</Popover.Content>
            </Popover>
        </div>
    );
};

const utledIkonType = (
    taskerFeiletOgManuellOppfølging: AntallTaskerMedStatusFeiletOgManuellOppfølging
) => {
    const { harMottattSvar, antallFeilet, antallManuellOppfølging } =
        taskerFeiletOgManuellOppfølging;

    const harFeiletTasker = harMottattSvar && antallFeilet > 0;
    const harTaskerTilManuellOppfølging = harMottattSvar && antallManuellOppfølging > 0;
    const harTaskerTilOppfølging =
        harMottattSvar && (harFeiletTasker || harTaskerTilManuellOppfølging);

    if (!harMottattSvar) {
        return { ikon: ExclamationmarkTriangleFillIcon, farge: Warning500 };
    } else if (harMottattSvar && !harTaskerTilOppfølging) {
        return { ikon: CheckmarkCircleFillIcon, farge: Success500 };
    } else if (harMottattSvar && !harFeiletTasker && harTaskerTilManuellOppfølging) {
        return { ikon: BucketMopFillIcon, farge: Warning500 };
    } else if (harMottattSvar && harTaskerTilOppfølging) {
        return { ikon: XMarkOctagonFillIcon, farge: Danger500 };
    } else {
        return { ikon: InformationSquareFillIcon, farge: Info500 };
    }
};

const utledTekst = (
    taskerFeiletOgManuellOppfølging: AntallTaskerMedStatusFeiletOgManuellOppfølging
): string => {
    const { harMottattSvar, antallFeilet, antallManuellOppfølging } =
        taskerFeiletOgManuellOppfølging;

    const harFeiletTasker = harMottattSvar && antallFeilet > 0;
    const harTaskerTilManuellOppfølging = harMottattSvar && antallManuellOppfølging > 0;
    const harTaskerTilOppfølging =
        harMottattSvar && (harFeiletTasker || harTaskerTilManuellOppfølging);

    if (!harMottattSvar) {
        return 'Kunne ikke hente ut tasker som trenger oppfølging for denne tjenesten';
    } else if (harMottattSvar && !harTaskerTilOppfølging) {
        return 'Ingen tasker som trenger oppfølging';
    } else if (harMottattSvar && !harFeiletTasker && harTaskerTilManuellOppfølging) {
        return `${taskerFeiletOgManuellOppfølging.antallManuellOppfølging} task(er) som trenger manuell oppfølging`;
    } else if (harMottattSvar && harTaskerTilOppfølging) {
        return `${
            taskerFeiletOgManuellOppfølging.antallFeilet +
            taskerFeiletOgManuellOppfølging.antallManuellOppfølging
        } task(er) som trenger oppfølging`;
    } else {
        return 'Noe er galt';
    }
};

export default TaskerTilOppfølging;

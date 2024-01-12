import { Button, Popover } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { AntallTaskerMedStatusFeiletOgManuellOppfølging, IService } from '../../typer/service';
import { AIconDanger, AIconSuccess, AIconWarning, AIconInfo } from '@navikt/ds-tokens/dist/tokens';
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
    const iconRef = useRef(null);
    const [åpen, settÅpen] = useState(false);

    const IkonType = utledIkonType(taskerFeiletOgManuellOppfølging);

    return (
        <div className={'varsel-wrapper'}>
            <Button
                ref={iconRef}
                key={taskerFeiletOgManuellOppfølging.serviceId}
                variant={'tertiary'}
                onClick={() => settÅpen(!åpen)}
                icon={
                    <IkonType.ikon
                        width={'2.5rem'}
                        height={'2.5rem'}
                        style={{ color: IkonType.farge }}
                    />
                }
            />
            <Popover
                open={åpen}
                onClose={() => settÅpen(!åpen)}
                anchorEl={iconRef.current}
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
        return { ikon: ExclamationmarkTriangleFillIcon, farge: AIconWarning };
    } else if (harMottattSvar && !harTaskerTilOppfølging) {
        return { ikon: CheckmarkCircleFillIcon, farge: AIconSuccess };
    } else if (harMottattSvar && !harFeiletTasker && harTaskerTilManuellOppfølging) {
        return { ikon: BucketMopFillIcon, farge: AIconWarning };
    } else if (harMottattSvar && harTaskerTilOppfølging) {
        return { ikon: XMarkOctagonFillIcon, farge: AIconDanger };
    } else {
        return { ikon: InformationSquareFillIcon, farge: AIconInfo };
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

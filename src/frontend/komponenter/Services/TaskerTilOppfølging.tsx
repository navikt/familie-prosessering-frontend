import { Button, Popover } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { IAntallFeiletOgManuellOppfølging, IOppfølgingstask } from '../../typer/service';
import { AIconDanger, AIconSuccess, AIconWarning, AIconInfo } from '@navikt/ds-tokens/dist/tokens';
import {
    ExclamationmarkTriangleFillIcon,
    CheckmarkCircleFillIcon,
    XMarkOctagonFillIcon,
    InformationSquareFillIcon,
    BucketMopFillIcon,
} from '@navikt/aksel-icons';

export interface TaskerTilOppfølgingProps {
    taskerTilOppfølging: IOppfølgingstask;
    taskerFeiletOgManuellOppfølging: IAntallFeiletOgManuellOppfølging[] | undefined;
}

export const TaskerTilOppfølging: React.FC<TaskerTilOppfølgingProps> = ({
    taskerTilOppfølging,
    taskerFeiletOgManuellOppfølging,
}) => {
    const iconRef = useRef(null);
    const [åpen, settÅpen] = useState(false);
    const objektMedDataOmAntallTasksFeiletOgTilManuellOppfølging =
        taskerFeiletOgManuellOppfølging?.find(
            (task) => task.serviceId === taskerTilOppfølging.serviceId
        );

    const harFeiletTasks =
        objektMedDataOmAntallTasksFeiletOgTilManuellOppfølging?.harMottattSvar &&
        objektMedDataOmAntallTasksFeiletOgTilManuellOppfølging?.antallFeilet > 0;
    const harTasksTilManuellOppfølging =
        objektMedDataOmAntallTasksFeiletOgTilManuellOppfølging?.harMottattSvar &&
        objektMedDataOmAntallTasksFeiletOgTilManuellOppfølging?.antallManuellOppfølging > 0;

    const IkonType = utledIkonType(
        taskerTilOppfølging,
        harFeiletTasks,
        harTasksTilManuellOppfølging
    );

    return (
        <div className={'varsel-wrapper'}>
            <Button
                ref={iconRef}
                key={taskerTilOppfølging.serviceId}
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
                <Popover.Content>{utledTekst(taskerTilOppfølging)}</Popover.Content>
            </Popover>
        </div>
    );
};

const utledIkonType = (
    taskerTilOppfølging: IOppfølgingstask,
    harFeiletTasks?: boolean,
    harTasksTilManuellOppfølging?: boolean
) => {
    if (!taskerTilOppfølging.harMottattSvar) {
        return { ikon: ExclamationmarkTriangleFillIcon, farge: AIconWarning };
    } else if (
        taskerTilOppfølging.harMottattSvar &&
        taskerTilOppfølging.antallTilOppfølging === 0
    ) {
        return { ikon: CheckmarkCircleFillIcon, farge: AIconSuccess };
    } else if (
        taskerTilOppfølging.harMottattSvar &&
        !harFeiletTasks &&
        harTasksTilManuellOppfølging
    ) {
        return { ikon: BucketMopFillIcon, farge: AIconWarning };
    } else if (taskerTilOppfølging.harMottattSvar && taskerTilOppfølging.antallTilOppfølging > 0) {
        return { ikon: XMarkOctagonFillIcon, farge: AIconDanger };
    } else {
        return { ikon: InformationSquareFillIcon, farge: AIconInfo };
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

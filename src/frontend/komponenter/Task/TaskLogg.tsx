import { BodyShort, Label } from '@navikt/ds-react';
import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { hentTaskLogg } from '../../api/task';
import { ITaskLogg } from '../../typer/task';
import { useServiceContext } from '../ServiceContext';

const hentStackTrace = (melding?: string) => {
    if (!melding) {
        return 'Ingen melding';
    }

    try {
        const json = JSON.parse(melding);
        if (json.stackTrace) {
            return json.stackTrace;
        } else if (json.feilmelding) {
            return `${json.feilmelding} - Ingen stack trace`;
        } else {
            return 'Ingen stack trace';
        }
    } catch {
        return melding ? melding : undefined;
    }
};

const TaskLogg: React.FC<{ taskId: number; visLogg: boolean }> = ({ taskId, visLogg }) => {
    const { valgtService } = useServiceContext();
    const [taskLogg, settTaskLogg] = useState<Ressurs<ITaskLogg[]>>(byggTomRessurs());

    const hentLogg = () => {
        if (valgtService) {
            hentTaskLogg(valgtService, taskId).then((response: Ressurs<ITaskLogg[]>) => {
                settTaskLogg(response);
            });
        }
    };

    useEffect(() => {
        if (visLogg && taskLogg.status === RessursStatus.IKKE_HENTET) {
            hentLogg();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [taskId, visLogg]);

    if (taskLogg.status === RessursStatus.SUKSESS) {
        const elements = (taskLogg.data || []).map((logg: ITaskLogg, index: number) => {
            const stackTrace = hentStackTrace(logg.melding);

            return (
                <div key={index} className={'taskpanel__logg--item'}>
                    <div className={'taskpanel__logg--item-metadata'}>
                        <Label as="p">{logg.type}</Label>
                        <BodyShort size={'small'}>Endret av: {logg.endretAv}</BodyShort>
                        <BodyShort size={'small'}>
                            {moment(logg.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                        </BodyShort>
                        <BodyShort size={'small'}>{logg.node}</BodyShort>
                    </div>

                    {stackTrace && (
                        <pre className={'taskpanel__logg--item-melding'}>{stackTrace}</pre>
                    )}
                </div>
            );
        });
        return <>{elements}</>;
    } else if (
        taskLogg.status === RessursStatus.IKKE_TILGANG ||
        taskLogg.status === RessursStatus.FEILET ||
        taskLogg.status === RessursStatus.FUNKSJONELL_FEIL
    ) {
        return <div>{taskLogg.frontendFeilmelding}</div>;
    } else {
        return <></>;
    }
};

export default TaskLogg;

import * as React from 'react';
import { useEffect, useState } from 'react';
import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import { ITaskLogg } from '../../typer/task';
import { Element, Normaltekst } from 'nav-frontend-typografi';
import * as moment from 'moment';
import { useServiceContext } from '../ServiceContext';
import { hentTaskLogg } from '../../api/task';

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
    } catch (error) {
        return melding ? melding : undefined;
    }
};

const TaskLogg: React.FC<{ taskId: number; visLogg: boolean }> = ({ taskId, visLogg }) => {
    const { valgtService } = useServiceContext();
    const [taskLogg, settTaskLogg] = useState<Ressurs<ITaskLogg[]>>(byggTomRessurs());

    const hentLogg = () => {
        hentTaskLogg(valgtService, taskId).then((response: Ressurs<ITaskLogg[]>) => {
            settTaskLogg(response);
        });
    };

    useEffect(() => {
        if (visLogg && taskLogg.status === RessursStatus.IKKE_HENTET) {
            hentLogg();
        }
    }, [taskId, visLogg]);

    if (taskLogg.status === RessursStatus.SUKSESS) {
        let elements = (taskLogg.data || []).map((logg: ITaskLogg, index: number) => {
            const stackTrace = hentStackTrace(logg.melding);

            return (
                <div key={index} className={'taskpanel__logg--item'}>
                    <div className={'taskpanel__logg--item-metadata'}>
                        <Element children={logg.type} />
                        <Normaltekst children={`Endret av: ${logg.endretAv}`} />
                        <Normaltekst
                            children={moment(logg.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                        />
                        <Normaltekst children={logg.node} />
                    </div>

                    {stackTrace && (
                        <pre className={'taskpanel__logg--item-melding'} children={stackTrace} />
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

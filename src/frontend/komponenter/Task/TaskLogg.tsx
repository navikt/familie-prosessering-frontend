import { byggTomRessurs, Ressurs, RessursStatus } from '@navikt/familie-typer';
import * as moment from 'moment';
import React, { useEffect, useState } from 'react';
import { hentTaskLogg } from '../../api/task';
import { ITaskLogg, loggType } from '../../typer/task';
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

const taggKlasseFraType = (type: loggType): string => {
    switch (type) {
        case loggType.FEILET:
            return 'taskkort__loggtagg taskkort__loggtagg--feil';
        case loggType.FERDIG:
            return 'taskkort__loggtagg taskkort__loggtagg--ok';
        case loggType.MANUELL_OPPFØLGING:
            return 'taskkort__loggtagg taskkort__loggtagg--manuell';
        default:
            return 'taskkort__loggtagg taskkort__loggtagg--noytral';
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
        return (
            <>
                {(taskLogg.data || []).map((logg: ITaskLogg, index: number) => {
                    const stackTrace = hentStackTrace(logg.melding);
                    return (
                        <div key={index} className={'taskkort__loggrad'}>
                            <div className={'taskkort__loggmeta'}>
                                <span className={taggKlasseFraType(logg.type)}>{logg.type}</span>
                                <div className={'taskkort__loggmeta-rad'}>
                                    <strong>Endret av</strong> {logg.endretAv}
                                </div>
                                <div className={'taskkort__loggmeta-rad'}>
                                    {moment(logg.opprettetTidspunkt).format('DD.MM.YYYY HH:mm')}
                                </div>
                                <div className={'taskkort__loggmeta-rad taskkort__loggmeta-pod'}>
                                    <strong>Pod</strong>
                                    <br />
                                    {logg.node}
                                </div>
                            </div>
                            {stackTrace && <pre className={'taskkort__loggpre'}>{stackTrace}</pre>}
                        </div>
                    );
                })}
            </>
        );
    } else if (
        taskLogg.status === RessursStatus.IKKE_TILGANG ||
        taskLogg.status === RessursStatus.FEILET ||
        taskLogg.status === RessursStatus.FUNKSJONELL_FEIL
    ) {
        return <div className={'taskkort__loggfeil'}>{taskLogg.frontendFeilmelding}</div>;
    }
    return null;
};

export default TaskLogg;

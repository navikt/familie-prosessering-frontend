import { Alert } from '@navikt/ds-react';
import { RessursStatus } from '@navikt/familie-typer';
import classNames from 'classnames';
import * as moment from 'moment';
import React, { FC } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ITask, TaskStatus } from '../../typer/task';
import KopierKnapp from '../Felleskomponenter/KopierKnapp/KopierKnapp';
import Paginering from '../Felleskomponenter/Paginering/Paginering';
import TopBar from '../Felleskomponenter/TopBar/TopBar';
import TaskListe from '../Task/TaskListe';
import { useTaskContext } from '../TaskProvider';

interface GruppertTasker {
    [callId: string]: ITask[];
}

type Prikkvariant = 'feil' | 'ok' | 'manuell';

const beregnPrikkvariant = (tasker: ITask[]): Prikkvariant => {
    if (tasker.some((t) => t.status === TaskStatus.FEILET)) {
        return 'feil';
    }
    if (tasker.some((t) => t.status === TaskStatus.MANUELL_OPPFØLGING)) {
        return 'manuell';
    }
    return 'ok';
};

const relativTid = (tidspunkt: string | Date | undefined): string => {
    if (!tidspunkt) {
        return '';
    }
    const nå = moment();
    const tid = moment(tidspunkt);
    const dagerSiden = nå.startOf('day').diff(tid.clone().startOf('day'), 'days');

    if (dagerSiden <= 0) {
        return 'i dag';
    }
    if (dagerSiden === 1) {
        return 'i går';
    }
    if (dagerSiden < 7) {
        return `${dagerSiden} dager siden`;
    }
    if (dagerSiden < 31) {
        const uker = Math.floor(dagerSiden / 7);
        return uker === 1 ? '1 uke siden' : `${uker} uker siden`;
    }
    return tid.format('DD.MM.YYYY');
};

const formaterTidspunkt = (tidspunkt: string | Date | undefined): string =>
    tidspunkt ? moment(tidspunkt).format('DD.MM.YYYY HH:mm') : '';

const grupperTasks = (tasker: ITask[]): GruppertTasker =>
    tasker.reduce<GruppertTasker>((akkumulert, task) => {
        const callId = task.metadata.callId;
        const eksisterende = akkumulert[callId] ?? [];
        return {
            ...akkumulert,
            [callId]: [...eksisterende, task].sort((a, b) =>
                moment(b.sistKjørt).diff(moment(a.sistKjørt))
            ),
        };
    }, {});

const sorterGrupper = (gruppert: GruppertTasker): Array<[string, ITask[]]> =>
    Object.entries(gruppert).sort(([, a], [, b]) =>
        moment(b[0].sistKjørt).diff(moment(a[0].sistKjørt))
    );

const GruppertTasks: FC = () => {
    const { service } = useParams();
    const { tasks, statusFilter } = useTaskContext();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const valgtCallId = searchParams.get('callId') ?? '';

    if (tasks.status === RessursStatus.HENTER) {
        return <Alert variant={'info'}>Laster tasker</Alert>;
    }
    if (tasks.status === RessursStatus.IKKE_TILGANG) {
        return (
            <Alert variant={'warning'}>Ikke tilgang til tasker: {tasks.frontendFeilmelding}</Alert>
        );
    }
    if (tasks.status === RessursStatus.FEILET) {
        return (
            <Alert variant={'error'}>
                Innhenting av tasker feilet: {tasks.frontendFeilmelding}
            </Alert>
        );
    }
    if (tasks.status !== RessursStatus.SUKSESS) {
        return <div />;
    }

    const gruppert = grupperTasks(tasks.data.tasks);
    const sorterteGrupper = sorterGrupper(gruppert);
    const aktivGruppe = valgtCallId ? gruppert[valgtCallId] : undefined;

    const åpneGruppe = (callId: string) => {
        navigate(`/service/${service}/gruppert?statusFilter=${statusFilter}&callId=${callId}`);
    };

    return (
        <div className={'side'}>
            <TopBar />

            <div className={'gruppert'}>
                <aside className={'gruppert-side'} aria-label={'CallId-grupper'}>
                    <div className={'gruppert-side__header'}>
                        <span className={'gruppert-side__tittel'}>CallId-grupper</span>
                        <Paginering kompakt={true} />
                    </div>
                    <div className={'gruppert-side__liste'}>
                        {sorterteGrupper.length === 0 && (
                            <div className={'gruppert-side__tom'}>Ingen grupper å vise</div>
                        )}
                        {sorterteGrupper.map(([callId, tasker]) => {
                            const sistKjørtTask = tasker[0];
                            const prikk = beregnPrikkvariant(tasker);
                            const erAktiv = callId === valgtCallId;
                            return (
                                <button
                                    key={callId}
                                    type={'button'}
                                    className={classNames('gruppert-rad', erAktiv && 'aktiv')}
                                    onClick={() => åpneGruppe(callId)}
                                    title={callId}
                                >
                                    <div className={'gruppert-rad__topp'}>
                                        <span
                                            className={classNames(
                                                'gruppert-rad__prikk',
                                                `gruppert-rad__prikk--${prikk}`
                                            )}
                                        />
                                        <span className={'gruppert-rad__id'}>
                                            #{sistKjørtTask.id}
                                        </span>
                                        <span className={'gruppert-rad__naar'}>
                                            {relativTid(sistKjørtTask.sistKjørt)}
                                        </span>
                                    </div>
                                    <div className={'gruppert-rad__cid'}>{callId}</div>
                                    <div className={'gruppert-rad__antall'}>
                                        <span className={'gruppert-rad__antall-badge'}>
                                            {tasker.length}
                                        </span>
                                        {tasker.length === 1 ? 'kjøring' : 'kjøringer'} ·{' '}
                                        {formaterTidspunkt(sistKjørtTask.sistKjørt)}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </aside>

                <div className={'gruppert-hoved'}>
                    {aktivGruppe ? (
                        <>
                            <div className={'gruppe-header'}>
                                <div className={'gruppe-header__cid'}>
                                    <span className={'gruppe-header__label'}>CallId</span>
                                    <span className={'gruppe-header__verdi'}>
                                        <span>{valgtCallId}</span>
                                        <KopierKnapp verdi={valgtCallId} etikett={'callId'} />
                                    </span>
                                </div>
                                <div className={'gruppe-header__meta'}>
                                    <span>
                                        Kjøringer <strong>{aktivGruppe.length}</strong>
                                    </span>
                                    <span>
                                        Sist{' '}
                                        <strong>
                                            {formaterTidspunkt(aktivGruppe[0].sistKjørt)}
                                        </strong>
                                    </span>
                                </div>
                            </div>
                            <TaskListe
                                tasks={aktivGruppe}
                                visPaginering={false}
                                visListeHeader={false}
                                kompakt={true}
                            />
                        </>
                    ) : (
                        <div className={'gruppert-hoved__tom'}>
                            Velg en gruppe til venstre for å se kjøringene.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default GruppertTasks;

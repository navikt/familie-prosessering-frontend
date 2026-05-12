import { InternalHeader, Spacer } from '@navikt/ds-react';
import { ISaksbehandler, RessursStatus } from '@navikt/familie-typer';
import * as React from 'react';
import { Link, useMatch } from 'react-router-dom';
import { useServiceContext } from '../../ServiceContext';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
    onClick: () => void;
    tittel: string;
}

const Brodsmuler: React.FC = () => {
    const { services } = useServiceContext();
    const taskMatch = useMatch('/service/:service/task/:taskId');
    const callIdMatch = useMatch('/service/:service/tasker-med-call-id/:callId');
    const gruppertMatch = useMatch('/service/:service/gruppert');
    const serviceMatch = useMatch('/service/:service');

    const aktiv = taskMatch ?? callIdMatch ?? gruppertMatch ?? serviceMatch;
    if (!aktiv) {
        return null;
    }

    const serviceId = aktiv.params.service;
    const taskId = taskMatch?.params.taskId;
    const callId = callIdMatch?.params.callId;

    const valgtServiceNavn =
        services.status === RessursStatus.SUKSESS
            ? services.data.find((s) => s.id === serviceId)?.displayName
            : undefined;
    const serviceLabel = valgtServiceNavn ?? serviceId ?? '';

    return (
        <nav className={'brodsmuler'} aria-label={'Brødsmuler'}>
            <Link to={'/'} className={'brodsmuler__lenke'}>
                Oversikt
            </Link>
            <span className={'brodsmuler__skille'} aria-hidden="true">
                /
            </span>
            {taskId || callId ? (
                <>
                    <Link to={`/service/${serviceId}`} className={'brodsmuler__lenke'}>
                        {serviceLabel}
                    </Link>
                    <span className={'brodsmuler__skille'} aria-hidden="true">
                        /
                    </span>
                    <span className={'brodsmuler__naa'}>
                        {taskId ? `#${taskId}` : `callId: ${callId}`}
                    </span>
                </>
            ) : (
                <span className={'brodsmuler__naa'}>{serviceLabel}</span>
            )}
        </nav>
    );
};

const Dekoratør: React.FC<IProps> = ({ innloggetSaksbehandler, onClick, tittel }) => (
    <InternalHeader>
        <InternalHeader.Title as={Link} to="/">
            {tittel}
        </InternalHeader.Title>
        <Brodsmuler />
        <Spacer />
        {innloggetSaksbehandler && (
            <InternalHeader.User name={innloggetSaksbehandler.displayName} />
        )}
        <InternalHeader.Button onClick={onClick}>Logg ut</InternalHeader.Button>
    </InternalHeader>
);

export default Dekoratør;

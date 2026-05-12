import { InternalHeader, Spacer } from '@navikt/ds-react';
import { ISaksbehandler } from '@navikt/familie-typer';
import * as React from 'react';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
    onClick: () => void;
    tittel: string;
}

const Dekoratør: React.FC<IProps> = ({ innloggetSaksbehandler, onClick, tittel }) => (
    <InternalHeader>
        <InternalHeader.Title as="h1" href="/">
            {tittel}
        </InternalHeader.Title>
        <Spacer />
        {innloggetSaksbehandler && (
            <InternalHeader.User name={innloggetSaksbehandler.displayName} />
        )}
        <InternalHeader.Button onClick={onClick}>Logg ut</InternalHeader.Button>
    </InternalHeader>
);

export default Dekoratør;

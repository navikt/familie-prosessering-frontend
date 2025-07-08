import { Heading, Link } from '@navikt/ds-react';
import { ISaksbehandler } from '@navikt/familie-typer';
import * as React from 'react';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
    onClick: () => void;
    tittel: string;
}

const Dekoratør: React.FC<IProps> = ({ innloggetSaksbehandler, onClick, tittel }) => (
    <div className={'dekoratør'}>
        <Link href="/" className={'dekoratør__tittel'} underline={false}>
            <Heading size={'large'} className={'dekoratør__tittel--tekst'}>
                {tittel}
            </Heading>
            <div className={'dekoratør__skille'} />
        </Link>
        <div className={'dekoratør__innloggetsaksbehandler'}>
            {innloggetSaksbehandler && innloggetSaksbehandler.displayName}
            <div className={'dekoratør__skille'} />
            <Link className={'dekoratør__innloggetsaksbehandler--lenke'} onClick={onClick}>
                Logg ut
            </Link>
        </div>
    </div>
);

export default Dekoratør;

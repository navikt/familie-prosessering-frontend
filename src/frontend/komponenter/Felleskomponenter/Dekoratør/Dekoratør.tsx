import { Heading, Link } from '@navikt/ds-react';
import { ISaksbehandler } from '@navikt/familie-typer';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
    onClick: () => void;
    tittel: string;
}

const Dekoratør: React.FC<IProps> = ({ innloggetSaksbehandler, onClick, tittel }) => {
    const navigate = useNavigate();

    return (
        <div className={'dekoratør'}>
            <button onClick={() => navigate('/')} className={'dekoratør__tittel'}>
                <Heading size={'large'} className={'dekoratør__tittel--tekst'}>
                    {tittel}{' '}
                </Heading>
                <div className={'dekoratør__skille'} />
            </button>
            <div className={'dekoratør__innloggetsaksbehandler'}>
                {innloggetSaksbehandler && innloggetSaksbehandler.displayName}
                <div className={'dekoratør__skille'} />
                <Link className={'dekoratør__innloggetsaksbehandler--lenke'} onClick={onClick}>
                    Logg ut
                </Link>
            </div>
        </div>
    );
};

export default Dekoratør;

import * as classNames from 'classnames';
import { Innholdstittel } from 'nav-frontend-typografi';
import * as React from 'react';
import { useHistory } from 'react-router';
import { ISaksbehandler } from '@navikt/familie-typer';

interface IProps {
    innloggetSaksbehandler?: ISaksbehandler;
    onClick: () => void;
    tittel: string;
}

const Dekoratør: React.StatelessComponent<IProps> = ({
    innloggetSaksbehandler,
    onClick,
    tittel,
}) => {
    const history = useHistory();

    return (
        <div className={'dekoratør'}>
            <button onClick={() => history.push('/')} className={'dekoratør__tittel'}>
                <Innholdstittel className={'dekoratør__tittel--tekst'} children={tittel} />
                <div className={'dekoratør__skille'} />
            </button>
            <div className={'dekoratør__innloggetsaksbehandler'}>
                {innloggetSaksbehandler && innloggetSaksbehandler.displayName}
                <div className={'dekoratør__skille'} />
                <button
                    className={classNames('dekoratør__innloggetsaksbehandler--lenke')}
                    onClick={onClick}
                    children={'Logg ut'}
                />
            </div>
        </div>
    );
};

export default Dekoratør;

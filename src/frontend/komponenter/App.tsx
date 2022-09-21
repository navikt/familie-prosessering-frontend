import '@navikt/ds-css';
import { Modal } from '@navikt/ds-react';
import { ISaksbehandler } from '@navikt/familie-typer';
import * as React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { hentInnloggetBruker } from '../api/saksbehandler';
import Dekoratør from './Felleskomponenter/Dekoratør/Dekoratør';
import GruppertTasks from './GruppertTasks/GruppertTasks';
import { ServiceProvider } from './ServiceContext';
import Services from './Services/Services';
import Tasks from './Task/Tasks';
import { TaskProvider } from './TaskProvider';

if (Modal.setAppElement) {
    Modal.setAppElement(document.getElementById('modal-a11y-wrapper'));
}

const App: React.FunctionComponent = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = React.useState<ISaksbehandler>();

    React.useEffect(() => {
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    return (
        <BrowserRouter>
            <Dekoratør
                innloggetSaksbehandler={innloggetSaksbehandler}
                tittel={'Oppgavebehandling'}
                onClick={() => {
                    window.location.href = `${window.origin}/auth/logout`;
                }}
            />
            <div className={'container'}>
                <ServiceProvider>
                    <Routes>
                        <Route path={'/'} element={<Services />} />
                        <Route
                            path="service/:service"
                            element={
                                <TaskProvider>
                                    <Tasks />
                                </TaskProvider>
                            }
                        />
                        <Route
                            path="service/:service/gruppert"
                            element={
                                <TaskProvider>
                                    <GruppertTasks />
                                </TaskProvider>
                            }
                        />
                    </Routes>
                </ServiceProvider>
            </div>
        </BrowserRouter>
    );
};

export default App;

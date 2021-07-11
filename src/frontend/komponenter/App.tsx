import Modal from 'nav-frontend-modal';
import * as React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { hentInnloggetBruker } from '../api/saksbehandler';
import Dekoratør from './Felleskomponenter/Dekoratør/Dekoratør';
import { ServiceProvider } from './ServiceContext';
import Services from './Services/Services';
import Tasks from './Task/Tasks';
import { TaskProvider } from './TaskProvider';
import GruppertTasks from './GruppertTasks/GruppertTasks';
import { taskStatus } from '../typer/task';
import { ISaksbehandler } from '@navikt/familie-typer';

Modal.setAppElement(document.getElementById('modal-a11y-wrapper'));

const App: React.FunctionComponent = () => {
    const [innloggetSaksbehandler, settInnloggetSaksbehandler] = React.useState<ISaksbehandler>();

    React.useEffect(() => {
        hentInnloggetBruker().then((innhentetInnloggetSaksbehandler) => {
            settInnloggetSaksbehandler(innhentetInnloggetSaksbehandler);
        });
    }, []);

    return (
        <Router>
            <Dekoratør
                innloggetSaksbehandler={innloggetSaksbehandler}
                tittel={'Oppgavebehandling'}
                onClick={() => {
                    window.location.href = `${window.origin}/auth/logout`;
                }}
            />
            <div className={'container'}>
                <ServiceProvider>
                    <Switch>
                        <Route exact={true} path={'/'} component={Services} />
                        <Route
                            exact={true}
                            path="/service/:service"
                            render={({ match }) => {
                                return (
                                    <TaskProvider>
                                        <Tasks />
                                    </TaskProvider>
                                );
                            }}
                        />
                        <Route
                            exact={true}
                            path="/service/:service/gruppert"
                            render={({ match }) => {
                                return (
                                    <TaskProvider>
                                        <GruppertTasks />
                                    </TaskProvider>
                                );
                            }}
                        />
                    </Switch>
                </ServiceProvider>
            </div>
        </Router>
    );
};

export default App;

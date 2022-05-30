import * as React from 'react';
import { createRoot } from 'react-dom/client';
import { AppContainer } from 'react-hot-loader';
import App from './komponenter/App';

import './index.less';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);

const renderApp = (Component: React.ComponentType<{}>): void => {
    root.render(
        <AppContainer>
            <Component />
        </AppContainer>
    );
};

renderApp(App);

if (module.hot) {
    module.hot.accept('./komponenter/App', () => {
        const NewApp = require('./komponenter/App').default;
        renderApp(NewApp);
    });
}

import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './komponenter/App';
import { init } from '@nais/apm';
import '@navikt/ds-tokens';

import './index.less';

init(); // app name, version, environment and collector URL resolved from nais

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);

root.render(<App />);

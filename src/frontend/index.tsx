import * as React from 'react';
import { createRoot } from 'react-dom/client';
import App from './komponenter/App';
import '@navikt/ds-tokens';

import './index.less';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);

root.render(<App />);

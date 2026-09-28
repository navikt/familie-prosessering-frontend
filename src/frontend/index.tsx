import { createRoot } from 'react-dom/client';
import { initApm } from './apm';
import App from './komponenter/App';

import './index.less';

if (import.meta.env.MODE !== 'development') {
    initApm();
}

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);

root.render(<App />);

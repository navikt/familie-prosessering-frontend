import { createRoot } from 'react-dom/client';
import App from './komponenter/App';
import { initApm } from './apm';

import './index.less';

if (import.meta.env.MODE !== 'development') {
    initApm();
}

const rootElement = document.getElementById('app');
const root = createRoot(rootElement!);

root.render(<App />);

import { component, useState } from './core/component';
import { render } from './core/renderer';
const App = component(() => {
    const [getCount, setCount] = useState(0);
    setTimeout(() => setCount(getCount() + 1), 1000); // Incrementa el contador cada segundo
    return `<h1>Count: ${getCount()}</h1>`;
});
document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('app');
    if (container) {
        render(App, container);
    }
});

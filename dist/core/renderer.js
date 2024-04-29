// src/core/renderer.ts
import { watchEffect } from './reactivity';
export function render(component, container) {
    let lastRender = component();
    container.innerHTML = lastRender;
    // Observar los cambios en el componente y actualizar el DOM
    watchEffect(() => {
        const newRender = component();
        if (newRender !== lastRender) {
            lastRender = newRender;
            container.innerHTML = lastRender;
        }
    });
}

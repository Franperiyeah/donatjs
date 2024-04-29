// src/core/component.ts
import { reactive, watchEffect } from './reactivity';
let currentComponent = null;
function useState(initialValue) {
    const state = reactive({ value: initialValue });
    return [
        () => state.value,
        (newValue) => {
            state.value = newValue;
        }
    ];
}
function useEffect(effect, deps = []) {
    const effectWrapper = () => {
        cleanup();
        currentEffect = effect();
    };
    let currentEffect = null;
    const cleanup = () => {
        if (typeof currentEffect === 'function') {
            currentEffect();
        }
        currentEffect = null; // Asegurarse de limpiar después de ejecutar
    };
    watchEffect(effectWrapper);
}
function component(fn) {
    currentComponent = fn;
    const render = () => {
        cleanup();
        currentComponent = null;
        return fn();
    };
    let currentCleanup = null;
    const cleanup = () => {
        if (typeof currentCleanup === 'function') {
            currentCleanup();
        }
        currentCleanup = null; // Asegurarse de limpiar después de ejecutar
    };
    return render;
}
export { component, useState, useEffect };

// src/core/component.ts

import { reactive, watchEffect } from './reactivity';

let currentComponent: Function | null = null;

function useState<T>(initialValue: T): [() => T, (newValue: T) => void] {
    const state = reactive({ value: initialValue });
    
    return [
        () => state.value,
        (newValue: T) => {
            state.value = newValue;
        }
    ];
}

function useEffect(effect: () => (() => void) | void, deps: any[] = []) {
    const effectWrapper = () => {
        cleanup();
        currentEffect = effect();
    };
    
    let currentEffect: (() => void) | void | null = null;
    const cleanup = () => {
        if (typeof currentEffect === 'function') {
            currentEffect();
        }
        currentEffect = null; // Asegurarse de limpiar después de ejecutar
    };

    watchEffect(effectWrapper);
}

function component(fn: Function) {
    currentComponent = fn;
    const render = () => {
        cleanup();
        currentComponent = null;
        return fn();
    };

    let currentCleanup: (() => void) | null = null;
    const cleanup = () => {
        if (typeof currentCleanup === 'function') {
            currentCleanup();
        }
        currentCleanup = null; // Asegurarse de limpiar después de ejecutar
    };

    return render;
}

export { component, useState, useEffect };

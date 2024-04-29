// src/core/reactivity.ts
const activeEffects = new Set();
function watchEffect(effect) {
    activeEffects.add(effect);
    effect();
    activeEffects.delete(effect);
}
const targetMap = new WeakMap();
function track(target, key) {
    if (!activeEffects.size)
        return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    activeEffects.forEach(effect => dep.add(effect));
}
function trigger(target, key) {
    const depsMap = targetMap.get(target);
    if (!depsMap)
        return;
    const dep = depsMap.get(key);
    if (dep) {
        dep.forEach(effect => effect());
    }
}
function reactive(target) {
    return new Proxy(target, {
        get(target, key, receiver) {
            track(target, key);
            return Reflect.get(target, key, receiver);
        },
        set(target, key, value, receiver) {
            const oldValue = Reflect.get(target, key, receiver);
            const result = Reflect.set(target, key, value, receiver);
            if (oldValue !== value) {
                trigger(target, key);
            }
            return result;
        }
    });
}
export { reactive, watchEffect };

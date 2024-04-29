// src/core/reactivity.ts

type Effect = () => void;
const activeEffects: Set<Effect> = new Set();

function watchEffect(effect: Effect) {
    activeEffects.add(effect);
    effect();
    activeEffects.delete(effect);
}

interface DepsMap extends Map<string | symbol, Set<Effect>> {}
type TargetMap = WeakMap<object, DepsMap>;

const targetMap: TargetMap = new WeakMap();

function track(target: object, key: string | symbol) {
    if (!activeEffects.size) return;
    let depsMap = targetMap.get(target);
    if (!depsMap) {
        depsMap = new Map<string | symbol, Set<Effect>>();
        targetMap.set(target, depsMap);
    }
    let dep = depsMap.get(key);
    if (!dep) {
        dep = new Set();
        depsMap.set(key, dep);
    }
    activeEffects.forEach(effect => dep!.add(effect));
}

function trigger(target: object, key: string | symbol) {
    const depsMap = targetMap.get(target);
    if (!depsMap) return;
    const dep = depsMap.get(key);
    if (dep) {
        dep.forEach(effect => effect());
    }
}

function reactive<T extends object>(target: T): T {
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

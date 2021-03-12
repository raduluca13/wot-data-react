import { Type } from "typescript";

const loadState = (storageKey: string, stateType: ReturnType<any>) => {
    const storage = localStorage.getItem(storageKey)
    if (storage !== null) {
        return JSON.parse(storage) as typeof stateType;
    }
}

const saveState = (storageKey: string, state: ReturnType<any>) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(storageKey, serializedState);
    } catch {
        // ignore write errors
    }
};

export {
    saveState,
    loadState
}
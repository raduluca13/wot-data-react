export interface Change<T> {
    key: keyof T;
    initialValue: any;
    newValue: any;
}

export interface Changeable<T> {
    changes: Change<T>[]
}

const onlyUnique = (value: any, index: any, self: string | any[]) => {
    return self.indexOf(value) === index;
}

export enum ChangeType {
    APPLY,
    REVERT
}

export function applyChanges<T extends Changeable<T>>(element: T, changeType: ChangeType) {
    const updatedElement = { ...element };

    if (element.changes.length > 0) {
        const changes = element.changes;
        const teamKeys = changes.map(change => change.key).filter(onlyUnique);

        teamKeys.forEach((changedKey: keyof T) => {
            const keyChanges = changes.filter(change => change.key === changedKey)
            const [first, last] = [keyChanges[0], keyChanges[keyChanges.length - 1]]

            if (changeType === ChangeType.APPLY) {
                const currentValue = last.newValue;
                updatedElement[changedKey] = currentValue;
            }

            if (changeType === ChangeType.REVERT) {
                const initialValue = first.initialValue;
                updatedElement[changedKey] = initialValue
            }
        })

        updatedElement.changes = [];
    }

    return updatedElement;
}


// TODO - transform below to decorator or remove ALLLLLL below;

export function PropertyChanged() {
    return function (target: Object, propertyKey: string) {
        let _value: string;
        //the getter of the property to return the value.
        const getter = function () {
            return _value;
        };

        const setter = function (newVal: string) {
            _value = newVal;
        }

        Object.defineProperty(target, propertyKey, {
            get: getter,
            set: setter
        });
    }
}

export function createId() {
    return Math.random().toString(36).substr(2, 9);
}

export function id() {
    return (target: {} | any, name: PropertyKey): any => {
        const descriptor = {
            get(this: any) {
                const propertyName = `__${String(name)}`;

                if (!this[propertyName]) {
                    this[propertyName] = createId();
                }

                return this[propertyName];
            },
            // set(value: any) { },
            enumerable: true,
            configurable: true,
        };

        Object.defineProperty(target, name, descriptor);
    };
}


// function identity<T>(element: T): T {
//     return element;
// }
// export type ChangeApplier<T> = <T>(changedElement: T) => T;
// export const ChangeApplierrr: <T>(element: T) => T = identity
// unused helpers // TODO - move them
type KeysEnum<T> = { [P in keyof Required<T>]: true };


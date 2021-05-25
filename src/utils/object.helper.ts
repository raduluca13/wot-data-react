export abstract class Cloneable<T> {
    constructor(readonly value: T) { }

    abstract getName(): string;

    clone() {
        // Using polymorphic this ensures the return type is correct in derived  types
        const Cls = this.constructor as new (value: T) => this;
        return new Cls(this.value);
    }
}

// class Mine implements Cloneable<Number> {
//     getName(): string {
//         throw new Error("Method not implemented.");
//     }
// }
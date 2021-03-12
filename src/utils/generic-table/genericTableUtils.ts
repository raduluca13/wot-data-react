export type Order = 'asc' | 'desc';
export type NumberOrString = number | string

type ComparatorFn<T> = (a: T, b: T) => number
// type ComparatorReturnType<T extends keyof any> = (
//     a: { [key in T]: NumberOrString },
//     b: { [key in T]: NumberOrString }
// ) => number


const descendingComparator = <T>(first: T, second: T, orderBy: keyof T) => {
    if (second[orderBy] < first[orderBy]) {
        return -1;
    }
    if (second[orderBy] > first[orderBy]) {
        return 1;
    }
    return 0;
}


export const getComparator = <T>(order: Order, orderBy: keyof T): ComparatorFn<T> => {
    if (order === 'desc') {
        return (a, b) => descendingComparator(a, b, orderBy)
    }

    return (a, b) => -descendingComparator(a, b, orderBy);
}


export const stableSort = function <T>(array: T[], comparator: ComparatorFn<T>) {
    console.log({ array })
    const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);

    stabilizedThis.sort((a, b) => {
        const order = comparator(a[0], b[0]);
        if (order !== 0) {
            return order
        };

        return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
}


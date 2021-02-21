import { createSlice, PayloadAction } from '@reduxjs/toolkit'

export enum VisibilityFilters {
    SHOW_ALL = 'SHOW_ALL',
    ATTACK = 'DEFENCE',
    DEFENCE = 'DEFENCE'
}

interface VisibilityFilterState {
    filterState: VisibilityFilters;
}

const initialState: VisibilityFilterState = {
    filterState: VisibilityFilters.SHOW_ALL
}

const filtersSlice = createSlice({
    name: 'visibilityFilters',
    initialState: initialState,
    reducers: {
        setVisibilityFilter(state, action: PayloadAction<VisibilityFilters>) {
            state.filterState = action.payload;
        }
    }
})

export const { setVisibilityFilter } = filtersSlice.actions
// export const selectVisibilityFilter = (state: RootState) => state.visibilityFilterState.filterState;

export type VisibilityFilterStateReducerReturnType = ReturnType<typeof filtersSlice.reducer>;
export const selectFilterState = (state: VisibilityFilterStateReducerReturnType) => state.filterState;

export default filtersSlice.reducer

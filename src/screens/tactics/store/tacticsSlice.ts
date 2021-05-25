
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseId, FetchStatus, RootState } from '../../../slices';
import CONFIG from '../../../api/config';
import { MapBaseNumber } from '../../../store/types/enums/MapBaseNumber.enum';
import { TacticType } from '../../../store/types/enums/TacticType.enum';
import { PlayerTacticRole, Tactic, TacticMetadata } from '../../../store/types/interfaces/TacticMetadata.interface';
import { WoTMap } from '../../../store/types/interfaces/WoTMap.interface';
import { buildParamStr, redirectTo } from '../../../utils/url/urlUtils';
import { applyChanges, Change, ChangeType } from '../../../store/decorators/PropertyChanged';
import { MapMarker, MarkerType } from '../../../slices/mapInteractionSlice';

const MAP_API = 'https://api.worldoftanks.ru/wot/encyclopedia/arenas/'
const MAP_IMAGES_API = "https://stratsketch.com/maps/wot/thumb/"

export const DEFAULT_NEW_TACTIC_ID = '0';
export const TACTICS_STATE_STORAGE_KEY = 'tacticsState';
export const TACTICS_PAGE = '/tactics'; // TODO - extract

interface TacticsState {
    tactics: Tactic[];
    selectedTacticId: string;

    mapFetchError: any,
    mapFetchStatus: FetchStatus,
    maps: WoTMap[];

    selectedMap: WoTMap;
}

const loadState = () => {
    const storage = localStorage.getItem(TACTICS_STATE_STORAGE_KEY)
    if (storage !== null) {
        return JSON.parse(storage) as TacticsState;
    }
}

const saveTacticsState = (state: TacticsState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(TACTICS_STATE_STORAGE_KEY, serializedState);
    } catch {
        // ignore write errors
    }
};

export const createDefaultTacticMetadata = () => {
    return {
        tacticReference: '',
        mapName: '',
        tacticType: TacticType.NONE,
        baseNumber: MapBaseNumber.NONE
    } as TacticMetadata
}
export const createDefaultTactic = () => {
    return {
        id: DEFAULT_NEW_TACTIC_ID,
        metadata: createDefaultTacticMetadata(),
        playerTacticRoles: [],
        activeTool: {
            cursorTool: true
        },
        positionList: [],
        cursorPosition: { x: 0, y: 0, markerType: MarkerType.MEDIUM_TANK } as MapMarker,
        changes: []
    } as Tactic
}
const createDefaultTacticsState = () => {
    return {
        tactics: [createDefaultTactic()] as Tactic[],
        selectedTacticId: DEFAULT_NEW_TACTIC_ID,
        mapFetchStatus: 'idle',
        mapFetchError: null,
        maps: [] as WoTMap[],
        selectedMap: null as any as WoTMap
    } as TacticsState;
}
const initialState: TacticsState = loadState() || createDefaultTacticsState();


export type ChangeTacticReferenceAction = {
    tacticReference: string;
}
export type ChangeTacticMapName = {
    mapName: string;
}
export type ChangeTacticBaseNumber = {
    baseNumber: MapBaseNumber;
}

const buildMapsQueryUrl: (url: string, params: any) => string = (url, params: any) => {
    const queryParamStr = buildParamStr(params);
    return `${url}?application_id=${CONFIG.APPLICATION_ID}&${queryParamStr}`;
}
const url = buildMapsQueryUrl(MAP_API, { language: "en" })

export const createMapImageUrl = (mapName: string) => `${MAP_IMAGES_API}${mapName}.jpg`
export const fetchMapsThunk = createAsyncThunk('maps/fetchMaps', async () => {
    const response: Response = await fetch(url);
    const json = await response.json();
    return json.data;
})


// TODO - remove any maps api logic from here (separate slice)
export const tacticsSlice = createSlice({
    name: 'tactics',
    initialState,
    reducers: {
        saveTactic: (state, action: PayloadAction<Tactic>) => {
            const updatedTactic = action.payload;
            const tacticsNumber = state.tactics.length;
            const defaultTacticIndex = state.tactics.findIndex(tactic => tactic.id === DEFAULT_NEW_TACTIC_ID)

            if (updatedTactic.id === DEFAULT_NEW_TACTIC_ID) {
                // ADD tactic
                const newTacticWithId: Tactic = { ...updatedTactic, id: `${tacticsNumber}`, changes: [] }
                state.tactics.push(newTacticWithId);
                state.tactics[defaultTacticIndex] = createDefaultTactic();
            } else {
                // UPDATE tactic
                const teamIndex = state.tactics.findIndex(tactic => tactic.id === updatedTactic.id);
                if (teamIndex !== -1) {
                    const changesAppliedTactic = applyChanges<Tactic>(updatedTactic, ChangeType.APPLY);
                    state.tactics[teamIndex] = changesAppliedTactic;
                } else {
                    state.tactics.push({ ...updatedTactic, changes: [] });
                    state.tactics[defaultTacticIndex] = createDefaultTactic();
                }
            }
            state.selectedTacticId = DEFAULT_NEW_TACTIC_ID;
            saveTacticsState(state);
            // redirectTo(TACTICS_PAGE)
        },
        removeTactic: (state, action: PayloadAction<BaseId>) => {
            const deletableTacticId = action.payload.id;
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === deletableTacticId)
            if (tacticIndex !== -1) {
                state.tactics.splice(tacticIndex, 1);
                if (deletableTacticId === state.selectedTacticId) {
                    state.selectedTacticId = DEFAULT_NEW_TACTIC_ID;
                }
            }
            saveTacticsState(state);
        },
        cancelTacticChanges: (state, action: PayloadAction<Tactic>) => {
            const tactic = action.payload;
            if (tactic.id === DEFAULT_NEW_TACTIC_ID) {
                redirectTo(TACTICS_PAGE);
            }

            const updatedTactic = applyChanges(tactic, ChangeType.REVERT);

            const defaultTacticIndex = state.tactics.findIndex(tactic => tactic.id === DEFAULT_NEW_TACTIC_ID);
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === updatedTactic.id);
            if (tacticIndex !== -1) {
                state.tactics[tacticIndex] = { ...updatedTactic };
            } else {
                state.tactics.push({ ...updatedTactic, changes: [] });
                state.tactics[defaultTacticIndex] = createDefaultTactic();
            }
            state.selectedTacticId = DEFAULT_NEW_TACTIC_ID;
            saveTacticsState(state);
            redirectTo(TACTICS_PAGE);
        },
        // moveCursor: (state, action: PayloadAction<Point>) => {
        //     const point = action.payload;
        //     // console.log({ point }, state.selectedTacticId)
        //     const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId)
        //     if (tacticIndex !== -1) {
        //         state.tactics[tacticIndex].cursorPosition = point;
        //     }
        // },
        // addTacticPosition: (state, action: PayloadAction<Point>) => {
        //     const point = action.payload;
        //     // console.log({ point })
        //     const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId)
        //     if (tacticIndex !== -1) {
        //         const tactic = state.tactics[tacticIndex];
        //         const updatedPositionList = [...tactic.positionList]
        //         updatedPositionList.push(point);
        //         if (updatedPositionList.length > 100) {
        //             updatedPositionList.splice(0, 1)
        //         }
        //         tactic.positionList = [...updatedPositionList]
        //     }
        // },
        // saveTacticPositions: (state, action: PayloadAction<Point[]>) => {
        //     const positionList = action.payload;
        //     const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId)
        //     if (tacticIndex !== -1) {
        //         state.tactics[tacticIndex].positionList = [...positionList]
        //     }
        // },
        clearTacticPositions: (state) => {
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId)
            if (tacticIndex !== -1) {
                state.tactics[tacticIndex].positionList = []
            }
        },
        changeSelectedTactic: (state, action: PayloadAction<BaseId>) => {
            state.selectedTacticId = action.payload.id;
            saveTacticsState(state); // TODO - why ?
        },
        saveTacticMetadata: (state: TacticsState, action: PayloadAction<TacticMetadata>) => {
            const selectedTactic = state.tactics[state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId)]
            selectedTactic.metadata = { ...action.payload }
            // todo .. apply partial changes only ?? or better delete this as it doesnt bring too much value, section is small and doesnt need partial save
            saveTacticsState(state);
        },
        changeTacticReference: (state: TacticsState, action: PayloadAction<ChangeTacticReferenceAction>) => {
            const tacticReference = action.payload.tacticReference;
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId);
            const isTacticInList = tacticIndex !== -1;

            if (!isTacticInList) {
                throw new Error();
            }

            const updatedTactic = { ...state.tactics[tacticIndex] };
            const metadataBefore = { ...updatedTactic.metadata }
            updatedTactic.metadata.tacticReference = tacticReference
            const metadataAfter = { ...updatedTactic.metadata }

            state.tactics[tacticIndex] = { ...updatedTactic };
            state.tactics[tacticIndex].changes.push({
                key: 'metadata',
                initialValue: metadataBefore,
                newValue: metadataAfter
            } as Change<Tactic>)
        },
        changeTacticMapName: (state: TacticsState, action: PayloadAction<ChangeTacticMapName>) => {
            const payload = action.payload;
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId);
            const isTacticInList = tacticIndex !== -1;
            if (isTacticInList) {
                const map = state.maps.find(map => map.name_i18n === payload.mapName);
                state.selectedMap = { ...map } as WoTMap;

                const updatedTactic = { ...state.tactics[tacticIndex] };
                updatedTactic.metadata.mapName = payload.mapName
                state.tactics[tacticIndex] = { ...updatedTactic };
            }
        },
        changeTacticBaseNumber: (state: TacticsState, action: PayloadAction<ChangeTacticBaseNumber>) => {
            const payload = action.payload;
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId);
            const isTacticInList = tacticIndex !== -1;
            if (isTacticInList) {
                const updatedTactic = { ...state.tactics[tacticIndex] };
                const beforeMetadata = { ...updatedTactic.metadata }
                updatedTactic.metadata.baseNumber = payload.baseNumber
                const afterMetadata = { ...updatedTactic.metadata }
                state.tactics[tacticIndex] = { ...updatedTactic };
                state.tactics[tacticIndex].changes.push({
                    key: 'metadata',
                    initialValue: beforeMetadata,
                    newValue: afterMetadata
                } as Change<Tactic>)
            }
        },
        changeTacticType: (state: TacticsState, action: PayloadAction<any>) => {
        },
        addTacticRole: (state: TacticsState, action: PayloadAction<PlayerTacticRole>) => {
            const tacticRole = action.payload;
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId);
            const tactic = state.tactics[tacticIndex];
            const tacticRoles = tactic.playerTacticRoles;
            const existingRoleIndex = tacticRoles.findIndex(role => role.playerId === tacticRole.playerId)
            const beforeTacticRoles = [...tactic.playerTacticRoles]
            if (existingRoleIndex !== -1) {
                tacticRoles[existingRoleIndex].tankId = tacticRole.tankId
            } else {
                tacticRoles.push({ ...tacticRole, index: tacticRoles.length })
            }
            const afterTacticRoles = [...tactic.playerTacticRoles]
            tactic.changes.push({
                key: 'playerTacticRoles',
                initialValue: beforeTacticRoles,
                newValue: afterTacticRoles
            } as Change<Tactic>)
        },
        removeTacticRole: (state: TacticsState, action: PayloadAction<PlayerTacticRole>) => {
            const tacticRole = action.payload;
            const tacticIndex = state.tactics.findIndex(tactic => tactic.id === state.selectedTacticId);
            const tactic = state.tactics[tacticIndex];
            const tacticRoles = tactic.playerTacticRoles;
            const existingRoleIndex = tacticRoles.findIndex(role => role.playerId === tacticRole.playerId)
            const beforeTacticRoles = [...tactic.playerTacticRoles]
            if (existingRoleIndex !== -1) {
                tacticRoles.splice(existingRoleIndex, 1);
            }
            const afterTacticRoles = [...tactic.playerTacticRoles]
            tactic.changes.push({
                key: 'playerTacticRoles',
                initialValue: beforeTacticRoles,
                newValue: afterTacticRoles
            } as Change<Tactic>)
        },
        changeTacticRoleIndex: (state: TacticsState, action: PayloadAction<{ previousIndex: number, currentIndex: number }>) => {
        }
    },
    extraReducers: {
        ['maps/fetchMaps/pending']: (state: TacticsState, action) => {
            state.mapFetchStatus = 'loading'
        },
        ['maps/fetchMaps/rejected']: (state: TacticsState, action) => {
            state.mapFetchStatus = 'failed'
            state.mapFetchError = action.error.message
        },
        ['maps/fetchMaps/fulfilled']: (state: TacticsState, action) => {
            state.mapFetchStatus = 'succeeded'
            const payload = action.payload;
            Object.keys(payload).forEach(key => state.maps.push(payload[key]));
        }
    }
});

export const {
    saveTactic,
    removeTactic,
    cancelTacticChanges,
    // moveCursor,
    // addTacticPosition,
    // saveTacticPositions,
    clearTacticPositions,
    changeTacticRoleIndex,
    changeSelectedTactic,
    saveTacticMetadata,
    changeTacticReference,
    changeTacticMapName,
    changeTacticBaseNumber,
    changeTacticType,
    addTacticRole,
    removeTacticRole
} = tacticsSlice.actions;

export const tacticsStateSelector = (state: RootState) => state.tacticsState;
export const selectedTacticIdSelector = (state: RootState) => state.tacticsState.selectedTacticId as string;
export const allTacticsSelector = (state: RootState) => state.tacticsState.tactics as Tactic[];

export const allMapsSelector = (state: RootState) => state.tacticsState.maps as WoTMap[];
export const selectedMapSelector = (state: RootState) => state.tacticsState.selectedMap as WoTMap;
export const mapFetchDetailsSelector = createSelector(
    [tacticsStateSelector, allMapsSelector],
    (tacticsState, allMaps) => {
        return {
            mapFetchStatus: tacticsState.mapFetchStatus,
            mapFetchError: tacticsState.mapFetchError,
            maps: allMaps
        }
    }
)

export const selectedTacticSelector = createSelector(
    [selectedTacticIdSelector, tacticsStateSelector],
    (selectedTacticId, tacticsState) => {
        return tacticsState.tactics.find(tactic => tactic.id === selectedTacticId) ?? createDefaultTactic()
    }
)
export const selectedTacticMetadataSelector = createSelector(
    [selectedTacticSelector],
    (selectedTactic) => {
        return selectedTactic ? selectedTactic.metadata : createDefaultTactic().metadata
    }
)
export const tacticRolesSelector = createSelector(
    [selectedTacticSelector],
    (selectedTactic) => {
        return selectedTactic ? selectedTactic.playerTacticRoles : [] as PlayerTacticRole[]
    }
)

export const activeToolSelector = createSelector([selectedTacticSelector], (selectedTactic) => { return selectedTactic.activeTool })
export const positionListSelector = createSelector([selectedTacticSelector], (selectedTactic) => { return selectedTactic.positionList })

export default tacticsSlice.reducer;

// export type TacticsStateReducerReturnType = ReturnType<typeof tacticsSlice.reducer>;
// export const selectTactics = (state: TacticsStateReducerReturnType) => state.tactics;

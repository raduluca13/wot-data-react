import { combineReducers } from 'redux'
import counterReducer from './counterSlice'
import tacticsReducer from '../screens/tactics/store/tacticsSlice'
import visibilityFilterReducer from './filterSlice'
import teamReducer from './teamSlice'
import clanReducer from './clanSlice'
import tournamentReducer from './tournamentSlice'
import mapInteractionReducer from './mapInteractionSlice'
import mapsApiReducer from './mapsApiSlice'
import globalMapReducer from './globalMapSlice'

const rootReducer = combineReducers({
  counterState: counterReducer,
  tacticsState: tacticsReducer,
  visibilityFilterState: visibilityFilterReducer,
  teamState: teamReducer,
  clanState: clanReducer,
  tournamentState: tournamentReducer,
  mapInteractionState: mapInteractionReducer,
  mapsApiState: mapsApiReducer,
  globalMapState: globalMapReducer
})

export type BaseId = {
  id: string;
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
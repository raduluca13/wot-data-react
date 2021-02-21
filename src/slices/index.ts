import { combineReducers } from 'redux'
import counterReducer from './counterSlice'
import tacticsReducer from '../screens/tactics/store/tacticsSlice'
import visibilityFilterReducer from './filterSlice'
import teamReducer from './teamSlice'
import clanReducer from './clanSlice'
import tournamentReducer from './tournamentSlice'
import roomReducer from './roomSlice'
import mapInteractionReducer from './mapInteractionSlice'

const rootReducer = combineReducers({
  counterState: counterReducer,
  tacticsState: tacticsReducer,
  visibilityFilterState: visibilityFilterReducer,
  teamState: teamReducer,
  clanState: clanReducer,
  tournamentState: tournamentReducer,
  roomState: roomReducer,
  mapInteractionState: mapInteractionReducer
})

export type BaseId = {
  id: string;
}

export type FetchStatus = 'idle' | 'loading' | 'succeeded' | 'failed';
export type RootState = ReturnType<typeof rootReducer>
export default rootReducer
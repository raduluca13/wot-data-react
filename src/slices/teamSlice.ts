import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '.';
import { User } from '../screens/vehicles/types';
import { applyChanges, Change, Changeable, ChangeType } from '../store/decorators/PropertyChanged';
import { redirectTo } from '../utils/url/urlUtils';

export const DEFAULT_NEW_TEAM_ID = '0';
export const DEFAULT_NEW_TEAM_NAME = '';
export const TEAM_STATE_STORAGE_KEY = 'teamState';
export const TEAMS_PAGE = '/teams'; // TODO - extract

interface TeamState {
    teams: Team[],
    selectedTeamId?: string;
}

export interface Team extends Changeable<Team> {
    teamId: string,
    teamName: string,
    players: User[];
}

export const createDefaultTeam = () => {
    return {
        teamId: DEFAULT_NEW_TEAM_ID,
        teamName: DEFAULT_NEW_TEAM_NAME,
        players: [],
        changes: [],
    }
}
const createDefaultTeamState = () => {
    return {
        teams: [createDefaultTeam()],
        selectedTeamId: DEFAULT_NEW_TEAM_ID
    };
}

export const createDefaultUser = () => {
    return {
        role: "",
        role_i18n: "",
        joined_at: 0,
        account_id: "",
        account_name: "",
    } as User
}

export type SelectedTeamIdAction = {
    teamId: string;
}
export type ChangeTeamNameAction = SelectedTeamIdAction & {
    teamName: string;
}
export type UserType = { user: User }
export type UserAction = UserType & SelectedTeamIdAction
export type AddPlayerToTeamAction = UserAction
export type RemovePlayerFromTeamAction = UserAction

const loadState = () => {
    const storage = localStorage.getItem(TEAM_STATE_STORAGE_KEY)
    if (storage !== null) {
        return JSON.parse(storage) as TeamState;
    }
}

export const saveTeamState = (state: TeamState) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem(TEAM_STATE_STORAGE_KEY, serializedState);
    } catch {
        // ignore write errors
    }
};

export function getProperty<T, K extends keyof T>(obj: T, key: K) {
    return obj[key]; // Inferred type is T[K]
}

const initialState: TeamState = loadState() || createDefaultTeamState();

export const teamSlice = createSlice({
    name: 'team',
    initialState,
    reducers: {
        saveTeam: (state: TeamState, action: PayloadAction<Team>) => {
            const updatedTeam = action.payload;
            const teamsNumber = state.teams.length;
            const defaultTeamIndex = state.teams.findIndex(team => team.teamId === DEFAULT_NEW_TEAM_ID);

            if (updatedTeam.teamId === DEFAULT_NEW_TEAM_ID) {
                // ADD team
                const newTeamWithId: Team = { ...updatedTeam, teamId: teamsNumber.toString() }
                state.teams.push(newTeamWithId);
                state.teams[defaultTeamIndex] = createDefaultTeam();
            } else {
                // UPDATE team
                const teamIndex = state.teams.findIndex(team => team.teamId === updatedTeam.teamId);
                if (teamIndex !== -1) {
                    const changesAppliedTeam = applyChanges<Team>(updatedTeam, ChangeType.APPLY)
                    state.teams[teamIndex] = changesAppliedTeam;
                } else {
                    state.teams.push({ ...updatedTeam, changes: [] });
                    state.teams[defaultTeamIndex] = createDefaultTeam();
                }
            }
            state.selectedTeamId = DEFAULT_NEW_TEAM_ID;
            saveTeamState(state);
            redirectTo(TEAMS_PAGE)
        },
        deleteTeam: (state: TeamState, action: PayloadAction<SelectedTeamIdAction>) => {
            const deletableTeamId = action.payload.teamId;
            const teamIndex = state.teams.findIndex(team => team.teamId === deletableTeamId);
            if (teamIndex !== -1) {
                state.teams.splice(teamIndex, 1);
                if (deletableTeamId === state.selectedTeamId) {
                    state.selectedTeamId = DEFAULT_NEW_TEAM_ID;
                }
            }
            saveTeamState(state);
        },
        addPlayer: (state: TeamState, action: PayloadAction<AddPlayerToTeamAction>) => {
            const teamId = action.payload.teamId;
            const newPlayer = action.payload.user;

            const selectedTeamIndex = state.teams.findIndex(team => team.teamId === teamId);
            if (selectedTeamIndex !== -1) {
                const selectedTeam = state.teams[selectedTeamIndex];
                const playerIndex = selectedTeam.players.findIndex(player => player.account_id === newPlayer.account_id);

                if (playerIndex === -1) {
                    const initial = [...selectedTeam.players]
                    selectedTeam.players.push(newPlayer)
                    const final = [...selectedTeam.players]
                    if (teamId !== DEFAULT_NEW_TEAM_ID) {
                        selectedTeam.changes.push({
                            key: 'players',
                            initialValue: initial,
                            newValue: final
                        } as Change<Team>)
                    }
                }
            }
        },
        removePlayer: (state: TeamState, action: PayloadAction<RemovePlayerFromTeamAction>) => {
            const teamId = action.payload.teamId;
            const newPlayer = action.payload.user;

            const selectedTeamIndex = state.teams.findIndex(team => team.teamId === teamId);
            if (selectedTeamIndex !== -1) {
                const selectedTeam = state.teams[selectedTeamIndex];
                const playerIndex = selectedTeam.players.findIndex(player => player.account_id === newPlayer.account_id);

                if (playerIndex !== -1) {
                    const initial = [...selectedTeam.players];
                    selectedTeam.players.splice(playerIndex, 1);
                    const final = [...selectedTeam.players];
                    if (teamId !== DEFAULT_NEW_TEAM_ID) {
                        selectedTeam.changes.push({
                            key: 'players',
                            initialValue: initial,
                            newValue: final
                        } as Change<Team>)
                    }
                }
            }

        },

        changeTeamName(state: TeamState, action: PayloadAction<ChangeTeamNameAction>) {
            const teamId = action.payload.teamId;
            const newTeamName = action.payload.teamName;

            const selectedTeamIndex = state.teams.findIndex(team => team.teamId === teamId);
            if (selectedTeamIndex !== -1) {
                const selectedTeam = state.teams[selectedTeamIndex];
                const initial = new String(selectedTeam.teamName).toString();
                selectedTeam.teamName = newTeamName;
                const final = new String(selectedTeam.teamName).toString();
                if (teamId !== DEFAULT_NEW_TEAM_ID) {
                    selectedTeam.changes.push({
                        key: 'teamName',
                        initialValue: initial,
                        newValue: final
                    } as Change<Team>)
                }
            }
        },
        cancelTeamChanges: (state: TeamState, action: PayloadAction<Team>) => {
            // TODO - is this really needed? if you go to /teams or other page which will GET the old state in case of cancel
            const team = action.payload;
            if (team.teamId === DEFAULT_NEW_TEAM_ID) {
                redirectTo(TEAMS_PAGE);
            }

            const updatedTeam = applyChanges(team, ChangeType.REVERT);

            const defaultTeamIndex = state.teams.findIndex(team => team.teamId === DEFAULT_NEW_TEAM_ID);
            const teamIndex = state.teams.findIndex(team => team.teamId === updatedTeam.teamId);
            if (teamIndex !== -1) {
                state.teams[teamIndex] = { ...updatedTeam };
            } else {
                state.teams.push({ ...updatedTeam, changes: [] });
                state.teams[defaultTeamIndex] = createDefaultTeam();
            }
            state.selectedTeamId = DEFAULT_NEW_TEAM_ID;
            saveTeamState(state);
            redirectTo(TEAMS_PAGE)
        },
        changeSelectedTeam: (state: TeamState, action: PayloadAction<string>) => {
            const newSelectedTeamId = action.payload;
            const teamIndex = state.teams.findIndex(team => team.teamId === newSelectedTeamId)
            if (teamIndex !== -1) {
                state.selectedTeamId = newSelectedTeamId;
                const defaultTeamIndex = state.teams.findIndex(team => team.teamId === DEFAULT_NEW_TEAM_ID);
                state.teams[defaultTeamIndex] = createDefaultTeam()
            }
            saveTeamState(state);
        },

    }
});

// EXPORT ACTIONS
export const { addPlayer, removePlayer, deleteTeam, changeTeamName, cancelTeamChanges, changeSelectedTeam, saveTeam } = teamSlice.actions;

// EXPORT SELECTORS - TODO replace duplicate selections across features
export const selectedTeamIdSelector = (state: RootState) => {
    return state.teamState.selectedTeamId ?? DEFAULT_NEW_TEAM_ID
}
export const selectedTeamSelector = (state: RootState) => {
    return state.teamState.teams.find(team => team.teamId === state.teamState.selectedTeamId) ?? createDefaultTeam();
}

export const teamsSelector = (state: RootState) => {
    return state.teamState.teams ?? [] as Team[];
}

// EXPORT REDUCER
export default teamSlice.reducer;


import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BaseId, RootState } from '.';

export interface Tournament {
    id: string;
    description: string;
    numberOfPlayers: number; // number of players/teams depending on format
    battleFormat: string; // replace with a type
    totalPrize: number;
}

interface TournamentState {
    tournamentList: Tournament[];
}

type ChangeTournamentDescriptionAction = BaseId &
{
    description: string
};

type ChangeTournamentBattleFormatAction = BaseId &
{
    battleFormat: string;
};
type ChangeTournamentTotalPrizeAction = BaseId &
{
    totalPrize: number;
};
type ChangeTournamentNumberOfPlayersAction = BaseId &
{
    numberOfPlayers: number;
};

const initialState: TournamentState = {
    tournamentList: [
        {
            id: '0',
            description: "example-description",
            numberOfPlayers: 5,
            totalPrize: 500,
            battleFormat: "1v1"
        } as Tournament
    ],
}

// state for all:
// type CurrentDisplayState = {
//     page: number
//   } & CurrentDisplay & CurrentRepo

export const createDefaultTournament = (id: number) => {
    return {
        id: `${id}`,
        numberOfPlayers: 0,
        totalPrize: 0,
        battleFormat: '',
        description: ''
    } as Tournament
}

export const tournamentSlice = createSlice({
    name: 'tournamentSlice',
    initialState,
    reducers: {
        addTournament: (state: TournamentState, action: PayloadAction<Tournament>) => {
            const playerIndex = state.tournamentList.findIndex(tournament => tournament === action.payload);
            const isPlayerInTeam = playerIndex !== -1
            if (!isPlayerInTeam) {
                state.tournamentList.push(action.payload);

            }
        },
        removeTournament: (state: TournamentState, action: PayloadAction<Tournament>) => {
            const tournamentIndex = state.tournamentList.findIndex(tournament => tournament === action.payload);
            const isTournamentInList = tournamentIndex !== -1
            if (isTournamentInList) {
                state.tournamentList.splice(tournamentIndex, 1);
            }
        },
        deleteTournaments: (state: TournamentState) => {
            state.tournamentList = [];
        },
        changeTournamentDescription: (state: TournamentState, payload: PayloadAction<ChangeTournamentDescriptionAction>) => {
            const load = payload.payload;
            const tournamentIndex = state.tournamentList.findIndex(tournament => tournament.id === load.id);
            const isTournamentInList = tournamentIndex !== -1;
            if (isTournamentInList) {
                const updatedTournament = {
                    ...state.tournamentList[tournamentIndex],
                    description: load.description
                }
                state.tournamentList[tournamentIndex] = updatedTournament;
            }
        },
        changeTournamentBattleFormat: (state: TournamentState, payload: PayloadAction<ChangeTournamentBattleFormatAction>) => {
            const load = payload.payload;
            const tournamentIndex = state.tournamentList.findIndex(tournament => tournament.id === load.id);
            const isTournamentInList = tournamentIndex !== -1;
            if (isTournamentInList) {
                const updatedTournament = {
                    ...state.tournamentList[tournamentIndex],
                    battleFormat: load.battleFormat
                }
                state.tournamentList[tournamentIndex] = updatedTournament;
            }
        },
        changeTournamentTotalPrize: (state: TournamentState, payload: PayloadAction<ChangeTournamentTotalPrizeAction>) => {
            const load = payload.payload;
            const tournamentIndex = state.tournamentList.findIndex(tournament => tournament.id === load.id);
            const isTournamentInList = tournamentIndex !== -1;
            if (isTournamentInList) {
                const updatedTournament = {
                    ...state.tournamentList[tournamentIndex],
                    totalPrize: load.totalPrize
                }
                state.tournamentList[tournamentIndex] = updatedTournament;
            }
        },
        changeTournamentNumberOfPlayers: (state: TournamentState, payload: PayloadAction<ChangeTournamentNumberOfPlayersAction>) => {
            const load = payload.payload;
            const tournamentIndex = state.tournamentList.findIndex(tournament => tournament.id === load.id);
            const isTournamentInList = tournamentIndex !== -1;
            if (isTournamentInList) {
                const updatedTournament = {
                    ...state.tournamentList[tournamentIndex],
                    numberOfPlayers: load.numberOfPlayers
                }
                state.tournamentList[tournamentIndex] = updatedTournament;
            }
        }
    }
});

export const {
    addTournament,
    removeTournament,
    deleteTournaments,
    changeTournamentBattleFormat,
    changeTournamentDescription,
    changeTournamentNumberOfPlayers,
    changeTournamentTotalPrize
} = tournamentSlice.actions;
export const selectTournaments = (state: RootState) => state.tournamentState.tournamentList;
export default tournamentSlice.reducer;

// export const selectPlayers = (state: TeamStateReducerReturnType) => state.players;
// export type TeamStateReducerReturnType = ReturnType<typeof teamSlice.reducer>;

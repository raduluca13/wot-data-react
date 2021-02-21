import { Button } from '@material-ui/core';
import React, { useCallback, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
    addTournament,
    changeTournamentBattleFormat,
    changeTournamentDescription,
    changeTournamentNumberOfPlayers,
    changeTournamentTotalPrize,
    createDefaultTournament,
} from '../../slices/tournamentSlice';
import AddIcon from "@material-ui/icons/Add";
import { RootState } from '../../slices';
import { useHistory } from 'react-router-dom';


// TODO
const EditTournament = () => {
    const dispatch = useDispatch()
    const { tournamentState, tournamentListLength } = useSelector(
        (state: RootState) => {
            return {
                tournamentState: state.tournamentState,
                tournamentListLength: state.tournamentState.tournamentList.length
            }
        }
    )
    const defaultTournament = createDefaultTournament(tournamentState.tournamentList.length)
    const [tournament, setTournament] = useState(defaultTournament);
    const history = useHistory();

    const onPlayersNumberChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const intValue = +event.currentTarget.value;
        const value = isNaN(intValue) ? 0 : intValue;
        const updatedTournament = { ...tournament, numberOfPlayers: isNaN(value) ? 0 : value }
        setTournament(updatedTournament)
        dispatch(
            changeTournamentNumberOfPlayers({ id: tournament.id, numberOfPlayers: value })
        )
    }

    const onTotalPrizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const intValue = +event.currentTarget.value;
        const value = isNaN(intValue) ? 0 : intValue;
        const updatedTournament = { ...tournament, totalPrize: value }
        setTournament(updatedTournament);
        dispatch(
            changeTournamentTotalPrize({ id: tournament.id, totalPrize: value })
        )
    }

    const onDescriptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const updatedTournament = { ...tournament, description: value }
        setTournament(updatedTournament);
        dispatch(
            changeTournamentDescription({ id: tournament.id, description: value })
        )
    }

    const onBattleFormatChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const value = event.currentTarget.value;
        const updatedTournament = { ...tournament, battleFormat: value }
        setTournament(updatedTournament);
        dispatch(
            changeTournamentBattleFormat({ id: tournament.id, battleFormat: value })
        )
    }

    // EventEmitter.subscribe(
    //     Events.DESCRIPTION_CHANGED,
    //     (event: React.ChangeEvent<HTMLInputElement>) => {
    //         const value = event.currentTarget.value;
    //         const updatedTournament = { ...tournament, description: value }
    //         setTournament(updatedTournament);
    //         dispatch(
    //             changeTournamentDescription({ id: tournament.id, description: value })
    //         )
    //     }
    // )
    // EventEmitter.subscribe(
    //     Events.BATTLE_FORMAT_CHANGED,
    //     (event: React.ChangeEvent<HTMLInputElement>) => {
    //         const value = event.currentTarget.value;
    //         const updatedTournament = { ...tournament, battleFormat: value }
    //         setTournament(updatedTournament);
    //         dispatch(
    //             changeTournamentBattleFormat({ id: tournament.id, battleFormat: value })
    //         )
    //     }
    // )
    // EventEmitter.subscribe(
    //     Events.TOTAL_PRIZE_CHANGED,
    //     (event: React.ChangeEvent<HTMLInputElement>) => {
    //         const intValue = +event.currentTarget.value;
    //         const value = isNaN(intValue) ? 0 : intValue;
    //         const updatedTournament = { ...tournament, totalPrize: value }
    //         setTournament(updatedTournament);
    //         dispatch(
    //             changeTournamentTotalPrize({ id: tournament.id, totalPrize: value })
    //         )
    //     }
    // )
    // EventEmitter.subscribe(
    //     Events.NUMBER_OF_PLAYERS_CHANGED,
    //     (event: React.ChangeEvent<HTMLInputElement>) => {
    //         const intValue = +event.currentTarget.value;
    //         const value = isNaN(intValue) ? 0 : intValue;
    //         const updatedTournament = { ...tournament, numberOfPlayers: isNaN(value) ? 0 : value }
    //         setTournament(updatedTournament)
    //         dispatch(
    //             changeTournamentNumberOfPlayers({ id: tournament.id, numberOfPlayers: value })
    //         )
    //     }
    // )

    const isFormValid: () => boolean = () => {
        return Boolean(tournament.battleFormat) &&
            Boolean(tournament.description) &&
            tournament.numberOfPlayers > 0 &&
            tournament.totalPrize > 0;
    }

    return (
        <div>
            <Button variant="outlined" color="primary" onClick={
                useCallback(() => history.push('/tournaments'), [history])
            }>
                Go to Tournament List
            </Button>
            <form onSubmit={ev => {
                ev.preventDefault();
            }}
            >
                <input
                    style={{ width: 450 }}
                    type="text"
                    placeholder="description"
                    value={tournament.description}
                    onChange={(event) => onDescriptionChange(event)}
                />
                <input
                    style={{ width: 450 }}
                    type="text"
                    placeholder="Enter new item"
                    value={tournament.battleFormat}
                    onChange={(event) => onBattleFormatChange(event)}
                />
                <input
                    style={{ width: 450 }}
                    type="text"
                    placeholder="Enter new item"
                    value={tournament.totalPrize}
                    onChange={(event) => onTotalPrizeChange(event)}
                />
                <input
                    style={{ width: 450 }}
                    type="text"
                    placeholder="Enter new item"
                    value={tournament.numberOfPlayers}
                    onChange={(event) => onPlayersNumberChange(event)
                        // EventEmitter.dispatch(Events.NUMBER_OF_PLAYERS_CHANGED, event)
                    }
                />
                <Button
                    variant="outlined"
                    color="primary"
                    onClick={(event) => {
                        try {
                            dispatch(addTournament(tournament))
                            // setTournament(createDefaultTournament())
                            history.push('/tournaments');
                        } catch (e) {
                            console.error(e)
                        }
                    }}
                    disabled={!isFormValid()}
                >
                    <AddIcon />
                </Button>
            </form>
        </div>
    )
}


export default EditTournament;

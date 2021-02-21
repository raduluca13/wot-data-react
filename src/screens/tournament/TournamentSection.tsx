import { Button } from '@material-ui/core';
import * as React from 'react';
import { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { Redirect, useHistory } from 'react-router-dom';
import TournamentList from './TournamentList';


export default () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const handleOnClick = useCallback(() => history.push('/add-tournament'), [history]);
    // const handleOnClick = () => history.push('/sample');
    return (
        <section>
            <Button variant="outlined" color="primary" onClick={handleOnClick}>
                {/* <Redirect to={{
                    pathname: '/history',
                    state: { id: '123' }
                }} />*/}
                Add tournaments
            </Button>
            <TournamentList />
        </section >
    )
};

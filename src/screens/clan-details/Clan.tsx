import { createStyles, makeStyles, Theme } from '@material-ui/core';
import React, { memo, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clanDetailsFetchSelector, fetchClanDetailsThunk } from '../../slices/clanSlice';
import { User } from '../vehicles/types';
import ClanMember from './ClanMember';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        content: {
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "space-around"
        }
    })
);

const Clan = () => {
    const dispatch = useDispatch();
    const classes = useStyles();
    const { clanDetails, clanDetailsFetchErrors, clanDetailsFetchStatus } = useSelector(clanDetailsFetchSelector);
    const clanMembers: User[] = clanDetails.members;

    useEffect(() => {
        if (clanDetailsFetchStatus === 'idle') {
            dispatch(fetchClanDetailsThunk())
        }
    }, [dispatch, clanDetailsFetchStatus])

    const renderClanMembers = () => {
        switch (clanDetailsFetchStatus) {
            case "idle":
                return <div></div>;
            case "loading":
                return <p>Loading clan members ...</p>;
            case "succeeded":
                return clanMembers.map(clanMember => <ClanMember key={clanMember.account_id} {...clanMember} />);
            case "failed":
                console.error({ clanDetailsFetchErrors })
                return <p>Could not connect server to get info</p>
        }
    }

    return (
        <section>
            <h1>Clan Details</h1>
            <div className={classes.content}>
                {renderClanMembers()}
            </div>
        </section>
    )
}

export default memo(Clan);
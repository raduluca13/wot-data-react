import {
    makeStyles,
    Theme,
    createStyles,
    Card,
    CardContent,
    Typography
} from '@material-ui/core';
import React, { useCallback } from 'react';
import { User } from '../vehicles/types';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        card: {
            maxWidth: "max-content",
            margin: "8px"
        }
    })
);

const ClanMember = (user: User) => {
    const classes = useStyles();
    // const userDetailsCallback = useCallback((userId: string) => history.push(`/users/${userId}`), [history]);
    const onClickUserDetails = useCallback((event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    }, [])

    return (
        <Card className={classes.card} onClick={onClickUserDetails}>
            <CardContent>
                <Typography variant="body2" color="textSecondary" component="p">
                    id: {user.account_id}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    name: {user.account_name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    role: {user.role}
                </Typography>
            </CardContent>
        </Card>
    )
}

export default ClanMember;
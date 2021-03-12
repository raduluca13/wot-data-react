import React, { useCallback } from "react"
import { Card, CardActionArea, CardContent, Typography, CardActions, Button, createStyles, makeStyles, Theme } from "@material-ui/core";
import VisibilityIcon from "@material-ui/icons/Visibility";
import { Province } from "../../slices/globalMapSlice";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        provincesContainer: {
            margin: theme.spacing(1),
            display: "flex",
            flexDirection: "column"
        },
        card: {
            marginBottom: "0.5rem"
        }
    }),
);


const ProvinceComponent = (province: Province) => {
    const classes = useStyles()
    
    const onViewClick = useCallback((event) => {

    }, [])

    return <Card className={classes.card}>
        <CardActionArea>
            {/* <CardMedia
            className={classes.media}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="Contemplative Reptile"
        /> */}
            <CardContent>
                <Typography gutterBottom variant="h5" component="h2">
                    Map: {province.arena_name}
                </Typography>
                <Typography gutterBottom variant="h5" component="h2">
                    Province Name: {province.province_name}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Prime Time: {province.prime_time}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Owner: {province.owner_clan_id}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Attackers: {province.attackers?.length}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Competitors: {province.competitors?.length}
                </Typography>
                <Typography variant="body2" color="textSecondary" component="p">
                    Daily income: {province.daily_revenue}
                </Typography>
            </CardContent>
        </CardActionArea>
        <CardActions>
            <Button size="small" variant="outlined" color="primary" onClick={onViewClick}>
                <VisibilityIcon />
            </Button>
        </CardActions>
    </Card>
}

export default ProvinceComponent;
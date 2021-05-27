import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React, { useEffect } from 'react';
// import logo from './logo.svg';
import './App.css';
import Teams from './screens/team/components/Teams';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Clan from './screens/clan-details/Clan';
import TournamentSection from './screens/tournament/TournamentSection';
import AddTournament from './screens/tournament/AddTournament';
import TeamForm from './screens/team/TeamForm';
import AddTactic from './screens/tactics/components/AddTactic';
import Tactics from './screens/tactics/components/Tactics';
import InteractiveMap from './screens/tactics/components/interactive-map/InteractiveMap';
import Provinces from './screens/provinces/Provinces';
import PlayerVechicleStatistics from './screens/clan-details/PlayerVehicleStatistics';
import { useDispatch, useSelector } from 'react-redux';
import { authenticationFetchSelector, buildLoginUrl, loginThunk } from './slices/authenticationSlice';
import Login from './components/Login';
import Menu from './components/Menu';
import Profile from './screens/profile/Profile';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: '1px solid black',
      // marginTop: '10%',
      // marginLeft: '10%',
      // marginRight: '10%',
      // minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "stretch",
      justifyContent: "space-around"
    }
  })
);

const App = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { userLoggedIn, authenticationFetchStatus, authenticationFetchErrors } = useSelector(authenticationFetchSelector);

  // DEFAULT LOGIN WHEN ENTERING APP
  // useEffect(() => {
  //   const currentAccessToken = userLoggedIn.access_token

  //   if (authenticationFetchStatus === "succeeded" && !currentAccessToken) {
  //     const redirection = buildLoginUrl()
  //     window.location.href = redirection
  //   }

  //   if (authenticationFetchStatus === 'idle' && !currentAccessToken) {
  //     dispatch(loginThunk())
  //   }
  // }, [authenticationFetchStatus, userLoggedIn])

  return (
    <div className={classes.root}>
      <BrowserRouter>
        <Menu />
        <Switch>
          <Route path="/clan-details">
            <Clan />
          </Route>
          <Route exact path="/tactics">
            <Tactics />
          </Route>
          <Route path={`/tactics/:tacticId`}>
            <AddTactic />
          </Route>
          <Route exact path="/teams">
            <Teams />
          </Route>
          <Route path={`/teams/:teamId`}>
            <TeamForm />
          </Route>
          <Route path="/add-tournament">
            <AddTournament />
          </Route>
          <Route path="/tournaments">
            <TournamentSection />
          </Route>
          <Route path="/map">
            <InteractiveMap />
          </Route>
          <Route path="/globalMap">
            <Provinces />
          </Route>
          <Route path="/profile">
            <Profile />
          </Route>
          <Route path="/tank-statistics/:playerId">
            <PlayerVechicleStatistics />
          </Route>
          <Route path="/login-redirect">
            <Login />
          </Route>
          {/* TODO - latest results dashboards time scaled */}
          {/* TODO - tasks screen */}
          {/* TODO - wildcard path */}
        </Switch>
      </BrowserRouter>
    </div >
  );
}

export default App;

// reference for clean redux file structure
// https://codesandbox.io/s/github/piotrwitek/typesafe-actions/tree/master/codesandbox?file=/src/store/root-reducer.ts


// PUSHER:
//  NAME: wot-tactics
//  CLUSTER:  eu (ireland)
// 
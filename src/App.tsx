import { makeStyles, Theme, createStyles } from '@material-ui/core';
import React from 'react';
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

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      border: '1px solid black',
      marginTop: '10%',
      marginLeft: '10%',
      marginRight: '10%',
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

  return (
    <div className={classes.root}>
      {/* <h1>Application</h1>
        <Button variant="outlined" color="primary" onClick={login}>
          LOGIN
        </Button> */}
      <BrowserRouter>
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
            <Provinces/>
          </Route>

          {/* TODO - latest results dashboards time scaled */}
          {/* TODO - tasks screen */}
          {/* TODO - wildcard path */}
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;

// reference for clean redux file structure
// https://codesandbox.io/s/github/piotrwitek/typesafe-actions/tree/master/codesandbox?file=/src/store/root-reducer.ts


// PUSHER:
//  NAME: wot-tactics
//  CLUSTER:  eu (ireland)
// 
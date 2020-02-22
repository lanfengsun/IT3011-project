import React, { useState, useEffect } from 'react';
import './App.css';
import { Grid, Button, CircularProgress } from '@material-ui/core';
import TeamEditor from './TeamEditor';
import Result from './Result';
import APIClient from './api';

const MIN_TEAM_SIZE = 5;
const OPPO_MAX_TEAM_SIZE = 5;
const MY_MAX_TEAM_SIZE = 12;

function App() {
  const [players, setPlayers] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [clickCalculate, setClickCalculate] = useState(false);
  const [opponent, setOpponent] = useState([]);
  const [team, setTeam] = useState([]);
  const [result, setResult] = useState([]);
  const apiClient = new APIClient();

  useEffect(() => {
    const apiClient = new APIClient();
    async function fetPlayers() {
      try {
        const data = await apiClient.getPlayers(1000);
        setPlayers(new Map(data.map(p => [p.id, p])));
      } catch (err) {
        console.log(err);
      }
    }
    fetPlayers();
  }, [])

  const addOpponent = player => {
    if (!opponent.includes(player) && !team.includes(player)) {
      setOpponent([...opponent, player]);
    }
  };

  const addMyTeam = player => {
    if (!opponent.includes(player) && !team.includes(player)) {
      setTeam([...team, player]);
    }
  };

  const onClickCalculate = async () => {
    setResult([]);
    setLoading(true);
    setClickCalculate(true);

    try {
      const data = await apiClient.calculate(opponent, team);
      setResult(data);
    } catch (err) {
      console.log(err);
    }
    setLoading(false);
  };

  return (
    <div className="App" >
      <Grid container>
        <Grid item xs={6}>
          <TeamEditor
            title="My opponent"
            allPlayers={players}
            teamSize={OPPO_MAX_TEAM_SIZE}
            onAddPlayer={addOpponent}
            team={opponent} />
        </Grid>
        <Grid item xs={6}>
          <TeamEditor
            title="My team"
            allPlayers={players}
            teamSize={MY_MAX_TEAM_SIZE}
            onAddPlayer={addMyTeam}
            team={team} />
        </Grid>
      </Grid>
      <Button
        variant="contained"
        color="primary"
        disabled={opponent.length < MIN_TEAM_SIZE || team.length < MIN_TEAM_SIZE}
        onClick={onClickCalculate}
      >
        Calculate
      </Button>
      {clickCalculate && loading && <CircularProgress />}
      {result.length > 0 && <Result result={result} />}
    </div>
  );
}

export default App;

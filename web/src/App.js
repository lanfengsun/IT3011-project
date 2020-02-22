import React, { useState, useEffect } from 'react';
import './App.css';
import { Grid, Button, TextField } from '@material-ui/core';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import CircularProgress from '@material-ui/core/CircularProgress';
import Title from './Title';
import TeamEditor from './TeamEditor';
import APIClient from './api';


function App() {
  const [players, setPlayers] = useState(new Map());
  const [loading, setLoading] = useState(true);
  const [opponent, setOpponent] = useState([]);
  const [team, setTeam] = useState([]);

  useEffect(() => {
    const apiClient = new APIClient();
    async function fetPlayers() {
      try {
        const data = await apiClient.getPlayers(1000);
        setPlayers(new Map(data.map(p => [p.id, p])));
        setLoading(false);
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

  return (
    <div className="App" >
      <Grid container>
        <Grid item xs={6}>
          <TeamEditor
            title="Your opponent"
            allPlayers={players}
            teamSize={5}
            onAddPlayer={addOpponent}
            team={opponent} />
        </Grid>
        <Grid item xs={6}>
          <TeamEditor
            title="Your team"
            allPlayers={players}
            teamSize={12}
            onAddPlayer={addMyTeam}
            team={team} />
        </Grid>
      </Grid>
      <Button variant="contained" color="primary" disabled={opponent.length < 5 || team.length < 5}>Calculate</Button>

      {/* {loading ? <CircularProgress /> :
        <div className="table">
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Player ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Points/min</TableCell>
                <TableCell>Rebounds/min</TableCell>
                <TableCell>Assists/min</TableCell>
                <TableCell>Minutes played</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {players.map(player => (
                <TableRow key={player.id}>
                  <TableCell>{player.id}</TableCell>
                  <TableCell>{player.name}</TableCell>
                  <TableCell>{player.points}</TableCell>
                  <TableCell>{player.rebounds}</TableCell>
                  <TableCell>{player.assists}</TableCell>
                  <TableCell>{player.min_played}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      } */}
    </div>
  );
}

export default App;

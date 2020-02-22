import React, { useState } from 'react';
import { Container, InputLabel, FormControl, List, ListItem, ListItemText, NativeSelect, FormHelperText } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import Title from './Title';

const useStyles = makeStyles({
    root: {
        // backgroundColor: 'red',
    },
    input: {
        minWidth: "250px"
    },
    listItem: {
        textAlign: "center"
    }
});

export default function TeamEditor(props) {
    const { title, allPlayers, team, teamSize, onAddPlayer } = props;

    const classes = useStyles(props);
    const [selected, setSelected] = useState("");

    const disabled = (team.length >= teamSize);

    const handleChange = event => {
        const player = event.target.value;
        setSelected(player);
        onAddPlayer(parseInt(player));
    };

    return (
        <Container className={classes.root}>
            <Title>{title}</Title>
            <FormControl>
                <InputLabel htmlFor={`name-${title.toLowerCase()}`}>Name</InputLabel>
                <NativeSelect
                    value={selected}
                    disabled={disabled}
                    onChange={handleChange}
                    inputProps={{
                        name: 'Name',
                        id: `name-${title.toLowerCase()}`,
                    }}
                >
                    <option value="" />>
                    {Array.from(allPlayers).map(([_, player]) => (
                        <option key={player.id} value={player.id}>
                            {player.name}
                        </option>
                    ))}
                </NativeSelect>
                <FormHelperText>
                    {disabled ? "Your team is full" : `Select the names of ${title.toLowerCase()}`}
                </FormHelperText>
            </FormControl>
            <List dense>
                {props.team.map(player_id => (
                    <ListItem key={player_id} alignItems="center" className={classes.listItem}>
                        <ListItemText primary={allPlayers.get(player_id).name} />
                    </ListItem>
                ))}
            </List>
        </Container>
    );
}

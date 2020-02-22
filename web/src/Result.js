import React from 'react';
import { Table, TableHead, TableBody, TableRow, TableCell } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const GAME_LENGTH = 48

const formatPercentage = x => {
    return parseFloat(100 * x).toFixed(2) + "%"
}

const formatNumber = x => {
    return x.toFixed(2)
}

const useStyles = makeStyles({
    root: {
    }
});

export default function Result(props) {
    const { result } = props;
    const classes = useStyles(props);
    return (
        <Table className={classes.root}>
            <TableHead>
                <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Points</TableCell>
                    <TableCell>Rebounds)</TableCell>
                    <TableCell>Assists</TableCell>
                    <TableCell>Blocks</TableCell>
                    <TableCell>Steals</TableCell>
                    <TableCell>FG %</TableCell>
                    <TableCell>FG3 %</TableCell>
                    <TableCell>FT %</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {result.map(player => (
                    <TableRow key={player.id}>
                        <TableCell>{player.name}</TableCell>
                        <TableCell>{formatNumber(player.points * GAME_LENGTH)}</TableCell>
                        <TableCell>{formatNumber(player.rebounds * GAME_LENGTH)}</TableCell>
                        <TableCell>{formatNumber(player.assists * GAME_LENGTH)}</TableCell>
                        <TableCell>{formatNumber(player.blocks * GAME_LENGTH)}</TableCell>
                        <TableCell>{formatNumber(player.steals * GAME_LENGTH)}</TableCell>
                        <TableCell>{formatPercentage(player.fg_pct)}</TableCell>
                        <TableCell>{formatPercentage(player.fg3_pct)}</TableCell>
                        <TableCell>{formatPercentage(player.ft_pct)}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    )
}

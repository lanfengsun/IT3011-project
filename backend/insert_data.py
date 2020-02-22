#!/usr/bin/python
import psycopg2
from config import config
from csv import DictReader


SEASON_SINCE = 2016
TABLE_NAME = 'nba_players'


def parse_min(minute):
    m, s = minute.split(":")
    return 60 * int(m) + int(s)


def init_table(conn):
    cur = conn.cursor()
    print('Createing %s table if not exist...' % TABLE_NAME)
    cur.execute(
        """
        CREATE TABLE IF NOT EXISTS %s (
            id INT PRIMARY KEY,
            name VARCHAR(32) NOT NULL,
            points FLOAT,
            rebounds FLOAT,
            assists FLOAT,
            steals FLOAT,
            blocks FLOAT,
            turnovers FLOAT,
            fg_pct FLOAT,
            fg3_pct FLOAT,
            ft_pct FLOAT,
            plus_minus FLOAT,
            min_played FLOAT
        )
        """ % TABLE_NAME
    )
    conn.commit()

    if conn.notices:
        for notice in conn.notices:
            print(notice)
    else:
        print('Creating table finished.')
    cur.close()


def get_players_count(conn):
    cur = conn.cursor()
    cur.execute(
        """
        SELECT COUNT(1) FROM %s
        """ % TABLE_NAME
    )
    count = cur.fetchone()[0]
    cur.close()
    return count


def insert_players(conn):
    cur = conn.cursor()
    print('Calculating players stats...')
    players = get_players()
    print('Inserting into %s table...' % TABLE_NAME)

    for _, p in players.items():
        tot_mins = p.tot_sec / 60
        cur.execute(
            """
            INSERT INTO %s
            (id, name, points, rebounds, assists, steals, blocks, turnovers, fg_pct, fg3_pct, ft_pct, plus_minus, min_played) VALUES
            (%s, '%s', %f, %f, %f, %f, %f, %f, %f, %f, %f, %f, %f)
            """ % (
                TABLE_NAME,
                p.id,
                p.name.replace("'", ''),
                p.tot_points / tot_mins,
                p.tot_rebounds / tot_mins,
                p.tot_assists / tot_mins,
                p.tot_steals / tot_mins,
                p.tot_blocks / tot_mins,
                p.tot_turnovers / tot_mins,
                p.tot_fgm / p.tot_fga if p.tot_fga else 0,
                p.tot_fg3m / p.tot_fg3a if p.tot_fg3a else 0,
                p.tot_ftm / p.tot_fta if p.tot_fta else 0,
                p.tot_plus_minus / tot_mins,
                tot_mins
            )
        )

    conn.commit()
    cur.close()
    print('Done.')


class Player:
    def __init__(self, id, name):
        self.id = id
        self.name = name
        self.tot_sec = 0
        self.tot_points = 0
        self.tot_rebounds = 0
        self.tot_assists = 0
        self.tot_steals = 0
        self.tot_blocks = 0
        self.tot_turnovers = 0
        self.tot_fga = 0
        self.tot_fgm = 0
        self.tot_fg3a = 0
        self.tot_fg3m = 0
        self.tot_fta = 0
        self.tot_ftm = 0
        self.tot_plus_minus = 0


def get_games():
    games = {}
    with open("../dataset/games.csv") as csv_file:
        csv_reader = DictReader(csv_file)
        for row in csv_reader:
            games[row['GAME_ID']] = int(row['SEASON'])
    return games


def get_players():
    players = {}
    games = get_games()
    with open("../dataset/games_details.csv") as csv_file:
        csv_reader = DictReader(csv_file)
        for row in csv_reader:
            if games[row['GAME_ID']] < SEASON_SINCE:
                continue
            if not row['MIN']:
                continue

            if row['PLAYER_ID'] not in players:
                players[row['PLAYER_ID']] = Player(
                    row['PLAYER_ID'], row['PLAYER_NAME'])

            player = players[row['PLAYER_ID']]
            try:
                player.tot_sec += parse_min(row['MIN'])
            except:
                print(row)
                raise
            player.tot_points += int(float(row['PTS']))
            player.tot_rebounds += int(float(row['REB']))
            player.tot_assists += int(float(row['AST']))
            player.tot_steals += int(float(row['STL']))
            player.tot_blocks += int(float(row['BLK']))
            player.tot_turnovers += int(float(row['TO']))
            player.tot_fga += int(float(row['FGA']))
            player.tot_fgm += int(float(row['FGM']))
            player.tot_fg3a += int(float(row['FG3A']))
            player.tot_fg3m += int(float(row['FG3M']))
            player.tot_fta += int(float(row['FTA']))
            player.tot_ftm += int(float(row['FTM']))
            player.tot_plus_minus += int(float(row['PLUS_MINUS']))

    return players


def main(conn):
    init_table(conn)
    players_count = get_players_count(conn)
    if players_count:
        print("%s already have %d entries, skip inserting." %
              (TABLE_NAME, players_count))
    else:
        insert_players(conn)


if __name__ == '__main__':
    conn = None
    try:
        params = config()
        print('Connecting to the PostgreSQL database...')
        conn = psycopg2.connect(**params)
        main(conn)
    except (Exception, psycopg2.DatabaseError) as error:
        print("[ERROR]: ", error)
    finally:
        if conn is not None:
            conn.close()
            print('Database connection closed.')

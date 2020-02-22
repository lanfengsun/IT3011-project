import os
import psycopg2
from psycopg2.extras import RealDictCursor
from flask import Flask, jsonify, request
from flask_cors import CORS, cross_origin

from config import config


app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'
db_params = config()


@app.route('/')
def hello_world():
    return "Hello world"


def run_query(query):
    with psycopg2.connect(**db_params) as conn:
        with conn.cursor(cursor_factory=RealDictCursor) as cursor:
            cursor.execute(query)
            res = cursor.fetchall()
    return jsonify(res)


@app.route('/player/id/<player_id>')
@cross_origin()
def get_player_by_id(player_id):
    query = """
            SELECT * FROM nba_players
            WHERE id = '%s'
            """ % player_id
    return run_query(query)


@app.route('/player/name/<name>')
def get_player_by_name(name):
    query = """
            SELECT * FROM nba_players
            WHERE name = '%s'
            """ % name
    return run_query(query)


@app.route('/players')
@cross_origin()
def get_players():
    limit = int(request.args.get('limit', 10))
    order_by = request.args.get('sort', 'name')
    query = """
            SELECT * FROM nba_players
            ORDER BY %s
            LIMIT %d
            """ % (order_by, limit)
    return run_query(query)

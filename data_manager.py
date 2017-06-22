import connect_psql
from datetime import datetime


def get_username_password(user_name):
    sql_command = """SELECT username, password FROM users WHERE username=%s;"""
    data = (user_name,)
    return connect_psql.execute_sql_command(sql_command, data)


def register_user(user_name, hashed_password):
    sql_command = """INSERT INTO users (username, password) VALUES (%s, %s);"""
    data = (user_name, hashed_password,)
    return connect_psql.execute_sql_command(sql_command, data)


def get_user_id_by_user_name(user_name):
    sql_command = """SELECT id FROM users WHERE username=%s;"""
    data = (user_name,)
    return connect_psql.execute_sql_command(sql_command, data)


def get_planets_voted_by_user(user_id):
    sql_command = """SELECT planet_id FROM planet_votes WHERE users_id=%s;"""
    data = (user_id,)
    return connect_psql.execute_sql_command(sql_command, data)


def update_vote_table(user_id, planet_id, planet_name):
    sql_command = """INSERT INTO planet_votes (users_id, planet_id, submission_time, planet_name)
                      VALUES (%s, %s, %s, %s);"""
    data = (user_id, planet_id, str(datetime.now())[:-7], planet_name,)
    return connect_psql.execute_sql_command(sql_command, data)


def planet_statistics():
    sql_command = ("""SELECT planet_name, COUNT(id) FROM planet_votes
                      GROUP BY planet_name ORDER BY COUNT(id) DESC, planet_name;""")
    data = ()
    return connect_psql.execute_sql_command(sql_command, data)

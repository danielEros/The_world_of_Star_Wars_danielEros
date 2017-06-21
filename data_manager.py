import connect_psql
from datetime import datetime

def get_username_password(username):
    sql_command = ("""SELECT username, password FROM users WHERE username='%s';""" % (username))
    return connect_psql.execute_sql_command(sql_command)


def register_user(username, hashed_password):
    sql_command = ("""INSERT INTO users (username, password) VALUES ('%s', '%s');""" % (username, hashed_password))
    return connect_psql.execute_sql_command(sql_command)

def get_user_id_by_user_name(user_name):
    sql_command = ("""SELECT id FROM users WHERE username='%s';""" % (user_name))
    return connect_psql.execute_sql_command(sql_command)

def get_planets_voted_by_user(user_id):
    sql_command = ("""SELECT planet_id FROM planet_votes WHERE users_id=%s;""" % (user_id))
    return connect_psql.execute_sql_command(sql_command)


def update_vote_table(user_id, planet_id):
    sql_command = ("""INSERT INTO planet_votes (users_id, planet_id, submission_time)
                      VALUES (%s, %s, '%s');""" % (user_id, planet_id, str(datetime.now())[:-7]))
    return connect_psql.execute_sql_command(sql_command)
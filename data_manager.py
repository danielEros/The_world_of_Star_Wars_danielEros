import connect_psql


def get_username_password(username):
    sql_command = ("""SELECT username, password FROM users WHERE username='%s';""" % (username))
    return connect_psql.execute_sql_command(sql_command)


def register_user(username, hashed_password):
    sql_command = ("""INSERT INTO users (username, password) VALUES ('%s', '%s');""" % (username, hashed_password))
    return connect_psql.execute_sql_command(sql_command)
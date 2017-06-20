import psycopg2
import config
import public_config
import private_config


def get_db_config(settings):
    db_settings = settings['db_settings']

    is_dev = True
    is_test = False
    is_prod = False

    if is_dev:
        return db_settings['dev']
    elif is_test:
        return db_settings['test']
    elif is_prod:
        return db_settings['prod']
    return dict()


def handle_database(command):
    try:
        config_data = get_db_config(config.get_settings())
        connect_str = ("dbname='" + config_data['db_name'] +
                       "' user='" + config_data['user'] +
                       "' host='" + config_data['host'] +
                       "' password='" + config_data['password'] + "'")
        connection = psycopg2.connect(connect_str)
        connection.autocommit = True
        cursor = connection.cursor()
        cursor.execute(command)
        if "SELECT" in command:
            table = cursor.fetchall()
            cursor.close()
            connection.close()
            return table
        cursor.close()
    except psycopg2.DatabaseError as exception:
        print(exception)
    finally:
        if connection:
            connection.close()

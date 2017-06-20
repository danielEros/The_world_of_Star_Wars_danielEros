import psycopg2
import os
from importlib.machinery import SourceFileLoader
current_file_path = os.path.dirname(os.path.abspath(__file__))
config = SourceFileLoader("config", current_file_path + "/config/config.py").load_module()
public_config = SourceFileLoader("public_config", current_file_path + "/config/public_config.py").load_module()
private_config = SourceFileLoader("private_config", current_file_path + "/config/private_config.py").load_module()


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

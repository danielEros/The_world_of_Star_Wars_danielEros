from flask import Flask, render_template, redirect, session, url_for, request, jsonify
import requests
import werkzeug.security
import data_manager

app = Flask(__name__)


@app.route('/')
def index_page():
    if 'username' in session:
        user_name = session['username']
    else:
        user_name = ''
    return render_template('index.html', success_message='', user_name=user_name)


@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        entered_username = request.form['username']
        entered_password = request.form['password']
        username_password_sql_check = data_manager.get_username_password(entered_username)
        if len(username_password_sql_check) == 0:
            error_message = 'The entered username is not found, please try again!'
            return render_template('login.html', error_message=error_message)
        else:
            if not(werkzeug.security.check_password_hash(username_password_sql_check[0][1], entered_password)):
                error_message = 'The entered password is wrong, please try again!'
                return render_template('login.html', error_message=error_message)
        session['username'] = entered_username
        # return redirect(url_for('index_page'))
        return render_template('index.html', success_message='', user_name=entered_username)
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    if request.method == 'POST':
        entered_username = request.form['username']
        entered_password = request.form['password']
        entered_password2 = request.form['password2']
        username_exists_sql_check = data_manager.get_username_password(entered_username)
        if len(entered_username) < 5:
            error_message = 'The username has to be at least 5 character long!'
            return render_template('register.html', error_message=error_message)
        if len(entered_password) < 5 or len(entered_password2) < 5:
            error_message = 'The password has to be at least 5 character long!'
            return render_template('register.html', error_message=error_message)
        if len(username_exists_sql_check) > 0:
            error_message = 'The entered username is already taken, please try a new one!'
            return render_template('register.html', error_message=error_message)
        if entered_password != entered_password2:
            error_message = 'The passwords are not matching, please try again!'
            return render_template('register.html', error_message=error_message)
        hashed_password = werkzeug.security.generate_password_hash(entered_password, 'pbkdf2:sha256', 8)
        data_manager.register_user(entered_username, hashed_password)
        success_message = 'Registration was successful, please log in!'
        return render_template('index.html', success_message=success_message, user_name='')
    return render_template('register.html')


@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index_page'))


@app.route('/search_db_if_voted')
def search_db_if_voted():
    planet_id = request.args.get('planetID', 0, type=int)
    user_name = request.args.get('userName')
    user_id = data_manager.get_user_id_by_user_name(user_name)[0][0]
    voted_planets = data_manager.get_planets_voted_by_user(user_id)
    result = 'not voted'
    planet_id_to_return = ''
    for planet in voted_planets:
        if planet_id == planet[0]:
            result = 'voted'
            planet_id_to_return = planet_id
    return jsonify(result=result, planet_id=planet_id)



@app.route('/register_vote_in_db', methods=['POST'])
def register_vote_in_db():
    user_name = request.form['userName']
    planet_id = request.form['planetID']
    user_id = data_manager.get_user_id_by_user_name(user_name)[0][0]
    data_manager.update_vote_table(user_id, planet_id)
    return jsonify(result="success", planet_id=planet_id)


@app.route('/get_planet_statistics')
def get_planet_statistics():
    planet_statistics = data_manager.planet_statistics()
    planet_statistics_list = []
    for row in planet_statistics:
        search_planet_name_in_swapi = requests.get('http://swapi.co/api/planets/%s/' % (row[0])).json()
        planet_name = search_planet_name_in_swapi['name']
        row_with_planet_name = [planet_name, row[1]]
        planet_statistics_list.append(row_with_planet_name)
    return jsonify(planet_statistics_list)


app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


if __name__ == '__main__':
    app.run()

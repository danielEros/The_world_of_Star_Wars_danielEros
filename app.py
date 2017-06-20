from flask import Flask, render_template, redirect, session, url_for, request
import werkzeug.security
import data_manager

app = Flask(__name__)


@app.route('/')
def index_page():
    if 'username' in session:
        user_name = session['username']
    else:
        user_name = ''
    return render_template('index.html', user_name=user_name)


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
        return redirect(url_for('index_page'))
    return render_template('login.html')


@app.route('/register', methods=['GET', 'POST'])
def register():
    pass

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index_page'))


app.secret_key = 'A0Zr98j/3yX R~XHH!jmN]LWX/,?RT'


if __name__ == '__main__':
    app.run(debug=True)

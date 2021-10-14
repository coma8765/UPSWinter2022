import string
import random

from flask import Flask, jsonify, request, Response
from flask_sqlalchemy import SQLAlchemy
import json

"""You may set server port this."""
PORT = 5000

app = Flask(__name__)

app.config['JSON_SORT_KEYS'] = False
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///sqlite3.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False


db = SQLAlchemy(app)


class Shortcut(db.Model):
    """Model shortcut, which be used."""
    id = db.Column(db.Integer, primary_key=True)
    origin_url = db.Column(db.String(80), unique=True, nullable=False)
    short_path = db.Column(db.String(8), unique=True, nullable=False)
    count_visited = db.Column(db.Integer, nullable=False, default=0)


@app.route("/shorten", methods=['POST'])
def shorten():
    """Route for shortening url link."""
    res = {
        'status': "",
        'shortenedUrl': ""
    }

    req = json.loads(request.data)
    if 'urlToShorten' in req:
        print(Shortcut.query.filter_by(origin_url=req['urlToShorten']).first(), req['urlToShorten'])
        old = Shortcut.query.filter_by(origin_url=req['urlToShorten']).first()
        if old:
            res['shortenedUrl'] = old.short_path
        else:
            def create_short():
                return ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))

            shortcut = Shortcut(origin_url=req['urlToShorten'], short_path=create_short())
            res['shortenedUrl'] = shortcut.short_path
            db.session.add(shortcut)
            db.session.commit()
        res['status'] = "Created"
    else:
        res['status'] = "Error"

    match res['status']:
        case "Created":
            code = 201
        case "Error":
            code = 400
        case _:
            code = 500

    return Response(jsonify(res).data, status=code, mimetype='application/json')


@app.route("/<path:path>", methods=['GET'])
def get_origin_url(path):
    """Route for redirect to origin URL."""
    res = {
        'redirectTo': "",
    }
    headers = {}

    s = Shortcut.query.filter_by(short_path=path).first()
    if s:
        res['redirectTo'] = s.origin_url
        headers.update({'location': s.origin_url})
        s.query.update({'count_visited': s.count_visited + 1}, synchronize_session="fetch")
        db.session.commit()

    return Response(
        jsonify(res).data, status=(res['redirectTo'] and 301 or 404),
        headers=headers
    )


@app.route("/<path:path>/views")
def get_views(path):
    """Route for get views for shorten link."""
    res = {
        "viewCount": 0
    }

    s = Shortcut.query.filter_by(short_path=path).first()
    if s:
        res['viewCount'] = s.count_visited
        status = 200
    else:
        status = 404

    return Response(
        jsonify(res).data, status=status
    )


@app.errorhandler(404)
def page_not_found(e):
    res = {
        'status': 'Error',
        'error': "Page not found."
    }
    return Response(jsonify(res).data)


@app.after_request
def post_res(response):
    """Hook for set Content-Type on all URLs."""
    response.headers["Content-type"] = "json"
    return response


if __name__ == '__main__':
    app.run(port=PORT, debug=False)

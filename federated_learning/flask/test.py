from flask import Flask, render_template

app = Flask(__name__)

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/transfer_learning")
def transfer_learning():
    return render_template("transfer_learning.html")
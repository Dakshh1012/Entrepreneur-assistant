from flask import Flask, jsonify

app = Flask(__name__)

@app.route("api/hello",methods=["GET"])
def hello():
    return jsonify({
        'response':"Hello world"
    })
    
    
    
if __name__=="__main__":
    app.run(debug=True,port=8080)
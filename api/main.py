from flask import Flask, render_template , request
from flask_socketio import SocketIO, emit
appFlask = Flask(__name__)
from flask_cors import CORS, cross_origin
CORS(appFlask, cross_origin=True)
socketio = SocketIO(appFlask, cors_allowed_origins='*')
from model_new import  Summarize_File , start_conversation
from io import BytesIO

@appFlask.route('/Upload',methods=['POST'])
def upload():
    socketio.emit("upload_progress",{"data":"10"})
    if 'file' not in request.files:
        print("No file part")
        return 'No file part'
    file = request.files['file']
    if file.filename == '':
        print("No selected file")
        return 'No selected file'
    if file:
        file.save('Files/' + file.filename)
        socketio.emit("upload_progress",{"data":"20"})
        SUmmarize_File_Content("Files/"+file.filename)
        return "File Uploaded"
    return "File Uploaded"

@appFlask.route('/')
def index():
    return render_template('index.html')

def SUmmarize_File_Content(filename):
    socketio.emit("upload_progress",{"data":"30"})
    Summarize_File(filename,socketio)

@socketio.on('ConversationInput')
def start_input_conversation(json):
    start_conversation(json['data'],socketio,json["filename"],emit)

import tornado.ioloop
import tornado.web
import signal
import sys
import requests
import json
import time, threading

WAIT_SECONDS = 5
execute_periodic_task = True

spotify_api_url = 'https://api.spotify.com/v1/me/player'
spotify_token_url = 'https://accounts.spotify.com/api/token'

authorization = ''
refresh_token = ''
access_token = ''

current_playback = None

def init_credentials():
    global authorization
    global refresh_token
    with open('credential.json') as json_file:
        data = json.load(json_file)
        authorization = data['authorization']
        refresh_token = data['refresh_token']

def obtain_access_token():
    global access_token
    headers = {
        'Authorization': 'Basic ' + authorization
    }
    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token
    }
    r = requests.post(spotify_token_url, data=data, headers=headers)
    response = json.loads(r.text)
    access_token = response['access_token']

def obtain_current_playback(retryOnce):
    global current_playback
    response = None
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
        }
    r = requests.get(spotify_api_url, headers=headers)
    response = json.loads(r.text)
    
    if 'error' in response != None and retryOnce == True:
        print("Try to obtain token (" + time.ctime() + ")")
        obtain_access_token()
        obtain_current_playback(False)
    else:
        current_playback = response
        print("Fetch current playback successful (" + time.ctime() + ")")

def current_playback_periodic_task():
    global execute_periodic_task
    if execute_periodic_task == True:
        obtain_current_playback(True)
        threading.Timer(WAIT_SECONDS, current_playback_periodic_task).start()

def parse_arguments():
    if len(sys.argv) < 2:
        print("Usage : python3 server.py 'radio-didou_root_path'")
        exit()
    else:
        return sys.argv[1]

class JinglesHandler(tornado.web.RequestHandler):
    def post(self):
        self.render("static/jingles.html")
    get = post

class CurrentPlaybackHandler(tornado.web.RequestHandler):
    global current_playback
    def get(self):
        self.set_header("Access-Control-Allow-Origin", "*")
        self.write(current_playback)

def make_app(root_path):
    return tornado.web.Application([
        (r"/()$", tornado.web.StaticFileHandler, {"path":root_path + "static/index.html"}),
        (r"/jingles", JinglesHandler),
        (r"/currentPlayback", CurrentPlaybackHandler),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path":root_path + "static/"})
    ])

def signal_sigint(signal, frame):
    global execute_periodic_task
    print("Stop periodic task")
    execute_periodic_task = False
    tornado.ioloop.IOLoop.current().stop()
    print("Server stopped")
    exit()

if __name__ == "__main__":
    init_credentials()
    current_playback_periodic_task()

    root_path = parse_arguments()
    signal.signal(signal.SIGINT, signal_sigint)
    app = make_app(root_path)
    app.listen(8888)
    print("Server is running on http://localhost:8888")
    tornado.ioloop.IOLoop.current().start()

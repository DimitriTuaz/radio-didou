import tornado.ioloop
import tornado.web
import signal
import sys
import requests
import json

spotify_api_url = 'https://api.spotify.com/v1/me/player'
spotify_token_url = 'https://accounts.spotify.com/api/token'

authorization = ''
refresh_token = ''
access_token = ''

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

def get_current_playback(retryOnce):
    response = None
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
        }
    r = requests.get(spotify_api_url, headers=headers)
    response = json.loads(r.text)
    
    if 'error' in response != None and retryOnce == True:
        obtain_access_token()
        return get_current_playback(False)
            
    return response


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

def make_app(root_path):
    return tornado.web.Application([
        (r"/()$", tornado.web.StaticFileHandler, {"path":root_path + "static/index.html"}),
        (r"/jingles", JinglesHandler),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path":root_path + "static/"})
    ])

def signal_sigint(signal, frame):
        tornado.ioloop.IOLoop.current().stop()
        print("Server stopped")
        exit()

if __name__ == "__main__":
        init_credentials()
        playback = get_current_playback(True)
        print(playback['item']['name'])

        root_path = parse_arguments()
        signal.signal(signal.SIGINT, signal_sigint)
        app = make_app(root_path)
        app.listen(8888)
        print("Server is running on http://localhost:8888")
        tornado.ioloop.IOLoop.current().start()

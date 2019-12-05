import tornado.ioloop
import tornado.web
import signal
import sys
import requests
import json

spotify_api_url = 'https://api.spotify.com/v1/me/player'
spotify_token_url = 'https://accounts.spotify.com/api/token'

refresh_token = 'AQCacjGQCv1E1d3aB1-ZNsBS_RvmGzT7D_9rKsZiDc9ia2b3WzchsEQsfDJcplc8pSQbpRUPEYuQk4L6dSgSQvWT7fUUvBKnkMgyhqvwxaVfJdJYllCTSBdeGGGSNwr8bMI'
authorization = 'M2EyNTdmMzEwNDIyNDkzYzg5NmZhYTcwYzBmODNiZjg6ZjI1OTNmY2YzY2UzNDQ2Nzg0MTM4NDEwMWIxN2FjNjQ='

access_token = 'BQDBZxhP-2sGsbL6UZW-JSt4qtfjJ8ODg7nPwRIK59EMFb2W1-YnKHW6cI9t7J8w-LBIHVtCyrgKAVywvBLnwKgvE7Q-6jN2kzcN7ItEUsPkdjt2FVVMiSsrF8kWgno7P50Xh4MFlXYCIgccdSNGqDPJCe9E'


def obtain_access_token():
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

def get_current_playback():
    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + access_token
        }
    r = requests.get(spotify_api_url, headers=headers)
    print(r.text)
    response = json.loads(r.text)
    
    if response['error'] != None:
        if response['error']['status'] == 401:
            print("Error: token expired")
            

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
        #root_path = parse_arguments()
        #signal.signal(signal.SIGINT, signal_sigint)
        #app = make_app(root_path)
        #app.listen(8888)
        playback = get_current_playback()
        
        
        #print("Server is running on http://localhost:8888")
        #tornado.ioloop.IOLoop.current().start()

import tornado.ioloop
import tornado.web
import signal
import sys

def parse_arguments():
    if len(sys.argv) < 1:
        print("Usage : python3 server.py")
        exit()
    else:
        return sys.argv[1]

class JinglesHandler(tornado.web.RequestHandler):
    def post(self):
        self.render("static/jingles.html")
    get = post

def make_app():
    return tornado.web.Application([
        (r"/()$", tornado.web.StaticFileHandler, {"path": "static/index.html"}),
        (r"/jingles", JinglesHandler),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path": "static/"})
    ])

def signal_sigint(signal, frame):
        tornado.ioloop.IOLoop.current().stop()
        print("Server stopped")
        exit()

if __name__ == "__main__":
        signal.signal(signal.SIGINT, signal_sigint)
        app = make_app()
        app.listen(8888)
        print("Server is running on http://localhost:8888")
        tornado.ioloop.IOLoop.current().start()

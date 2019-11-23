import tornado.ioloop
import tornado.web
import signal
import sys

def parse_arguments():
    if len(sys.argv) < 2:
        print("Usage : python3 server.py 'radio-didou_root_path'")
        exit()
    else:
        return sys.argv[1]


def make_app(root_path):
    return tornado.web.Application([
        (r"/()$", tornado.web.StaticFileHandler, {"path":root_path + "static/index.html"}),
        (r"/(.*)", tornado.web.StaticFileHandler, {"path":root_path + "static/"})
    ])

def signal_sigint(signal, frame):
        tornado.ioloop.IOLoop.current().stop()
        print("Server stopped")

if __name__ == "__main__":
        root_path = parse_arguments()
        signal.signal(signal.SIGINT, signal_sigint)
        app = make_app(root_path)
        app.listen(8888)
        print("Server is running on http://localhost:8888")
        tornado.ioloop.IOLoop.current().start()

#!/usr/bin/liquidsoap
## Log dir
set("log.file.path","/tmp/basic-radio.log")

# Input the stream,
# from an Icecast server or any other source
#url = "http://37.59.99.228:8889/radio-didou"
#input = mksafe(input.http(url))

input = input.alsa()

# Stream it out
output.icecast(%mp3.vbr(quality=0,samplerate=44100),
host = "localhost", port = 8889,
password = "Bl3fP9M1", mount = "radio-didou-liquidsoap",
input)

#!/usr/bin/liquidsoap
## Log dir
set("log.file.path","/tmp/basic-radio.log")

input = input.alsa()

# Stream it out
output.icecast(%mp3.vbr(quality=0,samplerate=44100),
host = "localhost", port = 8889,
password = "Bl3fP9M1", mount = "radio-didou-liquidsoap",
input)


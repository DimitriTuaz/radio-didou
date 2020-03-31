#!/usr/bin/liquidsoap
## Log dir
set("log.file.path","/tmp/basic-radio.log")
set("harbor.bind_addr","0.0.0.0")
live = audio_to_stereo(input.harbor("radio-didou-input-dimitri",port=8898,password="kOYkZ30l"))
live_guest = audio_to_stereo(input.harbor("radio-didou-input-guest",port=8898,password="dJqWAo41"))

live_mixed = add([live,live_guest])

input = input.alsa()

full = fallback(track_sensitive=false,
[live_mixed,input])

# Stream it out
output.icecast(%mp3.vbr(quality=0,samplerate=44100),
host = "localhost", port = 8889,
password = "Bl3fP9M1", mount = "radio-didou",
full)

#!/usr/bin/liquidsoap
## Log dir
set("log.file.path","/tmp/basic-radio-test.log")

set("init.daemon", false)
set("tag.encodings",["UTF-8","ISO-8859-1"])
set("encoder.encoder.export",["artist","title","album","song"])

setenv("TZ", "UTC")


set("harbor.bind_addrs",["0.0.0.0"])
set("harbor.verbose", true)

# This defines a source waiting on mount point
# /test-harbor
#live =  input.harbor("test-harbor", icy=true, port=8898, user="source", password="xxx", timeout=30.)

# DJ Authentication
def dj_auth(user,password) =
  log("Authenticating DJ: #{user}")
  ret = list.hd(get_process_lines("curl -s --request POST --url http://web/api/internal/1/auth --form dj-user="^quote(user)^" --form dj-password="^quote(password)^" --form api_auth="^quote("f2cac0e0c3ebcf0a5fd41c208163464e55096af71b07ed79f23e66699dd10424460eca30bc26d778321ca5ab946949840a6a")^""), default="")
end

def live_connected(header) =
  log("DJ Source connected! #{header}")
  ret = list.hd(get_process_lines("curl -s --request POST --url http://web/api/internal/1/djon --form api_auth="^quote("f2cac0e0c3ebcf0a5fd41c208163464e55096af71b07ed79f23e66699dd10424460eca30bc26d778321ca5ab946949840a6a")^""), default="")
end

def live_disconnected() =
  log("DJ Source disconnected!")
  ret = list.hd(get_process_lines("curl -s --request POST --url http://web/api/internal/1/djoff --form api_auth="^quote("f2cac0e0c3ebcf0a5fd41c208163464e55096af71b07ed79f23e66699dd10424460eca30bc26d778321ca5ab946949840a6a")^""), default="")
end

# Live Broadcasting
live = audio_to_stereo(input.harbor("streamer", id="radio_polo_input_streamer", port=8005, user="shoutcast", auth=dj_auth, icy=true, max=30., buffer=5., icy_metadata_charset="UTF-8", metadata_charset="UTF-8", on_connect=live_connected, on_disconnect=live_disconnected))


input = input.alsa()

radio = fallback([live,input])

# Stream it out
output.icecast(%mp3.vbr(quality=0,samplerate=44100),
host = "localhost", port = 8889,
password = "Bl3fP9M1", mount = "radio-didou-liquidsoap-test",
radio)


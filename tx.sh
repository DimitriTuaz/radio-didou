#!/bin/sh
chrt -f  80 \
gst-launch-1.0 \
  alsasrc ! audio/x-raw,channels=2 ! opusenc bitrate=200000 ! \
  rtpopuspay ! udpsink host=127.0.0.1 port=5002


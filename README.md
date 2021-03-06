# Radio-didou

## Supporting Software

- Icecast
- LiquidSoap
- Loopback 4
- MongoDB
- React
- SpotifyDeamon

## How-to install?

### Icecast

- Install Icecast2.

### Spotifyd

- Install Spotifyd https://github.com/Spotifyd/spotifyd
- Enable systemd for user even when not connected: 'loginctl enable-linger your_user'
- Add an aslsa virtual sound card : 'modprobe snd-aloop'
- Add line 'snd-aloop' to /etc/modules
- Copy /config/audio/.asoundrc in your user's home.
- Add your user to audio group : 'sudo adduser "your_user" audio'

### Liquidsoap

- Install OPAM : 'apt-get install opam'
- Install OCaml via OPAM : https://ocaml.org/docs/install.fr.html
- If having troubles with opam swithc :  https://github.com/ocaml/opam/issues/3827
- Install LiquidSoap via OPAM and add ALSA : https://www.liquidsoap.info/doc-dev/install.html#debianubuntu
- Add a symlink 'ln -s /home/liquidsoap/.opam/system/bin/liquidsoap /usr/bin/liquidsoap'
- The config file is in 'config/audio/radio-didou.liq'

### MongoDB

- Install MongoDB
- If you want to add authentication : https://docs.mongodb.com/manual/core/authentication/

### Loopback 4 (Backend)

- Install NodeJS, NPM and Yarn.
- In server folder do 'npm install'
- In OpenAPI folder do 'npm install'
- In server folder do './build.sh'
- In the client folder do 'yarn install'
- In the client folder do 'yarn build'
- In your root folder, run the server with './run.sh'

## How to configure ?
- Copy the file ./config/loopback/config.yaml into the root folder.
- Modify it to fit your needs.

# CI
CI is done by Drone CI !

# Contribution

If you want to contribute to this fun, full-stack typescript project, we welcome you on discord : https://discord.gg/CJrZDrt. We could also help you if you plan to set-up your own server.






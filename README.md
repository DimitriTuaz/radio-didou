# Radio-didou

## Supporting Software

- Icecast
- LiquidSoap
- Loopback 4
- React
- SpotifyDeamon

## Install

### Icecast

Configuration is in /usr/local/etc/icecast.xml

### Spotifyd

Installer darkice : sudo apt-get install darkice (not used anymore)
Installer spotifyd
Permettre à un service user de runner même sans session user active :
sudo loginctl enable-linger dimitri
Ajouter une carte son virtuelle : sudo modprobe snd-aloop
Reboot persistent : Ajouter la ligne 'snd-aloop' à /etc/modules
Copier /config/.asoundrc dans la home du user
Ajouter son user au group audio : sudo adduser "your_username" audio

### Liquidsoap

Install opam : sudo apt-get install opam
Install ocaml via opam : https://ocaml.org/docs/install.fr.html
/!\ if having troubles with opam swithc :  (https://github.com/ocaml/opam/issues/3827)
Install via OPAM and add alsa as opam package : https://www.liquidsoap.info/doc-dev/install.html#debianubuntu

sudo ln -s /home/liquidsoap/.opam/system/bin/liquidsoap /usr/bin/liquidsoap
sudo systemctl enable liquidsoap

### Loopback 4 (Backend)

Installez nodejs, npm.
- Dans le dossier server faite npm install
- Pour lancer le serveur faite npm run start

### Enregistrement DNS

A radio-didou.com -> xxx.xxx.xxx.xxx

CNAME wwww -> @

### Redirection de port

Rediriger le port 80 vers le port de l'application (8888) : https://o7planning.org/fr/11363/redirection-du-port-80-443-sur-ubuntu-server-en-utilisant-iptables

### Systemd

Enable : sudo systemctl enable radio-didou




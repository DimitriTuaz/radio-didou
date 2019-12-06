# radio-didou

Install icecast

Config IceCast : /usr/local/etc/icecast.xml


Install Python3 : sudo apt-get install python3

Install PIP3 : sudo apt-get install python3-pip

Install Tornado : pip3 install tornado

Install timeloop: pip3 install timeloop

Enregistrement DNS :

A radio-didou.com -> xxx.xxx.xxx.xxx

CNAME wwww -> @


Rediriger le port 80 vers le port de l'application (8888) : https://o7planning.org/fr/11363/redirection-du-port-80-443-sur-ubuntu-server-en-utilisant-iptables

Start : sudo systemctl start radio-didou.service


Spotifyd

Installer darkice : sudo apt-get install darkice
Installer spotifyd
Ajouter une carte son virtuelle : sudo modprobe snd-aloop
Reboot persistent : Ajouter la ligne 'snd-aloop' à /etc/modules
Ajouter son user au group audio : sudo adduser "your_username" audio





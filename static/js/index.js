// Store XMLHttpRequest and the JSON file location in variables
var xhr = new XMLHttpRequest();
var icecastStatusUrl = "http://37.59.99.228:8889/status-json.xsl";

// Called whenever the readyState attribute changes
xhr.onreadystatechange = function() {

  // Check if fetch request is done
  if (xhr.readyState == 4 && xhr.status == 200) {

    // Parse the JSON string
    var jsonData = JSON.parse(xhr.responseText);

    showCurrentListeners(jsonData);
  }
};

// Do the HTTP call to get IceCast status
function sendRequestToIcecast() {
    xhr.open("GET", icecastStatusUrl, true);
    xhr.send();
}

// Function that formats the string with HTML tags, then outputs the result
function showCurrentListeners(data) {
    var listeners = 0;
    if (data.icestats.source[0]) {
        listeners = data.icestats.source[0].listeners;
    }
    else {
        listeners = data.icestats.source.listeners;
    }
    var listenersString = "";
    if (listeners > 1) {
        listenersString = listeners + " auditeurs"
    }
    else {
        listenersString = listeners + " auditeur"
    }
    var output = "<p id=\"currentListeners\">" + listenersString + " actuellement</p>";
    document.getElementById("currentListeners").innerHTML = output;
}

function play(){
    document.getElementById('player').play();
    document.getElementById('player-h24').play()
}

var isMuted = false;

function toggleMute(){
    isMuted = !isMuted;
    document.getElementById("player").muted = isMuted;
    document.getElementById("player-h24").muted = isMuted;
    document.getElementById("icon-mute").setAttribute("src", isMuted ? "images/icon_mute.png" : "images/icon_sound.png");
}

window.setInterval(sendRequestToIcecast, 1000);

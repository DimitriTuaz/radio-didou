// Store XMLHttpRequest and the JSON file location in variables
var xhrIcecast = new XMLHttpRequest();
var xhrTrack = new XMLHttpRequest();
var icecastStatusUrl = "http://37.59.99.228:8889/status-json.xsl";
/* Test URL */
//var currentTrackJsonUrl = "http://localhost:8888/json/example_current_playback.json";
var currentTrackJsonUrl = "http://37.59.99.228:8888/currentPlayback";

// Called whenever the readyState attribute changes
xhrIcecast.onreadystatechange = function() {

  // Check if fetch request is done
  if (xhrIcecast.readyState == 4 && xhrIcecast.status == 200) {

    // Parse the JSON string
    var jsonData = JSON.parse(xhrIcecast.responseText);

    showCurrentListeners(jsonData);
  }
};

// Called whenever the readyState attribute changes
xhrTrack.onreadystatechange = function() {

  // Check if fetch request is done
  if (xhrTrack.readyState == 4 && xhrTrack.status == 200) {

    // Parse the JSON string
    var jsonData = JSON.parse(xhrTrack.responseText);

    displayCurrentTrack(jsonData);
  }
};

// Do the HTTP GET to get IceCast status
function sendRequestIcecastStatus() {
    xhrIcecast.open("GET", icecastStatusUrl, true);
    xhrIcecast.send();
}

// Do the HTTP GET to get current track
function sendRequestCurrentTrack() {
    xhrTrack.open("GET", currentTrackJsonUrl, true);
    xhrTrack.send();
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

function readSingleFile(e) {
  var file = e.target.files[0];
  if (!file) {
    return;
  }
  var reader = new FileReader();
  reader.onload = function(e) {
    var contents = e.target.result;
    displayContents(contents);
  };
  reader.readAsText(file);
}

function displayCurrentTrack(jsonData) {
    var album = jsonData.item.album.name + " (" + jsonData.item.album.release_date.substring(0, 4) + ")";
    var artists = "";
    jsonData.item.artists.forEach((item, index) => {
        artists += item.name;
        if (index < jsonData.item.artists.length - 1) {
            artists += ", ";
        }
    })
    document.getElementById("track-cover").setAttribute("src", jsonData.item.album.images[1].url);
    document.getElementById("track-title").innerHTML = "<p>" + jsonData.item.name + "</p>";
    document.getElementById("track-artists").innerHTML = "<p>" + artists + "</p>";
    document.getElementById("track-album").innerHTML = "<p>" + album + "</p>";
    document.getElementById("track-container").setAttribute("onClick", "window.open(\"" + jsonData.item.external_urls.spotify + "\", \"_blank\");");
    document.getElementById("player").setAttribute("title", jsonData.item.name);
    document.getElementById("player-h24").setAttribute("title", jsonData.item.name);
}

sendRequestCurrentTrack();
sendRequestIcecastStatus();

window.setInterval(sendRequestCurrentTrack, 1000);
window.setInterval(sendRequestIcecastStatus, 1000);

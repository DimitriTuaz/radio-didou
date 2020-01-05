var server = null;
if(window.location.protocol === 'http:')
	server = "http://" + window.location.hostname + ":8088/janus";
else
	server = "https://" + window.location.hostname + ":8089/janus";

var janus = null;
var streaming = null;
var opaqueId = "streamingtest-"+Janus.randomString(12);

var bitrateTimer = null;

var selectedStream = "1";

$(document).ready(function() {
	Janus.init({debug: "all", callback: function() {
		$('#start').one('click', function() {
			$(this).attr('disabled', true).unbind('click');
			if(!Janus.isWebrtcSupported()) {
				bootbox.alert("No WebRTC support... ");
				return;
			}
			// Create session
			janus = new Janus(
				{
					server: server,
					success: function() {
						janus.attach(
							{
								plugin: "janus.plugin.streaming",
								opaqueId: opaqueId,
								success: function(pluginHandle) {
									streaming = pluginHandle;
									Janus.log("Plugin attached! (" + streaming.getPlugin() + ", id=" + streaming.getId() + ")");
									$('#start').removeAttr('disabled').html("Stop")
										.click(function() {
											$(this).attr('disabled', true);
											clearInterval(bitrateTimer);
											janus.destroy();
											$('#play').attr('disabled', true).unbind('click');
											$('#start').attr('disabled', true).html("Bye").unbind('click');
										});
									$('#play').removeAttr('disabled')
										.click(function() {
											startStream();
											$('#play').attr('disabled', true).unbind('click');
										});
								},
								error: function(error) {
									Janus.error("  -- Error attaching plugin... ", error);
									bootbox.alert("Error attaching plugin... " + error);
								},
								onmessage: function(msg, jsep) {
									Janus.debug(" ::: Got a message :::");
									Janus.debug(msg);
									var result = msg["result"];
									if(result !== null && result !== undefined) {
										if(result["status"] !== undefined && result["status"] !== null) {
											var status = result["status"];
											if(status === 'stopped') {
												stopStream();
											}
										}
									} else if(msg["error"] !== undefined && msg["error"] !== null) {
										bootbox.alert(msg["error"]);
										stopStream();
										return;
									}
									if(jsep !== undefined && jsep !== null) {
										Janus.debug("Handling SDP as well...");
										Janus.debug(jsep);
										streaming.createAnswer(
											{
												jsep: jsep,
												media: { audioSend: false, videoSend: false, data: true },
												success: function(jsep) {
													Janus.debug("Got SDP!");
													Janus.debug(jsep);
													var body = { "request": "start" };
													streaming.send({"message": body, "jsep": jsep});
													$('#play').html("Stop").removeAttr('disabled').click(stopStream);
												},
												error: function(error) {
													Janus.error("WebRTC error:", error);
													bootbox.alert("WebRTC error... " + JSON.stringify(error));
												}
											});
									}
								},
								onremotestream: function(stream) {
									Janus.debug(" ::: Got a remote stream :::");
									Janus.debug(stream);
									if($('#remotevideo').length === 0) {
										$('#stream').append('<video class="rounded centered hide" id="remotevideo" width=320 height=240 autoplay playsinline/>');
										$("#remotevideo").bind("playing", function () {
											$('#waitingvideo').remove();
											if(this.videoWidth)
												$('#remotevideo').removeClass('hide').show();
											var videoTracks = stream.getVideoTracks();
											if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0)
												return;
										});
									}
									Janus.attachMediaStream($('#remotevideo').get(0), stream);
									var videoTracks = stream.getVideoTracks();
									if(videoTracks === null || videoTracks === undefined || videoTracks.length === 0) {
										// No remote video
										$('#remotevideo').hide();
										if($('#stream .no-video-container').length === 0) {
											$('#stream').append(
												'<div class="no-video-container">' +
													'<i class="fa fa-video-camera fa-5 no-video-icon"></i>' +
													'<span class="no-video-text">No remote video available</span>' +
												'</div>');
										}
									} else {
										$('#stream .no-video-container').remove();
										$('#remotevideo').removeClass('hide').show();
									}
									if(videoTracks && videoTracks.length &&
											(Janus.webRTCAdapter.browserDetails.browser === "chrome" ||
												Janus.webRTCAdapter.browserDetails.browser === "firefox" ||
												Janus.webRTCAdapter.browserDetails.browser === "safari")) {
										$('#bitrate').removeClass('hide').show();
										bitrateTimer = setInterval(function() {
											var bitrate = streaming.getBitrate();
											$('#bitrate').text(bitrate);
										}, 1000);
									}
								},
								ondataopen: function(data) {
									Janus.log("The DataChannel is available!");
								},
								ondata: function(data) {
									Janus.debug("We got data from the DataChannel! " + data);
								},
								oncleanup: function() {
									Janus.log(" ::: Got a cleanup notification :::");
									$('#bitrate').attr('disabled', true);
									if(bitrateTimer !== null && bitrateTimer !== undefined)
										clearInterval(bitrateTimer);
									bitrateTimer = null;
								}
							});
					},
					error: function(error) {
						Janus.error(error);
						bootbox.alert(error, function() {
							window.location.reload();
						});
					},
					destroyed: function() {
						window.location.reload();
					}
				});
		});
	}});
});

function startStream() {
	Janus.log("Selected stream id #" + selectedStream);
	if(selectedStream === undefined || selectedStream === null) {
		bootbox.alert("Select a stream from the list");
		return;
	}
	$('#play').attr('disabled', true).unbind('click');
	var body = { "request": "watch", id: parseInt(selectedStream) };
	streaming.send({"message": body});
}

function stopStream() {
	$('#play').attr('disabled', true).unbind('click');
	var body = { "request": "stop" };
	streaming.send({"message": body});
	streaming.hangup();
	$('#play').html("Watch or Listen").removeAttr('disabled').unbind('click').click(startStream);
	$('#bitrate').attr('disabled', true);
	if(bitrateTimer !== null && bitrateTimer !== undefined)
		clearInterval(bitrateTimer);
	bitrateTimer = null;
}

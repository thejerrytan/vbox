



window.openTrainingMode = function () {
      var w = document.getElementById("presentation_mode");
      w.style.display = "none";
      var x = document.getElementById("training_mode");
      x.style.display = "block";
      var y = document.getElementById("presentation_link");
      y.style.color = "black";
      y.style.fontWeight = "bold";
      var z = document.getElementById("training_link");
      z.style.color = "white";
      z.style.fontWeight = "normal";
      var container = document.getElementById("webcamcontainer");
      container.style.opacity = 1;
    
    }

window.openPresentationMode = function () {
      var w = document.getElementById("training_mode");
      w.style.display = "none";
      var x = document.getElementById("presentation_mode");
      x.style.display = "block";
      var y = document.getElementById("training_link");
      y.style.color = "black";
      y.style.fontWeight = "bold";
      var z = document.getElementById("presentation_link");
      z.style.color = "white";
      z.style.fontWeight = "normal";
      var caption = document.getElementById("presentation_captions");
      caption.innerText = "Hello World!";
      var container = document.getElementById("webcamcontainer");
      container.style.opacity = 0;
    }

var getWebcams = function() {
      return navigator.mediaDevices.enumerateDevices()
        .then((devices) => {
          devices.forEach((device) => {
            console.log(device.kind + ": \"" + device.label +
              "\" id = " + device.deviceId);
          });

          return devices.filter((device) => {
            return device.kind === 'videoinput';
          });
        });
    };

var startWebcamStream = function(webcamDevice, parentId) {
    	var parentContainer = document.getElementById(parentId);
      var constraints = {
        audio: false,
        video: {
          optional: [{
            sourceId: webcamDevice.deviceId
          }]
        },
        deviceId: {
          exact: webcamDevice.deviceId
        }
      };

      console.log('Starting webcam stream with device ID = ' + webcamDevice.deviceId);

      var successCallback = function(stream) {
        var video = document.createElement('video');
        video.className = "webcamP"
        video.autoplay = true;
        video.src = window.URL.createObjectURL(stream);

        var row = document.createElement('div');
        row.innerHTML = 'LABEL = "' + webcamDevice.label + '"<br> ID = "' + webcamDevice.deviceId + '"';
        parentContainer.appendChild(row);
        parentContainer.appendChild(video);

        console.log('Webcam stream with device ID = ' + webcamDevice.deviceId + ', LABEL = "' + webcamDevice.label + '" started', 'success');
      };

      var errorCallback = function(e) {
        console.log('Webcam stream with device ID = ' + webcamDevice.deviceId + ', LABEL = "' + webcamDevice.label + '" failed to start', e);
      }

      navigator.mediaDevices.getUserMedia(constraints)
        .then(successCallback)
        .catch(errorCallback);
    };

    var checkWebcamResolution = function(width, height) { //unused. broken
      return new Promise(function(resolve) {
        var successCallback = function(stream) {
          var video = document.createElement('video');
          video.autoplay = true;
          video.src = window.URL.createObjectURL(stream);

          video.onloadedmetadata = function(e) {
            if (width === video.videoWidth && height === video.videoHeight) {
              console.log('Webcam stream successfully started in <strong>' + width + 'x' + height + '</strong>', 'success');
            } else {
              console.log('Webcam stream failed to start in <strong>' + width + 'x' + height + '</strong>, instead started in <strong>' + video.videoWidth + 'x' + video.videoHeight + '</strong>', 'error');
            }

            setTimeout(function() {
              stream.getTracks().forEach(function(track) {
                track.stop();
              });

              video.remove();
              resolve();
            }, 500);
          };
        };

        var errorCallback = function() {
          console.log('Webcam stream failed to start in <strong>' + width + 'x' + height + '</strong>', 'error');
          resolve();
        }

        mediaDevices.getUserMedia({
            video: {
              width: {
                exact: width
              },
              height: {
                exact: height
              }
            }
          })
          .then(successCallback)
          .catch(errorCallback);
      });
    };

              getWebcams()
                .then((webcamDevices) => {
                  webcamDevices.forEach((webcamDevice) => {
                    console.log(JSON.stringify(webcamDevice));
                  	if (webcamDevice.label.indexOf('FaceTime HD Camera') >= 0) {
                  		// Laptop webcam
                      console.log('FaceTime HD Camera has opened');
	                    startWebcamStream(webcamDevice, "presentation_right");
                  	}
                  	if (webcamDevice.label.indexOf('USB Camera') >= 0) {
                  		// USB Webcam
                      console.log('USB Camera has opened');
	                    startWebcamStream(webcamDevice, "presentation_left");
                  	}
                  });
                });
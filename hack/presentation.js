
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



                  	if (webcamDevice.deviceId == '1b35d451bac59c8612ad932254ab7034e1ee04c25304f14fe82cd8d3b986fb0e'||
						webcamDevice.deviceId == 'laptop cam'){
                  		// Laptop webcam
	                    startWebcamStream(webcamDevice, "presentation_left");
                  	}
                  	if (webcamDevice.deviceId == '4a369d25074b7c57600f499346f45cdc5ddfba182d361552182dd2384b7d53aa'||
						webcamDevice.deviceId == 'usb cam'){
                  		// USB Webcam
	                    startWebcamStream(webcamDevice, "presentation_right");
                  	}
                  });
                });
/**
 * @license
 * Copyright 2018 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */

import * as tf from '@tensorflow/tfjs';
import 'isomorphic-fetch';
import {ControllerDataset} from './controller_dataset';
import * as ui from './ui';
import {Webcam} from './webcam';
import labels from './labels';

// The number of classes we want to predict. In this example, we will be
// predicting 4 classes for up, down, left, and right.
const NUM_CLASSES = labels.length;

// A webcam class that generates Tensors from the images from the webcam.
const webcam = new Webcam(document.getElementById('webcam'));

// The dataset object where we will store activations.
const controllerDataset = new ControllerDataset(NUM_CLASSES);

let mobilenet;
let model;

// Loads mobilenet and returns a model that returns the internal activation
// we'll use as input to our classifier model.
async function loadMobilenet() {
  const mobilenet = await tf.loadModel(
      'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json');

  // Return a model that outputs an internal activation.
  const layer = mobilenet.getLayer('conv_pw_13_relu');
  return tf.model({inputs: mobilenet.inputs, outputs: layer.output});
}

// When the UI buttons are pressed, read a frame from the webcam and associate
// it with the class label given by the button. up, down, left, right are
// labels 0, 1, 2, 3 respectively.
ui.setExampleHandler(label => {
  tf.tidy(() => {
    const labelIdx = labels.indexOf(label);
    webcam.currentLabel = label;
    console.log(label);
    const img = webcam.capture(true);
    controllerDataset.addExample(mobilenet.predict(img), labelIdx);

    // Draw the preview thumbnail.
    ui.drawThumb(img, label);
  });
});

/**
 * Sets up and trains the classifier.
 */
async function train() {
  if (controllerDataset.xs == null) {
    throw new Error('Add some examples before training!');
  }

  // Creates a 2-layer fully connected model. By creating a separate model,
  // rather than adding layers to the mobilenet model, we "freeze" the weights
  // of the mobilenet model, and only train weights from the new model.
  model = tf.sequential({
    layers: [
      // Flattens the input to a vector so we can use it in a dense layer. While
      // technically a layer, this only performs a reshape (and has no training
      // parameters).
      tf.layers.flatten({inputShape: [7, 7, 256]}),
      // Layer 1
      tf.layers.dense({
        units: ui.getDenseUnits(),
        activation: 'relu',
        kernelInitializer: 'varianceScaling',
        useBias: true
      }),
      // Layer 2. The number of units of the last layer should correspond
      // to the number of classes we want to predict.
      tf.layers.dense({
        units: NUM_CLASSES,
        kernelInitializer: 'varianceScaling',
        useBias: false,
        activation: 'softmax'
      })
    ]
  });

  // Creates the optimizers which drives training of the model.
  const optimizer = tf.train.adam(ui.getLearningRate());
  // We use categoricalCrossentropy which is the loss function we use for
  // categorical classification which measures the error between our predicted
  // probability distribution over classes (probability that an input is of each
  // class), versus the label (100% probability in the true class)>
  model.compile({optimizer: optimizer, loss: 'categoricalCrossentropy'});

  // We parameterize batch size as a fraction of the entire dataset because the
  // number of examples that are collected depends on how many examples the user
  // collects. This allows us to have a flexible batch size.
  const batchSize =
      Math.floor(controllerDataset.xs.shape[0] * ui.getBatchSizeFraction());
  if (!(batchSize > 0)) {
    throw new Error(
        `Batch size is 0 or NaN. Please choose a non-zero fraction.`);
  }

  // Train the model! Model.fit() will shuffle xs & ys so we don't have to.
  model.fit(controllerDataset.xs, controllerDataset.ys, {
    batchSize,
    epochs: ui.getEpochs(),
    callbacks: {
      onBatchEnd: async (batch, logs) => {
        ui.trainStatus('Loss: ' + logs.loss.toFixed(10));
      }
    }
  });
}

let isPredicting = false;

async function predict() {
  ui.isPredicting();
  while (isPredicting) {
    const predictedClass = tf.tidy(() => {
      // Capture the frame from the webcam.
      const img = webcam.capture(false);

      // Make a prediction through mobilenet, getting the internal activation of
      // the mobilenet model.
      const activation = mobilenet.predict(img);

      // Make a prediction through our newly-trained model using the activation
      // from mobilenet as input.
      const predictions = model.predict(activation);

      // Returns the index with the maximum probability. This number corresponds
      // to the class the model thinks is the most probable given the input.
      return predictions.as1D().argMax();
    });

    const classId = (await predictedClass.data())[0];
    predictedClass.dispose();

    ui.predictClass(classId);
    await tf.nextFrame();
  }
  ui.donePredicting();
}

document.getElementById('train').addEventListener('click', async () => {
  ui.trainStatus('Training...');
  await tf.nextFrame();
  await tf.nextFrame();
  isPredicting = false;
  train();
});
document.getElementById('predict').addEventListener('click', () => {
  ui.startPacman();
  isPredicting = true;
  predict();
});

document.getElementById('delete').addEventListener('click', async () => {
  fetch('http://localhost:1234/delete', {
    method: "post",
  }, function(response) {
    console.log(response);
  });
});

import async from 'async';
document.getElementById('fetch').addEventListener('click', async () => {
  fetch('http://localhost:1234/imagesFromStorage').then(
    response => response.json())
  .then((responseJSON) => {
      console.log(responseJSON.files);
      for (var dir in responseJSON.files) {
        var label = dir.split("/").slice(-1)[0];
        async.each(responseJSON.files[dir].map(file => [label,file]), function(labelFile, callback) {
          loadImage(labelFile[0], labelFile[1], callback);
        }, function(err) {
          if (err) throw err;
          console.log("Finished " + dir);
        });
        
      }
    });
});

const jpeg = require('jpeg-js');
const decodeImage = source => {
  console.time('decodeImage');
  const buf = Buffer.from(source, 'base64')
  const pixels = jpeg.decode(buf, true);
  logTimeAndMemory('decodeImage')
  return pixels
}

function loadImage(label, filename, callback) {
  const url = encodeURI("http://localhost:1234/image/" + label + "/" + filename);
  console.log(url);
  fetch(url).then((response) => {
    if (response.status == 200) {
      return response.text()
    } else {
      return response.json();
    }
  })
  .then((base64String) => {
    var image = new Image(),
      containerWidth = null,
      containerHeight = null;

    image.onload=function(){
      containerWidth = image.width;
      containerHeight = image.height;
      const tfImg = tf.tidy(() => {

        // Reads the image as a Tensor from the webcam <video> element.
        const webcamImage = tf.fromPixels(image);

        // Crop the image so we're using the center square of the rectangular
        // webcam.
        const croppedImage = webcam.cropImage(webcamImage);

        // Expand the outer most dimension so we have a batch size of 1.
        const batchedImage = croppedImage.expandDims(0);

        // Normalize the image between -1 and 1. The image comes in between 0-255,
        // so we divide by 127 and subtract 1.
        return batchedImage.toFloat().div(tf.scalar(127)).sub(tf.scalar(1));
      });
      const labelIdx = labels.indexOf(label);
      console.log(label, labelIdx);
      controllerDataset.addExample(mobilenet.predict(tfImg), labelIdx);
    }
    image.src = base64String;
    callback();
  });
}

async function init() {
  try {
    await webcam.setup();
  } catch (e) {
    document.getElementById('no-webcam').style.display = 'block';
  }
  mobilenet = await loadMobilenet();

  // Warm up the model. This uploads weights to the GPU and compiles the WebGL
  // programs so the first time we collect data from the webcam it will be
  // quick.
  tf.tidy(() => mobilenet.predict(webcam.capture(false)));

  ui.init();
}

// Initialize the application.
init();

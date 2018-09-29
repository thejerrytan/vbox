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
import labels from './labels';

const CONTROLS = ['up', 'down', 'left', 'right'];
const CONTROL_CODES = [38, 40, 37, 39];

export function init() {
  document.getElementById('controller').style.display = '';
  statusElement.style.display = 'none';
}

const trainStatusElement = document.getElementById('train-status');

// Set hyper params from UI values.
const learningRateElement = document.getElementById('learningRate');
export const getLearningRate = () => +learningRateElement.value;

const batchSizeFractionElement = document.getElementById('batchSizeFraction');
export const getBatchSizeFraction = () => +batchSizeFractionElement.value;

const epochsElement = document.getElementById('epochs');
export const getEpochs = () => +epochsElement.value;

const denseUnitsElement = document.getElementById('dense-units');
export const getDenseUnits = () => +denseUnitsElement.value;
const statusElement = document.getElementById('status');

export function startPacman() {
  google.pacman.startGameplay();
}

export function predictClass(classId) {
  google.pacman.keyPressed(CONTROL_CODES[classId]);
  console.log(classId, labels[classId]);
  document.body.setAttribute('data-active', labels[classId].toLowerCase());
}

export function isPredicting() {
  statusElement.style.visibility = 'visible';
}
export function donePredicting() {
  statusElement.style.visibility = 'hidden';
}
export function trainStatus(status) {
  trainStatusElement.innerText = status;
}

export let addExampleHandler;
export function setExampleHandler(handler) {
  addExampleHandler = handler;
}
let mouseDown = false;
const totals = {
  "hi":0,
  "my name is":0,
  "j":0,
  "k":0,
  "nice to":0,
  "meet":0,
  "you":0,
  "what is":0,
  "your":0,
  "i am":0,
  "deaf":0,
  "but":0,
  "happy to be":0,
  "talking to":0,
  "sorry":0,
  "got to go":0,
  "i have a":0,
  "presentation":0,
  "to deliver":0,
  "idle":0,
  "terminal":0
}

// const upButton = document.getElementById('up');
// const downButton = document.getElementById('down');
// const leftButton = document.getElementById('left');
// const rightButton = document.getElementById('right');

const b1 = document.getElementById("hi");
const b2 = document.getElementById("my name is");
const b3 = document.getElementById("j");
const b4 = document.getElementById("k");
const b5 = document.getElementById("nice to");
const b6 = document.getElementById("meet");
const b7 = document.getElementById("you");
const b8 = document.getElementById("what is");
const b9 = document.getElementById("your");
const b10 = document.getElementById("i am");
const b11 = document.getElementById("deaf");
const b12 = document.getElementById("but");
const b13 = document.getElementById("happy to be");
const b14 = document.getElementById("talking to");
const b15 = document.getElementById("sorry");
const b16 = document.getElementById("got to go");
const b17 = document.getElementById("i have a");
const b18 = document.getElementById("presentation");
const b19 = document.getElementById("to deliver");
const b20 = document.getElementById("idle");
const b21 = document.getElementById("terminal");


const thumbDisplayed = {};

async function handler(label) {
  mouseDown = true;
  const className = CONTROLS[label];
  const button = document.getElementById(className);
  const total = document.getElementById(label + '-total');
  while (mouseDown) {
    addExampleHandler(label);
    document.body.setAttribute('data-active', CONTROLS[label]);
    total.innerText = totals[label]++;
    await tf.nextFrame();
  }
  document.body.removeAttribute('data-active');
}

b1.addEventListener('mousedown', () => handler("hi"));
b1.addEventListener('mouseup', () => mouseDown = false);

b2.addEventListener('mousedown', () => handler("my name is"));
b2.addEventListener('mouseup', () => mouseDown = false);

b3.addEventListener('mousedown', () => handler("j"));
b3.addEventListener('mouseup', () => mouseDown = false);

b4.addEventListener('mousedown', () => handler("k"));
b4.addEventListener('mouseup', () => mouseDown = false);

b5.addEventListener('mousedown', () => handler("nice to"));
b5.addEventListener('mouseup', () => mouseDown = false);

b6.addEventListener('mousedown', () => handler("meet"));
b6.addEventListener('mouseup', () => mouseDown = false);

b7.addEventListener('mousedown', () => handler("you"));
b7.addEventListener('mouseup', () => mouseDown = false);

b8.addEventListener('mousedown', () => handler("what is"));
b8.addEventListener('mouseup', () => mouseDown = false);

b9.addEventListener('mousedown', () => handler("your"));
b9.addEventListener('mouseup', () => mouseDown = false);

b10.addEventListener('mousedown', () => handler("i am"));
b10.addEventListener('mouseup', () => mouseDown = false);

b11.addEventListener('mousedown', () => handler("deaf"));
b11.addEventListener('mouseup', () => mouseDown = false);

b12.addEventListener('mousedown', () => handler("but"));
b12.addEventListener('mouseup', () => mouseDown = false);

b13.addEventListener('mousedown', () => handler("happy to be"));
b13.addEventListener('mouseup', () => mouseDown = false);

b14.addEventListener('mousedown', () => handler("talking to"));
b14.addEventListener('mouseup', () => mouseDown = false);

b15.addEventListener('mousedown', () => handler("sorry"));
b15.addEventListener('mouseup', () => mouseDown = false);

b16.addEventListener('mousedown', () => handler("got to go"));
b16.addEventListener('mouseup', () => mouseDown = false);

b17.addEventListener('mousedown', () => handler("i have a"));
b17.addEventListener('mouseup', () => mouseDown = false);

b18.addEventListener('mousedown', () => handler("presentation"));
b18.addEventListener('mouseup', () => mouseDown = false);

b19.addEventListener('mousedown', () => handler("to deliver"));
b19.addEventListener('mouseup', () => mouseDown = false);

b20.addEventListener('mousedown', () => handler("idle"));
b20.addEventListener('mouseup', () => mouseDown = false);

b21.addEventListener('mousedown', () => handler("terminal"));
b21.addEventListener('mouseup', () => mouseDown = false);

// upButton.addEventListener('mousedown', () => handler(0));
// upButton.addEventListener('mouseup', () => mouseDown = false);

// downButton.addEventListener('mousedown', () => handler(1));
// downButton.addEventListener('mouseup', () => mouseDown = false);

// leftButton.addEventListener('mousedown', () => handler(2));
// leftButton.addEventListener('mouseup', () => mouseDown = false);

// rightButton.addEventListener('mousedown', () => handler(3));
// rightButton.addEventListener('mouseup', () => mouseDown = false);



export function drawThumb(img, label) {
  if (thumbDisplayed[label] == null) {
    const thumbCanvas = document.getElementById(label + '-thumb');
    draw(img, thumbCanvas);
  }
}

export function draw(image, canvas) {
  const [width, height] = [224, 224];
  const ctx = canvas.getContext('2d');
  const imageData = new ImageData(width, height);
  const data = image.dataSync();
  for (let i = 0; i < height * width; ++i) {
    const j = i * 4;
    imageData.data[j + 0] = (data[i * 3 + 0] + 1) * 127;
    imageData.data[j + 1] = (data[i * 3 + 1] + 1) * 127;
    imageData.data[j + 2] = (data[i * 3 + 2] + 1) * 127;
    imageData.data[j + 3] = 255;
  }
  ctx.putImageData(imageData, 0, 0);
}

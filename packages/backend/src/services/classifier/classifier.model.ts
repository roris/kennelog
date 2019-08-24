/**
 * Copied from: https://github.com/tensorflow/tfjs-examples/blob/master/mobilenet/index.js
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

// Changes made:
//    - the model is wrapped in a class
//    - predict() accepts a dataUri
//    - rejects() with @feathersjs/errors on exceptions
//    - uses node-canvas to process the image (tfjs/issues/1414)

import * as tf from '@tensorflow/tfjs';
import { ImageNetClasses } from './imagenet-classes';
import { Image, createCanvas } from 'canvas';
import { BadRequest, GeneralError } from '@feathersjs/errors';

const MOBILENET_MODEL_PATH =
  'https://storage.googleapis.com/tfjs-models/tfjs/mobilenet_v1_0.25_224/model.json';
const IMAGE_SIZE = 224;

const getTopKClasses = async logits => {
  const values = await logits.data();
  const valuesAndIndices: any = [];
  for (let i = 0; i < values.length; ++i) {
    valuesAndIndices.push({ value: values[i], index: i });
  }

  valuesAndIndices.sort((a, b) => b.value - a.value);
  const topKValue = valuesAndIndices[0].value;
  const topKIndex = valuesAndIndices[0].index;

  const result = {
    name: ImageNetClasses[topKIndex],
    probability: topKValue
  };

  return result;
};

export class MobileNet {
  model: tf.LayersModel | null = null;
  loaded = false;

  async load() {
    this.model = await tf.loadLayersModel(MOBILENET_MODEL_PATH);
    this.loaded = true;
    // Warmup the model. This isn't necessary, but makes the first prediction
    // faster. Call `dispose` to release the WebGL memory allocated for the return
    // value of `predict`
    this.model.predict(tf.zeros([1, IMAGE_SIZE, IMAGE_SIZE, 3])).dispose();
  }

  async predict(uri) {
    return new Promise((resolve, reject) => {
      // ref: https://github.com/tensorflow/tfjs/issues/1414
      const canvas = createCanvas(IMAGE_SIZE, IMAGE_SIZE);
      const image = new Image();
      // the sizes need to be set for TensorFlow to process the image for some reason
      image.width = IMAGE_SIZE;
      image.height = IMAGE_SIZE;

      image.onload = async () => {
        try {
          const predictions = await this.predict_(image, canvas);
          // Request was fullfilled,
          if (!predictions.name) {
            reject(new BadRequest('Image must be that of a dog.'));
          } else {
            resolve(predictions);
          }
        } catch (error) {
          console.error(error);
          reject(new GeneralError('Could not process the image'));
        }
      };

      image.src = uri;
    });
  }

  private async predict_(image, canvas) {
    // draw the image so tf can process it
    const context = canvas.getContext('2d');
    context.drawImage(image, 0, 0, IMAGE_SIZE, IMAGE_SIZE);

    // tf.browser.fromPixels() returns a Tensor from an image element.
    const img = tf.browser.fromPixels(canvas);

    const offset = tf.scalar(127.5);
    // Normalize the image from [0, 255] to [-1, 1].
    const normalized = img.sub(offset).div(offset);

    // Reshape to a single-element batch so we can pass it to predict.
    const batched = normalized.reshape([1, IMAGE_SIZE, IMAGE_SIZE, 3]);
    const logits = this.model.predict(batched);
    return getTopKClasses(logits);
  }
}

/*!
  Copyright 2018 Google LLC

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  https://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/
import {transformData} from './data-transform';
import * as parse from 'url-parse';
import * as Lib from './library-types';
import * as DS from './data-studio-types';

export const timeout = async (millis: number): Promise<{}> => {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(millis), millis);
  });
};

export const iframeLoaded = async (): Promise<{}> => {
  return new Promise((resolve, reject) => {
    window.addEventListener('load', (e) => {
      resolve(e);
    });
  });
};

export const postMessage = (clientMessage: Lib.ClientMessage) => {
  window.parent.postMessage(clientMessage, '*');
};

export const getWidth = (): number => document.body.clientWidth;
export const getHeight = (): number => document.documentElement.clientHeight;

export const getComponentId = (): string => {
  const parsed = parse(window.parent.location.href, true);
  return parsed.query.componentId;
};

export const delayedMessage = async (
  clientMessage: Lib.ClientMessage,
  millis: number
) => {
  await iframeLoaded();
  await timeout(millis);
  postMessage(clientMessage);
};

export interface SubsciptionOptions {
  transform: (componentData: DS.Message) => Lib.TransformedMessage;
}

export const subscribeToData = async (
  callback: (componentData: Lib.TransformedMessage) => void,
  subscriptionOptions: SubsciptionOptions = {transform: transformData}
): Promise<() => void> => {
  const {transform} = subscriptionOptions;
  await iframeLoaded();
  const onMessage = (message: DS.PostMessage) => {
    if (message.data.type === 'RENDER') {
      let messageData: DS.Message = message.data;
      callback(transform(messageData));
    }
  };
  window.addEventListener('message', onMessage);
  const componentId = getComponentId();
  postMessage({componentId, type: 'vizReady'});
  // Return a function that can be used to unsubscribe to the data stream.
  return () => window.removeEventListener('message', onMessage);
};

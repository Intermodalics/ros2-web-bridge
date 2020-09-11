// Copyright (c) 2017 Intel Corporation. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const RefCountingHandle = require('./ref_counting_handle.js');
const debug = require('debug')('ros2-web-bridge:SubscriptionManager');

class HandleWithCallbacks extends RefCountingHandle {
  constructor(object, destroyHandle) {
    super(object, destroyHandle);
    this._callbacks = new Map();
  }

  addCallback(id, callback) {
    this._callbacks.set(id, callback);
  }

  removeCallback(id) {
    this._callbacks.delete(id);
  }

  hasCallbackForId(id) {
    return this._callbacks.has(id);
  }

  get callbacks() {
    return Array.from(this._callbacks.values());
  }
}

class SubscriptionManager {
  constructor(node) {
    this._subscripions = new Map();
    this._node = node;
  }

  getSubscriptionByTopicName(topicName, bridgeId) {
    const subscriptionKey = this.getSubscriptionKey(topicName, bridgeId)
    return this._subscripions.get(subscriptionKey);
  }

  getSubscriptionKey(topicName, bridgeId) {
    return `${topicName}:${bridgeId}`;
  }

  createSubscription(messageType, topicName, bridgeId, callback) {
    const subscriptionKey = this.getSubscriptionKey(topicName, bridgeId)
    let handle = this._subscripions.get(subscriptionKey);

    if (!handle) {
      const defaultOpts = {}
      let opts = subscriptionManager._opts[topicName] !== undefined ? subscriptionManager._opts[topicName] : defaultOpts

      console.log(topicName, opts)

      let subscription = this._node.createSubscription(messageType, topicName, {enableTypedArray: false, ...opts}, (message) => {
        this._subscripions.get(subscriptionKey).callbacks.forEach(callback => {
          callback(topicName, message);
        });
      });
      handle = new HandleWithCallbacks(subscription, this._node.destroySubscription.bind(this._node));
      handle.addCallback(bridgeId, callback);
      this._subscripions.set(subscriptionKey, handle);
      debug(`Subscription has been created, and the topic name is ${topicName}.`);

      return handle.get();
    }

    handle.addCallback(bridgeId, callback);
    handle.retain();
    return handle.get();
  }

  destroySubscription(topicName, bridgeId) {
    const subscriptionKey = this.getSubscriptionKey(topicName, bridgeId)

    if (this._subscripions.has(subscriptionKey)) {
      let handle = this._subscripions.get(subscriptionKey);
      if (handle.hasCallbackForId(bridgeId)) {
        handle.removeCallback(bridgeId);
        handle.release();
        if (handle.count === 0) {
          this._subscripions.delete(subscriptionKey);
        }
      }
    }
  }

  destroyForBridgeId(bridgeId) {
    this._subscripions.forEach(handle => {
      if (handle.hasCallbackForId(bridgeId)) {
        handle.removeCallback(bridgeId);
        handle.release();
        this._removeInvalidHandle();
      }
    });
  }

  _removeInvalidHandle() {
    this._subscripions.forEach((handle, subscriptionKey, map) => {
      if (handle.count === 0) {
        map.delete(subscriptionKey);
      }
    });
  }
}

let subscriptionManager = {
  _instance: undefined,

  init(node) {
    if (!this._instance) {
      this._instance = new SubscriptionManager(node);
    }
  },

  getInstance() {
    return this._instance;
  }
};

module.exports = subscriptionManager;

/*
 * Copyright 2016 Scott Bender <scott@scottbender.net>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const util = require('util')
const fs = require('fs')
const _ = require('lodash')
const request = require("request")

module.exports = function(app) {
  var unsubscribes = []
  var plugin = {}
  var privateKey
  var last_states = {}
  
  plugin.start = function(props) {
    privateKey = props.privateKey

    command = {
      context: "vessels.self",
      subscribe: [{
        path: "notifications.*",
        minPeriod: 1000
      }]
    }
    
    app.subscriptionmanager.subscribe(command, unsubscribes, subscription_error, got_delta)
    //devices = readJson(app, "devices" , plugin.id)
    //send_push(app, devices[Object.keys(devices)[0]], "Hellow", "some.path")
  };

  function subscription_error(err)
  {
    app.error("error: " + err)
  }

  function got_delta(notification)
  {
    handleNotificationDelta(notification)
  }

  plugin.stop = function() {
    unsubscribes.forEach(function(func) { func() })
    unsubscribes = []
  }

  function handleNotificationDelta(notification)
  {
    app.debug("notification: " +
              util.inspect(notification, {showHidden: false, depth: 6}))
    
    
    notification.updates.forEach(function(update) {
      update.values.forEach(function(value) {
        if ( value.value != null
             && typeof value.value.message != 'undefined'
             && value.value.message != null
             && value.value.state != 'undefined'
             && value.value.state != 'normal' )
        {
          if ( last_states[value.path] == null
               || last_states[value.path] != value.value.state )
          {
            last_states[value.path] = value.value.state
            app.debug("message:" + value.value.message)
            
            send_to_iftt("SignalKNotification", value.value.state, value.value.message, value.path)
            send_to_iftt("SignalKNotification." + value.value.state, value.value.state, value.value.message, value.path)            
            send_to_iftt(value.path, value.value.state, value.value.message,
                         value.path)
            send_to_iftt(value.path + ".state." + value.value.state, value.value.state,
                         value.value.message, value.path)            
          }
        }
        else if ( last_states[value.path] )
        {
          delete last_states[value.path]
        }
      })
    })
  }



  function send_to_iftt(eventName, state, message, path)
  {
    var url = "https://maker.ifttt.com/trigger/" + eventName + "/with/key/" + privateKey
    app.debug("url: " + url)
    json = { "message": message, "state": state, "path": path }

    app.debug("json: " + JSON.stringify(json))
    request({
      url: url,
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      json: true,
      body: json,
    }, function(error, response, body)
            {
              if (!error && response.statusCode === 200) {
                debug(body)
              }
              else {
                console.log("error: " + error)
                console.log("response.statusCode: " + response.statusCode)
                console.log("response.statusText: " + response.statusText)
              }
            }
           )
  }

  plugin.id = "iftt-notifications"
  plugin.name = "IFTT Notifications"
  plugin.description = "Plugin that sends SignalK notifications to a IFFTT Maker channek"

  plugin.schema = {
    title: "Push Notifications",
    properties: {
      privateKey: {
        type: "string"
      }
      
      /*
      devices: {
        type: "array",
        title: " ",
        items: {
          title: "Registered Devices",
          type: "object",
          properties: {
            "deviceName": {
              title: "Device Name",
              type: "string",
            },
            "accessKey": {
              title: "Amazon SNS Access Key",
              type: "string",
            },
            "secretAccessKey": {
              title: "Amazon Secret Access Key",
              type: "string",
            },
            "targetArn": {
              title: "Target Amazon ARN",
              type: "string",
            },
          }
        }
      }
*/
    }
    
  }
  return plugin;
}


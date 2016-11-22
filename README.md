# signalk-ifttt-notifications
Trigger ifttt actions when alarms go off

Install with

```
cd /usr/local/src/signalk-server-node
npm install signalk-ifttt-notifications
```

Go to IFTTT Applets section and create a new Applet. For "this", choose the Maker service. Then click on the "Receive a web request" box.
Enter the notification key for the event name.For example, "notifications.environment.wind.speedApparent". Then choose something to do for "that".

Now go to the IFTT Services section and click on Maker, then go to settings. Get your private key. 
It's the string after "https://maker.ifttt.com/use/"


Now start your server and go to <http://localhost:3000/plugins/configure>. Make sure the plugin is Active and enter your IFTTT private key.

There are a few options for setting the event name on the IFTTT side. For each notification, four events are sent to IFTTT. This way you can setup generic applets to handle things like any 'emergency' notification. And you can also setup specific applets for specific notifications and/or states.

The four events:

1. "SignalKNotification" - used to have an action for any notification
2. "SignalKNotification.{state}" -  used to have an action for any notification with a specific state. For example, "SignalKNotification.emergency". (states are "warn", "alert", "alarm" and "emergency")
3. "notifications.{path}" - used to have an action for a specific notification in any state. For example: "notifications.environment.depth.belowSurface"
4. "notifications.{path}.{state}" - used to have an action for a specific notification in a specific state. For example: "notifications.environment.depth.belowSurface.warn"

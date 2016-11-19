# signalk-ifttt-notifications
Trigger ifttt actions when alarms go off

Install with

```
npm install signalk-ifttt-notifications
```

Go to IFTTT Applets section and create a new Applet. For "this", choose the Maker service. Then click on the "Receive a web request" box.
Enter the notification key for the event name.For example, "notifications.environment.wind.speedApparent". Then choose something to do for "that".

Now go to the IFTT Services section and click on Maker, then go to settings. Get your private key. 
It's the string after "https://maker.ifttt.com/use/"


Now start your server and go to <http://localhost:3000/plugins/configure>. Make sure the plugin is Active and enter your IFTTT private key.


Deploying Node.js & Socket.io app to Azure Web App
21 MARCH 2016 on Azure, Node.js, Socket.io, WebSockets
Source on GitHub

Even though the title of this post might sound trivial, but in practice it is not. I was really stretching myself trying to figure out how to deploy Node.js app with Socket.io to Azure. Locally I managed to put this into working, but deployment to Azure was tricky.

This post will walk through following points:

Creating Node.js app,
Deploying app to Azure,
Enabling Socket.io,
Creating Node.js app
The very first step is to create Node.js app, without Socket.io yet. This will come later. I'm doing such steps, because it turned out to be an easier way to spot an error. 
Anyway, since this app will use Express web framework (version 4.13.4) we need to go through few point in order to make such page.

Install Express.js, if you don't have it yet. 
npm install express -g
Next, install a handy tool called Express Generator which will generate and setup Express web application for us. 
npm install express-generator -g
Now, we are good to generate a new application. 
express app 
This command will create a structure of directories and files under the folder "app" with our new application. As the output of command suggests move up to the new create folder and install all dependencies. 
cd app && npm install
Ok, let see our new application. First of all we need to start the server with our new created application. In order to do this I will installed Visual Studio Code which it is my IDE. I am starting it with code . and then F5. 
When server is up and running the app, we can open web browser and in the address bar put following address localhost:3000. This should show this: 
Before we dive into Azure world, let's make a last small adjustment to the home page. 
In order to show WebSockets in the action, we need a client (browser) to be able to show coming data from the server. We need to add a new element <span id="random"></span> to  views\index.jade view.

extends layout

block content  
  h1= title
  This is the random number from server: 
  span#random
Deploying application to Azure
The best way to deploy the application to Azure will be with the use of Git. The flow is following: init local Git repository, add all (except node_module/*) files to stash and commit the changes.

(commands must be run when prompt is set to the app folder) 
git init 
echo node_modules/ > .gitignore 
git add . 
git commit -m "initial checkin"

Super! Now, it's time to create Azure Web Application. Let's login to Azure Portal, and create a new Web App. This should be self-explanatory process (use below picture if you are in doubts). 


To enable Git deployment on the Azure Web App, "Deployment Source" setting must be visited and set its value to "Local Git Repository". The next setting is "Deployment credentials" where "Deployment user name" and "Password" must be entered. 


Finally, now it is time to carry out the deployment. First, we need to add the Git repository a new remote address, which can be accomplished by typing following command: 
git remote add azure https://user111@app1981.scm.azurewebsites.net:443/app1981.git
and later pushing changes to Azure: 
git push azure master

Opening web browser with address http://app1981.azurewebsites.net should display the same page which was shown previously locally.

Enabling Socket.io,
Finally, we reached the level where the true action will happen. The changes in this point will affect all three areas: client, Azure and server. Let's start will client.

Create main.js file under folder public/javascripts/
Getting socket.io Client - in order to keep this example simple I will put CDN path as link in file views/layout.jade (code below).
script(src='https://cdn.socket.io/socket.io-1.4.5.js')  
script(src='javascripts/main.js')  
Let's write a code which will initialize communication with server and fire event when a new message is published by server
var socket = io.connect(window.location.href);  
socket.on('servermessage', function(msg) {  
   var element = document.getElementById('random');
   element.innerHTML = msg;
});
Btw. Do you have problem with the link anatomy? Check this out.

Great! Client is done, now it is time to enable WebSockets on Azure. 
Let's login to Azure Portal, and open "Application Settings" of the Web App we created earlier and Enable "Web sockets". 


Uff. It is time to change some code on server and I must admit this is the most tricky part. The Socket.io Docs do not really touch the problem. The thing is, if we generate an app with express generator a file bin/www is created. This file deals with starting up the Node.js server. The server is later used in app.js to attach an Socket.io instance. This introduces sort of loop of dependencies. The file bin/www before starting up a server instance requires app.js which requires the server instance to be initialized and running in order to attach socket.io instance. Yeap, that's it :) 
Let's see exact steps to make the server to work.

Get Socket.io with the power of NPM 
npm install socket.io --save
Let's make an instance of Socket.io and fire up a new message with a random data. In order to do we will need to make changes in app.js
... 
var app = express();  
app.io = require('socket.io')();  
...

app.io.on('connection', function(socket) {  
   setInterval(function() {
       socket.emit('servermessage', Math.floor((Math.random() * 100000)));
   }, 1000); 
});
module.exports = app;  
Finally, let's attach the socket.io instance to the server in bin/www file.
...
var io = app.io;  
...
var server = http.createServer(app);  
io.attach(server);  
...
Hit F5 or type node bin\www to start the server. Next, open browser localhost:3000 and see if this works. I hope you see random numbers displayed.

Super! Let's update out Azure server and prove it also works there. 
So, without unnecessary waffle: 
git add . 
git commit -m "with websockets on board" 
git push azure master

I hope, I could help!

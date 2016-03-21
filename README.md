Deploying Node.js & Socket.io app to Azure Web App

The Socket.io Docs do not really touch the problem. The thing is, if we generate an app with express generator a file bin/www is created. This file deals with starting up the Node.js server. The server is later used in app.js to attach an Socket.io instance. This introduces sort of loop of dependencies. The file bin/www before starting up a server instance requires app.js which requires the server instance to be initialized and running in order to attach socket.io instance. Yeap, that's it :) 

Here is the link to the full post http://gooddeveloper.azurewebsites.net/2016/03/21/deploying-node-js-app-with-socket-io/

# Chat Appication
### ESC101 Advance Track Project 

This project aims to provide basic chat functionality to the people in the campus of __Indian Institute Of Technology, Kanpur__. This project is for ESC101A (Introduction to Computing)

Mentored by: Govind Gopakumar (@govig)

### Timeline

* 25th February: Learnt how Websockets work, and how we require a HTTP server to serve requests from a browser. Used an implementation of a webserver in Python, [SimpleWebSocketServer](https://github.com/dpallot/simple-websocket-server).

* 27th February: Added basic Frontend elements, still need to figure out the complete Frontend layout. Urgent TODO: Form the backend quickly

* 1st March: Changing backend server from Python to a NodeJS HTTP Server, front-end remains some. Decision taken due to a lot of shortcomings using a Python backend, such as poor support of handling events, etc. (Would have to use a lot of libraries and still would not have got the required result)

* 4th March: Basic layout completed, need to add authentication and rooms option needs to be integrated with Frontend. Approximating deadline as 8th March for this.

* 6th March: Implementing Passport.js for session rememberance, and authentication. Quite a lot of work. Working on Routes, since if authentication is added, the server needs to handle if someone unauthenticated doesn't get sensitive (:P) information.

*10th April: Fixed up a lot of things. 

#### Basic File Structure
~~~
.
├── chat-app
│   ├── app.js
│   ├── bin
│   │   └── www
│   ├── config
│   │   ├── database.js
│   │   └── passport.js
│   ├── models
│   │   ├── room.js
│   │   └── user.js
│   ├── npm-debug.log
│   ├── public
│   │   ├── images
│   │   ├── javascripts
│   │   │   └── script.js
│   │   └── stylesheets
│   │       └── style.css
│   ├── routes
│   │   └── index.js
│   ├── test
│   │   ├── app_spec.js
│   │   └── test.js
│   └── views
│       ├── chatroom.ejs
│       ├── error.ejs
│       ├── index.ejs
│       ├── login.ejs
│       ├── partials
│       │   └── head.ejs
│       ├── rooms.ejs
│       └── signup.ejs
└── package.json
~~~

Homework Assignment #1

Please create a simple "Hello World" API. Meaning:
1. It should be a RESTful JSON API that listens on a port of your choice.
2. When someone posts anything to the route /hello, you should return a welcome message, in JSON format. This message can be anything you want.

## Solution

Simple HTTP(port 3000)/HTTPS(port 3001) server which sends back JSON formatted 'Welcome' message in case the route '/hello' is used.

## App start

In your console cd to the app folder and type
``` sh
node index.js
```

## App use

>http://localhost:3000/hello

>https://localhost:3001/hello

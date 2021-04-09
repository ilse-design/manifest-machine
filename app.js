var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

//app is the application communicating on port 80
var app = express();


const server = app.listen(80, () => {
    console.log("Listening on port: " + 80);
});

var Gpio = require('onoff').Gpio; //require onoff to control GPIO
var LEDPin = new Gpio(4, 'out'); //declare GPIO4 an output
var fs = require('fs'); //require filesystem to read html files

const io = require('socket.io')(server, {
    cors: {
        origin: "http://localhost:80",
        methods: ["GET", "POST"],
        transports: ['websocket', 'polling'],
        credentials: true
    },
    allowEIO3: true
});


// video is the application doing internal comunication with the webcam
//var video = express();

//const videoStream = require('raspberrypi-node-camera-web-streamer');
//videoStream.acceptConnections(video, {
//    width: 1280,
//    height: 720,
//    fps: 16,
//    encoding: 'JPEG',
//    quality: 7 //lower is faster
//}, '/stream.mjpg', true);

//const video_server = video.listen(3000, () => {
//console.log("listing to local video stream" + 3000);
//});


// view engine setup
//app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

io.sockets.on('connection', function (socket) {// WebSocket Connection

console.log("socket turned on");

  var buttonState = 0; //variable to store button state

  socket.on('state', function (data) { //get button state from client
    buttonState = data;
console.log("incomming data saved");
console.log(data);

    if (buttonState != LEDPin.readSync()) { //Change LED state if button state is changed
      LEDPin.writeSync(buttonState); //turn LED on or off
      console.log("button has pressed server recievd")
    }
  });
});


module.exports = app;

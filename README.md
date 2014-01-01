std-log
=======
std-log is a lightweight logging library.
Features:
 - severity levels comply to Syslog severity levels as defined in [RFC 5424]
 - configurable transports
 - configurable preprocessing function
 - logging methods are context agnostic


Installation
------------
```sh
npm install std-log
```


Transports
----------
Transports are the way the log messages are presented to the user.
The default and only transport available out of the box is ConsoleTransport, but feel free to provide a constructor to completely different one. For example:

```javascript
function FileTransport(options) {
    this.fileName = options.fileName;
}
['emergency', 'alert', 'critical', 'error', 'warning', 'notice', 'info', 'debug']
.forEach(function(severity) {
    FileTransport.prototype[severity] = function(msgParts) {
		fs.writeFile(this.FileName, msgParts.join(' '), 'utf8');
	};
});

var log = require('std-log')({
    transport: FileTransport,
    fileName: './app.log'
}).log;

log('This will be in file instead of console');
```
Every transport must be a constructor, who's prototype must implement the following methods:
 - emergency
 - alert
 - critical
 - error
 - warning
 - notice
 - info
 - debug

Each of them is a function with the following signature:
```javascript
function (msgParts, severity, severityIndex) {
    ...
}
```

Processors
----------
Processors are the way to alter every logged message before being sent to transport.

```javascript
var clc = require('cli-color');
var moment = require('moment');
var colors = [/* hole */,
    clc.bgRedBright.yellowBright,
	clc.bgRed.whiteBright,
	clc.bgRed.white,
	clc.redBright,
	clc.yellowBright,
	clc.cyanBright,
	clc.white,
	clc.blackBright
];
var warn = require('std-log')({
    level: 5,
    process: function(msgParts, severity, severityIndex) {
		var time = moment().format('YYYY-MM-DD HH:mm:ss');
		msgParts.unshift('[' + colors[severityIndex](time) + ']');
		return msgParts;
	}
}).warn;
warn('This is a warning');
// outputs:
// [2014-01-01 20:27:59] This is a warning
// the date and time inside square brackets will be in yellow bright color
```

License
-------
MIT





[RFC 5424]:http://tools.ietf.org/html/rfc5424#page-11

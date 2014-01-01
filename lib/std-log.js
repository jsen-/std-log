'use strict';

var SEVERITIES = [
	'none',
	'emergency',	// errors
	'alert',
	'critical',
	'error',
	'warning',		// warn
	'notice',		// infos
	'info',						// default
	'debug'			// debug
];

var ConsoleTransport = (function() {
	var mappings = {
		emergency: 	console.error,
		alert: 		console.error,
		critical: 	console.error,
		error: 		console.error,
		warning: 	console.warn,
		notice: 	console.info,
		info: 		console.info,
		debug: 		console.log
	};

	function ConsoleTransport(options) { }

	SEVERITIES.forEach(function(severity, index) {
		ConsoleTransport.prototype[severity] = function(msgParts) {
			mappings[severity].apply(console, msgParts);
		};
	});

	return ConsoleTransport;
}());



function normalizeLevel(level) {
	var levelIndex = SEVERITIES.indexOf(level);
	if(levelIndex !== -1) {
		level = levelIndex;
	} else {
		if((typeof level === 'number' || level instanceof Number) && level === level) {
			if(level < 0) {
				level = 0;
			} else if(level > 8) {
				level = 8;
			} else {
				level = Math.round(level);
			}
		} else {
			level = null;
		}
	}
	return level;
}


function getTransport(options) {
	return new (options.transport || factory.transports.Console)(options);
}

function getProcessor(options) {
	var processor = options.process;
	if(processor instanceof Function) {
		return processor;
	}
	return function(args) {
		return args;
	}
}

function factory(options) {
	var _level;
	if(typeof options === 'object') {
		_level = normalizeLevel(options.level);
		if(_level === null) {
			_level = factory.DEFAULT_LOG_LEVEL;
		}
	} else {
		_level = normalizeLevel(options);
		if(_level !== null) {
			options = { };
		} else {
			throw new factory.InvalidOptions(options);
		}
	}

	var transport = getTransport(options);
	var processor = getProcessor(options);
	var dispatcher = Object.create(null, {
		setLevel: {
			value: function(level) {
				var l = normalizeLevel(level);
				if(l !== null) {
					_level = l;
				} else {
					throw new factory.InvalidLogLevel(level);
				}
			}
		}
	});

	function makeDispatcherMethod(severity, index) {
		dispatcher[severity] = function() {
			if(_level >= index) {
				transport[severity](processor(Array.prototype.slice.call(arguments), severity, index), severity, index);
			}
		};
	}

	for(var index=1; index<SEVERITIES.length; ++index) {
		makeDispatcherMethod(SEVERITIES[index], index);
	};

	// a few convenience methods
	dispatcher.err = dispatcher.error;
	dispatcher.warn = dispatcher.warning;
	dispatcher.log = dispatcher.info;

	// the dispatcher is responsible for:
	//  - throwing away messages of severity above logging level
	//  - calling processing functions
	//  - translating convenience functions to standard ones (eg. log => info)
	//  - being context insensitive, eg: var log = require('node-std-log')().log; log('works');
	return dispatcher;
}
factory.SEVERITIES = SEVERITIES;
factory.DEFAULT_LOG_LEVEL = 7; // info
factory.version = require('../package.json').version;
factory.transports = {
	Console: ConsoleTransport
};

// ERRORS
function InvalidLogLevel(level) {
	this.name = 'InvalidLogLevel';
	this.message = 'Invalid log level specified: "' + level + '"';
}
InvalidLogLevel.prototype = Object.create(Error.prototype);
factory.InvalidLogLevel = InvalidLogLevel;

function InvalidOptions(options) {
	this.name = 'InvalidOptions';
	this.message = 'Invalid Options specified: "' + options + '"';
}
InvalidOptions.prototype = Object.create(Error.prototype);
factory.InvalidOptions = InvalidOptions;


module.exports = factory;

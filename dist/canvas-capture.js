(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["CanvasCapture"] = factory();
	else
		root["CanvasCapture"] = factory();
})(self, function() {
return /******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ 583:
/***/ ((module, exports, __webpack_require__) => {

/* module decorator */ module = __webpack_require__.nmd(module);
var __WEBPACK_AMD_DEFINE_RESULT__;;(function() {

if ( true && typeof module.exports !== 'undefined') {
  var Tar = __webpack_require__(617);
  var download = __webpack_require__(549);
  var GIF = __webpack_require__(468);
  var WebMWriter = __webpack_require__(627);
}

"use strict";

var objectTypes = {
'function': true,
'object': true
};

function checkGlobal(value) {
    return (value && value.Object === Object) ? value : null;
  }

/** Built-in method references without a dependency on `root`. */
var freeParseFloat = parseFloat,
  freeParseInt = parseInt;

/** Detect free variable `exports`. */
var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
? exports
: undefined;

/** Detect free variable `module`. */
var freeModule = (objectTypes["object"] && module && !module.nodeType)
? module
: undefined;

/** Detect the popular CommonJS extension `module.exports`. */
var moduleExports = (freeModule && freeModule.exports === freeExports)
? freeExports
: undefined;

/** Detect free variable `global` from Node.js. */
var freeGlobal = checkGlobal(freeExports && freeModule && typeof __webpack_require__.g == 'object' && __webpack_require__.g);

/** Detect free variable `self`. */
var freeSelf = checkGlobal(objectTypes[typeof self] && self);

/** Detect free variable `window`. */
var freeWindow = checkGlobal(objectTypes[typeof window] && window);

/** Detect `this` as the global object. */
var thisGlobal = checkGlobal(objectTypes[typeof this] && this);

/**
* Used as a reference to the global object.
*
* The `this` value is used if it's the global object to avoid Greasemonkey's
* restricted `window` object, otherwise the `window` object is used.
*/
var root = freeGlobal ||
((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
  freeSelf || thisGlobal || Function('return this')();

if( !('gc' in window ) ) {
	window.gc = function(){}
}

if (!HTMLCanvasElement.prototype.toBlob) {
 Object.defineProperty(HTMLCanvasElement.prototype, 'toBlob', {
  value: function (callback, type, quality) {

    var binStr = atob( this.toDataURL(type, quality).split(',')[1] ),
        len = binStr.length,
        arr = new Uint8Array(len);

    for (var i=0; i<len; i++ ) {
     arr[i] = binStr.charCodeAt(i);
    }

    callback( new Blob( [arr], {type: type || 'image/png'} ) );
  }
 });
}

// @license http://opensource.org/licenses/MIT
// copyright Paul Irish 2015


// Date.now() is supported everywhere except IE8. For IE8 we use the Date.now polyfill
//   github.com/Financial-Times/polyfill-service/blob/master/polyfills/Date.now/polyfill.js
// as Safari 6 doesn't have support for NavigationTiming, we use a Date.now() timestamp for relative values

// if you want values similar to what you'd get with real perf.now, place this towards the head of the page
// but in reality, you're just getting the delta between now() calls, so it's not terribly important where it's placed


(function(){

  if ("performance" in window == false) {
      window.performance = {};
  }

  Date.now = (Date.now || function () {  // thanks IE8
	  return new Date().getTime();
  });

  if ("now" in window.performance == false){

    var nowOffset = Date.now();

    if (performance.timing && performance.timing.navigationStart){
      nowOffset = performance.timing.navigationStart
    }

    window.performance.now = function now(){
      return Date.now() - nowOffset;
    }
  }

})();


function pad( n ) {
	return String("0000000" + n).slice(-7);
}
// https://developer.mozilla.org/en-US/Add-ons/Code_snippets/Timers

var g_startTime = window.Date.now();

function guid() {
	function s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}
	return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}

function CCFrameEncoder( settings ) {

	var _handlers = {};

	this.settings = settings;

	this.on = function(event, handler) {

		_handlers[event] = handler;

	};

	this.emit = function(event) {

		var handler = _handlers[event];
		if (handler) {

			handler.apply(null, Array.prototype.slice.call(arguments, 1));

		}

	};

	this.filename = settings.name || guid();
	this.extension = '';
	this.mimeType = '';

}

CCFrameEncoder.prototype.start = function(){};
CCFrameEncoder.prototype.stop = function(){};
CCFrameEncoder.prototype.add = function(){};
CCFrameEncoder.prototype.save = function(){};
CCFrameEncoder.prototype.dispose = function(){};
CCFrameEncoder.prototype.safeToProceed = function(){ return true; };
CCFrameEncoder.prototype.step = function() { console.log( 'Step not set!' ) }

function CCTarEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	this.extension = '.tar'
	this.mimeType = 'application/x-tar'
	this.fileExtension = '';

	this.tape = null
	this.count = 0;

}

CCTarEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCTarEncoder.prototype.start = function(){

	this.dispose();

};

CCTarEncoder.prototype.add = function( blob ) {

	var fileReader = new FileReader();
	fileReader.onload = function() {
		this.tape.append( pad( this.count ) + this.fileExtension, new Uint8Array( fileReader.result ) );

		//if( this.settings.autoSaveTime > 0 && ( this.frames.length / this.settings.framerate ) >= this.settings.autoSaveTime ) {

		this.count++;
		this.step();
	}.bind( this );
	fileReader.readAsArrayBuffer(blob);

}

CCTarEncoder.prototype.save = function( callback ) {

	callback( this.tape.save() );

}

CCTarEncoder.prototype.dispose = function() {

	this.tape = new Tar();
	this.count = 0;

}

function CCPNGEncoder( settings ) {

	CCTarEncoder.call( this, settings );

	this.type = 'image/png';
	this.fileExtension = '.png';

}

CCPNGEncoder.prototype = Object.create( CCTarEncoder.prototype );

CCPNGEncoder.prototype.add = function( canvas ) {

	canvas.toBlob( function( blob ) {
		CCTarEncoder.prototype.add.call( this, blob );
	}.bind( this ), this.type )

}

function CCJPEGEncoder( settings ) {

	CCTarEncoder.call( this, settings );

	this.type = 'image/jpeg';
	this.fileExtension = '.jpg';
	this.quality = ( settings.quality / 100 ) || .8;

}

CCJPEGEncoder.prototype = Object.create( CCTarEncoder.prototype );

CCJPEGEncoder.prototype.add = function( canvas ) {

	canvas.toBlob( function( blob ) {
		CCTarEncoder.prototype.add.call( this, blob );
	}.bind( this ), this.type, this.quality )

}

/*

	WebM Encoder

*/

function CCWebMEncoder( settings ) {

	var canvas = document.createElement( 'canvas' );
	if( canvas.toDataURL( 'image/webp' ).substr(5,10) !== 'image/webp' ){
		console.log( "WebP not supported - try another export format" )
	}

	CCFrameEncoder.call( this, settings );

	this.quality = ( settings.quality / 100 ) || .8;

	this.extension = '.webm'
	this.mimeType = 'video/webm'
	this.baseFilename = this.filename;

	this.frames = [];
	this.part = 1;

  this.videoWriter = new WebMWriter({
    quality: this.quality,
    fileWriter: null,
    fd: null,
    frameRate: settings.framerate
});


}

CCWebMEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCWebMEncoder.prototype.start = function( canvas ) {

	this.dispose();

}

CCWebMEncoder.prototype.add = function( canvas ) {

  this.videoWriter.addFrame(canvas);

	//this.frames.push( canvas.toDataURL('image/webp', this.quality) );

	if( this.settings.autoSaveTime > 0 && ( this.frames.length / this.settings.framerate ) >= this.settings.autoSaveTime ) {
		this.save( function( blob ) {
			this.filename = this.baseFilename + '-part-' + pad( this.part );
			download( blob, this.filename + this.extension, this.mimeType );
			this.dispose();
			this.part++;
			this.filename = this.baseFilename + '-part-' + pad( this.part );
			this.step();
		}.bind( this ) )
	} else {
		this.step();
	}

}

CCWebMEncoder.prototype.save = function( callback ) {

//	if( !this.frames.length ) return;

  this.videoWriter.complete().then(callback);

	/*var webm = Whammy.fromImageArray( this.frames, this.settings.framerate )
	var blob = new Blob( [ webm ], { type: "octet/stream" } );
	callback( blob );*/

}

CCWebMEncoder.prototype.dispose = function( canvas ) {

	this.frames = [];

}

function CCFFMpegServerEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	settings.quality = ( settings.quality / 100 ) || .8;

	this.encoder = new FFMpegServer.Video( settings );
    this.encoder.on( 'process', function() {
        this.emit( 'process' )
    }.bind( this ) );
    this.encoder.on('finished', function( url, size ) {
        var cb = this.callback;
        if ( cb ) {
            this.callback = undefined;
            cb( url, size );
        }
    }.bind( this ) );
    this.encoder.on( 'progress', function( progress ) {
        if ( this.settings.onProgress ) {
            this.settings.onProgress( progress )
        }
    }.bind( this ) );
    this.encoder.on( 'error', function( data ) {
        alert(JSON.stringify(data, null, 2));
    }.bind( this ) );

}

CCFFMpegServerEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCFFMpegServerEncoder.prototype.start = function() {

	this.encoder.start( this.settings );

};

CCFFMpegServerEncoder.prototype.add = function( canvas ) {

	this.encoder.add( canvas );

}

CCFFMpegServerEncoder.prototype.save = function( callback ) {

    this.callback = callback;
    this.encoder.end();

}

CCFFMpegServerEncoder.prototype.safeToProceed = function() {
    return this.encoder.safeToProceed();
};

/*
	HTMLCanvasElement.captureStream()
*/

function CCStreamEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	this.framerate = this.settings.framerate;
	this.type = 'video/webm';
	this.extension = '.webm';
	this.stream = null;
	this.mediaRecorder = null;
	this.chunks = [];

}

CCStreamEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCStreamEncoder.prototype.add = function( canvas ) {

	if( !this.stream ) {
		this.stream = canvas.captureStream( this.framerate );
		this.mediaRecorder = new MediaRecorder( this.stream );
		this.mediaRecorder.start();

		this.mediaRecorder.ondataavailable = function(e) {
			this.chunks.push(e.data);
		}.bind( this );

	}
	this.step();

}

CCStreamEncoder.prototype.save = function( callback ) {

	this.mediaRecorder.onstop = function( e ) {
		var blob = new Blob( this.chunks, { 'type' : 'video/webm' });
		this.chunks = [];
		callback( blob );

	}.bind( this );

	this.mediaRecorder.stop();

}

/*function CCGIFEncoder( settings ) {

	CCFrameEncoder.call( this );

	settings.quality = settings.quality || 6;
	this.settings = settings;

	this.encoder = new GIFEncoder();
	this.encoder.setRepeat( 1 );
  	this.encoder.setDelay( settings.step );
  	this.encoder.setQuality( 6 );
  	this.encoder.setTransparent( null );
  	this.encoder.setSize( 150, 150 );

  	this.canvas = document.createElement( 'canvas' );
  	this.ctx = this.canvas.getContext( '2d' );

}

CCGIFEncoder.prototype = Object.create( CCFrameEncoder );

CCGIFEncoder.prototype.start = function() {

	this.encoder.start();

}

CCGIFEncoder.prototype.add = function( canvas ) {

	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	this.ctx.drawImage( canvas, 0, 0 );
	this.encoder.addFrame( this.ctx );

	this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );

}

CCGIFEncoder.prototype.stop = function() {

	this.encoder.finish();

}

CCGIFEncoder.prototype.save = function( callback ) {

	var binary_gif = this.encoder.stream().getData();

	var data_url = 'data:image/gif;base64,'+encode64(binary_gif);
	window.location = data_url;
	return;

	var blob = new Blob( [ binary_gif ], { type: "octet/stream" } );
	var url = window.URL.createObjectURL( blob );
	callback( url );

}*/

function CCGIFEncoder( settings ) {

	CCFrameEncoder.call( this, settings );

	settings.quality = 31 - ( ( settings.quality * 30 / 100 ) || 10 );
	settings.workers = settings.workers || 4;

	this.extension = '.gif'
	this.mimeType = 'image/gif'

  	this.canvas = document.createElement( 'canvas' );
  	this.ctx = this.canvas.getContext( '2d' );
  	this.sizeSet = false;

  	this.encoder = new GIF({
		workers: settings.workers,
		quality: settings.quality,
		workerScript: settings.workersPath,
	} );

    this.encoder.on( 'progress', function( progress ) {
        if ( this.settings.onProgress ) {
            this.settings.onProgress( progress )
        }
    }.bind( this ) );

    this.encoder.on('finished', function( blob ) {
        var cb = this.callback;
        if ( cb ) {
            this.callback = undefined;
            cb( blob );
        }
    }.bind( this ) );

}

CCGIFEncoder.prototype = Object.create( CCFrameEncoder.prototype );

CCGIFEncoder.prototype.add = function( canvas ) {

	if( !this.sizeSet ) {
		this.encoder.setOption( 'width',canvas.width );
		this.encoder.setOption( 'height',canvas.height );
		this.sizeSet = true;
	}

	this.canvas.width = canvas.width;
	this.canvas.height = canvas.height;
	this.ctx.drawImage( canvas, 0, 0 );

	this.encoder.addFrame( this.ctx, { copy: true, delay: this.settings.step } );
	this.step();

	/*this.encoder.setSize( canvas.width, canvas.height );
	var readBuffer = new Uint8Array(canvas.width * canvas.height * 4);
	var context = canvas.getContext( 'webgl' );
	context.readPixels(0, 0, canvas.width, canvas.height, context.RGBA, context.UNSIGNED_BYTE, readBuffer);
	this.encoder.addFrame( readBuffer, true );*/

}

CCGIFEncoder.prototype.save = function( callback ) {

    this.callback = callback;

	this.encoder.render();

}

function CCapture( settings ) {

	var _settings = settings || {},
		_date = new Date(),
		_verbose,
		_display,
		_time,
		_startTime,
		_performanceTime,
		_performanceStartTime,
		_step,
        _encoder,
		_timeouts = [],
		_intervals = [],
		_frameCount = 0,
		_intermediateFrameCount = 0,
		_lastFrame = null,
		_requestAnimationFrameCallbacks = [],
		_capturing = false,
        _handlers = {};

	_settings.framerate = _settings.framerate || 60;
	_settings.motionBlurFrames = 2 * ( _settings.motionBlurFrames || 1 );
	_verbose = _settings.verbose || false;
	_display = _settings.display || false;
	_settings.step = 1000.0 / _settings.framerate ;
	_settings.timeLimit = _settings.timeLimit || 0;
	_settings.frameLimit = _settings.frameLimit || 0;
	_settings.startTime = _settings.startTime || 0;

	var _timeDisplay = document.createElement( 'div' );
	_timeDisplay.style.position = 'absolute';
	_timeDisplay.style.left = _timeDisplay.style.top = 0
	_timeDisplay.style.backgroundColor = 'black';
	_timeDisplay.style.fontFamily = 'monospace'
	_timeDisplay.style.fontSize = '11px'
	_timeDisplay.style.padding = '5px'
	_timeDisplay.style.color = 'red';
	_timeDisplay.style.zIndex = 100000
	if( _settings.display ) document.body.appendChild( _timeDisplay );

	var canvasMotionBlur = document.createElement( 'canvas' );
	var ctxMotionBlur = canvasMotionBlur.getContext( '2d' );
	var bufferMotionBlur;
	var imageData;

	_log( 'Step is set to ' + _settings.step + 'ms' );

    var _encoders = {
		gif: CCGIFEncoder,
		webm: CCWebMEncoder,
		ffmpegserver: CCFFMpegServerEncoder,
		png: CCPNGEncoder,
		jpg: CCJPEGEncoder,
		'webm-mediarecorder': CCStreamEncoder
    };

    var ctor = _encoders[ _settings.format ];
    if ( !ctor ) {
		throw "Error: Incorrect or missing format: Valid formats are " + Object.keys(_encoders).join(", ");
    }
    _encoder = new ctor( _settings );
    _encoder.step = _step

	_encoder.on('process', _process);
    _encoder.on('progress', _progress);

    if ("performance" in window == false) {
    	window.performance = {};
    }

	Date.now = (Date.now || function () {  // thanks IE8
		return new Date().getTime();
	});

	if ("now" in window.performance == false){

		var nowOffset = Date.now();

		if (performance.timing && performance.timing.navigationStart){
			nowOffset = performance.timing.navigationStart
		}

		window.performance.now = function now(){
			return Date.now() - nowOffset;
		}
	}

	var _oldSetTimeout = window.setTimeout,
		_oldSetInterval = window.setInterval,
	    	_oldClearInterval = window.clearInterval,
		_oldClearTimeout = window.clearTimeout,
		_oldRequestAnimationFrame = window.requestAnimationFrame,
		_oldNow = window.Date.now,
		_oldPerformanceNow = window.performance.now,
		_oldGetTime = window.Date.prototype.getTime;
	// Date.prototype._oldGetTime = Date.prototype.getTime;

	var media = [];

	function _init() {

		_log( 'Capturer start' );

		_startTime = window.Date.now();
		_time = _startTime + _settings.startTime;
		_performanceStartTime = window.performance.now();
		_performanceTime = _performanceStartTime + _settings.startTime;

		window.Date.prototype.getTime = function(){
			return _time;
		};
		window.Date.now = function() {
			return _time;
		};

		window.setTimeout = function( callback, time ) {
			var t = {
				callback: callback,
				time: time,
				triggerTime: _time + time
			};
			_timeouts.push( t );
			_log( 'Timeout set to ' + t.time );
            return t;
		};
		window.clearTimeout = function( id ) {
			for( var j = 0; j < _timeouts.length; j++ ) {
				if( _timeouts[ j ] == id ) {
					_timeouts.splice( j, 1 );
					_log( 'Timeout cleared' );
					continue;
				}
			}
		};
		window.setInterval = function( callback, time ) {
			var t = {
				callback: callback,
				time: time,
				triggerTime: _time + time
			};
			_intervals.push( t );
			_log( 'Interval set to ' + t.time );
			return t;
		};
		window.clearInterval = function( id ) {
			_log( 'clear Interval' );
			return null;
		};
		window.requestAnimationFrame = function( callback ) {
			_requestAnimationFrameCallbacks.push( callback );
		};
		window.performance.now = function(){
			return _performanceTime;
		};

		function hookCurrentTime() {
			if( !this._hooked ) {
				this._hooked = true;
				this._hookedTime = this.currentTime || 0;
				this.pause();
				media.push( this );
			}
			return this._hookedTime + _settings.startTime;
		};

		try {
			Object.defineProperty( HTMLVideoElement.prototype, 'currentTime', { get: hookCurrentTime } )
			Object.defineProperty( HTMLAudioElement.prototype, 'currentTime', { get: hookCurrentTime } )
		} catch (err) {
			_log(err);
		}

	}

	function _start() {
		_init();
		_encoder.start();
		_capturing = true;
	}

	function _stop() {
		_capturing = false;
		_encoder.stop();
		_destroy();
	}

	function _call( fn, p ) {
		_oldSetTimeout( fn, 0, p );
	}

	function _step() {
		//_oldRequestAnimationFrame( _process );
		_call( _process );
	}

	function _destroy() {
		_log( 'Capturer stop' );
		window.setTimeout = _oldSetTimeout;
		window.setInterval = _oldSetInterval;
		window.clearInterval = _oldClearInterval;
		window.clearTimeout = _oldClearTimeout;
		window.requestAnimationFrame = _oldRequestAnimationFrame;
		window.Date.prototype.getTime = _oldGetTime;
		window.Date.now = _oldNow;
		window.performance.now = _oldPerformanceNow;
	}

	function _updateTime() {
		var seconds = _frameCount / _settings.framerate;
		if( ( _settings.frameLimit && _frameCount >= _settings.frameLimit ) || ( _settings.timeLimit && seconds >= _settings.timeLimit ) ) {
			_stop();
			_save();
		}
		var d = new Date( null );
		d.setSeconds( seconds );
		if( _settings.motionBlurFrames > 2 ) {
			_timeDisplay.textContent = 'CCapture ' + _settings.format + ' | ' + _frameCount + ' frames (' + _intermediateFrameCount + ' inter) | ' +  d.toISOString().substr( 11, 8 );
		} else {
			_timeDisplay.textContent = 'CCapture ' + _settings.format + ' | ' + _frameCount + ' frames | ' +  d.toISOString().substr( 11, 8 );
		}
	}

	function _checkFrame( canvas ) {

		if( canvasMotionBlur.width !== canvas.width || canvasMotionBlur.height !== canvas.height ) {
			canvasMotionBlur.width = canvas.width;
			canvasMotionBlur.height = canvas.height;
			bufferMotionBlur = new Uint16Array( canvasMotionBlur.height * canvasMotionBlur.width * 4 );
			ctxMotionBlur.fillStyle = '#0'
			ctxMotionBlur.fillRect( 0, 0, canvasMotionBlur.width, canvasMotionBlur.height );
		}

	}

	function _blendFrame( canvas ) {

		//_log( 'Intermediate Frame: ' + _intermediateFrameCount );

		ctxMotionBlur.drawImage( canvas, 0, 0 );
		imageData = ctxMotionBlur.getImageData( 0, 0, canvasMotionBlur.width, canvasMotionBlur.height );
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			bufferMotionBlur[ j ] += imageData.data[ j ];
			bufferMotionBlur[ j + 1 ] += imageData.data[ j + 1 ];
			bufferMotionBlur[ j + 2 ] += imageData.data[ j + 2 ];
		}
		_intermediateFrameCount++;

	}

	function _saveFrame(){

		var data = imageData.data;
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			data[ j ] = bufferMotionBlur[ j ] * 2 / _settings.motionBlurFrames;
			data[ j + 1 ] = bufferMotionBlur[ j + 1 ] * 2 / _settings.motionBlurFrames;
			data[ j + 2 ] = bufferMotionBlur[ j + 2 ] * 2 / _settings.motionBlurFrames;
		}
		ctxMotionBlur.putImageData( imageData, 0, 0 );
		_encoder.add( canvasMotionBlur );
		_frameCount++;
		_intermediateFrameCount = 0;
		_log( 'Full MB Frame! ' + _frameCount + ' ' +  _time );
		for( var j = 0; j < bufferMotionBlur.length; j+= 4 ) {
			bufferMotionBlur[ j ] = 0;
			bufferMotionBlur[ j + 1 ] = 0;
			bufferMotionBlur[ j + 2 ] = 0;
		}
		gc();

	}

	function _capture( canvas ) {

		if( _capturing ) {

			if( _settings.motionBlurFrames > 2 ) {

				_checkFrame( canvas );
				_blendFrame( canvas );

				if( _intermediateFrameCount >= .5 * _settings.motionBlurFrames ) {
					_saveFrame();
				} else {
					_step();
				}

			} else {
				_encoder.add( canvas );
				_frameCount++;
				_log( 'Full Frame! ' + _frameCount );
			}

		}

	}

	function _process() {

		var step = 1000 / _settings.framerate;
		var dt = ( _frameCount + _intermediateFrameCount / _settings.motionBlurFrames ) * step;

		_time = _startTime + dt;
		_performanceTime = _performanceStartTime + dt;

		media.forEach( function( v ) {
			v._hookedTime = dt / 1000;
		} );

		_updateTime();
		_log( 'Frame: ' + _frameCount + ' ' + _intermediateFrameCount );

		for( var j = 0; j < _timeouts.length; j++ ) {
			if( _time >= _timeouts[ j ].triggerTime ) {
				_call( _timeouts[ j ].callback )
				//console.log( 'timeout!' );
				_timeouts.splice( j, 1 );
				continue;
			}
		}

		for( var j = 0; j < _intervals.length; j++ ) {
			if( _time >= _intervals[ j ].triggerTime ) {
				_call( _intervals[ j ].callback );
				_intervals[ j ].triggerTime += _intervals[ j ].time;
				//console.log( 'interval!' );
				continue;
			}
		}

		_requestAnimationFrameCallbacks.forEach( function( cb ) {
     		_call( cb, _time - g_startTime );
        } );
        _requestAnimationFrameCallbacks = [];

	}

	function _save( callback ) {

		if( !callback ) {
			callback = function( blob ) {
				download( blob, _encoder.filename + _encoder.extension, _encoder.mimeType );
				return false;
			}
		}
		_encoder.save( callback );

	}

	function _log( message ) {
		if( _verbose ) console.log( message );
	}

    function _on( event, handler ) {

        _handlers[event] = handler;

    }

    function _emit( event ) {

        var handler = _handlers[event];
        if ( handler ) {

            handler.apply( null, Array.prototype.slice.call( arguments, 1 ) );

        }

    }

    function _progress( progress ) {

        _emit( 'progress', progress );

    }

	return {
		start: _start,
		capture: _capture,
		stop: _stop,
		save: _save,
        on: _on
	}
}

(freeWindow || freeSelf || {}).CCapture = CCapture;

  // Some AMD build optimizers like r.js check for condition patterns like the following:
  if (true) {
    // Define as an anonymous module so, through path mapping, it can be
    // referenced as the "underscore" module.
    !(__WEBPACK_AMD_DEFINE_RESULT__ = (function() {
    	return CCapture;
    }).call(exports, __webpack_require__, exports, module),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
}
  // Check for `exports` after `define` in case a build optimizer adds an `exports` object.
  else {}

}());


/***/ }),

/***/ 549:
/***/ ((module) => {

//download.js v3.0, by dandavis; 2008-2014. [CCBY2] see http://danml.com/download.html for tests/usage
// v1 landed a FF+Chrome compat way of downloading strings to local un-named files, upgraded to use a hidden frame and optional mime
// v2 added named files via a[download], msSaveBlob, IE (10+) support, and window.URL support for larger+faster saves than dataURLs
// v3 added dataURL and Blob Input, bind-toggle arity, and legacy dataURL fallback was improved with force-download mime and base64 support

// data can be a string, Blob, File, or dataURL




function download(data, strFileName, strMimeType) {

	var self = window, // this script is only for browsers anyway...
		u = "application/octet-stream", // this default mime also triggers iframe downloads
		m = strMimeType || u,
		x = data,
		D = document,
		a = D.createElement("a"),
		z = function(a){return String(a);},


		B = self.Blob || self.MozBlob || self.WebKitBlob || z,
		BB = self.MSBlobBuilder || self.WebKitBlobBuilder || self.BlobBuilder,
		fn = strFileName || "download",
		blob,
		b,
		ua,
		fr;

	//if(typeof B.bind === 'function' ){ B=B.bind(self); }

	if(String(this)==="true"){ //reverse arguments, allowing download.bind(true, "text/xml", "export.xml") to act as a callback
		x=[x, m];
		m=x[0];
		x=x[1];
	}



	//go ahead and download dataURLs right away
	if(String(x).match(/^data\:[\w+\-]+\/[\w+\-]+[,;]/)){
		return navigator.msSaveBlob ?  // IE10 can't do a[download], only Blobs:
			navigator.msSaveBlob(d2b(x), fn) :
			saver(x) ; // everyone else can save dataURLs un-processed
	}//end if dataURL passed?

	try{

		blob = x instanceof B ?
			x :
			new B([x], {type: m}) ;
	}catch(y){
		if(BB){
			b = new BB();
			b.append([x]);
			blob = b.getBlob(m); // the blob
		}

	}



	function d2b(u) {
		var p= u.split(/[:;,]/),
		t= p[1],
		dec= p[2] == "base64" ? atob : decodeURIComponent,
		bin= dec(p.pop()),
		mx= bin.length,
		i= 0,
		uia= new Uint8Array(mx);

		for(i;i<mx;++i) uia[i]= bin.charCodeAt(i);

		return new B([uia], {type: t});
	 }

	function saver(url, winMode){


		if ('download' in a) { //html5 A[download]
			a.href = url;
			a.setAttribute("download", fn);
			a.innerHTML = "downloading...";
			a.style.display = 'none';
			D.body.appendChild(a);
			setTimeout(function() {
				a.click();
				D.body.removeChild(a);
				if(winMode===true){setTimeout(function(){ self.URL.revokeObjectURL(a.href);}, 250 );}
			}, 66);
			return true;
		}

		//do iframe dataURL download (old ch+FF):
		var f = D.createElement("iframe");
		D.body.appendChild(f);
		if(!winMode){ // force a mime that will download:
			url="data:"+url.replace(/^data:([\w\/\-\+]+)/, u);
		}


		f.src = url;
		setTimeout(function(){ D.body.removeChild(f); }, 333);

	}//end saver


	if (navigator.msSaveBlob) { // IE10+ : (has Blob, but not a[download] or URL)
		return navigator.msSaveBlob(blob, fn);
	}

	if(self.URL){ // simple fast and modern way using Blob and URL:
		saver(self.URL.createObjectURL(blob), true);
	}else{
		// handle non-Blob()+non-URL browsers:
		if(typeof blob === "string" || blob.constructor===z ){
			try{
				return saver( "data:" +  m   + ";base64,"  +  self.btoa(blob)  );
			}catch(y){
				return saver( "data:" +  m   + "," + encodeURIComponent(blob)  );
			}
		}

		// Blob but not URL:
		fr=new FileReader();
		fr.onload=function(e){
			saver(this.result);
		};
		fr.readAsDataURL(blob);
	}
	return true;
} /* end download() */

if ( true && typeof module.exports !== 'undefined') {
  module.exports = download;
}


/***/ }),

/***/ 468:
/***/ ((module) => {

// gif.js 0.2.0 - https://github.com/jnordberg/gif.js
(function(f){if(true){module.exports=f()}else { var g; }})(function(){var define,module,exports;return function(){function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=undefined;if(!u&&a)return require(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=undefined;for(var o=0;o<r.length;o++)s(r[o]);return s}return e}()({1:[function(require,module,exports){function EventEmitter(){this._events=this._events||{};this._maxListeners=this._maxListeners||undefined}module.exports=EventEmitter;EventEmitter.EventEmitter=EventEmitter;EventEmitter.prototype._events=undefined;EventEmitter.prototype._maxListeners=undefined;EventEmitter.defaultMaxListeners=10;EventEmitter.prototype.setMaxListeners=function(n){if(!isNumber(n)||n<0||isNaN(n))throw TypeError("n must be a positive number");this._maxListeners=n;return this};EventEmitter.prototype.emit=function(type){var er,handler,len,args,i,listeners;if(!this._events)this._events={};if(type==="error"){if(!this._events.error||isObject(this._events.error)&&!this._events.error.length){er=arguments[1];if(er instanceof Error){throw er}else{var err=new Error('Uncaught, unspecified "error" event. ('+er+")");err.context=er;throw err}}}handler=this._events[type];if(isUndefined(handler))return false;if(isFunction(handler)){switch(arguments.length){case 1:handler.call(this);break;case 2:handler.call(this,arguments[1]);break;case 3:handler.call(this,arguments[1],arguments[2]);break;default:args=Array.prototype.slice.call(arguments,1);handler.apply(this,args)}}else if(isObject(handler)){args=Array.prototype.slice.call(arguments,1);listeners=handler.slice();len=listeners.length;for(i=0;i<len;i++)listeners[i].apply(this,args)}return true};EventEmitter.prototype.addListener=function(type,listener){var m;if(!isFunction(listener))throw TypeError("listener must be a function");if(!this._events)this._events={};if(this._events.newListener)this.emit("newListener",type,isFunction(listener.listener)?listener.listener:listener);if(!this._events[type])this._events[type]=listener;else if(isObject(this._events[type]))this._events[type].push(listener);else this._events[type]=[this._events[type],listener];if(isObject(this._events[type])&&!this._events[type].warned){if(!isUndefined(this._maxListeners)){m=this._maxListeners}else{m=EventEmitter.defaultMaxListeners}if(m&&m>0&&this._events[type].length>m){this._events[type].warned=true;console.error("(node) warning: possible EventEmitter memory "+"leak detected. %d listeners added. "+"Use emitter.setMaxListeners() to increase limit.",this._events[type].length);if(typeof console.trace==="function"){console.trace()}}}return this};EventEmitter.prototype.on=EventEmitter.prototype.addListener;EventEmitter.prototype.once=function(type,listener){if(!isFunction(listener))throw TypeError("listener must be a function");var fired=false;function g(){this.removeListener(type,g);if(!fired){fired=true;listener.apply(this,arguments)}}g.listener=listener;this.on(type,g);return this};EventEmitter.prototype.removeListener=function(type,listener){var list,position,length,i;if(!isFunction(listener))throw TypeError("listener must be a function");if(!this._events||!this._events[type])return this;list=this._events[type];length=list.length;position=-1;if(list===listener||isFunction(list.listener)&&list.listener===listener){delete this._events[type];if(this._events.removeListener)this.emit("removeListener",type,listener)}else if(isObject(list)){for(i=length;i-- >0;){if(list[i]===listener||list[i].listener&&list[i].listener===listener){position=i;break}}if(position<0)return this;if(list.length===1){list.length=0;delete this._events[type]}else{list.splice(position,1)}if(this._events.removeListener)this.emit("removeListener",type,listener)}return this};EventEmitter.prototype.removeAllListeners=function(type){var key,listeners;if(!this._events)return this;if(!this._events.removeListener){if(arguments.length===0)this._events={};else if(this._events[type])delete this._events[type];return this}if(arguments.length===0){for(key in this._events){if(key==="removeListener")continue;this.removeAllListeners(key)}this.removeAllListeners("removeListener");this._events={};return this}listeners=this._events[type];if(isFunction(listeners)){this.removeListener(type,listeners)}else if(listeners){while(listeners.length)this.removeListener(type,listeners[listeners.length-1])}delete this._events[type];return this};EventEmitter.prototype.listeners=function(type){var ret;if(!this._events||!this._events[type])ret=[];else if(isFunction(this._events[type]))ret=[this._events[type]];else ret=this._events[type].slice();return ret};EventEmitter.prototype.listenerCount=function(type){if(this._events){var evlistener=this._events[type];if(isFunction(evlistener))return 1;else if(evlistener)return evlistener.length}return 0};EventEmitter.listenerCount=function(emitter,type){return emitter.listenerCount(type)};function isFunction(arg){return typeof arg==="function"}function isNumber(arg){return typeof arg==="number"}function isObject(arg){return typeof arg==="object"&&arg!==null}function isUndefined(arg){return arg===void 0}},{}],2:[function(require,module,exports){var NeuQuant=require("./TypedNeuQuant.js");var LZWEncoder=require("./LZWEncoder.js");function ByteArray(){this.page=-1;this.pages=[];this.newPage()}ByteArray.pageSize=4096;ByteArray.charMap={};for(var i=0;i<256;i++)ByteArray.charMap[i]=String.fromCharCode(i);ByteArray.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(ByteArray.pageSize);this.cursor=0};ByteArray.prototype.getData=function(){var rv="";for(var p=0;p<this.pages.length;p++){for(var i=0;i<ByteArray.pageSize;i++){rv+=ByteArray.charMap[this.pages[p][i]]}}return rv};ByteArray.prototype.writeByte=function(val){if(this.cursor>=ByteArray.pageSize)this.newPage();this.pages[this.page][this.cursor++]=val};ByteArray.prototype.writeUTFBytes=function(string){for(var l=string.length,i=0;i<l;i++)this.writeByte(string.charCodeAt(i))};ByteArray.prototype.writeBytes=function(array,offset,length){for(var l=length||array.length,i=offset||0;i<l;i++)this.writeByte(array[i])};function GIFEncoder(width,height){this.width=~~width;this.height=~~height;this.transparent=null;this.transIndex=0;this.repeat=-1;this.delay=0;this.image=null;this.pixels=null;this.indexedPixels=null;this.colorDepth=null;this.colorTab=null;this.neuQuant=null;this.usedEntry=new Array;this.palSize=7;this.dispose=-1;this.firstFrame=true;this.sample=10;this.dither=false;this.globalPalette=false;this.out=new ByteArray}GIFEncoder.prototype.setDelay=function(milliseconds){this.delay=Math.round(milliseconds/10)};GIFEncoder.prototype.setFrameRate=function(fps){this.delay=Math.round(100/fps)};GIFEncoder.prototype.setDispose=function(disposalCode){if(disposalCode>=0)this.dispose=disposalCode};GIFEncoder.prototype.setRepeat=function(repeat){this.repeat=repeat};GIFEncoder.prototype.setTransparent=function(color){this.transparent=color};GIFEncoder.prototype.addFrame=function(imageData){this.image=imageData;this.colorTab=this.globalPalette&&this.globalPalette.slice?this.globalPalette:null;this.getImagePixels();this.analyzePixels();if(this.globalPalette===true)this.globalPalette=this.colorTab;if(this.firstFrame){this.writeLSD();this.writePalette();if(this.repeat>=0){this.writeNetscapeExt()}}this.writeGraphicCtrlExt();this.writeImageDesc();if(!this.firstFrame&&!this.globalPalette)this.writePalette();this.writePixels();this.firstFrame=false};GIFEncoder.prototype.finish=function(){this.out.writeByte(59)};GIFEncoder.prototype.setQuality=function(quality){if(quality<1)quality=1;this.sample=quality};GIFEncoder.prototype.setDither=function(dither){if(dither===true)dither="FloydSteinberg";this.dither=dither};GIFEncoder.prototype.setGlobalPalette=function(palette){this.globalPalette=palette};GIFEncoder.prototype.getGlobalPalette=function(){return this.globalPalette&&this.globalPalette.slice&&this.globalPalette.slice(0)||this.globalPalette};GIFEncoder.prototype.writeHeader=function(){this.out.writeUTFBytes("GIF89a")};GIFEncoder.prototype.analyzePixels=function(){if(!this.colorTab){this.neuQuant=new NeuQuant(this.pixels,this.sample);this.neuQuant.buildColormap();this.colorTab=this.neuQuant.getColormap()}if(this.dither){this.ditherPixels(this.dither.replace("-serpentine",""),this.dither.match(/-serpentine/)!==null)}else{this.indexPixels()}this.pixels=null;this.colorDepth=8;this.palSize=7;if(this.transparent!==null){this.transIndex=this.findClosest(this.transparent,true)}};GIFEncoder.prototype.indexPixels=function(imgq){var nPix=this.pixels.length/3;this.indexedPixels=new Uint8Array(nPix);var k=0;for(var j=0;j<nPix;j++){var index=this.findClosestRGB(this.pixels[k++]&255,this.pixels[k++]&255,this.pixels[k++]&255);this.usedEntry[index]=true;this.indexedPixels[j]=index}};GIFEncoder.prototype.ditherPixels=function(kernel,serpentine){var kernels={FalseFloydSteinberg:[[3/8,1,0],[3/8,0,1],[2/8,1,1]],FloydSteinberg:[[7/16,1,0],[3/16,-1,1],[5/16,0,1],[1/16,1,1]],Stucki:[[8/42,1,0],[4/42,2,0],[2/42,-2,1],[4/42,-1,1],[8/42,0,1],[4/42,1,1],[2/42,2,1],[1/42,-2,2],[2/42,-1,2],[4/42,0,2],[2/42,1,2],[1/42,2,2]],Atkinson:[[1/8,1,0],[1/8,2,0],[1/8,-1,1],[1/8,0,1],[1/8,1,1],[1/8,0,2]]};if(!kernel||!kernels[kernel]){throw"Unknown dithering kernel: "+kernel}var ds=kernels[kernel];var index=0,height=this.height,width=this.width,data=this.pixels;var direction=serpentine?-1:1;this.indexedPixels=new Uint8Array(this.pixels.length/3);for(var y=0;y<height;y++){if(serpentine)direction=direction*-1;for(var x=direction==1?0:width-1,xend=direction==1?width:0;x!==xend;x+=direction){index=y*width+x;var idx=index*3;var r1=data[idx];var g1=data[idx+1];var b1=data[idx+2];idx=this.findClosestRGB(r1,g1,b1);this.usedEntry[idx]=true;this.indexedPixels[index]=idx;idx*=3;var r2=this.colorTab[idx];var g2=this.colorTab[idx+1];var b2=this.colorTab[idx+2];var er=r1-r2;var eg=g1-g2;var eb=b1-b2;for(var i=direction==1?0:ds.length-1,end=direction==1?ds.length:0;i!==end;i+=direction){var x1=ds[i][1];var y1=ds[i][2];if(x1+x>=0&&x1+x<width&&y1+y>=0&&y1+y<height){var d=ds[i][0];idx=index+x1+y1*width;idx*=3;data[idx]=Math.max(0,Math.min(255,data[idx]+er*d));data[idx+1]=Math.max(0,Math.min(255,data[idx+1]+eg*d));data[idx+2]=Math.max(0,Math.min(255,data[idx+2]+eb*d))}}}}};GIFEncoder.prototype.findClosest=function(c,used){return this.findClosestRGB((c&16711680)>>16,(c&65280)>>8,c&255,used)};GIFEncoder.prototype.findClosestRGB=function(r,g,b,used){if(this.colorTab===null)return-1;if(this.neuQuant&&!used){return this.neuQuant.lookupRGB(r,g,b)}var c=b|g<<8|r<<16;var minpos=0;var dmin=256*256*256;var len=this.colorTab.length;for(var i=0,index=0;i<len;index++){var dr=r-(this.colorTab[i++]&255);var dg=g-(this.colorTab[i++]&255);var db=b-(this.colorTab[i++]&255);var d=dr*dr+dg*dg+db*db;if((!used||this.usedEntry[index])&&d<dmin){dmin=d;minpos=index}}return minpos};GIFEncoder.prototype.getImagePixels=function(){var w=this.width;var h=this.height;this.pixels=new Uint8Array(w*h*3);var data=this.image;var srcPos=0;var count=0;for(var i=0;i<h;i++){for(var j=0;j<w;j++){this.pixels[count++]=data[srcPos++];this.pixels[count++]=data[srcPos++];this.pixels[count++]=data[srcPos++];srcPos++}}};GIFEncoder.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33);this.out.writeByte(249);this.out.writeByte(4);var transp,disp;if(this.transparent===null){transp=0;disp=0}else{transp=1;disp=2}if(this.dispose>=0){disp=this.dispose&7}disp<<=2;this.out.writeByte(0|disp|0|transp);this.writeShort(this.delay);this.out.writeByte(this.transIndex);this.out.writeByte(0)};GIFEncoder.prototype.writeImageDesc=function(){this.out.writeByte(44);this.writeShort(0);this.writeShort(0);this.writeShort(this.width);this.writeShort(this.height);if(this.firstFrame||this.globalPalette){this.out.writeByte(0)}else{this.out.writeByte(128|0|0|0|this.palSize)}};GIFEncoder.prototype.writeLSD=function(){this.writeShort(this.width);this.writeShort(this.height);this.out.writeByte(128|112|0|this.palSize);this.out.writeByte(0);this.out.writeByte(0)};GIFEncoder.prototype.writeNetscapeExt=function(){this.out.writeByte(33);this.out.writeByte(255);this.out.writeByte(11);this.out.writeUTFBytes("NETSCAPE2.0");this.out.writeByte(3);this.out.writeByte(1);this.writeShort(this.repeat);this.out.writeByte(0)};GIFEncoder.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);var n=3*256-this.colorTab.length;for(var i=0;i<n;i++)this.out.writeByte(0)};GIFEncoder.prototype.writeShort=function(pValue){this.out.writeByte(pValue&255);this.out.writeByte(pValue>>8&255)};GIFEncoder.prototype.writePixels=function(){var enc=new LZWEncoder(this.width,this.height,this.indexedPixels,this.colorDepth);enc.encode(this.out)};GIFEncoder.prototype.stream=function(){return this.out};module.exports=GIFEncoder},{"./LZWEncoder.js":3,"./TypedNeuQuant.js":4}],3:[function(require,module,exports){var EOF=-1;var BITS=12;var HSIZE=5003;var masks=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function LZWEncoder(width,height,pixels,colorDepth){var initCodeSize=Math.max(2,colorDepth);var accum=new Uint8Array(256);var htab=new Int32Array(HSIZE);var codetab=new Int32Array(HSIZE);var cur_accum,cur_bits=0;var a_count;var free_ent=0;var maxcode;var clear_flg=false;var g_init_bits,ClearCode,EOFCode;function char_out(c,outs){accum[a_count++]=c;if(a_count>=254)flush_char(outs)}function cl_block(outs){cl_hash(HSIZE);free_ent=ClearCode+2;clear_flg=true;output(ClearCode,outs)}function cl_hash(hsize){for(var i=0;i<hsize;++i)htab[i]=-1}function compress(init_bits,outs){var fcode,c,i,ent,disp,hsize_reg,hshift;g_init_bits=init_bits;clear_flg=false;n_bits=g_init_bits;maxcode=MAXCODE(n_bits);ClearCode=1<<init_bits-1;EOFCode=ClearCode+1;free_ent=ClearCode+2;a_count=0;ent=nextPixel();hshift=0;for(fcode=HSIZE;fcode<65536;fcode*=2)++hshift;hshift=8-hshift;hsize_reg=HSIZE;cl_hash(hsize_reg);output(ClearCode,outs);outer_loop:while((c=nextPixel())!=EOF){fcode=(c<<BITS)+ent;i=c<<hshift^ent;if(htab[i]===fcode){ent=codetab[i];continue}else if(htab[i]>=0){disp=hsize_reg-i;if(i===0)disp=1;do{if((i-=disp)<0)i+=hsize_reg;if(htab[i]===fcode){ent=codetab[i];continue outer_loop}}while(htab[i]>=0)}output(ent,outs);ent=c;if(free_ent<1<<BITS){codetab[i]=free_ent++;htab[i]=fcode}else{cl_block(outs)}}output(ent,outs);output(EOFCode,outs)}function encode(outs){outs.writeByte(initCodeSize);remaining=width*height;curPixel=0;compress(initCodeSize+1,outs);outs.writeByte(0)}function flush_char(outs){if(a_count>0){outs.writeByte(a_count);outs.writeBytes(accum,0,a_count);a_count=0}}function MAXCODE(n_bits){return(1<<n_bits)-1}function nextPixel(){if(remaining===0)return EOF;--remaining;var pix=pixels[curPixel++];return pix&255}function output(code,outs){cur_accum&=masks[cur_bits];if(cur_bits>0)cur_accum|=code<<cur_bits;else cur_accum=code;cur_bits+=n_bits;while(cur_bits>=8){char_out(cur_accum&255,outs);cur_accum>>=8;cur_bits-=8}if(free_ent>maxcode||clear_flg){if(clear_flg){maxcode=MAXCODE(n_bits=g_init_bits);clear_flg=false}else{++n_bits;if(n_bits==BITS)maxcode=1<<BITS;else maxcode=MAXCODE(n_bits)}}if(code==EOFCode){while(cur_bits>0){char_out(cur_accum&255,outs);cur_accum>>=8;cur_bits-=8}flush_char(outs)}}this.encode=encode}module.exports=LZWEncoder},{}],4:[function(require,module,exports){var ncycles=100;var netsize=256;var maxnetpos=netsize-1;var netbiasshift=4;var intbiasshift=16;var intbias=1<<intbiasshift;var gammashift=10;var gamma=1<<gammashift;var betashift=10;var beta=intbias>>betashift;var betagamma=intbias<<gammashift-betashift;var initrad=netsize>>3;var radiusbiasshift=6;var radiusbias=1<<radiusbiasshift;var initradius=initrad*radiusbias;var radiusdec=30;var alphabiasshift=10;var initalpha=1<<alphabiasshift;var alphadec;var radbiasshift=8;var radbias=1<<radbiasshift;var alpharadbshift=alphabiasshift+radbiasshift;var alpharadbias=1<<alpharadbshift;var prime1=499;var prime2=491;var prime3=487;var prime4=503;var minpicturebytes=3*prime4;function NeuQuant(pixels,samplefac){var network;var netindex;var bias;var freq;var radpower;function init(){network=[];netindex=new Int32Array(256);bias=new Int32Array(netsize);freq=new Int32Array(netsize);radpower=new Int32Array(netsize>>3);var i,v;for(i=0;i<netsize;i++){v=(i<<netbiasshift+8)/netsize;network[i]=new Float64Array([v,v,v,0]);freq[i]=intbias/netsize;bias[i]=0}}function unbiasnet(){for(var i=0;i<netsize;i++){network[i][0]>>=netbiasshift;network[i][1]>>=netbiasshift;network[i][2]>>=netbiasshift;network[i][3]=i}}function altersingle(alpha,i,b,g,r){network[i][0]-=alpha*(network[i][0]-b)/initalpha;network[i][1]-=alpha*(network[i][1]-g)/initalpha;network[i][2]-=alpha*(network[i][2]-r)/initalpha}function alterneigh(radius,i,b,g,r){var lo=Math.abs(i-radius);var hi=Math.min(i+radius,netsize);var j=i+1;var k=i-1;var m=1;var p,a;while(j<hi||k>lo){a=radpower[m++];if(j<hi){p=network[j++];p[0]-=a*(p[0]-b)/alpharadbias;p[1]-=a*(p[1]-g)/alpharadbias;p[2]-=a*(p[2]-r)/alpharadbias}if(k>lo){p=network[k--];p[0]-=a*(p[0]-b)/alpharadbias;p[1]-=a*(p[1]-g)/alpharadbias;p[2]-=a*(p[2]-r)/alpharadbias}}}function contest(b,g,r){var bestd=~(1<<31);var bestbiasd=bestd;var bestpos=-1;var bestbiaspos=bestpos;var i,n,dist,biasdist,betafreq;for(i=0;i<netsize;i++){n=network[i];dist=Math.abs(n[0]-b)+Math.abs(n[1]-g)+Math.abs(n[2]-r);if(dist<bestd){bestd=dist;bestpos=i}biasdist=dist-(bias[i]>>intbiasshift-netbiasshift);if(biasdist<bestbiasd){bestbiasd=biasdist;bestbiaspos=i}betafreq=freq[i]>>betashift;freq[i]-=betafreq;bias[i]+=betafreq<<gammashift}freq[bestpos]+=beta;bias[bestpos]-=betagamma;return bestbiaspos}function inxbuild(){var i,j,p,q,smallpos,smallval,previouscol=0,startpos=0;for(i=0;i<netsize;i++){p=network[i];smallpos=i;smallval=p[1];for(j=i+1;j<netsize;j++){q=network[j];if(q[1]<smallval){smallpos=j;smallval=q[1]}}q=network[smallpos];if(i!=smallpos){j=q[0];q[0]=p[0];p[0]=j;j=q[1];q[1]=p[1];p[1]=j;j=q[2];q[2]=p[2];p[2]=j;j=q[3];q[3]=p[3];p[3]=j}if(smallval!=previouscol){netindex[previouscol]=startpos+i>>1;for(j=previouscol+1;j<smallval;j++)netindex[j]=i;previouscol=smallval;startpos=i}}netindex[previouscol]=startpos+maxnetpos>>1;for(j=previouscol+1;j<256;j++)netindex[j]=maxnetpos}function inxsearch(b,g,r){var a,p,dist;var bestd=1e3;var best=-1;var i=netindex[g];var j=i-1;while(i<netsize||j>=0){if(i<netsize){p=network[i];dist=p[1]-g;if(dist>=bestd)i=netsize;else{i++;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}if(j>=0){p=network[j];dist=g-p[1];if(dist>=bestd)j=-1;else{j--;if(dist<0)dist=-dist;a=p[0]-b;if(a<0)a=-a;dist+=a;if(dist<bestd){a=p[2]-r;if(a<0)a=-a;dist+=a;if(dist<bestd){bestd=dist;best=p[3]}}}}}return best}function learn(){var i;var lengthcount=pixels.length;var alphadec=30+(samplefac-1)/3;var samplepixels=lengthcount/(3*samplefac);var delta=~~(samplepixels/ncycles);var alpha=initalpha;var radius=initradius;var rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(i=0;i<rad;i++)radpower[i]=alpha*((rad*rad-i*i)*radbias/(rad*rad));var step;if(lengthcount<minpicturebytes){samplefac=1;step=3}else if(lengthcount%prime1!==0){step=3*prime1}else if(lengthcount%prime2!==0){step=3*prime2}else if(lengthcount%prime3!==0){step=3*prime3}else{step=3*prime4}var b,g,r,j;var pix=0;i=0;while(i<samplepixels){b=(pixels[pix]&255)<<netbiasshift;g=(pixels[pix+1]&255)<<netbiasshift;r=(pixels[pix+2]&255)<<netbiasshift;j=contest(b,g,r);altersingle(alpha,j,b,g,r);if(rad!==0)alterneigh(rad,j,b,g,r);pix+=step;if(pix>=lengthcount)pix-=lengthcount;i++;if(delta===0)delta=1;if(i%delta===0){alpha-=alpha/alphadec;radius-=radius/radiusdec;rad=radius>>radiusbiasshift;if(rad<=1)rad=0;for(j=0;j<rad;j++)radpower[j]=alpha*((rad*rad-j*j)*radbias/(rad*rad))}}}function buildColormap(){init();learn();unbiasnet();inxbuild()}this.buildColormap=buildColormap;function getColormap(){var map=[];var index=[];for(var i=0;i<netsize;i++)index[network[i][3]]=i;var k=0;for(var l=0;l<netsize;l++){var j=index[l];map[k++]=network[j][0];map[k++]=network[j][1];map[k++]=network[j][2]}return map}this.getColormap=getColormap;this.lookupRGB=inxsearch}module.exports=NeuQuant},{}],5:[function(require,module,exports){var UA,browser,mode,platform,ua;ua=navigator.userAgent.toLowerCase();platform=navigator.platform.toLowerCase();UA=ua.match(/(opera|ie|firefox|chrome|version)[\s\/:]([\w\d\.]+)?.*?(safari|version[\s\/:]([\w\d\.]+)|$)/)||[null,"unknown",0];mode=UA[1]==="ie"&&document.documentMode;browser={name:UA[1]==="version"?UA[3]:UA[1],version:mode||parseFloat(UA[1]==="opera"&&UA[4]?UA[4]:UA[2]),platform:{name:ua.match(/ip(?:ad|od|hone)/)?"ios":(ua.match(/(?:webos|android)/)||platform.match(/mac|win|linux/)||["other"])[0]}};browser[browser.name]=true;browser[browser.name+parseInt(browser.version,10)]=true;browser.platform[browser.platform.name]=true;module.exports=browser},{}],6:[function(require,module,exports){var EventEmitter,GIF,GIFEncoder,browser,gifWorker,extend=function(child,parent){for(var key in parent){if(hasProp.call(parent,key))child[key]=parent[key]}function ctor(){this.constructor=child}ctor.prototype=parent.prototype;child.prototype=new ctor;child.__super__=parent.prototype;return child},hasProp={}.hasOwnProperty,indexOf=[].indexOf||function(item){for(var i=0,l=this.length;i<l;i++){if(i in this&&this[i]===item)return i}return-1},slice=[].slice;EventEmitter=require("events").EventEmitter;browser=require("./browser.coffee");GIFEncoder=require("./GIFEncoder.js");gifWorker=require("./gif.worker.coffee");module.exports=GIF=function(superClass){var defaults,frameDefaults;extend(GIF,superClass);defaults={workerScript:"gif.worker.js",workers:2,repeat:0,background:"#fff",quality:10,width:null,height:null,transparent:null,debug:false,dither:false};frameDefaults={delay:500,copy:false,dispose:-1};function GIF(options){var base,key,value;this.running=false;this.options={};this.frames=[];this.freeWorkers=[];this.activeWorkers=[];this.setOptions(options);for(key in defaults){value=defaults[key];if((base=this.options)[key]==null){base[key]=value}}}GIF.prototype.setOption=function(key,value){this.options[key]=value;if(this._canvas!=null&&(key==="width"||key==="height")){return this._canvas[key]=value}};GIF.prototype.setOptions=function(options){var key,results,value;results=[];for(key in options){if(!hasProp.call(options,key))continue;value=options[key];results.push(this.setOption(key,value))}return results};GIF.prototype.addFrame=function(image,options){var frame,key;if(options==null){options={}}frame={};frame.transparent=this.options.transparent;for(key in frameDefaults){frame[key]=options[key]||frameDefaults[key]}if(this.options.width==null){this.setOption("width",image.width)}if(this.options.height==null){this.setOption("height",image.height)}if(typeof ImageData!=="undefined"&&ImageData!==null&&image instanceof ImageData){frame.data=image.data}else if(typeof CanvasRenderingContext2D!=="undefined"&&CanvasRenderingContext2D!==null&&image instanceof CanvasRenderingContext2D||typeof WebGLRenderingContext!=="undefined"&&WebGLRenderingContext!==null&&image instanceof WebGLRenderingContext){if(options.copy){frame.data=this.getContextData(image)}else{frame.context=image}}else if(image.childNodes!=null){if(options.copy){frame.data=this.getImageData(image)}else{frame.image=image}}else{throw new Error("Invalid image")}return this.frames.push(frame)};GIF.prototype.render=function(){var i,j,numWorkers,ref;if(this.running){throw new Error("Already running")}if(this.options.width==null||this.options.height==null){throw new Error("Width and height must be set prior to rendering")}this.running=true;this.nextFrame=0;this.finishedFrames=0;this.imageParts=function(){var j,ref,results;results=[];for(i=j=0,ref=this.frames.length;0<=ref?j<ref:j>ref;i=0<=ref?++j:--j){results.push(null)}return results}.call(this);numWorkers=this.spawnWorkers();if(this.options.globalPalette===true){this.renderNextFrame()}else{for(i=j=0,ref=numWorkers;0<=ref?j<ref:j>ref;i=0<=ref?++j:--j){this.renderNextFrame()}}this.emit("start");return this.emit("progress",0)};GIF.prototype.abort=function(){var worker;while(true){worker=this.activeWorkers.shift();if(worker==null){break}this.log("killing active worker");worker.terminate()}this.running=false;return this.emit("abort")};GIF.prototype.spawnWorkers=function(){var j,numWorkers,ref,results;numWorkers=Math.min(this.options.workers,this.frames.length);(function(){results=[];for(var j=ref=this.freeWorkers.length;ref<=numWorkers?j<numWorkers:j>numWorkers;ref<=numWorkers?j++:j--){results.push(j)}return results}).apply(this).forEach(function(_this){return function(i){var worker;_this.log("spawning worker "+i);worker=new Worker(_this.options.workerScript);worker.onmessage=function(event){_this.activeWorkers.splice(_this.activeWorkers.indexOf(worker),1);_this.freeWorkers.push(worker);return _this.frameFinished(event.data)};return _this.freeWorkers.push(worker)}}(this));return numWorkers};GIF.prototype.frameFinished=function(frame){var i,j,ref;this.log("frame "+frame.index+" finished - "+this.activeWorkers.length+" active");this.finishedFrames++;this.emit("progress",this.finishedFrames/this.frames.length);this.imageParts[frame.index]=frame;if(this.options.globalPalette===true){this.options.globalPalette=frame.globalPalette;this.log("global palette analyzed");if(this.frames.length>2){for(i=j=1,ref=this.freeWorkers.length;1<=ref?j<ref:j>ref;i=1<=ref?++j:--j){this.renderNextFrame()}}}if(indexOf.call(this.imageParts,null)>=0){return this.renderNextFrame()}else{return this.finishRendering()}};GIF.prototype.finishRendering=function(){var data,frame,i,image,j,k,l,len,len1,len2,len3,offset,page,ref,ref1,ref2;len=0;ref=this.imageParts;for(j=0,len1=ref.length;j<len1;j++){frame=ref[j];len+=(frame.data.length-1)*frame.pageSize+frame.cursor}len+=frame.pageSize-frame.cursor;this.log("rendering finished - filesize "+Math.round(len/1e3)+"kb");data=new Uint8Array(len);offset=0;ref1=this.imageParts;for(k=0,len2=ref1.length;k<len2;k++){frame=ref1[k];ref2=frame.data;for(i=l=0,len3=ref2.length;l<len3;i=++l){page=ref2[i];data.set(page,offset);if(i===frame.data.length-1){offset+=frame.cursor}else{offset+=frame.pageSize}}}image=new Blob([data],{type:"image/gif"});return this.emit("finished",image,data)};GIF.prototype.renderNextFrame=function(){var frame,task,worker;if(this.freeWorkers.length===0){throw new Error("No free workers")}if(this.nextFrame>=this.frames.length){return}frame=this.frames[this.nextFrame++];worker=this.freeWorkers.shift();task=this.getTask(frame);this.log("starting frame "+(task.index+1)+" of "+this.frames.length);this.activeWorkers.push(worker);return worker.postMessage(task)};GIF.prototype.getContextData=function(ctx){return ctx.getImageData(0,0,this.options.width,this.options.height).data};GIF.prototype.getImageData=function(image){var ctx;if(this._canvas==null){this._canvas=document.createElement("canvas");this._canvas.width=this.options.width;this._canvas.height=this.options.height}ctx=this._canvas.getContext("2d");ctx.setFill=this.options.background;ctx.fillRect(0,0,this.options.width,this.options.height);ctx.drawImage(image,0,0);return this.getContextData(ctx)};GIF.prototype.getTask=function(frame){var index,task;index=this.frames.indexOf(frame);task={index:index,last:index===this.frames.length-1,delay:frame.delay,dispose:frame.dispose,transparent:frame.transparent,width:this.options.width,height:this.options.height,quality:this.options.quality,dither:this.options.dither,globalPalette:this.options.globalPalette,repeat:this.options.repeat,canTransfer:browser.name==="chrome"};if(frame.data!=null){task.data=frame.data}else if(frame.context!=null){task.data=this.getContextData(frame.context)}else if(frame.image!=null){task.data=this.getImageData(frame.image)}else{throw new Error("Invalid frame")}return task};GIF.prototype.log=function(){var args;args=1<=arguments.length?slice.call(arguments,0):[];if(!this.options.debug){return}return console.log.apply(console,args)};return GIF}(EventEmitter)},{"./GIFEncoder.js":2,"./browser.coffee":5,"./gif.worker.coffee":7,events:1}],7:[function(require,module,exports){var GIFEncoder,renderFrame;GIFEncoder=require("./GIFEncoder.js");renderFrame=function(frame){var encoder,page,stream,transfer;encoder=new GIFEncoder(frame.width,frame.height);if(frame.index===0){encoder.writeHeader()}else{encoder.firstFrame=false}encoder.setTransparent(frame.transparent);encoder.setDispose(frame.dispose);encoder.setRepeat(frame.repeat);encoder.setDelay(frame.delay);encoder.setQuality(frame.quality);encoder.setDither(frame.dither);encoder.setGlobalPalette(frame.globalPalette);encoder.addFrame(frame.data);if(frame.last){encoder.finish()}if(frame.globalPalette===true){frame.globalPalette=encoder.getGlobalPalette()}stream=encoder.stream();frame.data=stream.pages;frame.cursor=stream.cursor;frame.pageSize=stream.constructor.pageSize;if(frame.canTransfer){transfer=function(){var i,len,ref,results;ref=frame.data;results=[];for(i=0,len=ref.length;i<len;i++){page=ref[i];results.push(page.buffer)}return results}();return self.postMessage(frame,transfer)}else{return self.postMessage(frame)}};self.onmessage=function(event){return renderFrame(event.data)}},{"./GIFEncoder.js":2}]},{},[6])(6)});
//# sourceMappingURL=gif.js.map


/***/ }),

/***/ 617:
/***/ ((module) => {

(function () {
	"use strict";

	var lookup = [
			'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H',
			'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P',
			'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X',
			'Y', 'Z', 'a', 'b', 'c', 'd', 'e', 'f',
			'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n',
			'o', 'p', 'q', 'r', 's', 't', 'u', 'v',
			'w', 'x', 'y', 'z', '0', '1', '2', '3',
			'4', '5', '6', '7', '8', '9', '+', '/'
		];
	function clean(length) {
		var i, buffer = new Uint8Array(length);
		for (i = 0; i < length; i += 1) {
			buffer[i] = 0;
		}
		return buffer;
	}

	function extend(orig, length, addLength, multipleOf) {
		var newSize = length + addLength,
			buffer = clean((parseInt(newSize / multipleOf) + 1) * multipleOf);

		buffer.set(orig);

		return buffer;
	}

	function pad(num, bytes, base) {
		num = num.toString(base || 8);
		return "000000000000".substr(num.length + 12 - bytes) + num;
	}

	function stringToUint8 (input, out, offset) {
		var i, length;

		out = out || clean(input.length);

		offset = offset || 0;
		for (i = 0, length = input.length; i < length; i += 1) {
			out[offset] = input.charCodeAt(i);
			offset += 1;
		}

		return out;
	}

	function uint8ToBase64(uint8) {
		var i,
			extraBytes = uint8.length % 3, // if we have 1 byte left, pad 2 bytes
			output = "",
			temp, length;

		function tripletToBase64 (num) {
			return lookup[num >> 18 & 0x3F] + lookup[num >> 12 & 0x3F] + lookup[num >> 6 & 0x3F] + lookup[num & 0x3F];
		};

		// go through the array every three bytes, we'll deal with trailing stuff later
		for (i = 0, length = uint8.length - extraBytes; i < length; i += 3) {
			temp = (uint8[i] << 16) + (uint8[i + 1] << 8) + (uint8[i + 2]);
			output += tripletToBase64(temp);
		}

		// this prevents an ERR_INVALID_URL in Chrome (Firefox okay)
		switch (output.length % 4) {
			case 1:
				output += '=';
				break;
			case 2:
				output += '==';
				break;
			default:
				break;
		}

		return output;
	}

	window.utils = {}
	window.utils.clean = clean;
	window.utils.pad = pad;
	window.utils.extend = extend;
	window.utils.stringToUint8 = stringToUint8;
	window.utils.uint8ToBase64 = uint8ToBase64;
}());

(function () {
	"use strict";

/*
struct posix_header {             // byte offset
	char name[100];               //   0
	char mode[8];                 // 100
	char uid[8];                  // 108
	char gid[8];                  // 116
	char size[12];                // 124
	char mtime[12];               // 136
	char chksum[8];               // 148
	char typeflag;                // 156
	char linkname[100];           // 157
	char magic[6];                // 257
	char version[2];              // 263
	char uname[32];               // 265
	char gname[32];               // 297
	char devmajor[8];             // 329
	char devminor[8];             // 337
	char prefix[155];             // 345
                                  // 500
};
*/

	var utils = window.utils,
		headerFormat;

	headerFormat = [
		{
			'field': 'fileName',
			'length': 100
		},
		{
			'field': 'fileMode',
			'length': 8
		},
		{
			'field': 'uid',
			'length': 8
		},
		{
			'field': 'gid',
			'length': 8
		},
		{
			'field': 'fileSize',
			'length': 12
		},
		{
			'field': 'mtime',
			'length': 12
		},
		{
			'field': 'checksum',
			'length': 8
		},
		{
			'field': 'type',
			'length': 1
		},
		{
			'field': 'linkName',
			'length': 100
		},
		{
			'field': 'ustar',
			'length': 8
		},
		{
			'field': 'owner',
			'length': 32
		},
		{
			'field': 'group',
			'length': 32
		},
		{
			'field': 'majorNumber',
			'length': 8
		},
		{
			'field': 'minorNumber',
			'length': 8
		},
		{
			'field': 'filenamePrefix',
			'length': 155
		},
		{
			'field': 'padding',
			'length': 12
		}
	];

	function formatHeader(data, cb) {
		var buffer = utils.clean(512),
			offset = 0;

		headerFormat.forEach(function (value) {
			var str = data[value.field] || "",
				i, length;

			for (i = 0, length = str.length; i < length; i += 1) {
				buffer[offset] = str.charCodeAt(i);
				offset += 1;
			}

			offset += value.length - i; // space it out with nulls
		});

		if (typeof cb === 'function') {
			return cb(buffer, offset);
		}
		return buffer;
	}

	window.header = {}
	window.header.structure = headerFormat;
	window.header.format = formatHeader;
}());

(function () {
	"use strict";

	var header = window.header,
		utils = window.utils,
		recordSize = 512,
		blockSize;

	function Tar(recordsPerBlock) {
		this.written = 0;
		blockSize = (recordsPerBlock || 20) * recordSize;
		this.out = utils.clean(blockSize);
		this.blocks = [];
		this.length = 0;
	}

	Tar.prototype.append = function (filepath, input, opts, callback) {
		var data,
			checksum,
			mode,
			mtime,
			uid,
			gid,
			headerArr;

		if (typeof input === 'string') {
			input = utils.stringToUint8(input);
		} else if (input.constructor !== Uint8Array.prototype.constructor) {
			throw 'Invalid input type. You gave me: ' + input.constructor.toString().match(/function\s*([$A-Za-z_][0-9A-Za-z_]*)\s*\(/)[1];
		}

		if (typeof opts === 'function') {
			callback = opts;
			opts = {};
		}

		opts = opts || {};

		mode = opts.mode || parseInt('777', 8) & 0xfff;
		mtime = opts.mtime || Math.floor(+new Date() / 1000);
		uid = opts.uid || 0;
		gid = opts.gid || 0;

		data = {
			fileName: filepath,
			fileMode: utils.pad(mode, 7),
			uid: utils.pad(uid, 7),
			gid: utils.pad(gid, 7),
			fileSize: utils.pad(input.length, 11),
			mtime: utils.pad(mtime, 11),
			checksum: '        ',
			type: '0', // just a file
			ustar: 'ustar  ',
			owner: opts.owner || '',
			group: opts.group || ''
		};

		// calculate the checksum
		checksum = 0;
		Object.keys(data).forEach(function (key) {
			var i, value = data[key], length;

			for (i = 0, length = value.length; i < length; i += 1) {
				checksum += value.charCodeAt(i);
			}
		});

		data.checksum = utils.pad(checksum, 6) + "\u0000 ";

		headerArr = header.format(data);

		var headerLength = Math.ceil( headerArr.length / recordSize ) * recordSize;
		var inputLength = Math.ceil( input.length / recordSize ) * recordSize;

		this.blocks.push( { header: headerArr, input: input, headerLength: headerLength, inputLength: inputLength } );

	};

	Tar.prototype.save = function() {

		var buffers = [];
		var chunks = [];
		var length = 0;
		var max = Math.pow( 2, 20 );

		var chunk = [];
		this.blocks.forEach( function( b ) {
			if( length + b.headerLength + b.inputLength > max ) {
				chunks.push( { blocks: chunk, length: length } );
				chunk = [];
				length = 0;
			}
			chunk.push( b );
			length += b.headerLength + b.inputLength;
		} );
		chunks.push( { blocks: chunk, length: length } );

		chunks.forEach( function( c ) {

			var buffer = new Uint8Array( c.length );
			var written = 0;
			c.blocks.forEach( function( b ) {
				buffer.set( b.header, written );
				written += b.headerLength;
				buffer.set( b.input, written );
				written += b.inputLength;
			} );
			buffers.push( buffer );

		} );

		buffers.push( new Uint8Array( 2 * recordSize ) );

		return new Blob( buffers, { type: 'octet/stream' } );

	};

	Tar.prototype.clear = function () {
		this.written = 0;
		this.out = utils.clean(blockSize);
	};

  if ( true && typeof module.exports !== 'undefined') {
    module.exports = Tar;
  } else {
    window.Tar = Tar;
  }
}());


/***/ }),

/***/ 627:
/***/ ((module) => {

"use strict";
/**
 * A tool for presenting an ArrayBuffer as a stream for writing some simple data types.
 *
 * By Nicholas Sherlock
 *
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */



// (function(){
    /*
     * Create an ArrayBuffer of the given length and present it as a writable stream with methods
     * for writing data in different formats.
     */
    var ArrayBufferDataStream = function(length) {
        this.data = new Uint8Array(length);
        this.pos = 0;
    };

    ArrayBufferDataStream.prototype.seek = function(offset) {
        this.pos = offset;
    };

    ArrayBufferDataStream.prototype.writeBytes = function(arr) {
        for (var i = 0; i < arr.length; i++) {
            this.data[this.pos++] = arr[i];
        }
    };

    ArrayBufferDataStream.prototype.writeByte = function(b) {
        this.data[this.pos++] = b;
    };

    //Synonym:
    ArrayBufferDataStream.prototype.writeU8 = ArrayBufferDataStream.prototype.writeByte;

    ArrayBufferDataStream.prototype.writeU16BE = function(u) {
        this.data[this.pos++] = u >> 8;
        this.data[this.pos++] = u;
    };

    ArrayBufferDataStream.prototype.writeDoubleBE = function(d) {
        var
            bytes = new Uint8Array(new Float64Array([d]).buffer);

        for (var i = bytes.length - 1; i >= 0; i--) {
            this.writeByte(bytes[i]);
        }
    };

    ArrayBufferDataStream.prototype.writeFloatBE = function(d) {
        var
            bytes = new Uint8Array(new Float32Array([d]).buffer);

        for (var i = bytes.length - 1; i >= 0; i--) {
            this.writeByte(bytes[i]);
        }
    };

    /**
     * Write an ASCII string to the stream
     */
    ArrayBufferDataStream.prototype.writeString = function(s) {
        for (var i = 0; i < s.length; i++) {
            this.data[this.pos++] = s.charCodeAt(i);
        }
    };

    /**
     * Write the given 32-bit integer to the stream as an EBML variable-length integer using the given byte width
     * (use measureEBMLVarInt).
     *
     * No error checking is performed to ensure that the supplied width is correct for the integer.
     *
     * @param i Integer to be written
     * @param width Number of bytes to write to the stream
     */
    ArrayBufferDataStream.prototype.writeEBMLVarIntWidth = function(i, width) {
        switch (width) {
            case 1:
                this.writeU8((1 << 7) | i);
            break;
            case 2:
                this.writeU8((1 << 6) | (i >> 8));
                this.writeU8(i);
            break;
            case 3:
                this.writeU8((1 << 5) | (i >> 16));
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            case 4:
                this.writeU8((1 << 4) | (i >> 24));
                this.writeU8(i >> 16);
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            case 5:
                /*
                 * JavaScript converts its doubles to 32-bit integers for bitwise operations, so we need to do a
                 * division by 2^32 instead of a right-shift of 32 to retain those top 3 bits
                 */
                this.writeU8((1 << 3) | ((i / 4294967296) & 0x7));
                this.writeU8(i >> 24);
                this.writeU8(i >> 16);
                this.writeU8(i >> 8);
                this.writeU8(i);
            break;
            default:
                throw new RuntimeException("Bad EBML VINT size " + width);
        }
    };

    /**
     * Return the number of bytes needed to encode the given integer as an EBML VINT.
     */
    ArrayBufferDataStream.prototype.measureEBMLVarInt = function(val) {
        if (val < (1 << 7) - 1) {
            /* Top bit is set, leaving 7 bits to hold the integer, but we can't store 127 because
             * "all bits set to one" is a reserved value. Same thing for the other cases below:
             */
            return 1;
        } else if (val < (1 << 14) - 1) {
            return 2;
        } else if (val < (1 << 21) - 1) {
            return 3;
        } else if (val < (1 << 28) - 1) {
            return 4;
        } else if (val < 34359738367) { // 2 ^ 35 - 1 (can address 32GB)
            return 5;
        } else {
            throw new RuntimeException("EBML VINT size not supported " + val);
        }
    };

    ArrayBufferDataStream.prototype.writeEBMLVarInt = function(i) {
        this.writeEBMLVarIntWidth(i, this.measureEBMLVarInt(i));
    };

    /**
     * Write the given unsigned 32-bit integer to the stream in big-endian order using the given byte width.
     * No error checking is performed to ensure that the supplied width is correct for the integer.
     *
     * Omit the width parameter to have it determined automatically for you.
     *
     * @param u Unsigned integer to be written
     * @param width Number of bytes to write to the stream
     */
    ArrayBufferDataStream.prototype.writeUnsignedIntBE = function(u, width) {
        if (width === undefined) {
            width = this.measureUnsignedInt(u);
        }

        // Each case falls through:
        switch (width) {
            case 5:
                this.writeU8(Math.floor(u / 4294967296)); // Need to use division to access >32 bits of floating point var
            case 4:
                this.writeU8(u >> 24);
            case 3:
                this.writeU8(u >> 16);
            case 2:
                this.writeU8(u >> 8);
            case 1:
                this.writeU8(u);
            break;
            default:
                throw new RuntimeException("Bad UINT size " + width);
        }
    };

    /**
     * Return the number of bytes needed to hold the non-zero bits of the given unsigned integer.
     */
    ArrayBufferDataStream.prototype.measureUnsignedInt = function(val) {
        // Force to 32-bit unsigned integer
        if (val < (1 << 8)) {
            return 1;
        } else if (val < (1 << 16)) {
            return 2;
        } else if (val < (1 << 24)) {
            return 3;
        } else if (val < 4294967296) {
            return 4;
        } else {
            return 5;
        }
    };

    /**
     * Return a view on the portion of the buffer from the beginning to the current seek position as a Uint8Array.
     */
    ArrayBufferDataStream.prototype.getAsDataArray = function() {
        if (this.pos < this.data.byteLength) {
            return this.data.subarray(0, this.pos);
        } else if (this.pos == this.data.byteLength) {
            return this.data;
        } else {
            throw "ArrayBufferDataStream's pos lies beyond end of buffer";
        }
    };

// 	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
// 		module.exports = ArrayBufferDataStream;
// 	} else {
// 		window.ArrayBufferDataStream = ArrayBufferDataStream;
// 	}
// }());"use strict";

/**
 * Allows a series of Blob-convertible objects (ArrayBuffer, Blob, String, etc) to be added to a buffer. Seeking and
 * overwriting of blobs is allowed.
 *
 * You can supply a FileWriter, in which case the BlobBuffer is just used as temporary storage before it writes it
 * through to the disk.
 *
 * By Nicholas Sherlock
 *
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */
// (function() {
	var BlobBuffer = function(fs) {
		return function(destination) {
			var
				buffer = [],
				writePromise = Promise.resolve(),
				fileWriter = null,
				fd = null;

			if (typeof FileWriter !== "undefined" && destination instanceof FileWriter) {
				fileWriter = destination;
			} else if (fs && destination) {
				fd = destination;
			}

			// Current seek offset
			this.pos = 0;

			// One more than the index of the highest byte ever written
			this.length = 0;

			// Returns a promise that converts the blob to an ArrayBuffer
			function readBlobAsBuffer(blob) {
				return new Promise(function (resolve, reject) {
					var
						reader = new FileReader();

					reader.addEventListener("loadend", function () {
						resolve(reader.result);
					});

					reader.readAsArrayBuffer(blob);
				});
			}

			function convertToUint8Array(thing) {
				return new Promise(function (resolve, reject) {
					if (thing instanceof Uint8Array) {
						resolve(thing);
					} else if (thing instanceof ArrayBuffer || ArrayBuffer.isView(thing)) {
						resolve(new Uint8Array(thing));
					} else if (thing instanceof Blob) {
						resolve(readBlobAsBuffer(thing).then(function (buffer) {
							return new Uint8Array(buffer);
						}));
					} else {
						//Assume that Blob will know how to read this thing
						resolve(readBlobAsBuffer(new Blob([thing])).then(function (buffer) {
							return new Uint8Array(buffer);
						}));
					}
				});
			}

			function measureData(data) {
				var
					result = data.byteLength || data.length || data.size;

				if (!Number.isInteger(result)) {
					throw "Failed to determine size of element";
				}

				return result;
			}

			/**
			 * Seek to the given absolute offset.
			 *
			 * You may not seek beyond the end of the file (this would create a hole and/or allow blocks to be written in non-
			 * sequential order, which isn't currently supported by the memory buffer backend).
			 */
			this.seek = function (offset) {
				if (offset < 0) {
					throw "Offset may not be negative";
				}

				if (isNaN(offset)) {
					throw "Offset may not be NaN";
				}

				if (offset > this.length) {
					throw "Seeking beyond the end of file is not allowed";
				}

				this.pos = offset;
			};

			/**
			 * Write the Blob-convertible data to the buffer at the current seek position.
			 *
			 * Note: If overwriting existing data, the write must not cross preexisting block boundaries (written data must
			 * be fully contained by the extent of a previous write).
			 */
			this.write = function (data) {
				var
					newEntry = {
						offset: this.pos,
						data: data,
						length: measureData(data)
					},
					isAppend = newEntry.offset >= this.length;

				this.pos += newEntry.length;
				this.length = Math.max(this.length, this.pos);

				// After previous writes complete, perform our write
				writePromise = writePromise.then(function () {
					if (fd) {
						return new Promise(function(resolve, reject) {
							convertToUint8Array(newEntry.data).then(function(dataArray) {
								var
									totalWritten = 0,
									buffer = Buffer.from(dataArray.buffer),

									handleWriteComplete = function(err, written, buffer) {
										totalWritten += written;

										if (totalWritten >= buffer.length) {
											resolve();
										} else {
											// We still have more to write...
											fs.write(fd, buffer, totalWritten, buffer.length - totalWritten, newEntry.offset + totalWritten, handleWriteComplete);
										}
									};

								fs.write(fd, buffer, 0, buffer.length, newEntry.offset, handleWriteComplete);
							});
						});
					} else if (fileWriter) {
						return new Promise(function (resolve, reject) {
							fileWriter.onwriteend = resolve;

							fileWriter.seek(newEntry.offset);
							fileWriter.write(new Blob([newEntry.data]));
						});
					} else if (!isAppend) {
						// We might be modifying a write that was already buffered in memory.

						// Slow linear search to find a block we might be overwriting
						for (var i = 0; i < buffer.length; i++) {
							var
								entry = buffer[i];

							// If our new entry overlaps the old one in any way...
							if (!(newEntry.offset + newEntry.length <= entry.offset || newEntry.offset >= entry.offset + entry.length)) {
								if (newEntry.offset < entry.offset || newEntry.offset + newEntry.length > entry.offset + entry.length) {
									throw new Error("Overwrite crosses blob boundaries");
								}

								if (newEntry.offset == entry.offset && newEntry.length == entry.length) {
									// We overwrote the entire block
									entry.data = newEntry.data;

									// We're done
									return;
								} else {
									return convertToUint8Array(entry.data)
										.then(function (entryArray) {
											entry.data = entryArray;

											return convertToUint8Array(newEntry.data);
										}).then(function (newEntryArray) {
											newEntry.data = newEntryArray;

											entry.data.set(newEntry.data, newEntry.offset - entry.offset);
										});
								}
							}
						}
						// Else fall through to do a simple append, as we didn't overwrite any pre-existing blocks
					}

					buffer.push(newEntry);
				});
			};

			/**
			 * Finish all writes to the buffer, returning a promise that signals when that is complete.
			 *
			 * If a FileWriter was not provided, the promise is resolved with a Blob that represents the completed BlobBuffer
			 * contents. You can optionally pass in a mimeType to be used for this blob.
			 *
			 * If a FileWriter was provided, the promise is resolved with null as the first argument.
			 */
			this.complete = function (mimeType) {
				if (fd || fileWriter) {
					writePromise = writePromise.then(function () {
						return null;
					});
				} else {
					// After writes complete we need to merge the buffer to give to the caller
					writePromise = writePromise.then(function () {
						var
							result = [];

						for (var i = 0; i < buffer.length; i++) {
							result.push(buffer[i].data);
						}

						return new Blob(result, {mimeType: mimeType});
					});
				}

				return writePromise;
			};
		};
	}(null);

// 	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
// 		module.exports = BlobBuffer(require('fs'));
// 	} else {
// 		window.BlobBuffer = BlobBuffer(null);
// 	}
// })();
/**
 * WebM video encoder for Google Chrome. This implementation is suitable for creating very large video files, because
 * it can stream Blobs directly to a FileWriter without buffering the entire video in memory.
 *
 * When FileWriter is not available or not desired, it can buffer the video in memory as a series of Blobs which are
 * eventually returned as one composite Blob.
 *
 * By Nicholas Sherlock.
 *
 * Based on the ideas from Whammy: https://github.com/antimatter15/whammy
 *
 * Released under the WTFPLv2 https://en.wikipedia.org/wiki/WTFPL
 */

"use strict";

(function() {
    var WebMWriter = function(ArrayBufferDataStream, BlobBuffer) {
        function extend(base, top) {
            var
                target = {};

            [base, top].forEach(function(obj) {
                for (var prop in obj) {
                    if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                        target[prop] = obj[prop];
                    }
                }
            });

            return target;
        }

        /**
         * Decode a Base64 data URL into a binary string.
         *
         * Returns the binary string, or false if the URL could not be decoded.
         */
        function decodeBase64WebPDataURL(url) {
            if (typeof url !== "string" || !url.match(/^data:image\/webp;base64,/i)) {
                return false;
            }

            return window.atob(url.substring("data:image\/webp;base64,".length));
        }

        /**
         * Convert a raw binary string (one character = one output byte) to an ArrayBuffer
         */
        function stringToArrayBuffer(string) {
            var
                buffer = new ArrayBuffer(string.length),
                int8Array = new Uint8Array(buffer);

            for (var i = 0; i < string.length; i++) {
                int8Array[i] = string.charCodeAt(i);
            }

            return buffer;
        }

        /**
         * Convert the given canvas to a WebP encoded image and return the image data as a string.
         */
        function renderAsWebP(canvas, quality) {
            var
                frame = canvas.toDataURL('image/webp', {quality: quality});

            return decodeBase64WebPDataURL(frame);
        }

        function extractKeyframeFromWebP(webP) {
            // Assume that Chrome will generate a Simple Lossy WebP which has this header:
            var
                keyframeStartIndex = webP.indexOf('VP8 ');

            if (keyframeStartIndex == -1) {
                throw "Failed to identify beginning of keyframe in WebP image";
            }

            // Skip the header and the 4 bytes that encode the length of the VP8 chunk
            keyframeStartIndex += 'VP8 '.length + 4;

            return webP.substring(keyframeStartIndex);
        }

        // Just a little utility so we can tag values as floats for the EBML encoder's benefit
        function EBMLFloat32(value) {
            this.value = value;
        }

        function EBMLFloat64(value) {
            this.value = value;
        }

        /**
         * Write the given EBML object to the provided ArrayBufferStream.
         *
         * The buffer's first byte is at bufferFileOffset inside the video file. This is used to complete offset and
         * dataOffset fields in each EBML structure, indicating the file offset of the first byte of the EBML element and
         * its data payload.
         */
        function writeEBML(buffer, bufferFileOffset, ebml) {
            // Is the ebml an array of sibling elements?
            if (Array.isArray(ebml)) {
                for (var i = 0; i < ebml.length; i++) {
                    writeEBML(buffer, bufferFileOffset, ebml[i]);
                }
            // Is this some sort of raw data that we want to write directly?
            } else if (typeof ebml === "string") {
                buffer.writeString(ebml);
            } else if (ebml instanceof Uint8Array) {
                buffer.writeBytes(ebml);
            } else if (ebml.id){
                // We're writing an EBML element
                ebml.offset = buffer.pos + bufferFileOffset;

                buffer.writeUnsignedIntBE(ebml.id); // ID field

                // Now we need to write the size field, so we must know the payload size:

                if (Array.isArray(ebml.data)) {
                    // Writing an array of child elements. We won't try to measure the size of the children up-front

                    var
                        sizePos, dataBegin, dataEnd;

                    if (ebml.size === -1) {
                        // Write the reserved all-one-bits marker to note that the size of this element is unknown/unbounded
                        buffer.writeByte(0xFF);
                    } else {
                        sizePos = buffer.pos;

                        /* Write a dummy size field to overwrite later. 4 bytes allows an element maximum size of 256MB,
                         * which should be plenty (we don't want to have to buffer that much data in memory at one time
                         * anyway!)
                         */
                        buffer.writeBytes([0, 0, 0, 0]);
                    }

                    dataBegin = buffer.pos;

                    ebml.dataOffset = dataBegin + bufferFileOffset;
                    writeEBML(buffer, bufferFileOffset, ebml.data);

                    if (ebml.size !== -1) {
                        dataEnd = buffer.pos;

                        ebml.size = dataEnd - dataBegin;

                        buffer.seek(sizePos);
                        buffer.writeEBMLVarIntWidth(ebml.size, 4); // Size field

                        buffer.seek(dataEnd);
                    }
                } else if (typeof ebml.data === "string") {
                    buffer.writeEBMLVarInt(ebml.data.length); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeString(ebml.data);
                } else if (typeof ebml.data === "number") {
                    // Allow the caller to explicitly choose the size if they wish by supplying a size field
                    if (!ebml.size) {
                        ebml.size = buffer.measureUnsignedInt(ebml.data);
                    }

                    buffer.writeEBMLVarInt(ebml.size); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeUnsignedIntBE(ebml.data, ebml.size);
                } else if (ebml.data instanceof EBMLFloat64) {
                    buffer.writeEBMLVarInt(8); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeDoubleBE(ebml.data.value);
                } else if (ebml.data instanceof EBMLFloat32) {
                    buffer.writeEBMLVarInt(4); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeFloatBE(ebml.data.value);
                } else if (ebml.data instanceof Uint8Array) {
                    buffer.writeEBMLVarInt(ebml.data.byteLength); // Size field
                    ebml.dataOffset = buffer.pos + bufferFileOffset;
                    buffer.writeBytes(ebml.data);
                } else {
                    throw "Bad EBML datatype " + typeof ebml.data;
                }
            } else {
                throw "Bad EBML datatype " + typeof ebml.data;
            }
        }

        return function(options) {
            var
                MAX_CLUSTER_DURATION_MSEC = 5000,
                DEFAULT_TRACK_NUMBER = 1,

                writtenHeader = false,
                videoWidth, videoHeight,

                clusterFrameBuffer = [],
                clusterStartTime = 0,
                clusterDuration = 0,

                optionDefaults = {
                    quality: 0.95,       // WebM image quality from 0.0 (worst) to 1.0 (best)
                    fileWriter: null,    // Chrome FileWriter in order to stream to a file instead of buffering to memory (optional)
                    fd: null,            // Node.JS file descriptor to write to instead of buffering (optional)

                    // You must supply one of:
                    frameDuration: null, // Duration of frames in milliseconds
                    frameRate: null,     // Number of frames per second
                },

                seekPoints = {
                    Cues: {id: new Uint8Array([0x1C, 0x53, 0xBB, 0x6B]), positionEBML: null},
                    SegmentInfo: {id: new Uint8Array([0x15, 0x49, 0xA9, 0x66]), positionEBML: null},
                    Tracks: {id: new Uint8Array([0x16, 0x54, 0xAE, 0x6B]), positionEBML: null},
                },

                ebmlSegment,
                segmentDuration = {
                    "id": 0x4489, // Duration
                    "data": new EBMLFloat64(0)
                },

                seekHead,

                cues = [],

                blobBuffer = new BlobBuffer(options.fileWriter || options.fd);

            function fileOffsetToSegmentRelative(fileOffset) {
                return fileOffset - ebmlSegment.dataOffset;
            }

            /**
             * Create a SeekHead element with descriptors for the points in the global seekPoints array.
             *
             * 5 bytes of position values are reserved for each node, which lie at the offset point.positionEBML.dataOffset,
             * to be overwritten later.
             */
            function createSeekHead() {
                var
                    seekPositionEBMLTemplate = {
                        "id": 0x53AC, // SeekPosition
                        "size": 5, // Allows for 32GB video files
                        "data": 0 // We'll overwrite this when the file is complete
                    },

                    result = {
                        "id": 0x114D9B74, // SeekHead
                        "data": []
                    };

                for (var name in seekPoints) {
                    var
                        seekPoint = seekPoints[name];

                    seekPoint.positionEBML = Object.create(seekPositionEBMLTemplate);

                    result.data.push({
                         "id": 0x4DBB, // Seek
                         "data": [
                              {
                                  "id": 0x53AB, // SeekID
                                  "data": seekPoint.id
                              },
                              seekPoint.positionEBML
                         ]
                    });
                }

                return result;
            }

            /**
             * Write the WebM file header to the stream.
             */
            function writeHeader() {
                seekHead = createSeekHead();

                var
                    ebmlHeader = {
                        "id": 0x1a45dfa3, // EBML
                        "data": [
                            {
                                "id": 0x4286, // EBMLVersion
                                "data": 1
                            },
                            {
                                "id": 0x42f7, // EBMLReadVersion
                                "data": 1
                            },
                            {
                                "id": 0x42f2, // EBMLMaxIDLength
                                "data": 4
                            },
                            {
                                "id": 0x42f3, // EBMLMaxSizeLength
                                "data": 8
                            },
                            {
                                "id": 0x4282, // DocType
                                "data": "webm"
                            },
                            {
                                "id": 0x4287, // DocTypeVersion
                                "data": 2
                            },
                            {
                                "id": 0x4285, // DocTypeReadVersion
                                "data": 2
                            }
                        ]
                    },

                    segmentInfo = {
                        "id": 0x1549a966, // Info
                        "data": [
                            {
                                "id": 0x2ad7b1, // TimecodeScale
                                "data": 1e6 // Times will be in miliseconds (1e6 nanoseconds per step = 1ms)
                            },
                            {
                                "id": 0x4d80, // MuxingApp
                                "data": "webm-writer-js",
                            },
                            {
                                "id": 0x5741, // WritingApp
                                "data": "webm-writer-js"
                            },
                            segmentDuration // To be filled in later
                        ]
                    },

                    tracks = {
                        "id": 0x1654ae6b, // Tracks
                        "data": [
                            {
                                "id": 0xae, // TrackEntry
                                "data": [
                                    {
                                        "id": 0xd7, // TrackNumber
                                        "data": DEFAULT_TRACK_NUMBER
                                    },
                                    {
                                        "id": 0x73c5, // TrackUID
                                        "data": DEFAULT_TRACK_NUMBER
                                    },
                                    {
                                        "id": 0x9c, // FlagLacing
                                        "data": 0
                                    },
                                    {
                                        "id": 0x22b59c, // Language
                                        "data": "und"
                                    },
                                    {
                                        "id": 0x86, // CodecID
                                        "data": "V_VP8"
                                    },
                                    {
                                        "id": 0x258688, // CodecName
                                        "data": "VP8"
                                    },
                                    {
                                        "id": 0x83, // TrackType
                                        "data": 1
                                    },
                                    {
                                        "id": 0xe0,  // Video
                                        "data": [
                                            {
                                                "id": 0xb0, // PixelWidth
                                                "data": videoWidth
                                            },
                                            {
                                                "id": 0xba, // PixelHeight
                                                "data": videoHeight
                                            }
                                        ]
                                    }
                                ]
                            }
                        ]
                    };

                ebmlSegment = {
                    "id": 0x18538067, // Segment
                    "size": -1, // Unbounded size
                    "data": [
                        seekHead,
                        segmentInfo,
                        tracks,
                    ]
                };

                var
                    bufferStream = new ArrayBufferDataStream(256);

                writeEBML(bufferStream, blobBuffer.pos, [ebmlHeader, ebmlSegment]);
                blobBuffer.write(bufferStream.getAsDataArray());

                // Now we know where these top-level elements lie in the file:
                seekPoints.SegmentInfo.positionEBML.data = fileOffsetToSegmentRelative(segmentInfo.offset);
                seekPoints.Tracks.positionEBML.data = fileOffsetToSegmentRelative(tracks.offset);
            };

            /**
             * Create a SimpleBlock keyframe header using these fields:
             *     timecode    - Time of this keyframe
             *     trackNumber - Track number from 1 to 126 (inclusive)
             *     frame       - Raw frame data payload string
             *
             * Returns an EBML element.
             */
            function createKeyframeBlock(keyframe) {
                var
                    bufferStream = new ArrayBufferDataStream(1 + 2 + 1);

                if (!(keyframe.trackNumber > 0 && keyframe.trackNumber < 127)) {
                    throw "TrackNumber must be > 0 and < 127";
                }

                bufferStream.writeEBMLVarInt(keyframe.trackNumber); // Always 1 byte since we limit the range of trackNumber
                bufferStream.writeU16BE(keyframe.timecode);

                // Flags byte
                bufferStream.writeByte(
                    1 << 7 // Keyframe
                );

                return {
                    "id": 0xA3, // SimpleBlock
                    "data": [
                         bufferStream.getAsDataArray(),
                         keyframe.frame
                    ]
                };
            }

            /**
             * Create a Cluster node using these fields:
             *
             *    timecode    - Start time for the cluster
             *
             * Returns an EBML element.
             */
            function createCluster(cluster) {
                return {
                    "id": 0x1f43b675,
                    "data": [
                         {
                            "id": 0xe7, // Timecode
                            "data": Math.round(cluster.timecode)
                         }
                    ]
                };
            }

            function addCuePoint(trackIndex, clusterTime, clusterFileOffset) {
                cues.push({
                    "id": 0xBB, // Cue
                    "data": [
                         {
                             "id": 0xB3, // CueTime
                             "data": clusterTime
                         },
                         {
                             "id": 0xB7, // CueTrackPositions
                             "data": [
                                  {
                                      "id": 0xF7, // CueTrack
                                      "data": trackIndex
                                  },
                                  {
                                      "id": 0xF1, // CueClusterPosition
                                      "data": fileOffsetToSegmentRelative(clusterFileOffset)
                                  }
                             ]
                         }
                    ]
                });
            }

            /**
             * Write a Cues element to the blobStream using the global `cues` array of CuePoints (use addCuePoint()).
             * The seek entry for the Cues in the SeekHead is updated.
             */
            function writeCues() {
                var
                    ebml = {
                        "id": 0x1C53BB6B,
                        "data": cues
                    },

                    cuesBuffer = new ArrayBufferDataStream(16 + cues.length * 32); // Pretty crude estimate of the buffer size we'll need

                writeEBML(cuesBuffer, blobBuffer.pos, ebml);
                blobBuffer.write(cuesBuffer.getAsDataArray());

                // Now we know where the Cues element has ended up, we can update the SeekHead
                seekPoints.Cues.positionEBML.data = fileOffsetToSegmentRelative(ebml.offset);
            }

            /**
             * Flush the frames in the current clusterFrameBuffer out to the stream as a Cluster.
             */
            function flushClusterFrameBuffer() {
                if (clusterFrameBuffer.length == 0) {
                    return;
                }

                // First work out how large of a buffer we need to hold the cluster data
                var
                    rawImageSize = 0;

                for (var i = 0; i < clusterFrameBuffer.length; i++) {
                    rawImageSize += clusterFrameBuffer[i].frame.length;
                }

                var
                    buffer = new ArrayBufferDataStream(rawImageSize + clusterFrameBuffer.length * 32), // Estimate 32 bytes per SimpleBlock header

                    cluster = createCluster({
                        timecode: Math.round(clusterStartTime),
                    });

                for (var i = 0; i < clusterFrameBuffer.length; i++) {
                    cluster.data.push(createKeyframeBlock(clusterFrameBuffer[i]));
                }

                writeEBML(buffer, blobBuffer.pos, cluster);
                blobBuffer.write(buffer.getAsDataArray());

                addCuePoint(DEFAULT_TRACK_NUMBER, Math.round(clusterStartTime), cluster.offset);

                clusterFrameBuffer = [];
                clusterStartTime += clusterDuration;
                clusterDuration = 0;
            }

            function validateOptions() {
                // Derive frameDuration setting if not already supplied
                if (!options.frameDuration) {
                    if (options.frameRate) {
                        options.frameDuration = 1000 / options.frameRate;
                    } else {
                        throw "Missing required frameDuration or frameRate setting";
                    }
                }
            }

            function addFrameToCluster(frame) {
                frame.trackNumber = DEFAULT_TRACK_NUMBER;

                // Frame timecodes are relative to the start of their cluster:
                frame.timecode = Math.round(clusterDuration);

                clusterFrameBuffer.push(frame);

                clusterDuration += frame.duration;

                if (clusterDuration >= MAX_CLUSTER_DURATION_MSEC) {
                    flushClusterFrameBuffer();
                }
            }

            /**
             * Rewrites the SeekHead element that was initially written to the stream with the offsets of top level elements.
             *
             * Call once writing is complete (so the offset of all top level elements is known).
             */
            function rewriteSeekHead() {
                var
                    seekHeadBuffer = new ArrayBufferDataStream(seekHead.size),
                    oldPos = blobBuffer.pos;

                // Write the rewritten SeekHead element's data payload to the stream (don't need to update the id or size)
                writeEBML(seekHeadBuffer, seekHead.dataOffset, seekHead.data);

                // And write that through to the file
                blobBuffer.seek(seekHead.dataOffset);
                blobBuffer.write(seekHeadBuffer.getAsDataArray());

                blobBuffer.seek(oldPos);
            }

            /**
             * Rewrite the Duration field of the Segment with the newly-discovered video duration.
             */
            function rewriteDuration() {
                var
                    buffer = new ArrayBufferDataStream(8),
                    oldPos = blobBuffer.pos;

                // Rewrite the data payload (don't need to update the id or size)
                buffer.writeDoubleBE(clusterStartTime);

                // And write that through to the file
                blobBuffer.seek(segmentDuration.dataOffset);
                blobBuffer.write(buffer.getAsDataArray());

                blobBuffer.seek(oldPos);
            }

            /**
             * Add a frame to the video. Currently the frame must be a Canvas element.
             */
            this.addFrame = function(canvas) {
                if (writtenHeader) {
                    if (canvas.width != videoWidth || canvas.height != videoHeight) {
                        throw "Frame size differs from previous frames";
                    }
                } else {
                    videoWidth = canvas.width;
                    videoHeight = canvas.height;

                    writeHeader();
                    writtenHeader = true;
                }

                var
                    webP = renderAsWebP(canvas, {quality: options.quality});

                if (!webP) {
                    throw "Couldn't decode WebP frame, does the browser support WebP?";
                }

                addFrameToCluster({
                    frame: extractKeyframeFromWebP(webP),
                    duration: options.frameDuration
                });
            };

            /**
             * Finish writing the video and return a Promise to signal completion.
             *
             * If the destination device was memory (i.e. options.fileWriter was not supplied), the Promise is resolved with
             * a Blob with the contents of the entire video.
             */
            this.complete = function() {
                flushClusterFrameBuffer();

                writeCues();
                rewriteSeekHead();
                rewriteDuration();

                return blobBuffer.complete('video/webm');
            };

            this.getWrittenSize = function() {
                return blobBuffer.length;
            };

            options = extend(optionDefaults, options || {});
            validateOptions();
        };
    };

    if ( true && typeof module.exports !== 'undefined') {
	    // module.exports = WebMWriter(require("./ArrayBufferDataStream"), require("./BlobBuffer"));
      module.exports = WebMWriter(ArrayBufferDataStream,BlobBuffer);
    } else {
	    window.WebMWriter = WebMWriter(ArrayBufferDataStream, BlobBuffer);
    }
})();


/***/ }),

/***/ 809:
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.changeDpiBlob = changeDpiBlob;
exports.changeDpiDataUrl = changeDpiDataUrl;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createPngDataTable() {
  /* Table of CRCs of all 8-bit messages. */
  var crcTable = new Int32Array(256);
  for (var n = 0; n < 256; n++) {
    var c = n;
    for (var k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ c >>> 1 : c >>> 1;
    }
    crcTable[n] = c;
  }
  return crcTable;
}

function calcCrc(buf) {
  var c = -1;
  if (!pngDataTable) pngDataTable = createPngDataTable();
  for (var n = 0; n < buf.length; n++) {
    c = pngDataTable[(c ^ buf[n]) & 0xFF] ^ c >>> 8;
  }
  return c ^ -1;
}

var pngDataTable = void 0;

var PNG = 'image/png';
var JPEG = 'image/jpeg';

// those are 3 possible signature of the physBlock in base64.
// the pHYs signature block is preceed by the 4 bytes of lenght. The length of
// the block is always 9 bytes. So a phys block has always this signature:
// 0 0 0 9 p H Y s.
// However the data64 encoding aligns we will always find one of those 3 strings.
// this allow us to find this particular occurence of the pHYs block without
// converting from b64 back to string
var b64PhysSignature1 = 'AAlwSFlz';
var b64PhysSignature2 = 'AAAJcEhZ';
var b64PhysSignature3 = 'AAAACXBI';

var _P = 'p'.charCodeAt(0);
var _H = 'H'.charCodeAt(0);
var _Y = 'Y'.charCodeAt(0);
var _S = 's'.charCodeAt(0);

function changeDpiBlob(blob, dpi) {
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  var headerChunk = blob.slice(0, 33);
  return new Promise(function (resolve, reject) {
    var fileReader = new FileReader();
    fileReader.onload = function () {
      var dataArray = new Uint8Array(fileReader.result);
      var tail = blob.slice(33);
      var changedArray = changeDpiOnArray(dataArray, dpi, blob.type);
      resolve(new Blob([changedArray, tail], { type: blob.type }));
    };
    fileReader.readAsArrayBuffer(headerChunk);
  });
}

function changeDpiDataUrl(base64Image, dpi) {
  var dataSplitted = base64Image.split(',');
  var format = dataSplitted[0];
  var body = dataSplitted[1];
  var type = void 0;
  var headerLength = void 0;
  var overwritepHYs = false;
  if (format.indexOf(PNG) !== -1) {
    type = PNG;
    var b64Index = detectPhysChunkFromDataUrl(body);
    // 28 bytes in dataUrl are 21bytes, length of phys chunk with everything inside.
    if (b64Index >= 0) {
      headerLength = Math.ceil((b64Index + 28) / 3) * 4;
      overwritepHYs = true;
    } else {
      headerLength = 33 / 3 * 4;
    }
  }
  if (format.indexOf(JPEG) !== -1) {
    type = JPEG;
    headerLength = 18 / 3 * 4;
  }
  // 33 bytes are ok for pngs and jpegs
  // to contain the information.
  var stringHeader = body.substring(0, headerLength);
  var restOfData = body.substring(headerLength);
  var headerBytes = atob(stringHeader);
  var dataArray = new Uint8Array(headerBytes.length);
  for (var i = 0; i < dataArray.length; i++) {
    dataArray[i] = headerBytes.charCodeAt(i);
  }
  var finalArray = changeDpiOnArray(dataArray, dpi, type, overwritepHYs);
  var base64Header = btoa(String.fromCharCode.apply(String, _toConsumableArray(finalArray)));
  return [format, ',', base64Header, restOfData].join('');
}

function detectPhysChunkFromDataUrl(data) {
  var b64index = data.indexOf(b64PhysSignature1);
  if (b64index === -1) {
    b64index = data.indexOf(b64PhysSignature2);
  }
  if (b64index === -1) {
    b64index = data.indexOf(b64PhysSignature3);
  }
  // if b64index === -1 chunk is not found
  return b64index;
}

function searchStartOfPhys(data) {
  var length = data.length - 1;
  // we check from the end since we cut the string in proximity of the header
  // the header is within 21 bytes from the end.
  for (var i = length; i >= 4; i--) {
    if (data[i - 4] === 9 && data[i - 3] === _P && data[i - 2] === _H && data[i - 1] === _Y && data[i] === _S) {
      return i - 3;
    }
  }
}

function changeDpiOnArray(dataArray, dpi, format, overwritepHYs) {
  if (format === JPEG) {
    dataArray[13] = 1; // 1 pixel per inch or 2 pixel per cm
    dataArray[14] = dpi >> 8; // dpiX high byte
    dataArray[15] = dpi & 0xff; // dpiX low byte
    dataArray[16] = dpi >> 8; // dpiY high byte
    dataArray[17] = dpi & 0xff; // dpiY low byte
    return dataArray;
  }
  if (format === PNG) {
    var physChunk = new Uint8Array(13);
    // chunk header pHYs
    // 9 bytes of data
    // 4 bytes of crc
    // this multiplication is because the standard is dpi per meter.
    dpi *= 39.3701;
    physChunk[0] = _P;
    physChunk[1] = _H;
    physChunk[2] = _Y;
    physChunk[3] = _S;
    physChunk[4] = dpi >>> 24; // dpiX highest byte
    physChunk[5] = dpi >>> 16; // dpiX veryhigh byte
    physChunk[6] = dpi >>> 8; // dpiX high byte
    physChunk[7] = dpi & 0xff; // dpiX low byte
    physChunk[8] = physChunk[4]; // dpiY highest byte
    physChunk[9] = physChunk[5]; // dpiY veryhigh byte
    physChunk[10] = physChunk[6]; // dpiY high byte
    physChunk[11] = physChunk[7]; // dpiY low byte
    physChunk[12] = 1; // dot per meter....

    var crc = calcCrc(physChunk);

    var crcChunk = new Uint8Array(4);
    crcChunk[0] = crc >>> 24;
    crcChunk[1] = crc >>> 16;
    crcChunk[2] = crc >>> 8;
    crcChunk[3] = crc & 0xff;

    if (overwritepHYs) {
      var startingIndex = searchStartOfPhys(dataArray);
      dataArray.set(physChunk, startingIndex);
      dataArray.set(crcChunk, startingIndex + 13);
      return dataArray;
    } else {
      // i need to give back an array of data that is divisible by 3 so that
      // dataurl encoding gives me integers, for luck this chunk is 17 + 4 = 21
      // if it was we could add a text chunk contaning some info, untill desired
      // length is met.

      // chunk structur 4 bytes for length is 9
      var chunkLength = new Uint8Array(4);
      chunkLength[0] = 0;
      chunkLength[1] = 0;
      chunkLength[2] = 0;
      chunkLength[3] = 9;

      var finalHeader = new Uint8Array(54);
      finalHeader.set(dataArray, 0);
      finalHeader.set(chunkLength, 33);
      finalHeader.set(physChunk, 37);
      finalHeader.set(crcChunk, 50);
      return finalHeader;
    }
  }
}

/***/ }),

/***/ 162:
/***/ (function(module, exports, __webpack_require__) {

var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;(function(a,b){if(true)!(__WEBPACK_AMD_DEFINE_ARRAY__ = [], __WEBPACK_AMD_DEFINE_FACTORY__ = (b),
		__WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ?
		(__WEBPACK_AMD_DEFINE_FACTORY__.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__)) : __WEBPACK_AMD_DEFINE_FACTORY__),
		__WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));else {}})(this,function(){"use strict";function b(a,b){return"undefined"==typeof b?b={autoBom:!1}:"object"!=typeof b&&(console.warn("Deprecated: Expected third argument to be a object"),b={autoBom:!b}),b.autoBom&&/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(a.type)?new Blob(["\uFEFF",a],{type:a.type}):a}function c(a,b,c){var d=new XMLHttpRequest;d.open("GET",a),d.responseType="blob",d.onload=function(){g(d.response,b,c)},d.onerror=function(){console.error("could not download file")},d.send()}function d(a){var b=new XMLHttpRequest;b.open("HEAD",a,!1);try{b.send()}catch(a){}return 200<=b.status&&299>=b.status}function e(a){try{a.dispatchEvent(new MouseEvent("click"))}catch(c){var b=document.createEvent("MouseEvents");b.initMouseEvent("click",!0,!0,window,0,0,0,80,20,!1,!1,!1,!1,0,null),a.dispatchEvent(b)}}var f="object"==typeof window&&window.window===window?window:"object"==typeof self&&self.self===self?self:"object"==typeof __webpack_require__.g&&__webpack_require__.g.global===__webpack_require__.g?__webpack_require__.g:void 0,a=f.navigator&&/Macintosh/.test(navigator.userAgent)&&/AppleWebKit/.test(navigator.userAgent)&&!/Safari/.test(navigator.userAgent),g=f.saveAs||("object"!=typeof window||window!==f?function(){}:"download"in HTMLAnchorElement.prototype&&!a?function(b,g,h){var i=f.URL||f.webkitURL,j=document.createElement("a");g=g||b.name||"download",j.download=g,j.rel="noopener","string"==typeof b?(j.href=b,j.origin===location.origin?e(j):d(j.href)?c(b,g,h):e(j,j.target="_blank")):(j.href=i.createObjectURL(b),setTimeout(function(){i.revokeObjectURL(j.href)},4E4),setTimeout(function(){e(j)},0))}:"msSaveOrOpenBlob"in navigator?function(f,g,h){if(g=g||f.name||"download","string"!=typeof f)navigator.msSaveOrOpenBlob(b(f,h),g);else if(d(f))c(f,g,h);else{var i=document.createElement("a");i.href=f,i.target="_blank",setTimeout(function(){e(i)})}}:function(b,d,e,g){if(g=g||open("","_blank"),g&&(g.document.title=g.document.body.innerText="downloading..."),"string"==typeof b)return c(b,d,e);var h="application/octet-stream"===b.type,i=/constructor/i.test(f.HTMLElement)||f.safari,j=/CriOS\/[\d]+/.test(navigator.userAgent);if((j||h&&i||a)&&"undefined"!=typeof FileReader){var k=new FileReader;k.onloadend=function(){var a=k.result;a=j?a:a.replace(/^data:[^;]*;/,"data:attachment/file;"),g?g.location.href=a:location=a,g=null},k.readAsDataURL(b)}else{var l=f.URL||f.webkitURL,m=l.createObjectURL(b);g?g.location=m:location.href=m,g=null,setTimeout(function(){l.revokeObjectURL(m)},4E4)}});f.saveAs=g.saveAs=g, true&&(module.exports=g)});

//# sourceMappingURL=FileSaver.min.js.map

/***/ }),

/***/ 650:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (__WEBPACK_DEFAULT_EXPORT__)
/* harmony export */ });
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) return _arrayLikeToArray(arr);
}

function _iterableToArray(iter) {
  if (typeof Symbol !== "undefined" && Symbol.iterator in Object(iter)) return Array.from(iter);
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(n);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

var MicroModal = function () {

  var FOCUSABLE_ELEMENTS = ['a[href]', 'area[href]', 'input:not([disabled]):not([type="hidden"]):not([aria-hidden])', 'select:not([disabled]):not([aria-hidden])', 'textarea:not([disabled]):not([aria-hidden])', 'button:not([disabled]):not([aria-hidden])', 'iframe', 'object', 'embed', '[contenteditable]', '[tabindex]:not([tabindex^="-"])'];

  var Modal = /*#__PURE__*/function () {
    function Modal(_ref) {
      var targetModal = _ref.targetModal,
          _ref$triggers = _ref.triggers,
          triggers = _ref$triggers === void 0 ? [] : _ref$triggers,
          _ref$onShow = _ref.onShow,
          onShow = _ref$onShow === void 0 ? function () {} : _ref$onShow,
          _ref$onClose = _ref.onClose,
          onClose = _ref$onClose === void 0 ? function () {} : _ref$onClose,
          _ref$openTrigger = _ref.openTrigger,
          openTrigger = _ref$openTrigger === void 0 ? 'data-micromodal-trigger' : _ref$openTrigger,
          _ref$closeTrigger = _ref.closeTrigger,
          closeTrigger = _ref$closeTrigger === void 0 ? 'data-micromodal-close' : _ref$closeTrigger,
          _ref$openClass = _ref.openClass,
          openClass = _ref$openClass === void 0 ? 'is-open' : _ref$openClass,
          _ref$disableScroll = _ref.disableScroll,
          disableScroll = _ref$disableScroll === void 0 ? false : _ref$disableScroll,
          _ref$disableFocus = _ref.disableFocus,
          disableFocus = _ref$disableFocus === void 0 ? false : _ref$disableFocus,
          _ref$awaitCloseAnimat = _ref.awaitCloseAnimation,
          awaitCloseAnimation = _ref$awaitCloseAnimat === void 0 ? false : _ref$awaitCloseAnimat,
          _ref$awaitOpenAnimati = _ref.awaitOpenAnimation,
          awaitOpenAnimation = _ref$awaitOpenAnimati === void 0 ? false : _ref$awaitOpenAnimati,
          _ref$debugMode = _ref.debugMode,
          debugMode = _ref$debugMode === void 0 ? false : _ref$debugMode;

      _classCallCheck(this, Modal);

      // Save a reference of the modal
      this.modal = document.getElementById(targetModal); // Save a reference to the passed config

      this.config = {
        debugMode: debugMode,
        disableScroll: disableScroll,
        openTrigger: openTrigger,
        closeTrigger: closeTrigger,
        openClass: openClass,
        onShow: onShow,
        onClose: onClose,
        awaitCloseAnimation: awaitCloseAnimation,
        awaitOpenAnimation: awaitOpenAnimation,
        disableFocus: disableFocus
      }; // Register click events only if pre binding eventListeners

      if (triggers.length > 0) this.registerTriggers.apply(this, _toConsumableArray(triggers)); // pre bind functions for event listeners

      this.onClick = this.onClick.bind(this);
      this.onKeydown = this.onKeydown.bind(this);
    }
    /**
     * Loops through all openTriggers and binds click event
     * @param  {array} triggers [Array of node elements]
     * @return {void}
     */


    _createClass(Modal, [{
      key: "registerTriggers",
      value: function registerTriggers() {
        var _this = this;

        for (var _len = arguments.length, triggers = new Array(_len), _key = 0; _key < _len; _key++) {
          triggers[_key] = arguments[_key];
        }

        triggers.filter(Boolean).forEach(function (trigger) {
          trigger.addEventListener('click', function (event) {
            return _this.showModal(event);
          });
        });
      }
    }, {
      key: "showModal",
      value: function showModal() {
        var _this2 = this;

        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        this.activeElement = document.activeElement;
        this.modal.setAttribute('aria-hidden', 'false');
        this.modal.classList.add(this.config.openClass);
        this.scrollBehaviour('disable');
        this.addEventListeners();

        if (this.config.awaitOpenAnimation) {
          var handler = function handler() {
            _this2.modal.removeEventListener('animationend', handler, false);

            _this2.setFocusToFirstNode();
          };

          this.modal.addEventListener('animationend', handler, false);
        } else {
          this.setFocusToFirstNode();
        }

        this.config.onShow(this.modal, this.activeElement, event);
      }
    }, {
      key: "closeModal",
      value: function closeModal() {
        var event = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;
        var modal = this.modal;
        this.modal.setAttribute('aria-hidden', 'true');
        this.removeEventListeners();
        this.scrollBehaviour('enable');

        if (this.activeElement && this.activeElement.focus) {
          this.activeElement.focus();
        }

        this.config.onClose(this.modal, this.activeElement, event);

        if (this.config.awaitCloseAnimation) {
          var openClass = this.config.openClass; // <- old school ftw

          this.modal.addEventListener('animationend', function handler() {
            modal.classList.remove(openClass);
            modal.removeEventListener('animationend', handler, false);
          }, false);
        } else {
          modal.classList.remove(this.config.openClass);
        }
      }
    }, {
      key: "closeModalById",
      value: function closeModalById(targetModal) {
        this.modal = document.getElementById(targetModal);
        if (this.modal) this.closeModal();
      }
    }, {
      key: "scrollBehaviour",
      value: function scrollBehaviour(toggle) {
        if (!this.config.disableScroll) return;
        var body = document.querySelector('body');

        switch (toggle) {
          case 'enable':
            Object.assign(body.style, {
              overflow: ''
            });
            break;

          case 'disable':
            Object.assign(body.style, {
              overflow: 'hidden'
            });
            break;
        }
      }
    }, {
      key: "addEventListeners",
      value: function addEventListeners() {
        this.modal.addEventListener('touchstart', this.onClick);
        this.modal.addEventListener('click', this.onClick);
        document.addEventListener('keydown', this.onKeydown);
      }
    }, {
      key: "removeEventListeners",
      value: function removeEventListeners() {
        this.modal.removeEventListener('touchstart', this.onClick);
        this.modal.removeEventListener('click', this.onClick);
        document.removeEventListener('keydown', this.onKeydown);
      }
    }, {
      key: "onClick",
      value: function onClick(event) {
        if (event.target.hasAttribute(this.config.closeTrigger)) {
          this.closeModal(event);
        }
      }
    }, {
      key: "onKeydown",
      value: function onKeydown(event) {
        if (event.keyCode === 27) this.closeModal(event); // esc

        if (event.keyCode === 9) this.retainFocus(event); // tab
      }
    }, {
      key: "getFocusableNodes",
      value: function getFocusableNodes() {
        var nodes = this.modal.querySelectorAll(FOCUSABLE_ELEMENTS);
        return Array.apply(void 0, _toConsumableArray(nodes));
      }
      /**
       * Tries to set focus on a node which is not a close trigger
       * if no other nodes exist then focuses on first close trigger
       */

    }, {
      key: "setFocusToFirstNode",
      value: function setFocusToFirstNode() {
        var _this3 = this;

        if (this.config.disableFocus) return;
        var focusableNodes = this.getFocusableNodes(); // no focusable nodes

        if (focusableNodes.length === 0) return; // remove nodes on whose click, the modal closes
        // could not think of a better name :(

        var nodesWhichAreNotCloseTargets = focusableNodes.filter(function (node) {
          return !node.hasAttribute(_this3.config.closeTrigger);
        });
        if (nodesWhichAreNotCloseTargets.length > 0) nodesWhichAreNotCloseTargets[0].focus();
        if (nodesWhichAreNotCloseTargets.length === 0) focusableNodes[0].focus();
      }
    }, {
      key: "retainFocus",
      value: function retainFocus(event) {
        var focusableNodes = this.getFocusableNodes(); // no focusable nodes

        if (focusableNodes.length === 0) return;
        /**
         * Filters nodes which are hidden to prevent
         * focus leak outside modal
         */

        focusableNodes = focusableNodes.filter(function (node) {
          return node.offsetParent !== null;
        }); // if disableFocus is true

        if (!this.modal.contains(document.activeElement)) {
          focusableNodes[0].focus();
        } else {
          var focusedItemIndex = focusableNodes.indexOf(document.activeElement);

          if (event.shiftKey && focusedItemIndex === 0) {
            focusableNodes[focusableNodes.length - 1].focus();
            event.preventDefault();
          }

          if (!event.shiftKey && focusableNodes.length > 0 && focusedItemIndex === focusableNodes.length - 1) {
            focusableNodes[0].focus();
            event.preventDefault();
          }
        }
      }
    }]);

    return Modal;
  }();
  /**
   * Modal prototype ends.
   * Here on code is responsible for detecting and
   * auto binding event handlers on modal triggers
   */
  // Keep a reference to the opened modal


  var activeModal = null;
  /**
   * Generates an associative array of modals and it's
   * respective triggers
   * @param  {array} triggers     An array of all triggers
   * @param  {string} triggerAttr The data-attribute which triggers the module
   * @return {array}
   */

  var generateTriggerMap = function generateTriggerMap(triggers, triggerAttr) {
    var triggerMap = [];
    triggers.forEach(function (trigger) {
      var targetModal = trigger.attributes[triggerAttr].value;
      if (triggerMap[targetModal] === undefined) triggerMap[targetModal] = [];
      triggerMap[targetModal].push(trigger);
    });
    return triggerMap;
  };
  /**
   * Validates whether a modal of the given id exists
   * in the DOM
   * @param  {number} id  The id of the modal
   * @return {boolean}
   */


  var validateModalPresence = function validateModalPresence(id) {
    if (!document.getElementById(id)) {
      console.warn("MicroModal: \u2757Seems like you have missed %c'".concat(id, "'"), 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'ID somewhere in your code. Refer example below to resolve it.');
      console.warn("%cExample:", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', "<div class=\"modal\" id=\"".concat(id, "\"></div>"));
      return false;
    }
  };
  /**
   * Validates if there are modal triggers present
   * in the DOM
   * @param  {array} triggers An array of data-triggers
   * @return {boolean}
   */


  var validateTriggerPresence = function validateTriggerPresence(triggers) {
    if (triggers.length <= 0) {
      console.warn("MicroModal: \u2757Please specify at least one %c'micromodal-trigger'", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', 'data attribute.');
      console.warn("%cExample:", 'background-color: #f8f9fa;color: #50596c;font-weight: bold;', "<a href=\"#\" data-micromodal-trigger=\"my-modal\"></a>");
      return false;
    }
  };
  /**
   * Checks if triggers and their corresponding modals
   * are present in the DOM
   * @param  {array} triggers   Array of DOM nodes which have data-triggers
   * @param  {array} triggerMap Associative array of modals and their triggers
   * @return {boolean}
   */


  var validateArgs = function validateArgs(triggers, triggerMap) {
    validateTriggerPresence(triggers);
    if (!triggerMap) return true;

    for (var id in triggerMap) {
      validateModalPresence(id);
    }

    return true;
  };
  /**
   * Binds click handlers to all modal triggers
   * @param  {object} config [description]
   * @return void
   */


  var init = function init(config) {
    // Create an config object with default openTrigger
    var options = Object.assign({}, {
      openTrigger: 'data-micromodal-trigger'
    }, config); // Collects all the nodes with the trigger

    var triggers = _toConsumableArray(document.querySelectorAll("[".concat(options.openTrigger, "]"))); // Makes a mappings of modals with their trigger nodes


    var triggerMap = generateTriggerMap(triggers, options.openTrigger); // Checks if modals and triggers exist in dom

    if (options.debugMode === true && validateArgs(triggers, triggerMap) === false) return; // For every target modal creates a new instance

    for (var key in triggerMap) {
      var value = triggerMap[key];
      options.targetModal = key;
      options.triggers = _toConsumableArray(value);
      activeModal = new Modal(options); // eslint-disable-line no-new
    }
  };
  /**
   * Shows a particular modal
   * @param  {string} targetModal [The id of the modal to display]
   * @param  {object} config [The configuration object to pass]
   * @return {void}
   */


  var show = function show(targetModal, config) {
    var options = config || {};
    options.targetModal = targetModal; // Checks if modals and triggers exist in dom

    if (options.debugMode === true && validateModalPresence(targetModal) === false) return; // clear events in case previous modal wasn't close

    if (activeModal) activeModal.removeEventListeners(); // stores reference to active modal

    activeModal = new Modal(options); // eslint-disable-line no-new

    activeModal.showModal();
  };
  /**
   * Closes the active modal
   * @param  {string} targetModal [The id of the modal to close]
   * @return {void}
   */


  var close = function close(targetModal) {
    targetModal ? activeModal.closeModalById(targetModal) : activeModal.closeModal();
  };

  return {
    init: init,
    show: show,
    close: close
  };
}();
window.MicroModal = MicroModal;

/* harmony default export */ const __WEBPACK_DEFAULT_EXPORT__ = (MicroModal);


/***/ }),

/***/ 10:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.workerString = void 0;
exports.workerString = "(function(b){function a(b,d){if({}.hasOwnProperty.call(a.cache,b))return a.cache[b];var e=a.resolve(b);if(!e)throw new Error('Failed to resolve module '+b);var c={id:b,require:a,filename:b,exports:{},loaded:!1,parent:d,children:[]};d&&d.children.push(c);var f=b.slice(0,b.lastIndexOf('/')+1);return a.cache[b]=c.exports,e.call(c.exports,c,c.exports,f,b),c.loaded=!0,a.cache[b]=c.exports}a.modules={},a.cache={},a.resolve=function(b){return{}.hasOwnProperty.call(a.modules,b)?a.modules[b]:void 0},a.define=function(b,c){a.modules[b]=c},a.define('/gif.worker.coffee',function(d,e,f,g){var b,c;b=a('/GIFEncoder.js',d),c=function(a){var c,e,d,f;return c=new b(a.width,a.height),a.index===0?c.writeHeader():c.firstFrame=!1,c.setTransparent(a.transparent),c.setRepeat(a.repeat),c.setDelay(a.delay),c.setQuality(a.quality),c.addFrame(a.data),a.last&&c.finish(),d=c.stream(),a.data=d.pages,a.cursor=d.cursor,a.pageSize=d.constructor.pageSize,a.canTransfer?(f=function(c){for(var b=0,d=a.data.length;b<d;++b)e=a.data[b],c.push(e.buffer);return c}.call(this,[]),self.postMessage(a,f)):self.postMessage(a)},self.onmessage=function(a){return c(a.data)}}),a.define('/GIFEncoder.js',function(e,h,i,j){function c(){this.page=-1,this.pages=[],this.newPage()}function b(a,b){this.width=~~a,this.height=~~b,this.transparent=null,this.transIndex=0,this.repeat=-1,this.delay=0,this.image=null,this.pixels=null,this.indexedPixels=null,this.colorDepth=null,this.colorTab=null,this.usedEntry=new Array,this.palSize=7,this.dispose=-1,this.firstFrame=!0,this.sample=10,this.out=new c}var f=a('/TypedNeuQuant.js',e),g=a('/LZWEncoder.js',e);c.pageSize=4096,c.charMap={};for(var d=0;d<256;d++)c.charMap[d]=String.fromCharCode(d);c.prototype.newPage=function(){this.pages[++this.page]=new Uint8Array(c.pageSize),this.cursor=0},c.prototype.getData=function(){var d='';for(var a=0;a<this.pages.length;a++)for(var b=0;b<c.pageSize;b++)d+=c.charMap[this.pages[a][b]];return d},c.prototype.writeByte=function(a){this.cursor>=c.pageSize&&this.newPage(),this.pages[this.page][this.cursor++]=a},c.prototype.writeUTFBytes=function(b){for(var c=b.length,a=0;a<c;a++)this.writeByte(b.charCodeAt(a))},c.prototype.writeBytes=function(b,d,e){for(var c=e||b.length,a=d||0;a<c;a++)this.writeByte(b[a])},b.prototype.setDelay=function(a){this.delay=Math.round(a/10)},b.prototype.setFrameRate=function(a){this.delay=Math.round(100/a)},b.prototype.setDispose=function(a){a>=0&&(this.dispose=a)},b.prototype.setRepeat=function(a){this.repeat=a},b.prototype.setTransparent=function(a){this.transparent=a},b.prototype.addFrame=function(a){this.image=a,this.getImagePixels(),this.analyzePixels(),this.firstFrame&&(this.writeLSD(),this.writePalette(),this.repeat>=0&&this.writeNetscapeExt()),this.writeGraphicCtrlExt(),this.writeImageDesc(),this.firstFrame||this.writePalette(),this.writePixels(),this.firstFrame=!1},b.prototype.finish=function(){this.out.writeByte(59)},b.prototype.setQuality=function(a){a<1&&(a=1),this.sample=a},b.prototype.writeHeader=function(){this.out.writeUTFBytes('GIF89a')},b.prototype.analyzePixels=function(){var g=this.pixels.length,d=g/3;this.indexedPixels=new Uint8Array(d);var a=new f(this.pixels,this.sample);a.buildColormap(),this.colorTab=a.getColormap();var b=0;for(var c=0;c<d;c++){var e=a.lookupRGB(this.pixels[b++]&255,this.pixels[b++]&255,this.pixels[b++]&255);this.usedEntry[e]=!0,this.indexedPixels[c]=e}this.pixels=null,this.colorDepth=8,this.palSize=7,this.transparent!==null&&(this.transIndex=this.findClosest(this.transparent))},b.prototype.findClosest=function(e){if(this.colorTab===null)return-1;var k=(e&16711680)>>16,l=(e&65280)>>8,m=e&255,c=0,d=16777216,j=this.colorTab.length;for(var a=0;a<j;){var f=k-(this.colorTab[a++]&255),g=l-(this.colorTab[a++]&255),h=m-(this.colorTab[a]&255),i=f*f+g*g+h*h,b=parseInt(a/3);this.usedEntry[b]&&i<d&&(d=i,c=b),a++}return c},b.prototype.getImagePixels=function(){var a=this.width,g=this.height;this.pixels=new Uint8Array(a*g*3);var b=this.image,c=0;for(var d=0;d<g;d++)for(var e=0;e<a;e++){var f=d*a*4+e*4;this.pixels[c++]=b[f],this.pixels[c++]=b[f+1],this.pixels[c++]=b[f+2]}},b.prototype.writeGraphicCtrlExt=function(){this.out.writeByte(33),this.out.writeByte(249),this.out.writeByte(4);var b,a;this.transparent===null?(b=0,a=0):(b=1,a=2),this.dispose>=0&&(a=dispose&7),a<<=2,this.out.writeByte(0|a|0|b),this.writeShort(this.delay),this.out.writeByte(this.transIndex),this.out.writeByte(0)},b.prototype.writeImageDesc=function(){this.out.writeByte(44),this.writeShort(0),this.writeShort(0),this.writeShort(this.width),this.writeShort(this.height),this.firstFrame?this.out.writeByte(0):this.out.writeByte(128|this.palSize)},b.prototype.writeLSD=function(){this.writeShort(this.width),this.writeShort(this.height),this.out.writeByte(240|this.palSize),this.out.writeByte(0),this.out.writeByte(0)},b.prototype.writeNetscapeExt=function(){this.out.writeByte(33),this.out.writeByte(255),this.out.writeByte(11),this.out.writeUTFBytes('NETSCAPE2.0'),this.out.writeByte(3),this.out.writeByte(1),this.writeShort(this.repeat),this.out.writeByte(0)},b.prototype.writePalette=function(){this.out.writeBytes(this.colorTab);var b=768-this.colorTab.length;for(var a=0;a<b;a++)this.out.writeByte(0)},b.prototype.writeShort=function(a){this.out.writeByte(a&255),this.out.writeByte(a>>8&255)},b.prototype.writePixels=function(){var a=new g(this.width,this.height,this.indexedPixels,this.colorDepth);a.encode(this.out)},b.prototype.stream=function(){return this.out},e.exports=b}),a.define('/LZWEncoder.js',function(e,g,h,i){function f(y,D,C,B){function w(a,b){r[f++]=a,f>=254&&t(b)}function x(b){u(a),k=i+2,j=!0,l(i,b)}function u(b){for(var a=0;a<b;++a)h[a]=-1}function A(z,r){var g,t,d,e,y,w,s;for(q=z,j=!1,n_bits=q,m=p(n_bits),i=1<<z-1,o=i+1,k=i+2,f=0,e=v(),s=0,g=a;g<65536;g*=2)++s;s=8-s,w=a,u(w),l(i,r);a:while((t=v())!=c){if(g=(t<<b)+e,d=t<<s^e,h[d]===g){e=n[d];continue}if(h[d]>=0){y=w-d,d===0&&(y=1);do if((d-=y)<0&&(d+=w),h[d]===g){e=n[d];continue a}while(h[d]>=0)}l(e,r),e=t,k<1<<b?(n[d]=k++,h[d]=g):x(r)}l(e,r),l(o,r)}function z(a){a.writeByte(s),remaining=y*D,curPixel=0,A(s+1,a),a.writeByte(0)}function t(a){f>0&&(a.writeByte(f),a.writeBytes(r,0,f),f=0)}function p(a){return(1<<a)-1}function v(){if(remaining===0)return c;--remaining;var a=C[curPixel++];return a&255}function l(a,c){g&=d[e],e>0?g|=a<<e:g=a,e+=n_bits;while(e>=8)w(g&255,c),g>>=8,e-=8;if((k>m||j)&&(j?(m=p(n_bits=q),j=!1):(++n_bits,n_bits==b?m=1<<b:m=p(n_bits))),a==o){while(e>0)w(g&255,c),g>>=8,e-=8;t(c)}}var s=Math.max(2,B),r=new Uint8Array(256),h=new Int32Array(a),n=new Int32Array(a),g,e=0,f,k=0,m,j=!1,q,i,o;this.encode=z}var c=-1,b=12,a=5003,d=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];e.exports=f}),a.define('/TypedNeuQuant.js',function(A,F,E,D){function C(A,B){function I(){o=[],q=new Int32Array(256),t=new Int32Array(a),y=new Int32Array(a),z=new Int32Array(a>>3);var c,d;for(c=0;c<a;c++)d=(c<<b+8)/a,o[c]=new Float64Array([d,d,d,0]),y[c]=e/a,t[c]=0}function J(){for(var c=0;c<a;c++)o[c][0]>>=b,o[c][1]>>=b,o[c][2]>>=b,o[c][3]=c}function K(b,a,c,e,f){o[a][0]-=b*(o[a][0]-c)/d,o[a][1]-=b*(o[a][1]-e)/d,o[a][2]-=b*(o[a][2]-f)/d}function L(j,e,n,l,k){var h=Math.abs(e-j),i=Math.min(e+j,a),g=e+1,f=e-1,m=1,b,d;while(g<i||f>h)d=z[m++],g<i&&(b=o[g++],b[0]-=d*(b[0]-n)/c,b[1]-=d*(b[1]-l)/c,b[2]-=d*(b[2]-k)/c),f>h&&(b=o[f--],b[0]-=d*(b[0]-n)/c,b[1]-=d*(b[1]-l)/c,b[2]-=d*(b[2]-k)/c)}function C(p,s,q){var h=2147483647,k=h,d=-1,m=d,c,j,e,n,l;for(c=0;c<a;c++)j=o[c],e=Math.abs(j[0]-p)+Math.abs(j[1]-s)+Math.abs(j[2]-q),e<h&&(h=e,d=c),n=e-(t[c]>>i-b),n<k&&(k=n,m=c),l=y[c]>>g,y[c]-=l,t[c]+=l<<f;return y[d]+=x,t[d]-=r,m}function D(){var d,b,e,c,h,g,f=0,i=0;for(d=0;d<a;d++){for(e=o[d],h=d,g=e[1],b=d+1;b<a;b++)c=o[b],c[1]<g&&(h=b,g=c[1]);if(c=o[h],d!=h&&(b=c[0],c[0]=e[0],e[0]=b,b=c[1],c[1]=e[1],e[1]=b,b=c[2],c[2]=e[2],e[2]=b,b=c[3],c[3]=e[3],e[3]=b),g!=f){for(q[f]=i+d>>1,b=f+1;b<g;b++)q[b]=d;f=g,i=d}}for(q[f]=i+n>>1,b=f+1;b<256;b++)q[b]=n}function E(j,i,k){var b,d,c,e=1e3,h=-1,f=q[i],g=f-1;while(f<a||g>=0)f<a&&(d=o[f],c=d[1]-i,c>=e?f=a:(f++,c<0&&(c=-c),b=d[0]-j,b<0&&(b=-b),c+=b,c<e&&(b=d[2]-k,b<0&&(b=-b),c+=b,c<e&&(e=c,h=d[3])))),g>=0&&(d=o[g],c=i-d[1],c>=e?g=-1:(g--,c<0&&(c=-c),b=d[0]-j,b<0&&(b=-b),c+=b,c<e&&(b=d[2]-k,b<0&&(b=-b),c+=b,c<e&&(e=c,h=d[3]))));return h}function F(){var c,f=A.length,D=30+(B-1)/3,y=f/(3*B),q=~~(y/w),n=d,o=u,a=o>>h;for(a<=1&&(a=0),c=0;c<a;c++)z[c]=n*((a*a-c*c)*m/(a*a));var i;f<s?(B=1,i=3):f%l!==0?i=3*l:f%k!==0?i=3*k:f%p!==0?i=3*p:i=3*j;var r,t,x,e,g=0;c=0;while(c<y)if(r=(A[g]&255)<<b,t=(A[g+1]&255)<<b,x=(A[g+2]&255)<<b,e=C(r,t,x),K(n,e,r,t,x),a!==0&&L(a,e,r,t,x),g+=i,g>=f&&(g-=f),c++,q===0&&(q=1),c%q===0)for(n-=n/D,o-=o/v,a=o>>h,a<=1&&(a=0),e=0;e<a;e++)z[e]=n*((a*a-e*e)*m/(a*a))}function G(){I(),F(),J(),D()}function H(){var b=[],g=[];for(var c=0;c<a;c++)g[o[c][3]]=c;var d=0;for(var e=0;e<a;e++){var f=g[e];b[d++]=o[f][0],b[d++]=o[f][1],b[d++]=o[f][2]}return b}var o,q,t,y,z;this.buildColormap=G,this.getColormap=H,this.lookupRGB=E}var w=100,a=256,n=a-1,b=4,i=16,e=1<<i,f=10,B=1<<f,g=10,x=e>>g,r=e<<f-g,z=a>>3,h=6,t=1<<h,u=z*t,v=30,o=10,d=1<<o,q=8,m=1<<q,y=o+q,c=1<<y,l=499,k=491,p=487,j=503,s=3*j;A.exports=C}),a('/gif.worker.coffee')}.call(this,this))//# sourceMappingURL=gif.worker.js.map";
// gif.worker.js 0.1.6 - https://github.com/jnordberg/gif.js


/***/ }),

/***/ 713:
/***/ ((__unused_webpack_module, exports) => {

"use strict";

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.css = void 0;
exports.css = "\n/**************************  Basic Modal Styles\n**************************/\n\n.modal {\n  font-family: -apple-system,BlinkMacSystemFont,avenir next,avenir,helvetica neue,helvetica,ubuntu,roboto,noto,segoe ui,arial,sans-serif;\n}\n\n.modal__overlay {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;\n  bottom: 0;\n  background: rgba(0,0,0,0.6);\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}\n\n.modal__container {\n  background-color: #fff;\n  padding: 30px;\n  max-width: 500px;\n  max-height: 100vh;\n  overflow-y: auto;\n  box-sizing: border-box;\n}\n\n.modal__header {\n  display: flex;\n  justify-content: space-between;\n  align-items: center;\n}\n\n.modal__title {\n  margin-top: 0;\n  margin-bottom: 0;\n  font-weight: 600;\n  font-size: 1.25rem;\n  line-height: 1.25;\n  color: #222;\n  box-sizing: border-box;\n}\n\n.modal__footer {\n  text-align: right;\n}\n\n.modal__footer>.modal__btn {\n  margin-right: 8px;\n}\n\n.modal__close {\n  background: transparent;\n  border: 0;\n}\n\n.modal__header .modal__close:before { content: \"\u2715\"; }\n\n.modal__content {\n  margin-top: 2rem;\n  margin-bottom: 2rem;\n  line-height: 1.5;\n  color: rgba(0,0,0,.8);\n}\n\n.modal__btn {\n  font-size: .875rem;\n  padding-left: 1rem;\n  padding-right: 1rem;\n  padding-top: .5rem;\n  padding-bottom: .5rem;\n  background-color: #e6e6e6;\n  color: rgba(0,0,0,.8);\n  border-radius: .25rem;\n  border-style: none;\n  border-width: 0;\n  cursor: pointer;\n  -webkit-appearance: button;\n  text-transform: none;\n  overflow: visible;\n  line-height: 1.15;\n  margin: 0;\n  will-change: transform;\n  -moz-osx-font-smoothing: grayscale;\n  -webkit-backface-visibility: hidden;\n  backface-visibility: hidden;\n  -webkit-transform: translateZ(0);\n  transform: translateZ(0);\n  transition: -webkit-transform .25s ease-out;\n  transition: transform .25s ease-out;\n  transition: transform .25s ease-out,-webkit-transform .25s ease-out;\n}\n\n.modal__btn:focus, .modal__btn:hover {\n  -webkit-transform: scale(1.05);\n  transform: scale(1.05);\n}\n\n.modal__btn-primary {\n  background-color: #333;\n  color: #fff;\n}\n\n\n\n/**************************  Demo Animation Style\n**************************/\n@keyframes mmfadeIn {\n    from { opacity: 0; }\n      to { opacity: 1; }\n}\n\n@keyframes mmfadeOut {\n    from { opacity: 1; }\n      to { opacity: 0; }\n}\n\n@keyframes mmslideIn {\n  from { transform: translateY(15%); }\n    to { transform: translateY(0); }\n}\n\n@keyframes mmslideOut {\n    from { transform: translateY(0); }\n    to { transform: translateY(-10%); }\n}\n\n.micromodal-slide {\n  display: none;\n}\n\n.micromodal-slide.is-open {\n  display: block;\n}\n\n.micromodal-slide[aria-hidden=\"false\"] .modal__overlay {\n  animation: mmfadeIn .3s cubic-bezier(0.0, 0.0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden=\"false\"] .modal__container {\n  animation: mmslideIn .3s cubic-bezier(0, 0, .2, 1);\n}\n\n.micromodal-slide[aria-hidden=\"true\"] .modal__overlay {\n  animation: mmfadeOut .3s cubic-bezier(0.0, 0.0, 0.2, 1);\n}\n\n.micromodal-slide[aria-hidden=\"true\"] .modal__container {\n  animation: mmslideOut .3s cubic-bezier(0, 0, .2, 1);\n}\n\n.micromodal-slide .modal__container,\n.micromodal-slide .modal__overlay {\n  will-change: transform;\n}\n";


/***/ }),

/***/ 330:
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";

var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.showDot = exports.initDotWithCSS = exports.showDialog = exports.showAlert = exports.PARAMS = void 0;
var micromodal_1 = __webpack_require__(650);
var micromodal_css_1 = __webpack_require__(713);
// Params.
exports.PARAMS = {
    SHOW_ALERTS: true,
    SHOW_DIALOGS: true,
    SHOW_REC_DOT: true,
};
// Add modal styling.
var style = document.createElement('style');
style.textContent = micromodal_css_1.css;
document.head.append(style);
function initModalHTML(modalID, title, content) {
    if (content === void 0) { content = ''; }
    var modalString = "<div class=\"modal micromodal-slide\" id=\"modal-" + modalID + "\" aria-hidden=\"true\">\n\t\t<div class=\"modal__overlay\" tabindex=\"-1\" data-micromodal-close>\n\t\t<div class=\"modal__container\" role=\"dialog\" aria-modal=\"true\" aria-labelledby=\"modal-" + modalID + "-title\">\n\t\t\t<header class=\"modal__header\">\n\t\t\t\t<h2 class=\"modal__title\" id=\"modal-" + modalID + "-title\">\n\t\t\t\t\t" + title + "\n\t\t\t\t</h2>\n\t\t\t\t<button class=\"modal__close\" aria-label=\"Close modal\" data-micromodal-close></button>\n\t\t\t</header>\n\t\t\t<main class=\"modal__content\">\n\t\t\t\t<p id=\"modal-" + modalID + "-content\">\n\t\t\t\t\t" + content + "\n\t\t\t\t</p>\n\t\t\t</main>\n\t\t</div>\n\t\t</div>\n\t</div>";
    // This is a trick to create an element from string.
    var temp = document.createElement('div');
    temp.innerHTML = modalString;
    return temp.firstChild;
}
;
var alertModalInited = false;
var dialogModalInited = false;
var ALERT_MODAL_ID = 'alert';
var alertModal = initModalHTML(ALERT_MODAL_ID, 'Warning');
var DIALOG_MODAL_ID = 'dialog';
var dialogModal = initModalHTML(DIALOG_MODAL_ID, 'Saving...');
function showAlert(message) {
    if (!exports.PARAMS.SHOW_ALERTS) {
        console.warn(message);
        return;
    }
    if (!alertModalInited) {
        alertModalInited = true;
        document.getElementsByTagName('body')[0].appendChild(alertModal);
    }
    document.getElementById("modal-" + ALERT_MODAL_ID + "-content").innerHTML = message;
    micromodal_1.default.show("modal-" + ALERT_MODAL_ID);
}
exports.showAlert = showAlert;
function showDialog(title, message, options) {
    if (!dialogModalInited) {
        dialogModalInited = true;
        document.getElementsByTagName('body')[0].appendChild(dialogModal);
    }
    document.getElementById("modal-" + DIALOG_MODAL_ID + "-title").innerHTML = title;
    document.getElementById("modal-" + DIALOG_MODAL_ID + "-content").innerHTML = message;
    micromodal_1.default.show("modal-" + DIALOG_MODAL_ID);
    var autoCloseDelay = (options === null || options === void 0 ? void 0 : options.autoCloseDelay) !== undefined ? options.autoCloseDelay : -1;
    if (autoCloseDelay > 0) {
        setTimeout(function () {
            micromodal_1.default.close("modal-" + DIALOG_MODAL_ID);
        }, autoCloseDelay);
    }
}
exports.showDialog = showDialog;
// Create record red dot vis to overlay when recording is happening.
var dot = document.createElement('div');
function initDotWithCSS(css) {
    dot.id = 'recordingDot';
    var dotCSS = __assign({ background: "red", width: "20px", height: "20px", "border-radius": "50%", display: "none", position: "absolute", top: "0", right: "0", "z-index": "10", margin: "20px" }, css);
    Object.assign(dot.style, dotCSS);
    document.getElementsByTagName('body')[0].appendChild(dot);
}
exports.initDotWithCSS = initDotWithCSS;
function showDot(visible) {
    if (!exports.PARAMS.SHOW_REC_DOT)
        return;
    if (visible) {
        dot.style.display = "inline-block";
    }
    else {
        dot.style.display = "none";
    }
}
exports.showDot = showDot;


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			id: moduleId,
/******/ 			loaded: false,
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	(() => {
/******/ 		// define getter functions for harmony exports
/******/ 		__webpack_require__.d = (exports, definition) => {
/******/ 			for(var key in definition) {
/******/ 				if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 					Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/global */
/******/ 	(() => {
/******/ 		__webpack_require__.g = (function() {
/******/ 			if (typeof globalThis === 'object') return globalThis;
/******/ 			try {
/******/ 				return this || new Function('return this')();
/******/ 			} catch (e) {
/******/ 				if (typeof window === 'object') return window;
/******/ 			}
/******/ 		})();
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	(() => {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = (exports) => {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	})();
/******/ 	
/******/ 	/* webpack/runtime/node module decorator */
/******/ 	(() => {
/******/ 		__webpack_require__.nmd = (module) => {
/******/ 			module.paths = [];
/******/ 			if (!module.children) module.children = [];
/******/ 			return module;
/******/ 		};
/******/ 	})();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be in strict mode.
(() => {
"use strict";
var exports = __webpack_exports__;

Object.defineProperty(exports, "__esModule", ({ value: true }));
exports.isRecording = exports.stopRecord = exports.recordFrame = exports.takeJPEGSnapshot = exports.takePNGSnapshot = exports.beginGIFRecord = exports.beginVideoRecord = exports.bindKeyToJPEGSnapshot = exports.bindKeyToPNGSnapshot = exports.bindKeyToGIFRecord = exports.bindKeyToVideoRecord = exports.setVerbose = exports.init = exports.showDialog = void 0;
// @ts-ignore
var ccapture_js_1 = __webpack_require__(583);
var file_saver_1 = __webpack_require__(162);
// @ts-ignore
var changedpi_1 = __webpack_require__(809);
var modals_1 = __webpack_require__(330);
var gif_worker_1 = __webpack_require__(10);
// Export showDialog method in case it is useful.
var modals_2 = __webpack_require__(330);
Object.defineProperty(exports, "showDialog", ({ enumerable: true, get: function () { return modals_2.showDialog; } }));
// Make is so we don't have to specify workersPath for CCapture.
var workersBlob = new Blob([gif_worker_1.workerString]);
var workersPath = URL.createObjectURL(workersBlob);
var VERBOSE = true;
var capturer = null;
// This is an unused variable,
// but needed for proper import of CCapture at the moment.
// See https://github.com/spite/ccapture.js/issues/78
var temp = ccapture_js_1.default;
var hotkeys = {
    webm: null,
    gif: null,
    png: null,
    jpeg: null,
};
var isRecordingVideo = false;
var isRecordingGIF = false;
var canvas = null;
var numFrames = 0;
function init(_canvas, options) {
    canvas = _canvas;
    if (options && options.verbose !== undefined)
        setVerbose(options.verbose);
    if (options && options.showAlerts !== undefined)
        modals_1.PARAMS.SHOW_ALERTS = options.showAlerts;
    if (options && options.showDialogs !== undefined)
        modals_1.PARAMS.SHOW_DIALOGS = options.showDialogs;
    if (options && options.showRecDot !== undefined)
        modals_1.PARAMS.SHOW_REC_DOT = options.showRecDot;
    if (modals_1.PARAMS.SHOW_REC_DOT) {
        modals_1.initDotWithCSS(options === null || options === void 0 ? void 0 : options.recDotCSS);
    }
    canvas.addEventListener('resize', function () {
        if (capturer) {
            modals_1.showAlert("Don't resize while recording canvas!");
        }
    });
}
exports.init = init;
function setVerbose(state) {
    VERBOSE = !!state;
}
exports.setVerbose = setVerbose;
function checkCanvas() {
    if (canvas === null) {
        console.warn('No canvas supplied, please call CanvasCapture.init() and pass in canvas element.');
        return false;
    }
    return true;
}
var recOptions = {
    webm: undefined,
    gif: undefined,
    png: undefined,
    jpeg: undefined,
};
// Pressing key once will start record, press again to stop.
function bindKeyToVideoRecord(key, options) {
    recOptions.webm = options;
    Object.keys(hotkeys).forEach(function (keyName) {
        if (hotkeys[keyName] === key) {
            hotkeys[keyName] = null;
        }
    });
    hotkeys.webm = key;
}
exports.bindKeyToVideoRecord = bindKeyToVideoRecord;
function bindKeyToGIFRecord(key, options) {
    recOptions.gif = options;
    Object.keys(hotkeys).forEach(function (keyName) {
        if (hotkeys[keyName] === key) {
            hotkeys[keyName] = null;
        }
    });
    hotkeys.gif = key;
}
exports.bindKeyToGIFRecord = bindKeyToGIFRecord;
// Snapshots just take a single shot.
function bindKeyToPNGSnapshot(key, options) {
    recOptions.png = options;
    Object.keys(hotkeys).forEach(function (keyName) {
        if (hotkeys[keyName] === key) {
            hotkeys[keyName] = null;
        }
    });
    hotkeys.png = key;
}
exports.bindKeyToPNGSnapshot = bindKeyToPNGSnapshot;
function bindKeyToJPEGSnapshot(key, options) {
    recOptions.jpeg = options;
    Object.keys(hotkeys).forEach(function (keyName) {
        if (hotkeys[keyName] === key) {
            hotkeys[keyName] = null;
        }
    });
    hotkeys.jpeg = key;
}
exports.bindKeyToJPEGSnapshot = bindKeyToJPEGSnapshot;
window.addEventListener('keydown', function (e) {
    if (hotkeys.webm && e.key === hotkeys.webm) {
        if (isRecordingVideo)
            stopRecord();
        else
            beginVideoRecord(recOptions.webm);
    }
    if (hotkeys.gif && e.key === hotkeys.gif) {
        if (isRecordingGIF)
            stopRecord();
        else
            beginGIFRecord(recOptions.gif);
    }
    if (hotkeys.png && e.key === hotkeys.png) {
        takePNGSnapshot(recOptions.png);
    }
    if (hotkeys.jpeg && e.key === hotkeys.jpeg) {
        takeJPEGSnapshot(recOptions.jpeg);
    }
});
function beginVideoRecord(options) {
    if (isRecordingGIF) {
        console.warn('You are currently recording a gif, stop recording gif before starting new video record.');
        return;
    }
    if (isRecordingVideo) {
        console.warn('You are currently recording a video, stop recording current video before starting new video record.');
        return;
    }
    // CCapture seems to expect a quality between 0 and 100.
    var quality = 100;
    if (options && options.quality) {
        quality = options.quality * 100;
    }
    // Create a capturer that exports a WebM video.
    // @ts-ignore
    capturer = new window.CCapture({
        format: 'webm',
        name: (options === null || options === void 0 ? void 0 : options.name) || 'WEBM_Capture',
        framerate: (options === null || options === void 0 ? void 0 : options.fps) || 60,
        quality: quality,
        verbose: VERBOSE,
    });
    isRecordingVideo = true;
    startRecord();
}
exports.beginVideoRecord = beginVideoRecord;
function beginGIFRecord(options) {
    if (isRecordingVideo) {
        console.warn('You are currently recording a video, stop recording video before starting new gif record.');
        return;
    }
    if (isRecordingGIF) {
        console.warn('You are currently recording a gif, stop recording current gif before starting new gif record.');
        return;
    }
    // CCapture seems to expect a quality between 0 and 100.
    var quality = 100;
    if (options && options.quality) {
        quality = options.quality * 100;
    }
    // Create a capturer that exports a GIF.
    // @ts-ignore
    capturer = new window.CCapture({
        format: 'gif',
        name: (options === null || options === void 0 ? void 0 : options.name) || 'GIF_Capture',
        framerate: (options === null || options === void 0 ? void 0 : options.fps) || 60,
        workersPath: workersPath,
        quality: quality,
        verbose: VERBOSE,
    });
    isRecordingGIF = true;
    startRecord();
}
exports.beginGIFRecord = beginGIFRecord;
function takePNGSnapshot(options) {
    if (!checkCanvas()) {
        return;
    }
    var name = (options === null || options === void 0 ? void 0 : options.name) || 'PNG_Capture';
    canvas.toBlob(function (blob) {
        if (!blob) {
            modals_1.showAlert('Problem saving PNG, please try again!');
            return;
        }
        if (options === null || options === void 0 ? void 0 : options.dpi) {
            changedpi_1.changeDpiBlob(blob, options === null || options === void 0 ? void 0 : options.dpi).then(function (blob) {
                file_saver_1.saveAs(blob, name + ".png");
            });
        }
        else {
            file_saver_1.saveAs(blob, name + ".png");
        }
    }, 'image/png');
}
exports.takePNGSnapshot = takePNGSnapshot;
function takeJPEGSnapshot(options) {
    var name = (options === null || options === void 0 ? void 0 : options.name) || 'JPEG_Capture';
    if (!checkCanvas()) {
        return;
    }
    // Quality is a number between 0 and 1 https://developer.mozilla.org/en-US/docs/Web/API/HTMLCanvasElement/toBlob
    canvas.toBlob(function (blob) {
        if (!blob) {
            modals_1.showAlert('Problem saving JPEG, please try again!');
            return;
        }
        if (options === null || options === void 0 ? void 0 : options.dpi) {
            changedpi_1.changeDpiBlob(blob, options === null || options === void 0 ? void 0 : options.dpi).then(function (blob) {
                file_saver_1.saveAs(blob, name + ".jpg");
            });
        }
        else {
            file_saver_1.saveAs(blob, name + ".jpg");
        }
    }, 'image/jpeg', (options === null || options === void 0 ? void 0 : options.quality) || 1);
}
exports.takeJPEGSnapshot = takeJPEGSnapshot;
function recordFrame() {
    if (!checkCanvas()) {
        return;
    }
    if (!capturer) {
        console.warn('No valid capturer inited, please call CanvasCapture.beginVideoRecord() or CanvasCapture.beginGIFRecord() first.');
        return;
    }
    capturer.capture(canvas);
    numFrames++;
}
exports.recordFrame = recordFrame;
function startRecord() {
    capturer.start();
    // For video and gif records, we should also throw up an indicator to show that we're in record mode.
    modals_1.showDot(true);
    numFrames = 0;
}
function stopRecord() {
    if (!capturer) {
        console.warn('No valid capturer inited, please call CanvasCapture.beginVideoRecord() or CanvasCapture.beginGIFRecord() first.');
        return;
    }
    if (numFrames === 0) {
        console.warn('No frames recorded, call CanvasCapture.recordFrame()');
        return;
    }
    capturer.stop();
    capturer.save();
    capturer = null;
    if (isRecordingGIF) {
        // Tell the user that gifs take a sec to process.
        if (modals_1.PARAMS.SHOW_DIALOGS)
            modals_1.showDialog('Processing...', 'GIF is processing and may take a minute to save.  You can close this window in the meantime.', { autoCloseDelay: 7000 });
    }
    isRecordingGIF = false;
    isRecordingVideo = false;
    modals_1.showDot(false);
}
exports.stopRecord = stopRecord;
function isRecording() {
    return isRecordingVideo || isRecordingGIF;
}
exports.isRecording = isRecording;

})();

/******/ 	return __webpack_exports__;
/******/ })()
;
});
//# sourceMappingURL=canvas-capture.js.map
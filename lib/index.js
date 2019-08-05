// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"index.ts":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var __assign = void 0 && (void 0).__assign || function () {
  __assign = Object.assign || function (t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];

      for (var p in s) {
        if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
      }
    }

    return t;
  };

  return __assign.apply(this, arguments);
};

var MusicVisualization =
/** @class */
function () {
  function MusicVisualization(options) {
    this.options = __assign({
      src: '',
      gap: 0,
      minHeight: 10
    }, options);
    this.drawRafId = 0;
    this.objectUrl = '';
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas = this.createCanvas(this.width, this.height);
    this.canvasCtx = this.canvas.getContext('2d');
    this.container = this.createDomContainer(this.canvas);
    document.body.appendChild(this.container);
    this.analyser = null;
    this.audio = this.createAudio();
    this.hanldeCanPlay = this.hanldeCanPlay.bind(this);
    this.handleError = this.handleError.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.audio.addEventListener('canplay', this.hanldeCanPlay);
    this.audio.addEventListener('error', this.handleError);
    window.addEventListener('resize', this.handleResize);
  }

  MusicVisualization.prototype.start = function () {
    var _this = this;

    if (!this.audio.src) {
      return;
    } // playing


    if (!this.audio.paused && this.audio.duration > 0) {
      return;
    }

    if (!this.analyser) {
      this.analyser = this.createAnalyser(this.audio);
    }

    this.audio.play().then(function () {
      _this.draw();
    });
  };

  MusicVisualization.prototype.stop = function () {
    if (this.drawRafId) {
      window.cancelAnimationFrame(this.drawRafId);
      this.drawRafId = null;
    }

    this.audio.pause();
  };

  MusicVisualization.prototype.destroy = function () {
    this.stop();

    if (this.objectUrl) {
      window.URL.revokeObjectURL(this.objectUrl);
      this.objectUrl = null;
    }

    window.removeEventListener('resize', this.handleResize);
    this.audio.removeEventListener('canplay', this.hanldeCanPlay);
    this.audio.removeEventListener('error', this.handleError);
    document.body.removeChild(this.container);
    this.container = null;
    this.audio = null;
    this.analyser = null;
  };

  MusicVisualization.prototype.changeMusic = function (file) {
    if (this.objectUrl) {
      window.URL.revokeObjectURL(this.objectUrl);
    }

    this.objectUrl = window.URL.createObjectURL(file);
    this.stop();
    this.audio.src = this.objectUrl;
    this.start();
  };

  MusicVisualization.prototype.hanldeCanPlay = function () {
    if (this.options.onCanplay) {
      this.options.onCanplay(this);
    }
  };

  MusicVisualization.prototype.handleError = function () {
    if (this.options.onError) {
      this.options.onError();
    }
  };

  MusicVisualization.prototype.handleResize = function () {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  };
  /**
   * 创建DOM
   * @param canvas
   */


  MusicVisualization.prototype.createDomContainer = function (canvas) {
    var container = document.createElement('div');
    container.className = 'music-container';
    container.style.cssText = 'position: fixed; left: 0; bottom: 0; width: 100%; height: 100%; pointer-events: none;';
    container.appendChild(canvas);
    return container;
  };
  /**
   *  创建canvas
   */


  MusicVisualization.prototype.createCanvas = function (width, height) {
    var canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  };
  /**
   * 创建audio
   */


  MusicVisualization.prototype.createAudio = function () {
    var audio = new Audio();
    audio.src = this.options.src;
    audio.preload = 'auto';
    audio.volume = 0.8;
    audio.loop = true;
    audio.crossOrigin = 'anonymous';
    return audio;
  };
  /**
   * 创建auido 分析器
   * @param audio
   */


  MusicVisualization.prototype.createAnalyser = function (audio) {
    var audioCtx = new (AudioContext || webkitAudioContext)();
    var source = audioCtx.createMediaElementSource(audio);
    var analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    return analyser;
  };
  /**
   * 画曲线
   * @param param0
   */


  MusicVisualization.prototype.drawCurveLine = function (_a) {
    var startX = _a.startX,
        startY = _a.startY,
        stopX = _a.stopX,
        stopY = _a.stopY,
        scaleY = _a.scaleY,
        arr = _a.arr;

    var _b = this,
        height = _b.height,
        canvasCtx = _b.canvasCtx;

    var minHeight = this.options.minHeight;
    var len = arr.length;
    var sliceWidth = stopX / (len - 1);
    var lastX = startX;
    var lastY = startY;

    for (var index = 0; index < len - 1; index++) {
      var x = lastX + sliceWidth;
      var y = (height / 3 * (arr[index] / 256) + minHeight) * scaleY; // 取当前点 和 上一个点的中点, 模拟曲线

      var middleX = (lastX + x) / 2;
      var middleY = (lastY + y) / 2;
      canvasCtx.quadraticCurveTo(lastX, lastY, middleX, middleY);
      lastX = x;
      lastY = y;
    }

    canvasCtx.quadraticCurveTo(lastX, lastY, stopX, stopY * scaleY);
  };

  MusicVisualization.prototype.drawGraph = function (arr) {
    var canvasCtx = this.canvasCtx;
    var _a = this.options,
        minHeight = _a.minHeight,
        gap = _a.gap;
    var singleWidth = this.width / 2 - gap;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    canvasCtx.lineTo(0, minHeight);
    this.drawCurveLine({
      startX: 0,
      startY: minHeight,
      stopX: singleWidth,
      stopY: minHeight,
      scaleY: 1,
      arr: arr
    });
    canvasCtx.lineTo(singleWidth, 0);
    canvasCtx.fill();
  };

  MusicVisualization.prototype.drawLine = function (arr) {
    var canvasCtx = this.canvasCtx;
    var _a = this.options,
        gap = _a.gap,
        minHeight = _a.minHeight;
    var singleWidth = this.width / 2 - gap;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    this.drawCurveLine({
      startX: 0,
      startY: minHeight,
      stopX: singleWidth,
      stopY: minHeight,
      scaleY: 1.1,
      arr: arr
    });
    canvasCtx.stroke();
  };

  MusicVisualization.prototype.draw = function () {
    var _a = this,
        analyser = _a.analyser,
        canvasCtx = _a.canvasCtx,
        width = _a.width,
        height = _a.height;

    var gap = this.options.gap;
    var singleWidth = this.width / 2 - gap;
    var bufferLength = analyser.frequencyBinCount - 5;
    var dataArray = new Uint8Array(bufferLength).slice(0, -20);
    analyser.getByteFrequencyData(dataArray);
    canvasCtx.clearRect(0, 0, width, height);
    var gradientLeft = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
    gradientLeft.addColorStop(0, '#ff30a2');
    gradientLeft.addColorStop(1, '#d8db31');
    var gradientRight = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
    gradientRight.addColorStop(0, '#00cf2e');
    gradientRight.addColorStop(1, '#3bddd2'); // 镜像 翻转 左边

    canvasCtx.save();
    canvasCtx.transform(1, 0, 0, -1, 0, height);
    canvasCtx.fillStyle = gradientLeft;
    canvasCtx.strokeStyle = gradientLeft;
    this.drawGraph(dataArray);
    this.drawLine(dataArray);
    canvasCtx.restore(); // 镜像再 翻转 右边

    canvasCtx.save();
    canvasCtx.transform(-1, 0, 0, -1, width, height);
    canvasCtx.fillStyle = gradientRight;
    canvasCtx.strokeStyle = gradientRight;
    this.drawGraph(dataArray);
    this.drawLine(dataArray);
    canvasCtx.restore();
    this.drawRafId = requestAnimationFrame(this.draw.bind(this));
  };

  return MusicVisualization;
}();

var _default = MusicVisualization;
exports.default = _default;
},{}]},{},["index.ts"], "MusicVisualization")
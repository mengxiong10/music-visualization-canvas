parcelRequire=function(e,r,t,n){var i,o="function"==typeof parcelRequire&&parcelRequire,u="function"==typeof require&&require;function f(t,n){if(!r[t]){if(!e[t]){var i="function"==typeof parcelRequire&&parcelRequire;if(!n&&i)return i(t,!0);if(o)return o(t,!0);if(u&&"string"==typeof t)return u(t);var c=new Error("Cannot find module '"+t+"'");throw c.code="MODULE_NOT_FOUND",c}p.resolve=function(r){return e[t][1][r]||r},p.cache={};var l=r[t]=new f.Module(t);e[t][0].call(l.exports,p,l,l.exports,this)}return r[t].exports;function p(e){return f(p.resolve(e))}}f.isParcelRequire=!0,f.Module=function(e){this.id=e,this.bundle=f,this.exports={}},f.modules=e,f.cache=r,f.parent=o,f.register=function(r,t){e[r]=[function(e,r){r.exports=t},{}]};for(var c=0;c<t.length;c++)try{f(t[c])}catch(e){i||(i=e)}if(t.length){var l=f(t[t.length-1]);"object"==typeof exports&&"undefined"!=typeof module?module.exports=l:"function"==typeof define&&define.amd?define(function(){return l}):n&&(this[n]=l)}if(parcelRequire=f,i)throw i;return f}({"+fUd":[function(require,module,exports) {
"use strict";Object.defineProperty(exports,"__esModule",{value:!0}),exports.default=void 0;var t=function(){return(t=Object.assign||function(t){for(var e,i=1,a=arguments.length;i<a;i++)for(var s in e=arguments[i])Object.prototype.hasOwnProperty.call(e,s)&&(t[s]=e[s]);return t}).apply(this,arguments)},e=function(){function e(e){var i=this;this.options=t({gap:0,minHeight:10,el:document.body,audioEvents:{}},e);var a=this.options.el;this.drawRafId=null,this.objectUrl="",this.canvas=this.createCanvas(),this.canvasCtx=this.canvas.getContext("2d"),this.options.el.appendChild(this.canvas),this.canvas.width=a.clientWidth,this.canvas.height=a.clientHeight,this.analyser=null,this.audio=this.createAudio(),Object.keys(this.options.audioEvents).forEach(function(t){i.audio.addEventListener(t,i.options.audioEvents[t])}),this.resizeObserver=new ResizeObserver(function(t){for(var e=0,a=t;e<a.length;e++){var s=a[e];i.canvas.width=s.target.clientWidth,i.canvas.height=s.target.clientHeight}}),this.resizeObserver.observe(a)}return e.prototype.start=function(){var t=this;if(this.audio.src&&(this.audio.paused||!(this.audio.duration>0)))return this.createAnalyser(),this.audio.play().then(function(){t.draw()})},e.prototype.stop=function(){return this.drawRafId&&(window.cancelAnimationFrame(this.drawRafId),this.drawRafId=null),this.audio.pause()},e.prototype.destroy=function(){var t=this;this.stop(),this.objectUrl&&window.URL.revokeObjectURL(this.objectUrl),Object.keys(this.options.audioEvents).forEach(function(e){t.audio.removeEventListener(e,t.options.audioEvents[e])}),this.resizeObserver.unobserve(this.options.el),this.analyser=null},e.prototype.changeMusic=function(t){this.objectUrl&&window.URL.revokeObjectURL(this.objectUrl),this.objectUrl=window.URL.createObjectURL(t),this.stop(),this.audio.src=this.objectUrl,this.start()},e.prototype.createCanvas=function(){var t=document.createElement("canvas");return t.style.cssText="position: absolute; left: 0; bottom: 0; width: 100%; height: 100%; pointer-events: none;",t},e.prototype.createAudio=function(){var t=new Audio;return t.src=this.options.src,t.preload="auto",t.volume=.8,t.loop=!0,t.crossOrigin="anonymous",t},e.prototype.createAnalyser=function(){if(!this.analyser){var t=new(AudioContext||webkitAudioContext),e=t.createMediaElementSource(this.audio),i=t.createAnalyser();e.connect(i),i.connect(t.destination),i.fftSize=256,this.analyser=i}},e.prototype.drawCurveLine=function(t){for(var e=t.startX,i=t.startY,a=t.stopX,s=t.stopY,r=t.scaleY,o=t.arr,n=this.canvas.height,h=this.canvasCtx,c=this.options.minHeight,d=o.length,u=a/(d-1),l=e,p=i,v=0;v<d-1;v++){var f=l+u,y=(n/3*(o[v]/256)+c)*r,w=(l+f)/2,b=(p+y)/2;h.quadraticCurveTo(l,p,w,b),l=f,p=y}h.quadraticCurveTo(l,p,a,s*r)},e.prototype.drawGraph=function(t){var e=this.canvasCtx,i=this.options,a=i.minHeight,s=i.gap,r=this.canvas.width/2-s;e.beginPath(),e.moveTo(0,0),e.lineTo(0,a),this.drawCurveLine({startX:0,startY:a,stopX:r,stopY:a,scaleY:1,arr:t}),e.lineTo(r,0),e.fill()},e.prototype.drawLine=function(t){var e=this.canvasCtx,i=this.options,a=i.gap,s=i.minHeight,r=this.canvas.width/2-a;e.beginPath(),e.moveTo(0,0),this.drawCurveLine({startX:0,startY:s,stopX:r,stopY:s,scaleY:1.1,arr:t}),e.stroke()},e.prototype.draw=function(){if(this.analyser){var t=this.canvas,e=t.width,i=t.height,a=this.options.gap,s=this.analyser,r=this.canvasCtx,o=e/2-a,n=s.frequencyBinCount-5,h=new Uint8Array(n).slice(0,-20);s.getByteFrequencyData(h),r.clearRect(0,0,e,i);var c=r.createLinearGradient(0,0,o,0);c.addColorStop(0,"#ff30a2"),c.addColorStop(1,"#d8db31");var d=r.createLinearGradient(0,0,o,0);d.addColorStop(0,"#00cf2e"),d.addColorStop(1,"#3bddd2"),r.save(),r.transform(1,0,0,-1,0,i),r.fillStyle=c,r.strokeStyle=c,this.drawGraph(h),this.drawLine(h),r.restore(),r.save(),r.transform(-1,0,0,-1,e,i),r.fillStyle=d,r.strokeStyle=d,this.drawGraph(h),this.drawLine(h),r.restore(),this.drawRafId=requestAnimationFrame(this.draw.bind(this))}},e}(),i=e;exports.default=i;
},{}],"/Xnp":[function(require,module,exports) {
module.exports="canon.6d1014d4.mp3";
},{}],"vKFU":[function(require,module,exports) {

},{}],"Focm":[function(require,module,exports) {
"use strict";var e=t(require("../src/index")),n=t(require("./canon.mp3"));function t(e){return e&&e.__esModule?e:{default:e}}require("./index.css");var i=document.getElementById("play"),c=document.getElementById("fileElem"),a="loading",u={loading:{text:"加载中...",click:function(){}},playing:{text:"暂停",click:function(e){e.stop()}},pause:{text:"播放",click:function(e){e.start()}}},l=function(e){a=e,i.textContent=u[a].text};l("loading");var r=new e.default({src:n.default,audioEvents:{playing:function(){l("playing")},pause:function(){l("pause")},canplay:function(){l("pause")},error:function(){alert("加载资源失败, 请自行选择歌曲")}}});i.addEventListener("click",function(){u[a].click(r)}),c.addEventListener("change",function(e){var n=e.target.files;r.changeMusic(n[0])});
},{"../src/index":"+fUd","./canon.mp3":"/Xnp","./index.css":"vKFU"}]},{},["Focm"], null)
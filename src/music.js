import debounce from 'lodash/debounce';
import defaultSrc from './Because Of You.m4a';

class MusicVisualization {
  constructor() {
    this.audio = null;
    this.analyser = null;
    this.drawVisual = null;

    this.minHeight = 10; // 图像最小高度

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.singleWidth = this.width / 2; // 单个图像宽度

    this.defaultSrc = defaultSrc;

    this.objectUrl = null;
    this.init();
  }

  init() {
    this.createAudio();
    this.createAnalyser();
    this.createCanvas();
    const container = document.createElement('div');
    container.className = 'music-container';
    container.style.cssText =
      'position: fixed; left: 0; bottom: 0; width: 100%; height: 100%; pointer-events: none;';

    container.appendChild(this.canvas);

    document.body.appendChild(container);

    window.addEventListener('resize', debounce(this.resize.bind(this), 100));
  }

  resize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.singleWidth = this.width / 2; // 单个图像宽度
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  start() {
    // playing
    if (!this.audio.paused && this.audio.duration > 0) {
      return;
    }
    this.audio.play().then(() => {
      this.draw();
    });
  }

  stop() {
    if (this.drawVisual) {
      window.cancelAnimationFrame(this.drawVisual);
      this.drawVisual = null;
    }
    this.audio.pause();
  }

  changeMusic(file) {
    if (this.objectUrl) {
      window.URL.revokeObjectURL(this.objectUrl);
    }
    this.objectUrl = window.URL.createObjectURL(file);
    this.stop();
    this.audio.src = this.objectUrl;
    this.start();
  }

  createAudio() {
    const audio = new Audio();
    audio.src = this.defaultSrc;
    audio.preload = 'auto';
    audio.volume = 0.8;
    audio.loop = true;
    audio.crossOrigin = 'anonymous';
    this.audio = audio;
  }

  createAnalyser() {
    const { audio } = this;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;

    this.analyser = analyser;
  }

  createCanvas() {
    const canvas = document.createElement('canvas');
    const canvasCtx = canvas.getContext('2d');
    const { singleWidth } = this;
    canvas.width = this.width;
    canvas.height = this.height;

    const gradientLeft = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
    gradientLeft.addColorStop('0', '#ff30a2');
    gradientLeft.addColorStop('1.0', '#d8db31');

    const gradientRight = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
    gradientRight.addColorStop('0', '#00cf2e');
    gradientRight.addColorStop('1.0', '#3bddd2');
    this.canvas = canvas;
    this.canvasCtx = canvasCtx;
    this.gradientLeft = gradientLeft;
    this.gradientRight = gradientRight;
  }

  getPoints(data, cb) {
    const { height, minHeight, singleWidth } = this;
    let x = 0;
    const arr = data.slice(0, -20);
    const len = arr.length;
    const sliceWidth = singleWidth / (len - 1);
    for (let index = 0; index < len; index++) {
      const v = arr[index] / 256;
      const y = (height / 3) * v + minHeight;
      cb(x, y);
      x += sliceWidth;
    }
  }

  drawCurve(lastPointX, lastPointY, x, y) {
    const { canvasCtx } = this;
    canvasCtx.quadraticCurveTo(
      lastPointX,
      lastPointY,
      (lastPointX + x) / 2,
      (lastPointY + y) / 2
    );
  }

  drawGraph(arr) {
    const { canvasCtx, minHeight, singleWidth } = this;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    canvasCtx.lineTo(0, minHeight);
    let lastPointX = 0;
    let lastPointY = minHeight;
    this.getPoints(arr, (x, y) => {
      this.drawCurve(lastPointX, lastPointY, x, y);
      lastPointX = x;
      lastPointY = y;
    });
    this.drawCurve(lastPointX, lastPointY, singleWidth, minHeight);
    canvasCtx.lineTo(singleWidth, 0);
    canvasCtx.fill();
  }

  drawLine(arr) {
    const { canvasCtx, singleWidth, minHeight } = this;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    let lastPointX = 0;
    let lastPointY = 0;
    this.getPoints(arr, (x, y) => {
      this.drawCurve(lastPointX, lastPointY, x, 1.1 * y);
      lastPointX = x;
      lastPointY = 1.1 * y;
    });
    this.drawCurve(lastPointX, lastPointY, singleWidth, minHeight);
    canvasCtx.stroke();
  }

  draw() {
    const {
      analyser,
      canvasCtx,
      gradientLeft,
      gradientRight,
      width,
      height
    } = this;
    const bufferLength = analyser.frequencyBinCount - 5;
    let dataArray = new Uint8Array(bufferLength);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, width, height);

    // 镜像 翻转 左边
    canvasCtx.save();
    canvasCtx.transform(1, 0, 0, -1, 0, height);
    canvasCtx.fillStyle = gradientLeft;
    canvasCtx.strokeStyle = gradientLeft;
    this.drawGraph(dataArray);
    this.drawLine(dataArray);
    canvasCtx.restore();

    // 镜像再 翻转 右边
    canvasCtx.save();
    canvasCtx.transform(-1, 0, 0, -1, width, height);
    canvasCtx.fillStyle = gradientRight;
    canvasCtx.strokeStyle = gradientRight;
    this.drawGraph(dataArray);
    this.drawLine(dataArray);
    canvasCtx.restore();

    this.drawVisual = requestAnimationFrame(this.draw.bind(this));
  }
}

export default MusicVisualization;

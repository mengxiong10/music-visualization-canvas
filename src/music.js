import throttle from 'lodash/throttle';
import music from './canon.mp3';

const musicList = [];
let analyser;
let audio;

let bufferLength;
let dataArray;

let drawVisual;

let currentUrl;
let currentIndex = 0;

let canvas;
let canvasCtx;
let width = window.innerWidth;
let height = window.innerHeight;

let singleWidth = width / 2 - 100; // 单个图像宽度

const minHeight = 10; // 最小高度

let gradientLeft;
let gradientRight;

const svg = `
  <svg
    viewBox="0 0 1024 1024"
    version="1.1"
    class="music-svg-wrapper"
    xmlns="http://www.w3.org/2000/svg"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    style="position: absolute; bottom: -32px;left: 50%; margin-left: -150px;width: 300px;pointer-events: visible; z-index: 1 "
  >
    <defs>
      <linearGradient id="svg-gradient1">
        <stop offset="0%" stop-color="#d8db31" />
        <stop offset="50%" stop-color="#ff30a2" />
        <stop offset="70%" stop-color="#00cf2e" />
        <stop offset="100%" stop-color="#3bddd2" />
      </linearGradient>
      <style type="text/css"></style>
    </defs>
    <symbol id="musicSvgSymbol">
      <path
        d="M459.838061 502.318545c0-30.657939 24.948364-55.606303 55.606303-55.606303s55.544242 24.948364 55.544242 55.606303-24.886303 55.606303-55.544242 55.606303a55.668364 55.668364 0 0 1-55.606303-55.606303m173.242181 0c0-64.884364-52.751515-117.666909-117.635878-117.666909a117.79103 117.79103 0 0 0-117.666909 117.666909 117.79103 117.79103 0 0 0 117.666909 117.66691 117.76 117.76 0 0 0 117.604848-117.66691"
      ></path>
      <path
        d="M515.413333 935.439515c-238.809212 0-433.089939-194.311758-433.089939-433.089939 0-238.840242 194.249697-433.18303 433.12097-433.183031 238.809212 0 433.12097 194.342788 433.120969 433.183031 0 238.778182-194.311758 433.089939-433.120969 433.089939m0-928.302545C242.346667 7.13697 20.262788 229.251879 20.262788 502.349576c0 273.035636 222.145939 495.181576 495.181576 495.181576s495.181576-222.17697 495.181575-495.181576c0-273.066667-222.17697-495.243636-495.181575-495.243637"
      ></path>
      <path
        d="M806.353455 471.288242a31.030303 31.030303 0 0 0-31.030303 31.030303v0.031031c0 143.297939-116.580848 259.847758-259.878788 259.847757a31.030303 31.030303 0 0 0 0 62.060606c177.493333 0 321.939394-144.41503 321.939394-321.939394a31.030303 31.030303 0 0 0-31.030303-31.030303M515.413333 242.439758a31.030303 31.030303 0 0 0 0-62.060606c-177.493333 0-321.877333 144.41503-321.908363 321.908363v0.03103a31.030303 31.030303 0 0 0 62.060606 0c0-143.297939 116.580848-259.878788 259.878788-259.878787z"
      ></path>
    </symbol>
    <g>
      <use xlink:href="#musicSvgSymbol" class="music-svg"></use>
      <use xlink:href="#musicSvgSymbol" class="music-svg"></use>
    </g>
  </svg>
`;

function init() {
  createAudio();
  createAnalyser();
  const container = document.createElement('div');
  container.className = 'music-container';
  container.style.cssText =
    'position: fixed; left: 0; bottom: 0; width: 100%; height: 100%;pointer-events: none;';

  const canvas = createCanvas();
  const ipt = createIptFile();

  container.appendChild(canvas);
  container.appendChild(ipt);
  container.insertAdjacentHTML('beforeend', svg);

  document.body.appendChild(container);
  window.addEventListener('resize', throttle(getSize, 200));
  return container;
}

function getSize() {
  width = window.innerWidth;
  height = window.innerHeight;
  singleWidth = width / 2 - 100; // 单个图像宽度
  canvas.width = width;
  canvas.height = height;
}

function createIptFile() {
  const label = document.createElement('label');
  label.style.cssText =
    'position: absolute; bottom: -32px;left: 50%; margin-left: -150px;width: 300px;height: 300px;pointer-events: visible; opacity: 0; z-index: 2; ';
  const ipt = document.createElement('input');
  ipt.type = 'file';
  ipt.accept = 'audio/*';
  ipt.addEventListener('change', e => {
    const target = e.target;
    const file = target.files[0];
    musicList.push(file);
    currentIndex = musicList - 1;
    changeMusic(file);
  });
  label.appendChild(ipt);
  return label;
}

function createAudio() {
  audio = new Audio(music);
  audio.preload = 'auto';
  audio.volume = 0.8;
  audio.addEventListener('ended', autoNext);
}

function createAnalyser() {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
  const source = audioCtx.createMediaElementSource(audio);
  analyser = audioCtx.createAnalyser();
  source.connect(analyser);
  analyser.connect(audioCtx.destination);

  analyser.fftSize = 256;

  bufferLength = analyser.frequencyBinCount - 5;
  dataArray = new Uint8Array(bufferLength);
}

function createCanvas() {
  canvas = document.createElement('canvas');

  canvas.width = width;
  canvas.height = height;

  canvasCtx = canvas.getContext('2d');

  gradientLeft = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
  gradientLeft.addColorStop('0', '#ff30a2');
  gradientLeft.addColorStop('1.0', '#d8db31');

  gradientRight = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
  gradientRight.addColorStop('0', '#00cf2e');
  gradientRight.addColorStop('1.0', '#3bddd2');
  return canvas;
}

function getPoints(cb) {
  let x = 0;
  const sliceWidth = singleWidth / (bufferLength - 1);
  for (let index = 0; index < bufferLength; index++) {
    const v = dataArray[index] / 256;
    const y = (height / 2) * v + minHeight;
    cb(x, y);
    x += sliceWidth;
  }
}

function drawGraph() {
  canvasCtx.beginPath();
  canvasCtx.moveTo(0, 0);
  canvasCtx.lineTo(0, minHeight);
  getPoints((x, y) => {
    canvasCtx.lineTo(x, y);
  });
  canvasCtx.lineTo(singleWidth, minHeight);
  canvasCtx.lineTo(singleWidth, 0);
  canvasCtx.fill();
}

function drawLine() {
  canvasCtx.beginPath();
  getPoints((x, y) => {
    canvasCtx.lineTo(x, 1.1 * y);
  });
  canvasCtx.stroke();
}

function draw() {
  analyser.getByteFrequencyData(dataArray);

  canvasCtx.clearRect(0, 0, width, height);

  // 镜像 翻转 左边
  canvasCtx.save();
  canvasCtx.transform(1, 0, 0, -1, 0, height);
  canvasCtx.fillStyle = gradientLeft;
  canvasCtx.strokeStyle = gradientLeft;
  drawGraph();
  drawLine();
  canvasCtx.restore();

  // 镜像再 翻转 右边
  canvasCtx.save();
  canvasCtx.transform(-1, 0, 0, -1, width, height);
  canvasCtx.fillStyle = gradientRight;
  canvasCtx.strokeStyle = gradientRight;
  drawGraph();
  drawLine();
  canvasCtx.restore();

  drawVisual = requestAnimationFrame(draw);
}

function start() {
  audio.play().then(() => {
    draw();
  });
}

function stop() {
  window.cancelAnimationFrame(drawVisual);
  drawVisual = 0;
  audio.pause();
}

function changeMusic(file) {
  if (currentUrl) {
    window.URL.revokeObjectURL(currentUrl);
  }
  let url;
  if (typeof file === 'string') {
    url = file;
  } else {
    url = currentUrl = window.URL.createObjectURL(file);
  }
  stop();
  audio.src = url;
  start();
}

function autoNext() {
  const length = musicList.length;
  if (length) {
    const index = currentIndex + 1;
    currentIndex = index >= length ? 0 : index;
    changeMusic(musicList[currentIndex]);
  } else {
    changeMusic(music);
  }
}

export { init, start, stop };

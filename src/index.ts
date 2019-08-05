declare const webkitAudioContext: {
  prototype: AudioContext;
  new (contextOptions?: AudioContextOptions): AudioContext;
};

export interface Options {
  src: string;
  minHeight?: number;
  gap?: number;
  onPlay?: () => void;
  onStop?: () => void;
  audioEvents?: {
    [key: string]: () => void;
  };
}

class MusicVisualization {
  options: Required<Options>;
  container: HTMLDivElement;
  audio: HTMLAudioElement;
  analyser: AnalyserNode | null;
  canvas: HTMLCanvasElement;
  canvasCtx: CanvasRenderingContext2D;
  drawRafId: number | null;
  objectUrl: string;
  width: number;
  height: number;

  constructor(options: Options) {
    this.options = {
      src: '',
      gap: 0,
      minHeight: 10,
      onPlay: () => {},
      onStop: () => {},
      audioEvents: {},
      ...options
    };

    this.drawRafId = null;
    this.objectUrl = '';

    this.width = window.innerWidth;
    this.height = window.innerHeight;

    this.canvas = this.createCanvas(this.width, this.height);
    this.canvasCtx = this.canvas.getContext('2d') as CanvasRenderingContext2D;
    this.container = this.createDomContainer(this.canvas);
    document.body.appendChild(this.container);

    this.analyser = null;
    this.audio = this.createAudio();

    if (this.options.audioEvents) {
      Object.keys(this.options.audioEvents).forEach(key => {
        this.audio.addEventListener(key, this.options.audioEvents[key]);
      });
    }
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  public start() {
    if (!this.audio.src) {
      return;
    }
    // playing
    if (!this.audio.paused && this.audio.duration > 0) {
      return;
    }
    if (!this.analyser) {
      this.analyser = this.createAnalyser(this.audio);
    }
    return this.audio.play().then(() => {
      if (this.options.onPlay) {
        this.options.onPlay();
      }
      this.draw();
    });
  }

  public stop() {
    if (this.drawRafId) {
      window.cancelAnimationFrame(this.drawRafId);
      this.drawRafId = null;
    }
    this.audio.pause();
    if (this.options.onStop) {
      this.options.onStop();
    }
  }

  public destroy() {
    this.stop();
    if (this.objectUrl) {
      window.URL.revokeObjectURL(this.objectUrl);
    }
    if (this.options.audioEvents) {
      Object.keys(this.options.audioEvents).forEach(key => {
        this.audio.removeEventListener(key, this.options.audioEvents[key]);
      });
    }
    window.removeEventListener('resize', this.handleResize);
    document.body.removeChild(this.container);
    this.analyser = null;
  }

  public changeMusic(file: any) {
    if (this.objectUrl) {
      window.URL.revokeObjectURL(this.objectUrl);
    }
    this.objectUrl = window.URL.createObjectURL(file);
    this.stop();
    this.audio.src = this.objectUrl;
    this.start();
  }

  private handleResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.canvas.width = this.width;
    this.canvas.height = this.height;
  }

  /**
   * 创建DOM
   * @param canvas
   */
  private createDomContainer(canvas: HTMLCanvasElement) {
    const container = document.createElement('div');
    container.className = 'music-container';
    container.style.cssText =
      'position: fixed; left: 0; bottom: 0; width: 100%; height: 100%; pointer-events: none;';

    container.appendChild(canvas);

    return container;
  }

  /**
   *  创建canvas
   */
  private createCanvas(width: number, height: number) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    return canvas;
  }

  /**
   * 创建audio
   */
  private createAudio() {
    const audio = new Audio();
    audio.src = this.options.src;
    audio.preload = 'auto';
    audio.volume = 0.8;
    audio.loop = true;
    audio.crossOrigin = 'anonymous';
    return audio;
  }

  /**
   * 创建auido 分析器
   * @param audio
   */
  private createAnalyser(audio: HTMLMediaElement) {
    const audioCtx = new (AudioContext || webkitAudioContext)();
    const source = audioCtx.createMediaElementSource(audio);
    const analyser = audioCtx.createAnalyser();
    source.connect(analyser);
    analyser.connect(audioCtx.destination);
    analyser.fftSize = 256;
    return analyser;
  }

  /**
   * 画曲线
   * @param param0
   */
  private drawCurveLine({
    startX,
    startY,
    stopX,
    stopY,
    scaleY,
    arr
  }: {
    startX: number;
    startY: number;
    stopX: number;
    stopY: number;
    scaleY: number;
    arr: Uint8Array;
  }) {
    const { height, canvasCtx } = this;
    const { minHeight } = this.options;
    const len = arr.length;
    const sliceWidth = stopX / (len - 1);
    let lastX = startX;
    let lastY = startY;
    for (let index = 0; index < len - 1; index++) {
      const x = lastX + sliceWidth;
      const y = ((height / 3) * (arr[index] / 256) + minHeight) * scaleY;
      // 取当前点 和 上一个点的中点, 模拟曲线
      const middleX = (lastX + x) / 2;
      const middleY = (lastY + y) / 2;
      canvasCtx.quadraticCurveTo(lastX, lastY, middleX, middleY);
      lastX = x;
      lastY = y;
    }
    canvasCtx.quadraticCurveTo(lastX, lastY, stopX, stopY * scaleY);
  }

  private drawGraph(arr: Uint8Array) {
    const { canvasCtx } = this;
    const { minHeight, gap } = this.options;
    const singleWidth = this.width / 2 - gap;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    canvasCtx.lineTo(0, minHeight);
    this.drawCurveLine({
      startX: 0,
      startY: minHeight,
      stopX: singleWidth,
      stopY: minHeight,
      scaleY: 1,
      arr
    });
    canvasCtx.lineTo(singleWidth, 0);
    canvasCtx.fill();
  }

  private drawLine(arr: Uint8Array) {
    const { canvasCtx } = this;
    const { gap, minHeight } = this.options;
    const singleWidth = this.width / 2 - gap;
    canvasCtx.beginPath();
    canvasCtx.moveTo(0, 0);
    this.drawCurveLine({
      startX: 0,
      startY: minHeight,
      stopX: singleWidth,
      stopY: minHeight,
      scaleY: 1.1,
      arr
    });
    canvasCtx.stroke();
  }

  private draw() {
    if (!this.analyser) {
      return;
    }
    const { analyser, canvasCtx, width, height } = this;
    const { gap } = this.options;
    const singleWidth = this.width / 2 - gap;
    const bufferLength = analyser.frequencyBinCount - 5;
    const dataArray = new Uint8Array(bufferLength).slice(0, -20);

    analyser.getByteFrequencyData(dataArray);

    canvasCtx.clearRect(0, 0, width, height);

    const gradientLeft = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
    gradientLeft.addColorStop(0, '#ff30a2');
    gradientLeft.addColorStop(1, '#d8db31');

    const gradientRight = canvasCtx.createLinearGradient(0, 0, singleWidth, 0);
    gradientRight.addColorStop(0, '#00cf2e');
    gradientRight.addColorStop(1, '#3bddd2');

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

    this.drawRafId = requestAnimationFrame(this.draw.bind(this));
  }
}

export default MusicVisualization;

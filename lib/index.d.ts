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
declare class MusicVisualization {
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
    constructor(options: Options);
    start(): Promise<void> | undefined;
    stop(): void;
    destroy(): void;
    changeMusic(file: any): void;
    private handleResize;
    /**
     * 创建DOM
     * @param canvas
     */
    private createDomContainer;
    /**
     *  创建canvas
     */
    private createCanvas;
    /**
     * 创建audio
     */
    private createAudio;
    /**
     * 创建auido 分析器
     * @param audio
     */
    private createAnalyser;
    /**
     * 画曲线
     * @param param0
     */
    private drawCurveLine;
    private drawGraph;
    private drawLine;
    private draw;
}
export default MusicVisualization;

## 音乐可视化

自己娱乐的作品, 由某音乐 MV 引发的灵感, 自用于一些彩蛋

## Demo

<https://mengxiong10.github.io/music-visualization-canvas/>

## 安装

```bash
$ npm install music-visualization-canvas --save
```

## 用法

```js
import MusicVisualization from 'music-visualization-canvas';

const mv = new MusicVisualization({
  src: 'https://music.mp3',
  audioEvents: {
    playing: () => {},
    pause: () => {},
    canplay: () => {},
    error: () => {}
  }
});

// 暂停
mv.stop();

// 播放
mv.start();
```

## api

### 选项

| Key         | 描述                   | 默认值        |
| ----------- | ---------------------- | ------------- |
| src         | 音频的 url             | -             |
| el          | canvas 插入的 DOM 元素 | document.body |
| audioEvents | audio 对象上注册的事件 | -             |

### 方法

| 方法    | 描述     |
| ------- | -------- |
| start   | 开始播放 |
| stop    | 暂停     |
| destroy | 销毁     |

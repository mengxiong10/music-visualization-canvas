import MusicVisualization from '../src/index';
import canon from './canon.mp3';
import './index.css';

// 播放按钮
const btnPlay = document.getElementById('play');
// 换音乐按钮
const btnChangeFile = document.getElementById('fileElem');

let state = 'loading'; // loading | 'playing' | 'pause';

const stateMap = {
  loading: {
    text: '加载中...',
    click: () => {}
  },
  playing: {
    text: '暂停',
    click(app) {
      app.stop();
    }
  },
  pause: {
    text: '播放',
    click(app) {
      app.start();
    }
  }
};

// 切换状态
const changeState = (value) => {
  state = value;
  btnPlay.textContent = stateMap[state].text;
};

changeState('loading');

const mv = new MusicVisualization({
  src: canon,
  audioEvents: {
    playing: () => {
      changeState('playing');
    },
    pause: () => {
      changeState('pause');
    },
    canplay: () => {
      changeState('pause');
    },
    error: () => {
      alert('加载资源失败, 请自行选择歌曲');
    }
  }
});

btnPlay.addEventListener('click', function () {
  stateMap[state].click(mv);
});

btnChangeFile.addEventListener('change', (evt) => {
  const files = evt.target.files;
  mv.changeMusic(files[0]);
});

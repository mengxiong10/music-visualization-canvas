import MusicVisualization from '../lib/index.ts';
import './index.css';

// 播放按钮
const playBtn = document.getElementById('play');

// 换音乐按钮
const fileElem = document.getElementById('fileElem');

let btn = null;

// 切换状态
const changeBtnState = value => {
  btn = value;
  playBtn.textContent = value.text;
};

const btnState = {
  loading: {
    text: '加载中...',
    click: () => {}
  },
  playing: {
    text: '暂停',
    click(mv) {
      mv.stop();
    }
  },
  canPaly: {
    text: '播放',
    click(mv) {
      mv.start();
    }
  }
};

changeBtnState(btnState.loading);

const mv = new MusicVisualization({
  src: 'http://new-sound.iqing.com/play/7dc218c1-c75a-439e-99a7-35de2cca9ad8.aac',
  onPlay: () => {
    changeBtnState(btnState.playing);
  },
  onStop: () => {
    changeBtnState(btnState.canPaly);
  },
  audioEvents: {
    canplay: () => {
      changeBtnState(btnState.canPaly);
    },
    error: () => {
      alert('加载资源失败, 请自行选择歌曲');
    }
  }
});

playBtn.addEventListener('click', function() {
  btn.click(mv);
});

fileElem.addEventListener('change', evt => {
  const files = evt.target.files;
  mv.changeMusic(files[0]);
});

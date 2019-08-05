import MusicVisualization from '../lib/index.ts';
import './index.css';

const playBtn = document.getElementById('play');

const fileElem = document.getElementById('fileElem');

let status = 'loading';

playBtn.textContent = '加载中…';

const src =
  'http://new-sound.iqing.com/play/7dc218c1-c75a-439e-99a7-35de2cca9ad8.aac';

const instance = new MusicVisualization({
  src,
  onCanplay: () => {
    if (status === 'loading') {
      status = 'loaded';
      playBtn.textContent = '播放';
    }
  },
  onError: () => {
    alert('加载资源失败, 请自行选择歌曲');
  }
});

function play() {
  instance.start();
  status = 'play';
  playBtn.textContent = '暂停';
}

function stop() {
  instance.stop();
  status = 'stop';
  playBtn.textContent = '播放';
}

playBtn.addEventListener('click', () => {
  if (status === 'loading') {
    return;
  }
  if (status === 'play') {
    stop();
  } else {
    play();
  }
});

fileElem.addEventListener('change', e => {
  const files = e.target.files;
  instance.changeMusic(files[0]);
});

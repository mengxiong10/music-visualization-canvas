import './index.css';
import MusicVisualization from './music';
import defaultSrc from './canon.mp3';

// const src1 = 'https://music.163.com/song/media/outer/url?id=19287485.mp3 ';

const instance = new MusicVisualization({
  defaultSrc
});

const playBtn = document.getElementById('play');

const fileElem = document.getElementById('fileElem');

let status = 'loading';

playBtn.textContent = '加载中…';

instance.audio.addEventListener('canplay', () => {
  if (status === 'loading') {
    status = 'loaded';
    playBtn.textContent = '播放';
  }
});

instance.audio.addEventListener('error', function() {
  if (this.error.code) {
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

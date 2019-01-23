import './index.css';
import MusicVisualization from './music';

// const src1 = 'https://music.163.com/song/media/outer/url?id=19287485.mp3 ';
const defaultSrc =
  'https://m10.music.126.net/20190123101453/5fcf2f8faea027e0bebe0084649d6d0b/ymusic/6bdd/dfe1/235b/2eea628ccf6836eefb661ab6291714b5.mp3';

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

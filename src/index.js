import './index.css';
import MusicVisualization from './music';

const instance = new MusicVisualization();

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

fileElem.addEventListener('change', (e) => {
  const files = e.target.files;
  instance.changeMusic(files[0]);
});

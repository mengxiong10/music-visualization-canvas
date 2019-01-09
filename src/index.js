import './index.css';
import { init, start } from './music';

let play = false;

document.getElementById('btn').addEventListener('click', () => {
  if (play) {
    return;
  }
  play = true;
  init();
  setTimeout(start, 3000);
});

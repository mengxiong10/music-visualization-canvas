import './index.css';
import { init, start } from './music';

init();

let play = false;

document.getElementById('btn').addEventListener('click', () => {
  if (play) {
    return;
  }
  play = true;
  start();
});

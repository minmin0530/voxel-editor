import ProgressHistory from './progress_history';
import Main from './main';

const main = new Main();
const progressHistory = new ProgressHistory(main);

window.main = main;
window.progressHistory = progressHistory;

window.onload = function() {
  main.init();
  loop();
};

function loop() {
  progressHistory.timeLine();
  main.update();
  main.render();
  requestAnimationFrame(loop);
}


import _progress from 'cli-progress';
import _colors from 'ansi-colors';

export async function logProgrss(title, msg, total, onProcss, onComplete) {
  const opt = {
    format: `${title} |${_colors.cyan('{bar}')}| {percentage}% || ${msg}: {value}/{total} || Category: {category}`,
    barCompleteChar: '\u2588',
    barIncompleteChar: '\u2591',
    hideCursor: true,
    noTTYOutput: true
  }

  console.log('');
  // create new progress bar
  const pgbar = new _progress.Bar(opt);

  let value = 0;
  let category = "N/A";

  // initialize the bar -  defining payload token "speed" with the default value "N/A"
  pgbar.start(total, value, {category: category});

  while(true) {
    ([value, category] = await onProcss(value));
    if (total <= value) {
      break;
    }
    // update the bar value
    pgbar.update(value, {category: category});
  }

  pgbar.update(value, {category: category});
  pgbar.stop();
  
  await onComplete();
}

export function logProgresser_selftest() {
  console.log('');
  // create new progress bar
  const b1 = new _progress.Bar({
      format: 'CLI Progress |' + _colors.cyan('{bar}') + '| {percentage}% || {value}/{total} Chunks || Speed: {speed}',
      barCompleteChar: '\u2588',
      barIncompleteChar: '\u2591',
      hideCursor: true,
      noTTYOutput: true
  });

  // initialize the bar -  defining payload token "speed" with the default value "N/A"
  b1.start(200, 0, {
      speed: "N/A"
  });

  // the bar value - will be linear incremented
  let value = 0;

  const speedData = [];

  // 20ms update rate
  const timer = setInterval(function(){
    // increment value
    value++;

    // example speed data
    speedData.push(Math.random()*2+5);
    const currentSpeedData = speedData.splice(-10);

    // update the bar value
    b1.update(value, {
        speed: (currentSpeedData.reduce(function(a, b) { return a + b; }, 0) / currentSpeedData.length).toFixed(2) + "Mb/s"
    });

    // set limit
    if (value >= b1.getTotal()){
        // stop timer
        clearInterval(timer);

        b1.stop();
    }
  }, 20);
}

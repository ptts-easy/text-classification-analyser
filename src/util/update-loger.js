import logUpdate from 'log-update';

export function logUpdat(msg) {
  logUpdate(msg);
}

export function logUpdater_selftest() {
  const frames = ['-', '\\', '|', '/'];
  let index = 0;

  setInterval(() => {
    const frame = frames[++index % frames.length];
    logUpdate(`${frame} processed ${index}`);
  }, 80);
}
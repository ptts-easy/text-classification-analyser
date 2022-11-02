import { sleep } from 'deasync';

export function asleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export function ssleep(ms) {
//  const start_time = new Date();
  sleep(ms);
//  const end_time = new Date();
//  console.log("Prediction Time :", (end_time.valueOf() - start_time.valueOf())/1000); 
}

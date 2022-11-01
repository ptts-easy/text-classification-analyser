import { main as ml_predict } from './ml-classify-text/predict.js';
import { main as wx_predict } from './whichx/predict.js';
import { main as nt_predict } from './natural/predict.js';
import esMain from 'es-main';

function main() {
  console.log("================= ml-classify-text =================");

  ml_predict();

  console.log("================= whichx =================");

  wx_predict();

  console.log("================= natural =================");

  nt_predict();
}

if (esMain(import.meta)) {
  main();
}

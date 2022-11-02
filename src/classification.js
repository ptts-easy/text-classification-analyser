import { main as ml_predict } from './ml-classify-text/predict.js';
import { main as wx_predict } from './whichx/predict.js';
import { main as nt_predict } from './natural/predict.js';
import { main as nn_predict } from './node-nlp/predict.js';
import { main as bs_predict } from './bayes/predict.js';
import { main as bc_predict } from './bayes-classifier/predict.js';
import { main as nb_predict } from './nbayes/predict.js';
import { main as cf_predict } from './classificator/predict.js';
import { ssleep } from './util/thread-mng.js';
import esMain from 'es-main';

async function main() {
  console.log("================= 1. ml-classify-text =================");

  await ml_predict("ml-classify-text => ");

  console.log("================= 2. whichx =================");

  await wx_predict("whichx => ");

  console.log("================= 3. natural =================");

  await nt_predict("natural => ");

  console.log("================= 4. node-nlp =================");

  await nn_predict("node-nlp => ");

  console.log("================= 5. bayes =================");

  await bs_predict("bayes => ");

  console.log("================= 6. bayes-classifier =================");

  await bc_predict("bayes-classifier => ");

  console.log("================= 7. nbayes =================");

  await nb_predict("nbayes => ");

  console.log("================= 8. classificator =================");

  await cf_predict("classificator => ");
}

if (esMain(import.meta)) {
  main();
}

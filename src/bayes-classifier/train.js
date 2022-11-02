import {logProgrss} from '../util/progress-loger.js';
import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import BayesClassifier from 'bayes-classifier';
import catgorys from '../../datasets/category.js';
import { train_path } from "../../config/config.js"

const module_path = "./src/bayes-classifier/model/model.json";

let classifier = {};

async function setup() {

  if (fs.existsSync(module_path)) {
    const model_json = fs.readFileSync(module_path, 'utf8');
    const model_obj = JSON.parse(model_json);
    classifier = new BayesClassifier();
    classifier.restore(model_obj);
    console.log("model loaded !!!");
  } else {
    classifier = new BayesClassifier();
  }
}

async function train() {
  console.log("train data prepare started !!!");

  const start_time = new Date();

  const category_count = catgorys.length;

  await logProgrss("Train", "count", category_count, 
    async function(idx) {
      let catgory = catgorys[idx]
      try {
        const path = `${train_path}${catgory}.txt`;
        const text = fs.readFileSync(path.toString());
        const sentences = spiliter([text.toString()]);
        classifier.addDocuments(sentences, catgory)
      } catch (err) {
        console.log(`read "${train_path}${catgory}.txt" file failed !!!`);
        console.log(err);
      }
      return [idx + 1, `${catgory}.txt`];
    },
    async function(){
      const end_time = new Date();
      console.log("Time :", (end_time.valueOf() - start_time.valueOf())/1000);
    }
  );

  console.log("train started !!!");

  const hrstart = process.hrtime();

  classifier.train();

  const hrend = process.hrtime(hrstart);
  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

  console.log("train ended !!!");
  
  let model_json = JSON.stringify(classifier);
  fs.writeFileSync(module_path, model_json, 'utf8');

  console.log("model saved !!!");
}

async function main() {
  await setup();
  await train();
}

main();

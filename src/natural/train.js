import {logProgrss} from '../util/progress-loger.js';
import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import nt from 'natural';
import catgorys from '../../datasets/category.js';
import { train_path } from "../../config/config.js"

const module_path = "./src/natural/model/model.json";

let classifier = {};

async function setup() {

  if (fs.existsSync(module_path)) {
    const model_json = fs.readFileSync(module_path, 'utf8');
    const model_obj = JSON.parse(model_json);
    classifier = model_obj;
    nt.BayesClassifier.restore(classifier, null);
    console.log("model loaded !!!");

//    nt.BayesClassifier.load(module_path, null, function (err, new_classifier) {
//      if (err) console.log(err);
//      classifier = new_classifier;
//      console.log("model loaded !!!");
//    });
  } else {
    classifier = new nt.BayesClassifier();
  }
}

async function train() {
  console.log("train started !!!");

  const start_time = new Date();

  for (let catgory of catgorys) {
    try {
      const path = `${train_path}${catgory}.txt`;
      const text = fs.readFileSync(path.toString());
      const sentences = spiliter([text.toString()]);
      await logProgrss(`${catgory}.txt`, "sentences", sentences.length, 
        async function(idx) {
          classifier.addDocument(sentences[idx], catgory);
          return [idx + 1, catgory];
        },
        async function(){
//          console.log(`${catgory}.txt file train complated`);
        }
      );
    } catch (err) {
      console.log(`read "${train_path}${catgory}.txt" file failed !!!`);
      console.log(err);
    }
  }

  const end_time = new Date();
  console.log("Time :", (end_time.valueOf() - start_time.valueOf())/1000);

  console.log("train started !!!");

  const hrstart = process.hrtime();

  classifier.train();

  const hrend = process.hrtime(hrstart);
  console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

  console.log("train ended !!!");
  
  let model_json = JSON.stringify(classifier);
  fs.writeFileSync(module_path, model_json, 'utf8');

  console.log("model saved !!!");

//  classifier.save(module_path, function (err, classifier) {
//    if (err) console.log(err)
//
//    console.log("trained Model saved !!!");
//  })
}

async function main() {
  await setup();
  await train();
}

main();

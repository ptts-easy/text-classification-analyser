import {logProgrss} from '../util/progress-loger.js';
import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import * as mlct from 'ml-classify-text';
import catgorys from '../../datasets/category.js';
import { train_path } from "../../config/config.js"

const module_path = "./src/ml-classify-text/model/model.json";

const { Classifier, Model } = mlct.default;

let classifier = {};

async function setup() {

  if (fs.existsSync(module_path)) {
    const model_json = fs.readFileSync(module_path, 'utf8');
    const model_obj = JSON.parse(model_json);
    classifier = new Classifier();
    classifier.model = new Model(model_obj);
    console.log("model loaded !!!");
  } else {
    classifier = new Classifier();
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
        classifier.train(sentences, catgory);
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

  let model_json = JSON.stringify(classifier.model.serialize());
  fs.writeFileSync(module_path, model_json, 'utf8');

  console.log("model saved !!!");
}

async function train1() {
  console.log("train started !!!");

  const start_time = new Date();

  for (let catgory of catgorys) {
    try {
      const path = `${train_path}${catgory}.txt`;
      const text = fs.readFileSync(path.toString());
      const sentences = spiliter([text.toString()]);
      await logProgrss(`${catgory}.txt`, "sentences", sentences.length, 
        async function(idx) {
          classifier.train(sentences[idx], catgory);
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

  let model_json = JSON.stringify(classifier.model.serialize());
  fs.writeFileSync(module_path, model_json, 'utf8');

  console.log("model saved !!!");
}

async function main() {
  await setup();
  await train1();
}

main();

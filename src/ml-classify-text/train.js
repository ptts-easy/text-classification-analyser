import {logProgrss} from '../util/progress-loger.js';
import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import * as mlct from 'ml-classify-text';
import catgorys from '../../datasets/category.js';

const train_path = "./datasets/trains/";
const module_path = "./src/ml-classify-text/model/model.json";

const { Classifier, Model } = mlct.default;

let classifier = {};

function setup(train) {

  if (fs.existsSync(module_path)) {
    const data = fs.readFileSync(module_path);
    const config = JSON.parse(data);

    classifier = new Classifier();
    classifier.model = new Model(config);
    
    console.log("model loaded !!!");
    train();
  } else {
    classifier = new Classifier();
    train();
  }
}

function train() {
  console.log("train started !!!");

  let model = classifier.model;

  for (let catgory of catgorys) {
    const start_time = new Date();    
    try {
      const path = `${train_path}${catgory}.txt`;
      const text = fs.readFileSync(path.toString());
      const sentences = spiliter([text.toString()]);
      logProgrss(`${catgory}.txt`, "sentences", sentences.length, function(idx) {
          classifier.train(sentences[idx], catgory);
          return idx + 1;
        },
        function(){
          console.log(`${catgory}.txt file train complated`);
          fs.writeFileSync(module_path, JSON.stringify(model.serialize()));
          console.log(`${catgory}.txt file trained Model saved !!!`);
        }
      );
    } catch (err) {
      console.log(`read "${train_path}${catgory}.txt" file failed !!!`);
      console.log(err);
    }
    const end_time = new Date();
    console.log("Time :", (end_time.valueOf() - start_time.valueOf())/1000);
  }

  console.log("train ended !!!"); 
}

function train_selftest() {
  console.log("ml-classify-text/train::train_selftest()");
}

function main() {
//  train_selftest();

  setup(train);
}

main();

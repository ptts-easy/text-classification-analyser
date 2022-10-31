import {logProgrss} from '../util/progress-loger.js';
import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import nt from 'natural';
import catgorys from '../../datasets/category.js';

const train_path = "./datasets/trains/";
const module_path = "./src/natural/model/model.json";

let classifier = {};

function setup(train) {

  if (fs.existsSync(module_path)) {
    nt.BayesClassifier.load(module_path, null, function (err, new_classifier) {
      if (err) console.log(err);
      console.log("model loaded !!!");
      classifier = new_classifier;
      train();
    });
  } else {
    classifier = new nt.BayesClassifier();
    train();
  }
}

function train() {
  for (let catgory of catgorys) {
    const start_time = new Date();    
    try {
      const path = `${train_path}${catgory}.txt`;
      const text = fs.readFileSync(path.toString());
      const sentences = spiliter([text.toString()]);
      logProgrss(`${catgory}.txt`, "sentences", sentences.length, function(idx) {
          classifier.addDocument(sentences[idx], catgory);
          return idx + 1;
        },
        function(){
          console.log(`${catgory}.txt file add documnet complated`);
        }
      );
    } catch (err) {
      console.log(`read "${train_path}${catgory}.txt" file failed !!!`);
      console.log(err);
    }
    const end_time = new Date();
    console.log("Time :", (end_time.valueOf() - start_time.valueOf())/1000);
  }

  console.log("train started !!!");
    
  classifier.train();
  
  classifier.save(module_path, function (err, classifier) {
    if (err) console.log(err)
    console.log("trained Model saved !!!");
  })

  console.log("train ended !!!"); 
}

function train_selftest() {
  console.log("natural/train::train_selftest()");
}

function main() {
//  train_selftest();

  setup(train);
}

main();

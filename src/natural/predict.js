import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import nt from 'natural';
import catgorys from '../../datasets/category.js';

const test_path = "./datasets/test/test.txt";
const module_path = "./src/natural/model/model.json";

let classifier = {};

function setup(predict) {

  if (fs.existsSync(module_path)) {
    nt.BayesClassifier.load(module_path, null, function (err, new_classifier) {
      if (err) console.log(err);
      console.log("model loaded !!!");
      classifier = new_classifier;
      predict();
    });
  } else {
    console.log("model don't exist !!!");
  }
}

function predict() {
  console.log("predict started !!!");

  const start_time = new Date();

  let res_category;
  
  try {
    const text = fs.readFileSync(test_path);

    res_category = classifier.classify(text.toString());
  } catch (err) {
    console.log(`read "${test_path}" file failed !!!`);
    console.log(err);
  }

  const end_time = new Date();


  console.log("Classification Result  ===> ", res_category);  

  console.log("Prediction Time :", (end_time.valueOf() - start_time.valueOf())/1000); 

  console.log("predict ended !!!"); 
}

function predict_selftest() {
  console.log("natural/predict::predict_selftest()");
}

function main() {
//  predict_selftest();

  setup(predict);
}

main();
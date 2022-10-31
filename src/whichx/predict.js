import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import WhichX from 'whichx';
import catgorys from '../../datasets/category.js';

const test_path = "./datasets/test/test.txt";
const module_path = "./src/whichx/model/model.json";

let classifier = {};

function setup(predict) {

  if (fs.existsSync(module_path)) {
    const data = fs.readFileSync(module_path);
    const config = JSON.parse(data);

    classifier = new WhichX();
//    classifier.addLabels(catgorys);

    classifier.import(config);
    
    console.log("model loaded !!!");
    predict();
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
  console.log("whichx/predict::predict_selftest()");
}

function main() {
//  predict_selftest();

  setup(predict);
}

main();
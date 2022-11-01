import {spiliter} from '../util/spiliter-wink-nlp.js';
import esMain from 'es-main';
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
//  console.log("predict started !!!");

  const start_time = new Date();

  let res_category;
  
  try {
    const text = fs.readFileSync(test_path);
    const sentences = spiliter([text.toString()]);

    console.log(`Total sentences = ${sentences.length}`);

    for (let sentence of sentences) {
      res_category = classifier.classify(sentence);
      console.log("Classification Result  ===> ", res_category);
    }
  } catch (err) {
    console.log(`read "${test_path}" file failed !!!`);
    console.log(err);
  }

  const end_time = new Date();

  console.log("Classification Result  ===> ", res_category);  

  console.log("Prediction Time :", (end_time.valueOf() - start_time.valueOf())/1000); 

//  console.log("predict ended !!!"); 
}

export function main() {
  setup(predict);
}

if (esMain(import.meta)) {
  main();
}
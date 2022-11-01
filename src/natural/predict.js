import {spiliter} from '../util/spiliter-wink-nlp.js';
import esMain from 'es-main';
import * as fs from 'fs';
import nt from 'natural';
import catgorys from '../../datasets/category.js';
import { test_path } from "../../config/config.js"

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

  console.log("Prediction Time :", (end_time.valueOf() - start_time.valueOf())/1000); 

//  console.log("predict ended !!!"); 
}

export function main() {
  setup(predict);
}

if (esMain(import.meta)) {
  main();
}
import {spiliter} from '../util/spiliter-wink-nlp.js';
import esMain from 'es-main';
import * as fs from 'fs';
import * as mlct from 'ml-classify-text';
import catgorys from '../../datasets/category.js';
import { test_path } from "../../config/config.js"

const module_path = "./src/ml-classify-text/model/model.json";

const { Classifier, Model } = mlct.default;

let classifier = {};
let label = "";

async function setup() {

  if (fs.existsSync(module_path)) {
    const model_json = fs.readFileSync(module_path, 'utf8');
    const model_obj = JSON.parse(model_json);
    classifier = new Classifier();
    classifier.model = new Model(model_obj);
    console.log("model loaded !!!");
    return true;
  } else {
    console.log("model don't exist !!!");
    return false;
  }
}

async function predict() {
//  console.log("predict started !!!");

  const start_time = new Date();

  let res_category;

  const fRes = new Map();
  let fVal = 0;
  let fMin = 0.001;

  for (let catgory of catgorys) {
    fRes.set(catgory, fVal);
  }

  try {
    const text = fs.readFileSync(test_path);
    const sentences = spiliter([text.toString()]);

    console.log(`Total sentences = ${sentences.length}`);

    for (let sentence of sentences) {
//      let predictions = classifier.predict(sentence, 100, 0.0);
//    
//      if (predictions.length) {
//        predictions.forEach(prediction => {
//          if(prediction.confidence > fMin) {
//            fVal = fRes.get(prediction.label);
//            fVal += Math.log(prediction.confidence);
//            fRes.set(prediction.label, fVal);
//          }
//        })
//      } else {
//        console.log('No predictions returned')
//      }

      let predictions = classifier.predict(sentence, 1, 0.0);
      console.log(label, "Classification Result  ===> ", `${predictions[0].label} (${predictions[0].confidence})`)
//      res_category = prediction.label;
//      console.log(label, "Classification Result  ===> ", res_category);
    }
  } catch (err) {
    console.log(`read "${test_path}" file failed !!!`);
    console.log(err);
  }

  const end_time = new Date();

  console.log("Prediction Time :", (end_time.valueOf() - start_time.valueOf())/1000); 

//  console.log("predict ended !!!"); 

/*
  let sorted_result = [];

  for (const [key, value] of fRes.entries()) {
    sorted_result.push({name:key, value:value});
  }

  sorted_result.sort((a, b) => b.value - a.value);

  res_category = sorted_result[0].name;

  console.log("Classification Result  ===> ", res_category);
*/
}

export async function main(_label) {
  if (_label != undefined)
    label = _label;
  if (await setup() ==true) {
    await predict();
  }
}

if (esMain(import.meta)) {
  main();
}
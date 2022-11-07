import {spiliter} from '../util/spiliter-wink-nlp.js';
import esMain from 'es-main';
import * as fs from 'fs';
import bayes from 'classificator';
import catgorys from '../../datasets/category.js';
import { test_path, SHOW_CLASSIFICATION_RESULT } from "../../config/config.js"

const module_path = "./src/classificator/model/model.json";

let classifier = {};
let label = "";

async function setup() {

  if (fs.existsSync(module_path)) {
    const model_json = fs.readFileSync(module_path, 'utf8');
    classifier = bayes.fromJson(model_json)
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

  const cRes = new Map();

  for (let catgory of catgorys) {
    cRes.set(catgory, 0);
  }

  try {
    const text = fs.readFileSync(test_path);
    const sentences = spiliter([text.toString()]);

    console.log(`Total sentences = ${sentences.length}`);

    for (let sentence of sentences) {
      let prediction = classifier.categorize(sentence);
      res_category = prediction.predictedCategory;
      cRes.set(res_category, cRes.get(res_category) + 1);
      if (SHOW_CLASSIFICATION_RESULT == true) {
  //      console.log(label, "Classification Result  ===> ", res_category);
        for (const item of prediction.likelihoods) {
          if (item.category == res_category) {
            console.log(label, "Classification Result  ===> ", `${item.category} (${item.proba})`)
            break;
          }
        }
      }
    }
  } catch (err) {
    console.log(`read "${test_path}" file failed !!!`);
    console.log(err);
  }

  const end_time = new Date();

  console.log("Prediction Time :", (end_time.valueOf() - start_time.valueOf())/1000); 

//  console.log("predict ended !!!"); 

  console.log(cRes);
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
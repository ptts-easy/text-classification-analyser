import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import * as mlct from 'ml-classify-text';
import catgorys from '../../datasets/category.js';

const test_path = "./datasets/test/test.txt";
const module_path = "./src/ml-classify-text/model/model.json";

const { Classifier, Model } = mlct.default;

let classifier = {};

function setup(predict) {

  if (fs.existsSync(module_path)) {
    const data = fs.readFileSync(module_path);
    const config = JSON.parse(data);

    classifier = new Classifier();

    classifier.model = new Model(config);
    
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

//    console.log(sentences);

    for (let sentence of sentences) {
      let predictions = classifier.predict(sentence, 100, 0.0);
    
      if (predictions.length) {
        predictions.forEach(prediction => {
//          console.log(`${prediction.label} (${prediction.confidence})`)
          if(prediction.confidence > fMin) {
            fVal = fRes.get(prediction.label);
            fVal += Math.log(prediction.confidence);
            fRes.set(prediction.label, fVal);
          }
        })
      } else {
        console.log('No predictions returned')
      }
    }
  } catch (err) {
    console.log(`read "${test_path}" file failed !!!`);
    console.log(err);
  }

  const end_time = new Date();

//  console.log(fRes);


  let sorted_result = [];

  for (const [key, value] of fRes.entries()) {
    sorted_result.push({name:key, value:value});
  }

  sorted_result.sort((a, b) => b.value - a.value);

//  console.log(sorted_result);

  res_category = sorted_result[0].name;

  console.log("Classification Result  ===> ", res_category);  

  console.log("Prediction Time :", (end_time.valueOf() - start_time.valueOf())/1000); 

  console.log("predict ended !!!"); 
}

function predict_selftest() {
  console.log("ml-classify-text/predict::predict_selftest()");
}

function main() {
//  predict_selftest();

  setup(predict);
}

main();
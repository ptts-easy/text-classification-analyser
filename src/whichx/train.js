import {logProgrss} from '../util/progress-loger.js';
import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import WhichX from 'whichx';
import catgorys from '../../datasets/category.js';

const train_path = "./datasets/trains/";
const module_path = "./src/whichx/model/model.json";

let classifier = {};

function setup(train) {

  if (fs.existsSync(module_path)) {
    const data = fs.readFileSync(module_path);
    const config = JSON.parse(data);

    classifier = new WhichX();
//    classifier.addLabels(catgorys);

    classifier.import(config);
    
    console.log("model loaded !!!");
    train();
  } else {
    classifier = new WhichX();
    classifier.addLabels(catgorys);
    train();
  }
}

function train() {
  console.log("train started !!!");

  for (let catgory of catgorys) {
    const start_time = new Date();    
    try {
      const path = `${train_path}${catgory}.txt`;
      const text = fs.readFileSync(path.toString());
      const sentences = spiliter([text.toString()]);
      logProgrss(`${catgory}.txt`, "sentences", sentences.length, function(idx) {
          classifier.addData(catgory, sentences[idx]);
          return idx + 1;
        },
        function(){
          console.log(`${catgory}.txt file train complated`);
          let model = classifier.export();
          fs.writeFileSync(module_path, JSON.stringify(model));
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
  console.log("whichx/train::train_selftest()");

  var classifier = new WhichX();
  var validLabels = ["cat", "dog"];
  var dataExport;

  classifier.addLabels(validLabels);
  classifier.addData("cat", "meow purr sits on lap");
  classifier.addData("dog", "bark woof wag fetch");
  dataExport = classifier.export();

  const str_model = JSON.stringify(dataExport);

  dataExport = JSON.parse(str_model);

  classifier = new WhichX();
  classifier.import(dataExport);

  console.log(classifier.classify("who I am?"));
}

function main() {
//  train_selftest();

  setup(train);
}

main();

import {logProgrss} from '../util/progress-loger.js';
import {spiliter} from '../util/spiliter-wink-nlp.js';
import * as fs from 'fs';
import { NlpManager } from 'node-nlp';
import catgorys from '../../datasets/category.js';
import { train_path } from "../../config/config.js"

const module_path = "./src/node-nlp/model/model.nlp";

let classifier = {};

function setup(train) {

  if (fs.existsSync(module_path)) {
//    classifier.load(module_path);
    const data = fs.readFileSync(module_path, 'utf8');
    const config = JSON.parse(data);
    classifier = new NlpManager();
    classifier.import(config);
    console.log("model loaded !!!");
    train();
  } else {
    classifier = new NlpManager({ languages: ['en'], forceNER: true });
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
          classifier.addDocument('en', sentences[idx], catgory);
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

  (async() => {
    console.log("train started !!!");

    const hrstart = process.hrtime();

    await classifier.train();

    const hrend = process.hrtime(hrstart);
    console.info('Trained (hr): %ds %dms', hrend[0], hrend[1] / 1000000);

//    classifier.save(module_path);
    let model = classifier.export(true);
    fs.writeFileSync(module_path, model, 'utf8');

    console.log("train ended !!!"); 
  })();
}

function train_selftest() {
  console.log("node-nlp/train::train_selftest()");
}

function main() {
//  train_selftest();

  setup(train);
}

main();

import {selftest as nt_selftest} from './spiliter-natural.js';
import {selftest as ss_selftest} from './spiliter-sentence-splitter.js';
import {selftest as sbd_selftest} from './spiliter-sbd.js';
import {selftest as wn_selftest} from './spiliter-wink-nlp.js';

import { split_path } from "../../config/config.js"
import * as fs from 'fs';

function main() {

  if (fs.existsSync(split_path)) {
    const texts = fs.readFileSync(split_path).toString();

    nt_selftest([texts]);
    ss_selftest([texts]);
    sbd_selftest([texts]);
    wn_selftest([texts]);

  } else {
    console.log("Test data don't exist !!!");
  }
}

main();

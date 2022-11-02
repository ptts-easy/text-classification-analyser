import tokenizer from "sbd";
import { split_sentences_show, split_count_show, split_time_show, INPUT_MIN_WORDS, INPUT_MAX_WORDS } from "../../config/config.js"

const optional_options = {
  "newline_boundaries" : false,
  "html_boundaries"    : false,
  "sanitize"           : false,
  "allowed_tags"       : false,
  "preserve_whitespace" : false,
  "abbreviations"      : null
};

function texts_paser(texts) {
  if(texts == undefined) {
    return [];
  }

  let n = texts.length;

  let total_sentences = [];

  let sentences;

  for(let i = 0; i < n; i ++) {
    sentences = text_paser(texts[i]);

    if(sentences.length < 1) {
      continue;
    }

    total_sentences = total_sentences.concat(sentences);
  }

  return total_sentences;
}

function text_paser(text) {

  const sentences = tokenizer.sentences(text, optional_options);

  const choice_sentences = [];

  for (let sentence of sentences) {
    const words = sentence.split(" ");

    if(words.length < INPUT_MIN_WORDS) {
      continue;
    }

    if(words.length > INPUT_MAX_WORDS) {
      continue;
    }

    choice_sentences.push(sentence);
  }
  
  return choice_sentences;
}

export function selftest(texts) {
  console.log("================ sbd_selftest ================");

  const start_time = new Date();
  
  const sentences = texts_paser(texts);
  
  const end_time = new Date();

  if (split_sentences_show == true) {
    console.log(sentences);
  }

  if (split_count_show == true) {
    console.log(sentences.length);
  }
    
  if (split_time_show == true) {
    console.log("split time :", (end_time.valueOf() - start_time.valueOf())/1000); 
  }
}

export function spiliter(texts) {
  return texts_paser(texts);
}

import { split, Syntax } from "sentence-splitter";

const INPUT_MIN_WORDS = 5;

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

  let sentences_object = split(text);

  let sentences = [];

  for (const {type, raw} of sentences_object) {
    if(type == "Sentence")
      sentences.push(raw);
  }

  const choice_sentences = [];

  for (let sentence of sentences) {
    const words = sentence.split(" ");
//    const words = sentence.match(/\S+\s*/g);

    if(words.length < INPUT_MIN_WORDS) {
      continue;
    }

    choice_sentences.push(sentence);
  }
  
  return choice_sentences;
}

export function spilitr_selftest() {
  console.log("spilitr_selftest");

  const sentences = texts_paser([
    "This is book. That is book and notebook. That is desk and chair",
"The recovery and assimilation of \
Greek works and Islamic inquiries into Western Europe from the 10th to 13th \
century revived \"natural philosophy\",[7][9] which was later transformed by the Scientific \
Revolution that began in the 16th century[10] as new ideas and discoveries departed from previous \
Greek conceptions and traditions.[11][12] The scientific method soon played a greater role in knowledge \
creation and it was not until the 19th century that many of the institutional and professional features of \
science began to take shape;[13][14] along with the changing of \"natural philosophy\" to \"natural science\""
    ]);

  console.log(sentences);

}

export function spiliter(texts) {
  return texts_paser(texts);
}

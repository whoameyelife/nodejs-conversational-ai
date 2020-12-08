//Fetching the data from the text file synchronously
import * as fs from "fs";
import fetch from "node-fetch";
import { API_KEY } from "./config.js";

const getTextDetail = async (text, count) => {
  let output = [];
  let synonyms = [];
  return await fetch(
    `https://dictionary.yandex.net/api/v1/dicservice.json/lookup?key=${API_KEY}&lang=en-en&text=${text}`
  )
    .then((res) => res.json())
    .then((json) => {
      let textData, textSynonyms;
      if (json["def"].length !== 0) {
        textData = { ...json["def"] };
        if (textData["0"].tr) {
          textSynonyms = textData["0"].tr;
        }

        textSynonyms.map((textObj) => {
          if (textObj.syn !== undefined) {
            textObj.syn.map((synonym) => {
              synonyms.push(synonym.text);
            });
          }
        });

        console.log("Text: ", text.toUpperCase());
        console.log("Part Of Speech: ", textData["0"]["pos"]);
        console.log("Occurences: ", count);
        console.log("Synonyms: ", synonyms, "\n");
        console.log("------------------------------- \n");
      } else {
        console.log("Text:", text.toUpperCase());
        console.log("Part Of Speech: Not Available");
        console.log("Occurences: ", count);
        console.log("Synonyms: Not Available \n");
        console.log("------------------------------- \n");
      }
    });
};
try {
  let data = fs.readFileSync("Data.txt", "utf-8");
  let lineArray = data.split("\n").filter((a) => a.length !== 0);
  let mappedText = {};
  lineArray.map((line, index) => {
    let textsArray = line.split(" ");
    textsArray.map((text, index) => {
      let filteredText = text.toLowerCase().replace(/[^a-zA-Z]/g, "");
      if (filteredText.length > 5) {
        if (filteredText in mappedText) {
          mappedText[filteredText] = mappedText[filteredText] + 1;
        } else {
          mappedText[filteredText] = 1;
        }
      }
      return true;
    });
    return true;
  });

  let result = Object.assign(
    ...Object.entries(mappedText)
      .sort(({ 1: a }, { 1: b }) => b - a)
      .slice(0, 10)
      .map(([c, d]) => ({ [c]: d }))
  );

  Object.entries(result).forEach((entry) => {
    const [key, value] = entry;
    getTextDetail(key, value);
  });
} catch (e) {
  console.log("Error: ", e.stack);
}

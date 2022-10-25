const functions = require("firebase-functions");
var FormData = require("form-data");
const axios = require("axios");
const fs = require("fs");
const { remove_background } = require("./remove_background");

// Create and Deploy Your First Cloud Functions
// https://firebase.google.com/docs/functions/write-firebase-functions

const testImageUrl =
  "https://firebasestorage.googleapis.com/v0/b/vc-development-44703.appspot.com/o/top.jpg?alt=media&token=77dba186-29c7-451e-8b90-0e0d24e92e01";
const slazzerApikey = "";

exports.helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", { structuredData: true });
  response.send("Hello from Firebase!");
});

exports.test_remove_background = functions.https.onCall(() => {
  console.log("test_remove_background");
});
// Takes an image Url, removes the background then returns the new image as a base 64 string
exports.removeBackground = functions.https.onCall(({ imageurl }, context) => {
  var bodyFormData = new FormData();
  const apiKey = "4e22a20ed93a49de9fd1b2abac402f3f";
  const settings = {
    url: "https://api.slazzer.com/v2.0/remove_image_background",
    apiKey: apiKey,
    imageurl: imageurl,
    outputImagePath: "output.jpg",
  };
  bodyFormData.append("source_image_url", testImageUrl);
  return axios({
    method: "post",
    url: settings.url,
    data: bodyFormData,
    headers: { "API-KEY": settings.apiKey },
  })
    .then(function (response) {
      //handle success
      console.log(response);
      const body = response.data;
      if (response.statusCode != 200) {
        return {
          message:
            "Error: There was an error not caught by exception but here you go",
        };
      }
      // fs.writeFileSync(settings.outputImagePath, body);
      return {
        message: "Success",
        response: response,
      };
    })
    .catch(function (response) {
      //handle error
      console.log("Errrooooooooor", response);
      return response;
    });
});

/* eslint-disable no-console */
import axios from "axios"
import config from "./config"


function report_end(token, cb) {
  axios
  .post(config.host + "/webview/report", {
    action: "endplay",
    token: token
  })
  .then(response => {
    log(response)
    if (cb) {
      cb()
    }
  })
}

function choose(choices) {
  var index = Math.floor(Math.random() * choices.length);
  return choices[index];
}

function log(message) {
  if(window.playin_debug) {
    console.log(message)
  }
}

export {
  report_end,
  choose,
  log
}
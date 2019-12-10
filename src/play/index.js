/* eslint-disable no-console */
import axios from "axios";
import { play_ios } from "./ios_play";
import { log } from "../ext/functions";


function init(target_id, ad_id, options, comp) {
  log("play init...")
  const requesturl = "https://playinads.com/webview/play"
  axios.post(requesturl, {
    ad_id: ad_id
  })
    .then(response => {
      if (response.data.code !== 0) {
        console.log("no device available")
        options.playError && options.playError("no device available");
        return;
      }
      var token = response.data.data.token;
      comp.play_token = token;
      comp.$store.dispatch("set_play_token", token);
      comp.duration = response.data.data.duration;
      // var width = response.data.data.device_width;
      // var height = response.data.data.device_height;
      comp.app_url = response.data.data.app_url;
      comp.comments_count = response.data.data.comments_count;
      comp.audience = response.data.data.audience;
      comp.app_rate = response.data.data.app_rate;
      comp.game_title = response.data.data.app_name;
      console.log("game: " + comp.game_title);
      comp.game_icon = response.data.data.icon_url;

      if (response.data.data.orientation === 0)
        comp.$store.dispatch("screen_portrait");
      else
        comp.$store.dispatch("screen_landscape");
      var ios = false;
      if (response.data.data.os_type === 1) {
        ios = true
      }
      if (!ios) {
        comp.grey_token = response.data.data.token;
        comp.webrtc_address =
          "wss://" + response.data.data.stream_server_ip;
        log("grey_token: " + comp.grey_token);
        log("webrtc_address: " + comp.webrtc_address);
        comp.grey_play = true;
      } else {
        window.player = play_ios(
          "wss://" +
          response.data.data.stream_server_domain +
          ":20092/websocket",
          token,
          target_id,
          function onSourceEstablished() {
            setTimeout(() => {
              // !window.play_end && options.playReady && options.playReady()
              if (window.play_end) return;
              comp.$store.dispatch("prepared")
              comp.$store.dispatch("start_play")
              comp.start_timer();
            }, 1000);
          },
          function onEnd() {
            window.play_end = true
            comp.end_play()
            options.playEnd && options.playEnd()
          },
          null,
          ios
        );
      }
    });
}

export {
  init
}
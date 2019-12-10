<template>
  <div id="play_screen"></div>
</template>


<script>
import { log } from "../../ext/functions.js";
import GreyManager from "./g.js";
require("./g.css");

export default {
  props: {
    webrtc_address: String,
    gray_token: String,
    player_dom_id: String
  },
  methods: {
    destroy() {
      if (this.rtc_report) {
        clearInterval(this.rtc_report);
        delete this.rtc_report;
      }
      if (this.g_instance) {
        try {
          this.g_instance.close();
          delete this.g_instance;
        } catch (error) {
          log(error);
          if (window.gwebsocket) {
            try {
              window.gwebsocket.close();
              delete window.gwebsocket;
            } catch (error) {
              log(error);
            }
          }
          if (window.gwebrtc_connection) {
            try {
              window.gwebrtc_connection.close();
              delete window.gwebrtc_connection;
            } catch (error) {
              log(error);
            }
          }
          if (window.gwebrtc_datachannel) {
            try {
              window.gwebrtc_datachannel.close();
              delete window.gwebrtc_datachannel;
            } catch (error) {
              log(error);
            }
          }
          this.$store.dispatch("close_play");
        }
      }
    },
  },
  created() {
    log("wa: " + this.webrtc_address);
    log("token: " + this.grey_token);
    if (!this.grey_manager)
      this.grey_manager = new GreyManager();
      log(this.grey_manager)
  },
  mounted() {
    var fileUploadAddress = this.webrtc_address + "/fileupload/";
    var options = {
      token: this.grey_token,
      paas: true,
      template: "god_simple",
      touch: true,
      mouse: true,
      fullscreen: true
    };
    log(this.player_dom_id);
    this.g_instance = this.grey_manager.add(
      document.getElementById(this.player_dom_id),
      this.webrtc_address,
      fileUploadAddress,
      options
    );
  },
  beforeDestroy() {
    this.destroy();
  }
};
</script>


<style>
</style>

<template>
  <div class="playinbody">
    <CloseButton v-if="closebtn" ref="closebtn" v-bind:play_token="play_token" />
    <DownloadModal
      v-if="download_modal"
      :app_rate="app_rate"
      :game_title="game_title"
      :game_icon="game_icon"
      :audience="audience"
      :comments_count="comments_count"
    />
    <div id="mirror"></div>
    <GPlay
      ref="gplay"
      v-if="grey_play"
      :webrtc_address="webrtc_address"
      :grey_token="play_token"
      player_dom_id="mirror"
      @close="on_webrtc_close"
    />
  </div>
</template>

<script>
import { init } from "./play/index";
import CloseButton from "./components/play/CloseButton.vue";
import DownloadModal from "./components/play/DownloadModal.vue";
import GPlay from "./components/g/Play.vue";
import { log } from "./ext/functions";
require("./app.css");

export default {
  name: "app",
  props: {
    ad_id: String,
    options: Object
  },
  components: {
    CloseButton,
    DownloadModal,
    GPlay
  },
  data: function() {
    return {
      viewport: "width=368, user-scalable=no",
      app_rate: "",
      game_title: "",
      game_icon: "",
      audience: "",
      comments_count: "",
      play_token: "",
      duration: 50,
      grey_play: false,
      download_modal: this.$props.options.download_modal,
      closebtn: this.$props.options.closebtn
    };
  },
  created() {
    if (window.play_end) return;
    if (!window.on_webrtc_open) window.on_webrtc_open = this.on_webrtc_open;
    if (!window.on_webrtc_close) window.on_webrtc_close = this.on_webrtc_close;
    init("mirror", this.$props.ad_id, this.$props.options, this);
  },
  metaInfo() {
    return {
      title: this.title,
      meta: [{ charset: "utf-8" }, { name: "viewport", content: this.viewport }]
    };
  },
  mounted() {
    const v_h = 667;
    const v_w = 375;
    const v_rate = v_h / v_w;
    var real_rate = window.innerHeight / window.innerWidth;
    if (v_rate >= real_rate) {
      this.viewport = "height=667, user-scalable=no";
    }
  },
  methods: {
    start_timer() {
      if(!this.$props.options.closebtn) return;
      var minDuration = 30;
      if (this.$props.options && this.$props.options.minDuration)
        minDuration = this.$props.options.minDuration;
      this.$refs.closebtn.start_timer(this.duration, minDuration);
    },
    end_play() {
      this.$store.dispatch("close_play");
    },
    on_webrtc_open() {
      log("webrtc opened.");
      this.$store.dispatch("prepared");
      this.$store.dispatch("start_play");
      this.start_timer();
    },
    on_webrtc_close() {
      this.end_play()
    }
  }
};
</script>

<style>
#mirror {
  position: fixed;
  left: 0;
  text-align: center;
  width: 100%;
}
</style>

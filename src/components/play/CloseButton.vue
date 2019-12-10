<template>
  <div
    class="disable-select"
    v-on:click="close"
    v-bind:class="{closebtn0:this.orientation==0, closebtn1:this.orientation==1}"
  >{{global_count_str}}|{{skip_count_str}}</div>
</template>

<script>
import axios from "axios";
import { log } from "../../ext/functions";

export default {
  methods: {
    close() {
      if (this.closable) {
        this.$store.dispatch("close_play")
      } else {
        log("canut close.");
      }
    },
    start_timer(duration, minDuration) {
      this.count = duration;
      this.skip_count = minDuration;
      this.timer = setInterval(() => {
        if (this.count > 1) {
          this.count = this.count - 1;
          this.global_count_str = "" + this.count + "s";
        } else {
          this.global_count_str = "X";
          this.$store.dispatch("close_play")
          clearInterval(this.timer);
        }
        if (this.skip_count > 1) {
          this.skip_count--;
          this.skip_count_str = "SkipAd(" + this.skip_count + "s)";
        } else {
          this.skip_count_str = "SkipAd";
          this.$store.dispatch("enable_closable")
        }
      }, 1000);
    }
  },
  props: {
    play_token: String,
  },
  computed: {
    orientation() {
      return this.$store.state.orientation
    },
    closable() {
      return this.$store.state.closable
    }
  },
  data() {
    return {
      count: "",
      skip_count: 30,
      global_count_str: "",
      skip_count_str: ""
    };
  },
  created() {},
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = undefined;
    }
  }
};
</script>

<style scoped>
.closebtn0 {
  position: fixed;
  top: 30px;
  right: 50px;
  width: auto;
  height: 30px;
  background-position: center;
  vertical-align: middle;
  color: #ffffff;
  background-color: #000000;
  text-align: center;
  line-height: 30px;
  opacity: 0.5;
  z-index: 1000;
}

.closebtn1 {
  position: fixed;
  bottom: 60px;
  right: -20px;
  width: auto;
  height: 30px;
  background-position: center;
  vertical-align: middle;
  color: #ffffff;
  background-color: #000000;
  text-align: center;
  line-height: 30px;
  transform: rotate(90deg);
  opacity: 0.5;
  z-index: 1000;
}
</style>
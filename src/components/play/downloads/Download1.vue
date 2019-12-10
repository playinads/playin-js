<template>
    <div>
      <div v-show="show_wrapper" class="wrapper" v-on:click="install"></div>
      <div v-show="show_installbtn" v-bind:class="orientation==0 ? installdiv0 : installdiv1">
          <button v-bind:class="orientation==0 ? installbtn0: installbtn1" v-on:click="install"><b>INSTALL NOW</b></button>
      </div>
    </div>
</template>

<script>
import { report_end, log } from "../../../ext/functions.js";
export default {
  props: {
    app_rate: String,
    game_title: String,
    game_icon: String,
    audience: String,
    comments_count: Number,
    app_url: String
  },
  methods: {
    install() {
      log("install: " + this.app_url)
      report_end(this.$store.state.play_token,()=> {window.location.href = this.app_url})
    }
  },
  data() {
    return {
      show_wrapper: false,
      show_installbtn: false,
      installdiv0: "installdiv0",
      installdiv1: "installdiv1",
      installbtn0: "installbtn0",
      installbtn1: "installbtn1",
    }
  },
  created() {
    this.$store.watch(
      (state, getters) => state.closable,
      (value, oldvalue) => {
        if(value) {
          this.show_installbtn = true
          setTimeout(()=>{
            this.show_wrapper = true
          }, 3000)
        }
      }
    )
    this.$store.watch(
      (state, getters) => state.closing,
      (value, oldvalue) => {
        if(value) {
          this.show_wrapper = true
        }
      }
    )
  },
  computed: {
    orientation() {
      return this.$store.state.orientation
    },
  }
}
</script>


<style scoped>
.wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  z-index: 9999;
}

.installdiv0 {
    position: fixed;
    bottom: 8%;
    width: 100%;
    text-align: center;
}

.installbtn0 {
    border: black;
    border-width: 1px;
    background-color: #0bb8a0;
    color: white;
    font-size: 25px;
    font-family: 'Aria', Helvetica, monospace;
    text-shadow: 0px 1px black;
    height: 70px;
    border-radius: 35px;
    border: 7px solid #11e2cb;
    box-shadow: 0px 8px 0px 0px #0c7e76;
    width: 230px;
    animation: scale 2s linear infinite;
}
.installdiv1 {
    position: fixed;
    width: 230px;
    left: -50px;
    top: calc(50% - 50px);
    text-align: center;
    transform: rotate(90deg);
}

.installbtn1 {
    border: black;
    border-width: 1px;
    background-color: #0bb8a0;
    color: white;
    font-size: 25px;
    font-family: 'Aria', Helvetica, monospace;
    text-shadow: 0px 1px black;
    height: 70px;
    border-radius: 35px;
    border: 7px solid #11e2cb;
    box-shadow: 0px 8px 0px 0px #0c7e76;
    width: 230px;
    animation: scale 2s linear infinite;
}
/* @keyframes scale {
  50% {
    -webkit-transform:scale(1.2);
    -moz-transform:scale(1.2);
    -ms-transform:scale(1.2);
    -o-transform:scale(1.2);
    transform:scale(1.2);
  }
} */
</style>
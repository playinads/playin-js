<template>
  <div>
    <button
      ref="downloadbtn"
      v-bind:class="{downloadbtn0: !rotate90, downloadbtn1: rotate90}"
      v-on:click="open"
    ></button>

    <transition name="mask">
      <div class="modal-mask" v-on:click="close" v-show="showmodal">
        <div class="modal-wrapper">
          <div :class="{rotate90, rotate_wrap: true}">
            <transition v-bind:name="transitionName">
              <div
                ref="modal"
                :class="{'modal-container': !rotate90, 'modal-container1': rotate90}"
                :style="{right: offset}"
                @click.stop
                v-show="showmodal"
              >
                <div class="modal-body">
                  <slot name="body">
                    <div ref="game_icon" class="game_icon_div">
                      <img v-bind:src="game_icon" />
                    </div>
                    <div class="body_right">
                      <div class="game_title">{{game_title}}</div>
                      <div class="body_right_middle">{{audience}}</div>
                      <div class="body_right_bottom">
                        <span>
                          <img
                            class="smallicon"
                            src="https://playinads.com/static/img/star.a4503eac.jpg"
                          />
                          {{app_rate}}
                        </span>
                        <span>
                          <img
                            class="smallicon"
                            src="https://playinads.com/static/img/man.92b90c2a.jpg"
                          />
                          {{comments_count}}
                        </span>
                        <button class="install_btn" v-on:click="install">Install</button>
                      </div>
                    </div>

                    <div class="modal_body_bottom">
                      <hr />
                      <slot name="footer">
                        <img
                          class="playinicon"
                          src="https://playinads.com/static/img/playinlogo.f32fe723.jpg"
                        />
                      </slot>
                    </div>
                  </slot>
                </div>

                <div class="modal-footer">
                  <div
                    class="disable-select"
                    v-bind:class="{continue_text0: !rotate90, continue_text1: rotate90}"
                    v-on:click="close"
                  >tap to continue</div>
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
import { report_end } from "../../ext/functions.js";

export default {
  methods: {
    close() {
      if (this.$store.state.playing) {
        this.$store.dispatch("close_modal");
      } else {
        this.$store.dispatch("close_play");
      }
    },
    open() {
      if (this.rotate90)
        this.offset = "-" + (window.innerHeight - window.innerWidth) / 2 + "px";
      this.$store.dispatch("open_modal");
    },
    install() {
      this.$store.dispatch("install");
      report_end(this.$store.state.play_token);
    }
  },
  props: {
    app_rate: String,
    game_title: String,
    game_icon: String,
    audience: String,
    comments_count: Number,
    app_url: String
  },
  data() {
    return {
      offset: "0"
    };
  },
  computed: {
    showmodal() {
      return this.$store.state.show_modal;
    },
    orientation() {
      return this.$store.state.orientation;
    },
    rotate90() {
      if (this.$store.state.orientation === 0) return false;
      else return true;
    },
    transitionName() {
      if (this.orientation === 0) return "modal";
      else return "modal1";
    }
  },
  created() {
    this.$store.watch(
      (state, getters) => state.playing,
      (value, oldvalue) => {
        if (!value) {
          this.open();
        }
      }
    );
  },
  mounted() {}
};
</script>

<style scoped>
.downloadbtn0 {
  background-color: #fc5f45;
  height: 130px;
  width: 12px;
  position: fixed;
  right: -6px;
  border-radius: 12px;
  border: 0px;
  top: calc(50% - 65px);
  z-index: 9997;
}
.downloadbtn1 {
  background-color: #fc5f45;
  height: 16px;
  width: 130px;
  position: fixed;
  bottom: -6px;
  border-radius: 12px;
  border: 0px;
  right: calc(50% - 65px);
  z-index: 9997;
}

.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: table;
  transition: all 500ms ease;
}

.continue_text0 {
  position: fixed;
  bottom: 25%;
  left: calc(50% - 50px);
  z-index: 9999;
  width: 100%;
  height: 50px;
  color: white;
}

.continue_text1 {
  position: fixed;
  bottom: -80px;
  left: calc(50% - 50px);
  z-index: 9999;
  width: 100%;
  height: 50px;
  color: white;
}

.modal-wrapper {
  /* display: table-cell; */
  position: fixed;
  /* padding: 0; */
  height: 100%;
  width: 100%;
  /* text-align: center;
  vertical-align: middle; */
}

.modal-container {
  position: absolute;
  top: calc(50% - 65px);
  width: 80%;
  right: 0;
  margin-right: 0;
  height: 130px;
  margin: 0;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 500ms ease;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 5px 0 0 5px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 0px;
  padding-bottom: 5px;
  border-left: 10px solid #fc5f45;
}

.modal-container1 {
  position: fixed;
  bottom: calc(50% - 65px);
  width: 338px;
  margin-right: 0;
  height: 130px;
  margin: 0;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.33);
  transition: all 500ms ease;
  font-family: Helvetica, Arial, sans-serif;
  border-radius: 5px 0 0 5px;
  padding-left: 15px;
  padding-right: 15px;
  padding-top: 0px;
  padding-bottom: 5px;
  border-left: 10px solid #fc5f45;
}

.rotate_wrap {
  width: 100%;
  height: 100%;
  position: relative;
}

.rotate90 {
  transform: rotate(90deg);
  /* transition: tranform 1ms; */
}

.modal-body {
  margin: 0 0 0 0;
  display: block;
  min-height: 80%;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */
.mask-leave-active {
  /* transform: rotate(90deg); */
  transition: all 500ms ease;
}
.mask-enter {
  transition: all 500ms ease;
}

.modal-leave-active {
  transform: translateX(98%);
}

.modal-enter {
  transform: translateX(98%);
}

.modal1-leave-active {
  transform: translateX(98%);
}

.modal1-enter {
  transform: translateX(98%);
}

.smallicon {
  width: 13px;
}

.game_icon_div {
  display: inline-block;
  width: 30%;
  height: 100px;
}
.game_icon_div img {
  max-width: 80px;
  border-radius: 8px;
  margin: 10px;
}

.body_right {
  display: inline-block;
  height: 100px;
  margin: 0;
  width: 70%;
  position: absolute;
  padding-top: 20px;
}

.game_title {
  margin-left: 10px;
  height: 20px;
  position: relative;
  top: 0px;
  font-weight: bolder;
}

.body_right_middle {
  position: relative;
  top: 10px;
  height: 10px;
  font-size: 1em;
  margin-left: 10px;
  color: darkgray;
}

.body_right_bottom {
  /* display: block; */
  position: relative;
  top: 35px;
  height: 25px;
  /* top: 30px; */
  width: 100%;
  margin-left: 10px;
}

.modal_body_bottom {
  display: block;
  position: absolute;
  bottom: 0;
  width: 90%;
}

.install_btn {
  position: absolute;
  background-color: #fc5f45;
  color: #fff;
  font-weight: bold;
  bottom: 10px;
  height: 30px;
  width: 60px;
  border-radius: 20px;
  right: 10px;
  border: 0px;
}

.playinicon {
  height: 20px;
}
</style>
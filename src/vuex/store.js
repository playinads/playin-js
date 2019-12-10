/* eslint-disable */
import Vuex from "vuex"
import Vue from "vue"
import { report_end, log } from "../ext/functions";

Vue.use(Vuex)


/*
ready

end

*/
const store = new Vuex.Store({
  state: {
    show_modal: false,
    playing: false,
    orientation: 0,
    prepared: false,
    android: false,
    closable: false,
    closing: false,
    play_token: "",
    play_audio_mute: false,
    client_android: false
  },
  getters: {
    orientation: state => state.orientation,
  },
  mutations: {
    switch_modal(state, status) {
      log("show_modal: " + status)
      state.show_modal = status
    },
    switch_playing_status(state, status){
      state.playing = status
    },
    change_orientation(state, orientation) {
      state.orientation = orientation
    },
    unprepared(state) {
      state.prepared = false
    },
    prepared(state) {
      state.prepared = true
    },
    clear_play_status(state) {
      state.show_modal= false
      state.prepared = false
      state.playing = false
      state.closabel = false
      state.closing = false
    },
    set_platform(state, android) {
      state.android = android
    },
    set_client_platform(state, client_android) {
      state.client_android = client_android
    },
    set_closable(state, closable){
      state.closable = closable
    },
    close_play(state) {
      report_end(state.play_token)
      state.closing = true
      state.playing = false
    },
    close_play_with_redirect(state) {
      state.closing = true
      state.playing = false
      report_end(state.play_token, ()=>{})
    },
    set_play_token(state, token) {
      state.play_token = token
    },
    audio_control(state, muted) {
      state.play_audio_mute = muted
    }
  },
  actions: {
    open_modal({ commit }) {
      commit('switch_modal', true)
    },
    close_modal({ commit }) {
      commit('switch_modal', false)
    },
    report_endplay({commit}) {

    },
    start_play({commit}) {
      log("start play")
      commit('switch_playing_status', true)
    },
    end_play({commit}) {
      window.play_options && window.play_options.playEnd && window.play_options.playEnd();
      window.play_end = true
      commit('switch_playing_status', false)
    },
    screen_portrait({commit}) {
      commit("change_orientation", 0)
    },
    screen_landscape({commit}) {
      commit("change_orientation", 1)
    },
    clear_play_status({commit}) {
      commit("clear_play_status")
    },
    prepared({commit}) {
      !window.play_end && window.play_options && window.play_options.playReady && window.play_options.playReady();
      commit("prepared")
    },
    unprepared({commit}) {
      commit("unprepared")
    },
    set_platform_android({commit}) {
      commit("set_platform", true)
    },
    set_platform_ios({commit}) {
      commit("set_platform", false)
    },
    set_client_platform_android({commit}, android_client) {
      commit("set_client_platform", true)
    },
    enable_closable({commit}) {
      commit("set_closable", true)
    },
    close_play({commit}) {
      window.play_options && window.play_options.playEnd && window.play_options.playEnd();
      window.play_end = true
      commit("close_play")
    },
    close_play_with_redirect({commit}) {
      commit("close_play_with_redirect")
    },
    set_play_token({commit}, token) {
      commit("set_play_token", token)
    },
    mute_audio_control({commit}) {
      commit("audio_control", true)
    },
    unmute_audio_control({commit}) {
      commit("audio_control", false)
    },
    install({commit}) {
      window.play_options && window.play_options.install && window.play_options.install();
    }
  }
})

export default store
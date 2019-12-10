/* eslint-disable no-console */
import { mount } from "./touch";
import {JSMpeg} from "./jsmpeg.min.js";

function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;

    for (let arr of arrays) {
        totalLength += arr.length;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.length;
    }
    return result;
}


function str2ab(str) {
    var bufView = new Uint8Array(str.length);
    for (var i = 0, strLen = str.length; i < strLen; i++) {
        bufView[i] = str.charCodeAt(i);
    }
    return bufView;
}

function android_pre_send(socket){
    var pack_type = new Uint8Array(1)
    pack_type[0] = 2
    var stream_type = new Uint8Array(1)
    stream_type[0] = 6
    var msg_length_ab = new ArrayBuffer(4);
    var view = new DataView(msg_length_ab, 0, 4);
    var msg_body = str2ab("");
    view.setUint32(0,msg_body.byteLength + 1, true);
    var msg_length = new Uint8Array(msg_length_ab);
    var ab = concatenate(Uint8Array, pack_type, msg_length, stream_type, msg_body);
    socket.send(ab)
}


window.AudioContext = window.AudioContext||window.webkitAudioContext;
const audioContext = new AudioContext();
var audioStack = [];
var nextTime = 0;
function scheduleBuffers() {
    // console.log("scheduleBuffers: " + audioStack.length)
    while ( audioStack.length) {
        var buffer = audioStack.shift();
        var source = audioContext.createBufferSource();
        source.buffer = buffer;
        source.connect(audioContext.destination);
        if (nextTime == 0)
            nextTime = audioContext.currentTime + 0.01; /// add 50ms latency to work well across systems - tune this if you like
        if(audioContext.currentTime > nextTime + 0.06) {
            nextTime = audioContext.currentTime + 0.01;
        }
        source.start(nextTime);
        nextTime+=source.buffer.duration
    }
}


var isUnlocked = false;
window.addEventListener('touchstart', function() {
    if(isUnlocked) {
        return
    }
    var buffer = audioContext.createBuffer(1, 1, 22050);
    var empty_source = audioContext.createBufferSource();
    empty_source.buffer = buffer;
    empty_source.connect(audioContext.destination);
    empty_source.start(0);
    this.setTimeout(function(){
        if((empty_source.playbackState === empty_source.PLAYING_STATE || empty_source.playbackState === empty_source.FINISHED_STATE))
            isUnlocked = true;
    }, 0);
}, false)

function play_ios(url, token, div_id, onSourceEstablished, onEnded, component, ios=true) {
    var player = null;
    const type = new Int8Array(1);
    type[0] = 1;

    const length = new Int8Array(4);
    length[0] = 6;

    const identifier = new Int8Array(4);
    identifier[0] = 0;

    const msgid = new Int8Array(2);
    msgid[1] = 0x01;
    msgid[0] = 0x02;

    let msg = str2ab(JSON.stringify({
        "token": token,
        "device_name": "playinjs",
        "device_id": "playinjs",
        "width": 376,
        "height": 668,
        "coder": "mpegts"
    }))
    length[0] += msg.length;
    const buf2 = concatenate(Int8Array, type, length, identifier, msgid, msg);


    var div_canvas = document.getElementById(div_id);
    var canvas = document.createElement('canvas');

    div_canvas.appendChild(canvas);

    JSMpeg.Source.WebSocket.prototype.onOpen = function () {
        this.progress = 1;
        // this.socket.binaryType = 'arraybuffer';
        this.socket.send(buf2);
        if(!ios)
            android_pre_send(this.socket)
    };
    JSMpeg.Source.WebSocket.prototype.onMessage = function (ev) {
        var isFirstChunk = !this.established;
        this.established = true;
        var d = null;
        var socket_data = new Int8Array(ev.data)
        var data_type = socket_data[0];

        if (data_type == 1){
            var ab = ev.data.slice(11);
            var string = new TextDecoder("utf-8").decode(ab);
            var data_json = JSON.parse(string);
            if (data_json.code !== 0){
                onEnded();
            }
        }else {
            if(socket_data[5] === 3){
                var audioData = socket_data.slice(6);
                var a16 = new Int16Array(audioData.buffer)
                var floats = new Float32Array(a16.length);
                a16.forEach(function (sample, i) {
                    floats[i] = sample / 0x7FFF;
                    if (floats[i]  > 1) floats[i]  = 1;
                    if (floats[i]  < -1) floats[i]  = -1;
                });
                var audioBuffer = audioContext.createBuffer(1, floats.length, 22050)
                audioBuffer.getChannelData(0).set(floats)
                audioStack.push(audioBuffer);
                scheduleBuffers();
                return;
            }
            if (socket_data[5] != 11){
                return
            }
            d = ev.data.slice(6);
            if (this.destination) {
                this.destination.write(d);
            }
        }
        if (isFirstChunk && this.onEstablishedCallback) {
            this.onEstablishedCallback(this);
        }
    };
    player = new JSMpeg.Player(url, {canvas: canvas, protocols: "binary", onSourceEstablished: onSourceEstablished, onEnded: onEnded});
    mount(canvas, player.source.socket);
    window.player = player
    return player;
}
export {play_ios};
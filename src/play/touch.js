/* eslint-disable no-console */
import { log } from "../ext/functions";
var mousedown = false;
var mouseevent = false;
const canvas_width = 376;
const canvas_height = 668;
var touches_id = [];
var first_touch = true;
var android = false;


function get_id_from_identifier(touch_identifiler){
    var i = 0;
    for (;i < touches_id.length; i++ ) {
        if (touches_id[i] === touch_identifiler)
            return i;
    }
    return store_touch_identifier(touch_identifiler);
}

function store_touch_identifier(touch_identifier) {
    var i = 0;
    for(;i < touches_id.length; i++ ) {
        if(!touches_id[i]){
            touches_id[i] = touch_identifier
            return i;
        }
    }
    touches_id.push(touch_identifier)
    return i;
}

function concatenate(resultConstructor, ...arrays) {
    let totalLength = 0;

    for (let arr of arrays) {
        totalLength += arr.byteLength;
    }
    let result = new resultConstructor(totalLength);
    let offset = 0;
    for (let arr of arrays) {
        result.set(arr, offset);
        offset += arr.byteLength;
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

function handleTouchEvent(event) {
    if (first_touch) {
        android = event.changedTouches[0].identifier !== 0 ? false : true;
        first_touch = false
        log("chrome touch: " + android );
    }
    if (!player)
        var player = window.player
    if (!player){
        console.log("player not init.")
        return
    }
    event.preventDefault();
    var touch_type = "0";
    switch (event.type){
        case "touchstart":
            touch_type = "0";
            mouseevent = false;
            break;
        case "mousedown":
            touch_type = "0";
            mousedown = true;
            mouseevent = true;
            break;
        case "mousemove":
            if (!mousedown)
            return;
            mouseevent = true;
            mouseevent = true;
            touch_type = "1";
            break;
        case "touchmove":
            touch_type = "1";
            mouseevent = false;
            break;
        case "mouseup":
            touch_type = "2";
            mousedown = false;
            mouseevent = true;
            break;
        case "touchend":
            touch_type = "2";
            mouseevent = false;
            break;
    }
    var touch_event = null;
    var x, y;
    var changed_id = null;
    var data = {}
    if (mouseevent || ((event.changedTouches) && event.changedTouches.length > 0)) {
        if (mouseevent){
            touch_event = event;
            changed_id = 0;
        } else {
            touch_event = event.changedTouches[0];
            changed_id = android ? touch_event.identifier : get_id_from_identifier(touch_event.identifier);
            var i;
            for(i=0; i< event.touches.length; i++){
                var touch = event.touches.item(i)
                var touch_id = android ? touch.identifier : get_id_from_identifier(touch.identifier)
                if(touch_id !== changed_id) {
                    x = (touch.clientX - this.rect.left) / (canvas_width);
                    y = (touch.clientY - this.rect.top) / (canvas_height);
                    data[touch_id] =  "" + x.toFixed(4) + "_" + y.toFixed(4) +  "_1_0_0";
                }
            }
        }
        x = (touch_event.clientX - this.rect.left) / (canvas_width);
        y = (touch_event.clientY - this.rect.top) / (canvas_height);
        data[changed_id] =  "" + x.toFixed(4) + "_" + y.toFixed(4) +  "_" + touch_type + "_0_0";
    }
    if(touch_type == "2") {
        delete touches_id[changed_id]
    }
    var msg_type = new Uint8Array(1);
    msg_type[0] = 2;
    var msg_body = str2ab(JSON.stringify(data));
    var msg_length_ab = new ArrayBuffer(4);
    var view = new DataView(msg_length_ab, 0, 4);
    view.setUint32(0,msg_body.byteLength + 1, true);
    var msg_length = new Uint8Array(msg_length_ab);
    var ios_packet_type = new Uint8Array(1);
    ios_packet_type[0] = 0;
    var ab = concatenate(Uint8Array, msg_type, msg_length, ios_packet_type, msg_body);
    if (player != null && player.source.socket != null) {
        player.source.socket.send(ab);
    }
}

function handlegesture(event) {
    event.preventDefault();
}

function mount(node, socket) {
    var rect = node.getBoundingClientRect();
    node.addEventListener("touchstart", handleTouchEvent.bind({rect: rect, socket: socket}), false)
    node.addEventListener("touchmove", handleTouchEvent.bind({rect: rect, socket: socket}), false)
    node.addEventListener("touchend", handleTouchEvent.bind({rect: rect, socket: socket}), false)
    node.addEventListener("gesturestart", handlegesture, false)
    node.addEventListener("gesturechange", handlegesture, false)
    node.addEventListener("gestureend", handlegesture, false)
}

export {
    mount
}
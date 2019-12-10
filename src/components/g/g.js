/* eslint-disable */
function Grey() {
    return function o(a, s, c) {
        function l(t, e) {
            if (!s[t]) {
                if (!a[t]) {
                    var n = "function" == typeof require && require;
                    if (!e && n) return n(t, !0);
                    if (d) return d(t, !0);
                    var r = new Error("Cannot find module '" + t + "'");
                    throw r.code = "MODULE_NOT_FOUND", r
                }
                var i = s[t] = {
                    exports: {}
                };
                a[t][0].call(i.exports, function (e) {
                    return l(a[t][1][e] || e)
                }, i, i.exports, o, a, s, c)
            }
            return s[t].exports
        }
        for (var d = "function" == typeof require && require, e = 0; e < c.length; e++) l(c[e]);
        return l
    }({
        1: [function (e, t, n) {
            "use strict";
            e("adapterjs");
            var R = e("loglevel"),
                I = e("./plugins/Lagometer");
            t.exports = function (root, webrtcAddress, fileupload_address, template, token, o, a, gapps_available, c) {
                var geny_instance = this,
                    d = [],
                    u = "";
                this.template = template, this.token = token, this.useRedis = !0, this.openGappsAvailable = gapps_available, this.initialized = !1, this.reconnecting = !1, this.keyboardEventsAreEnabled = !1, this.touchEventsAreEnabled = !1, this.mouseEventsAreEnabled = !1, this.lagometerIsEnabled = !1;
                var websocket = null;
                window.gwebsocket = websocket;
                this.webrtcAddress = webrtcAddress, this.fileUploadAddress = fileupload_address, this.useWebsocketAsDataChannel = !1, this.root = root, this.video = null, this.wrapper = null, this.wrapper_video = null, this.stream = null, this.callbacks = {}, this.broadcastCustomEvent = function (event, target) {
                    var n = null;
                    "function" == typeof CustomEvent ? n = new CustomEvent(event, {
                        detail: target
                    }) : (n = document.createEvent("CustomEvent")).initCustomEvent(event, !1, !1, {
                        detail: target
                    }), window.dispatchEvent(n)
                };
                var f, webrtc_connection = null,
                    webrtc_datachannel = null,
                    g = {
                        offerToReceiveAudio: !0,
                        offerToReceiveVideo: !0
                    };
                window.gwebrtc_datachannel = webrtc_datachannel
                function m(e) {
                    return null != e && e instanceof WebSocket && e.readyState === e.OPEN
                }
                this.x = 0, this.y = 0, this.getChildByClass = function (e, t) {
                    for (var n = 0, r = e.childNodes.length; n < r; n++) {
                        var i = e.childNodes[n];
                        if (i.classList && i.classList.contains(t)) return i;
                        var o = geny_instance.getChildByClass(i, t);
                        if (o) return o
                    }
                }, this.on = function (e, t) {
                    this.callbacks[e] || (this.callbacks[e] = []), this.callbacks[e].push(t)
                }, this.emit = function (e, t) {
                    this.callbacks[e] && this.callbacks[e].forEach(function (e) {
                        e(t)
                    })
                }, this.video = geny_instance.getChildByClass(root, "video"), this.wrapper = geny_instance.getChildByClass(root, "wrapper"), this.wrapper_video = geny_instance.getChildByClass(root, "wrapper_video"), document.addEventListener("click", function (e) {
                    (function e(t, n) {
                        if (t.classList && t.classList.contains(n)) return !0;
                        return t.parentNode && e(t.parentNode, n)
                    })(e.target, "genymotion-overlay") || e.target.classList.contains("genymotion_button") || e.target.classList.contains("dont_close") || geny_instance.emit("close-overlays")
                }), this.onwebrtcready = function () {
                    R.debug("setup");
                    var n = 0;

                    function r(e) {
                        websocket && (geny_instance.close(), geny_instance.reconnecting = !0), (websocket = new WebSocket(e)).onopen = websocket_onopen, websocket.onmessage = websocket_onmessage, websocket.onerror = websocket_onmessage, websocket.binaryType = "arraybuffer", geny_instance.lagometerIsEnabled && new I(geny_instance), n <= 13 ? websocket.onclose = function (e) {
                            var t;
                            switch (geny_instance.initialized = !1, R.debug("Error! Maybe your VM is not available yet? (" + e.code + ") " + e.reason), clearTimeout(t), e.code) {
                                case 1e3:
                                    R.debug("Closing..."), geny_instance.broadcastCustomEvent("closeConnection", {
                                        msg: "Closing connection"
                                    });
                                    break;
                                case 1006:
                                    // geny_instance.broadcastCustomEvent("closeConnectionUnavailable", {
                                    //     msg: "Can't connect to the WebSocket"
                                    // }), R.debug("Retrying in 3 seconds..."), t = setTimeout(function () {
                                    //     r(webrtcAddress)
                                    // }, 3e3), d.push(t), n++;
                                    break;
                                case 4242:
                                    geny_instance.broadcastCustomEvent("closeWrongToken", {
                                        msg: "Wrong token, can't establish connection"
                                    });
                                    break;
                                case 4243:
                                    geny_instance.broadcastCustomEvent("closeNoLongerValidToken", {
                                        msg: "The token provided is no longer valid"
                                    });
                                    break;
                                case 4244:
                                    geny_instance.broadcastCustomEvent("closeServerShutdown", {
                                        msg: "Server is shutting down..."
                                    });
                                    break;
                                default:
                                    geny_instance.broadcastCustomEvent("defaultCloseConnection", {
                                        msg: "Default close connection"
                                    })
                            }
                        } : R.debug("Unable to establish connection to your VM. Closing...")
                    }
                    r(webrtcAddress)
                };
                var websocket_onopen = function () {
                    var e = {
                        type: "token",
                        token: token
                    };
                    m(websocket) && websocket.send(JSON.stringify(e))
                };
                this.close = function () {
                    if (geny_instance.initialized = !1, void 0 !== geny_instance.camera && void 0 !== geny_instance.camera.getLocalVideo() && geny_instance.removeLocalStream(geny_instance.camera.getLocalVideo()), websocket) {
                        websocket.close(), websocket = null;
                        for (var e = 0; e < d.length; e++) clearTimeout(d[e]);
                        d = []
                    }
                    if (webrtc_connection && (webrtc_connection.close(), webrtc_connection = null), webrtc_datachannel && (webrtc_datachannel.close(), webrtc_datachannel = null), void 0 !== geny_instance.fileUpload) {
                        geny_instance.fileUpload.loaderWorker.postMessage({
                            type: "close"
                        })
                    }
                },
                    this.sendData = function (e) {
                        m(websocket) && websocket.send(e, {
                            binary: !0
                        })
                    },
                    this.sendEventMessage = function (e) {
                        "string" == typeof e || e instanceof String || (e = JSON.stringify(e)), geny_instance.useWebsocketAsDataChannel ? m(websocket) && websocket.send(e) : null !== webrtc_datachannel && "open" === webrtc_datachannel.readyState ? webrtc_datachannel.send(e) : R.warn("cannot sendEventMessage signalingDataChannel closed")
                    },
                    this.renegotiate = function () {
                        var e = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
                        e && (webrtc_connection.addTransceiver("audio"), webrtc_connection.addTransceiver("video")), webrtc_connection.createOffer(C, E, g)
                    },
                    this.addLocalStream = function (e) {
                        "function" == typeof webrtc_connection.addTrack ? f = webrtc_connection.addTrack(e.getTracks()[0], e) : webrtc_connection.addStream(e), geny_instance.renegotiate()
                    },
                    this.removeLocalStream = function (e) {
                        e.getTracks()[0].stop(), "function" == typeof webrtc_connection.addTrack ? webrtc_connection.removeTrack(f) : webrtc_connection.removeStream(e), geny_instance.renegotiate()
                    };
                var b = function () {
                    R.debug("Creating peer connection");
                    var e = [];
                    0 < Object.getOwnPropertyNames(o).length && e.push(o), 0 < Object.getOwnPropertyNames(a).length && e.push(a);
                    var t = {
                        iceServers: e
                    };
                    if (webrtc_connection) R.debug("Peer connection already exists");
                    else try {
                        webrtc_connection = new RTCPeerConnection(t)
                        window.gwebrtc_connection = webrtc_connection
                    } catch (e) {
                        R.warn("Failed to create PeerConnection, exception:", e.message)
                    }
                    if (webrtc_connection.onicecandidate = function (e) {
                        var t, n;
                        void 0 !== e.candidate && (null !== e.candidate ? (t = e.candidate, n = {
                            sdpMLineIndex: t.sdpMLineIndex,
                            sdpMid: t.sdpMid,
                            candidate: t.candidate
                        }, m(websocket) && websocket.send(JSON.stringify(n))) : R.debug("All candidates ready"))
                    }, void 0 !== webrtc_connection.createDataChannel) {
                        (webrtc_datachannel = webrtc_connection.createDataChannel("events", {
                            ordered: !0
                        })).onerror = function (e) {
                            R.warn("Data Channel Error:", e)
                        }, webrtc_datachannel.onmessage = function (e) {
                            // R.debug("Got Data Channel Message:", e.data)
                            console("Got Data Channel Message:", e.data)
                        }, webrtc_datachannel.onopen = function () {
                            if(window.on_webrtc_open) window.on_webrtc_open()
                            R.debug("Data Channel opened")
                        }, webrtc_datachannel.onclose = function () {
                            if(window.on_webrtc_close) window.on_webrtc_close()
                            R.debug("The Data Channel is Closed")
                        }, webrtc_connection.ondatachannel = function (e) {
                            var t = e.channel;
                            t.onmessage = _
                        }
                    } else geny_instance.useWebsocketAsDataChannel = !0;
                    webrtc_connection.ontrack = function (e) {
                        if (R.debug("Received track:", e.track.kind), "video" === e.track.kind) {
                            R.debug("Added remote video track using ontrack"), geny_instance.video.srcObject = e.streams[0], geny_instance.video.setAttribute("playsinline", !0);
                            
                            var t = geny_instance.video.play();
                            void 0 !== t && t.then(function () {
                                R.debug("Playing video with sound enabled"), geny_instance.broadcastCustomEvent("video", {
                                    msg: "play automatically allowed with sound"
                                })
                            }).catch(function () {
                                R.debug("Can't play video with sound enabled"), geny_instance.broadcastCustomEvent("video", {
                                    msg: "play with sound denied"
                                }), geny_instance.video.muted = !0;
                                var e = geny_instance.video.play();
                                e.then(function () {
                                    R.debug("Playing video with sound disabled"), geny_instance.broadcastCustomEvent("video", {
                                        msg: "play automatically allowed without sound"
                                    });
                                    var e = document.createElement("div");
                                    e.classList.add("click_to_unmute"), e.innerHTML = "By default, the sound has been turned off, please click anywhere to re-enable audio", geny_instance.wrapper_video.prepend(e);
                                    var t = function () {
                                        geny_instance.video.muted = !1, geny_instance.video.removeEventListener("click", t), geny_instance.video.removeEventListener("touchend", t), geny_instance.broadcastCustomEvent("video", {
                                            msg: "sound manually allowed by click"
                                        }), e.remove(), R.debug("Playing video with sound enabled has been authorized due to user click")
                                    };
                                    geny_instance.video.addEventListener("click", t), geny_instance.video.addEventListener("touchend", t)
                                }).catch(function () {
                                    R.debug("Can't play video, even with sound disabled"), geny_instance.broadcastCustomEvent("video", {
                                        msg: "play denied even without sound"
                                    });
                                    var e = document.createElement("div");
                                    e.classList.add("click_to_display"), e.classList.add("genymotion_video_overlay"), geny_instance.wrapper_video.prepend(e);
                                    var t = function () {
                                        geny_instance.video.play(), e.remove(), geny_instance.broadcastCustomEvent("video", {
                                            msg: "play manually allowed by click"
                                        }), R.debug("Playing video with sound disabled has been authorized due to user click")
                                    };
                                    e.addEventListener("click", t), e.addEventListener("touchend", t)
                                })
                            }), geny_instance.stream = e.streams[0], u = geny_instance.video.style.background, geny_instance.video.style.background = "transparent", geny_instance.touchEventsAreEnabled && geny_instance.touchEvents.addTouchCallbacks(), geny_instance.mouseEventsAreEnabled && geny_instance.mouseEvents.addMouseCallbacks(), geny_instance.keyboardEventsAreEnabled && geny_instance.keyboardEvents.addKeyboardCallbacks()
                            
                        }
                    }, 
                    webrtc_connection.oniceconnectionstatechange = function () {
                        var e = webrtc_connection ? webrtc_connection.iceConnectionState : "No peerconn";
                        if (R.debug("iceConnectionState: ", e), geny_instance.broadcastCustomEvent("iceConnectionState", {
                            msg: e
                        }), "failed" === e) {
                            if(window.grtcfailed){
                                window.grtcfailed()
                            }
                            // var t = document.createElement("div");
                            // t.classList.add("cant_connect_overlay"), t.classList.add("genymotion_video_overlay"), t.innerHTML = '<div class="error_text">Aw, snap!<br/>Connection failed.<p>Check your internet connection & firewall rules.</br>See <a href="">help</a> online to setup TURN configuration.</p></div>', geny_instance.wrapper_video.prepend(t);
                            // var n = function () {
                            //     geny_instance.broadcastCustomEvent("iceConnectionStateDocumentation", {
                            //         msg: "clicked"
                            //     }), t.remove(), window.open(c, "_blank")
                            // };
                            // t.addEventListener("click", n), t.addEventListener("touchend", n)
                        }
                    }, 
                    webrtc_connection.onconnectionstatechange = function () {
                        R.debug("ConnectionState changed:", webrtc_connection.iceConnectionState)
                        if(webrtc_connection.iceConnectionState === 'disconnected')
                            window.on_webrtc_close && window.on_webrtc_close()
                    }, 
                    webrtc_connection.onnegotiationneeded = function () {
                        R.debug("on Negotiation needed")
                    }, "plugin" === webrtcDetectedType && (webrtc_connection.onaddstream = function (e) {
                        R.debug("Added remote video track using onaddstream"), geny_instance.video = attachMediaStream(geny_instance.video, e.stream), geny_instance.stream = e.stream, geny_instance.touchEventsAreEnabled && geny_instance.touchEvents.addTouchCallbacks(), geny_instance.mouseEventsAreEnabled && geny_instance.mouseEvents.addMouseCallbacks(), geny_instance.keyboardEventsAreEnabled && geny_instance.keyboardEvents.addKeyboardCallbacks()
                    }), geny_instance.renegotiate()
                },
                    C = function (e) {
                        webrtc_connection.setLocalDescription(e), m(websocket) && websocket.send(JSON.stringify(e))
                    },
                    websocket_onmessage = function (e) {
                        var t = null;
                        try {
                            t = JSON.parse(e.data)
                        } catch (e) {
                            return
                        }
                        if (t)
                            if (t.sdp) try {
                                var n = new RTCSessionDescription(t);
                                webrtc_connection.setRemoteDescription(n, T, E)
                            } catch (e) {
                                R.warn("Failed to create SDP ", e.message)
                            } else if (t.candidate) try {
                                var r = new RTCIceCandidate(t);
                                webrtc_connection.addIceCandidate(r)
                            } catch (e) {
                                R.warn("Failed to create ICE ", e.message)
                            } else t.connection ? b() : S(t)
                    },
                    T = function () {
                        if (R.debug("Webrtc connection success"), !geny_instance.initialized && (geny_instance.initialized = !0, geny_instance.reconnecting ? geny_instance.reconnecting = !1 : geny_instance.broadcastCustomEvent("successConnection", {
                            msg: "Connection established"
                        }), geny_instance.fileUpload)) {
                            var e = {
                                type: "address",
                                fileUploadAddress: fileupload_address,
                                token: token
                            };
                            void 0 !== geny_instance.fileUpload.loaderWorker && geny_instance.fileUpload.loaderWorker.postMessage(e)
                        }
                    },
                    E = function (e) {
                        R.debug("Failure callback:", e)
                    },
                    _ = function (e) {
                        var t = JSON.parse(e.data);
                        S(t)
                    },
                    S = function (e) {
                        if ("USERS" === e.type) "SUCCESS" === e.code && geny_instance.broadcastCustomEvent("userListUpdated", {
                            msg: e.message
                        });
                        else if ("VERSION" === e.type) {
                            if ("SUCCESS" === e.code) {
                                var t = geny_instance.getChildByClass(root, "version_number");
                                t && (t.innerHTML = e.message)
                            }
                        } else "CAPABILITIES" === e.type && [{
                            widget: geny_instance.battery,
                            capability: e.message.battery
                        }, {
                            widget: geny_instance.camera,
                            capability: e.message.camera
                        }, {
                            widget: geny_instance.gps,
                            capability: e.message.gps
                        }, {
                            widget: geny_instance.identifiers,
                            capability: e.message.identifiers
                        }, {
                            widget: geny_instance.network,
                            capability: e.message.network
                        }, {
                            widget: geny_instance.phone,
                            capability: e.message.phone
                        }, {
                            widget: geny_instance.diskIO,
                            capability: e.message.diskIO
                        }, {
                            widget: geny_instance.buttonEvents,
                            capability: e.message.accelerometer,
                            enable: function (e) {
                                e.enableRotation()
                            },
                            disable: function (e) {
                                e.disableRotation()
                            }
                        }, {
                            widget: geny_instance.fileUpload,
                            capability: e.message.systemPatcher,
                            enable: function (e) {
                                e.toggleCapability(!0)
                            },
                            disable: function (e) {
                                e.toggleCapability(!1)
                            }
                        }].forEach(function (e) {
                            void 0 !== e.widget && (!1 === e.capability ? e.disable ? e.disable(e.widget) : e.widget.disable() : e.enable ? e.enable(e.widget) : e.widget.enable())
                        });
                        "SUCCESS" === e.code && geny_instance.emit(e.type, e.message)
                    }
            }
        }, {
            "./plugins/Lagometer": 14,
            adapterjs: 27,
            loglevel: 29
        }],
        2: [function (e, t, n) {
            var r = e("adapterjs"),
                l = e("./Genymotion"),
                d = e("lodash"),
                u = e("loglevel");
            u.setDefaultLevel("debug");
            var p = e("./plugins/GPS"),
                f = e("./plugins/CoordinateUtils"),
                h = e("./plugins/MouseEvents"),
                v = e("./plugins/TouchEvents"),
                g = e("./plugins/ButtonsEvents"),
                m = e("./plugins/Lagometer"),
                y = e("./plugins/Fullscreen"),
                b = e("./plugins/KeyboardEvents"),
                C = e("./plugins/Clipboard"),
                w = e("./plugins/FileUpload"),
                T = e("./plugins/Camera"),
                E = e("./plugins/Battery"),
                _ = e("./plugins/QualityChooser"),
                S = e("./plugins/Screencast"),
                R = e("./plugins/Identifiers"),
                I = e("./plugins/Network"),
                P = e("./plugins/Phone"),
                k = e("./plugins/SizeChooser"),
                L = e("./plugins/ResolutionChooser"),
                x = e("./plugins/IOThrottling");
            t.exports = function () {
                var i = this,
                    o = [],
                    a = !1;
                this.templates = {
                    bootstrap: {
                        html: '<div class="wrapper">    <div align="center" class="wrapper_video embed-responsive embed-responsive-16by9">        <video class="video embed-responsive-item" autoplay preload="none">            Your browser does not support the VIDEO tag        </video>    </div>    <div class="toolbars">        <div class="toolbar">            <ul>            </ul>        </div>    </div></div>',
                        js: "",
                        css: ".genymotion_bootstrap .video {    background: transparent url(img/screenshot.png) no-repeat;    background-size: contain;    background-position: center;    width: 99%}.genymotion_bootstrap {    background-color: black;}.genymotion_bootstrap .toolbars {    position: absolute;    width: 47px;    height: 100%;    top: 0;    right: 0;    margin: 0;}.genymotion_bootstrap .toolbar {    position: absolute;    top: 5%;    right: 0;    margin: 0;}.genymotion_bootstrap li img {    margin: auto}@media (min-width: 1200px) {    .genymotion_bootstrap li img {        width: 85%;    }}"
                    },
                    fullscreen: {
                        html: '<link href=\'https://fonts.googleapis.com/css?family=Roboto\' rel=\'stylesheet\' type=\'text/css\'><a class="fullscreen_message" href="#"></a><div class="wrapper hide">    <div class="wrapper_video">        <video class="video" autoplay preload="none">            Your browser does not support the VIDEO tag        </video>    </div>    <div class="toolbars">        <div class="toolbar">            <ul>            </ul>        </div>    </div></div><p class="LayoutIsFullWindow" hidden></p>',
                        js: "",
                        css: ".genymotion_fullscreen {    position: absolute;    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    width: 100%;    height: 97%;    background-color: black;}.genymotion_fullscreen .fullscreen_message {    display: block;    padding: 0;    margin: 0;    height: 100%;    width: 100%;    background: white url(../../img/fullscreen-background.png) no-repeat center;    background-size: cover;}.genymotion_fullscreen .hide {    display: none;}.genymotion_fullscreen .video {    background: transparent url(img/screenshot.png) no-repeat;    background-size: contain;    background-position: center;    position: absolute;    top: 0;    left: 0;    width: 95%;    height: 100%;    padding: 0;}.genymotion_player .toolbars{    position: absolute;    top: 0;    right: 0;}"
                    },
                    fullwindow: {
                        html: '<div class="wrapper">    <div class="wrapper_video">        <video class="video" autoplay preload="none">            Your browser does not support the VIDEO tag        </video>    </div>    <div class="toolbar">        <ul>        </ul>    </div></div><p class="LayoutIsFullWindow" hidden></p>',
                        js: "",
                        css: ".genymotion_fullwindow {    position: absolute;    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    width: 100%;    height: 97%;    min-height: 560px;    background-color: black;}.genymotion_fullwindow .video {    background: transparent url(img/screenshot.png) no-repeat;    background-size: contain;    background-position: center;    position: absolute;    top: 0;    left: 0;    width: calc(95% - 50px);    height: 100%;    padding: 0;}.genymotion_fullwindow .toolbar {    position: absolute;    top: 10px;    right: 0;    padding-right: 10px;    margin: 0;    width: 50px;}"
                    },
                    god_default: {
                        html: '<div class="wrapper">    <div class="wrapper_video">        <video class="video" autoplay preload="none" poster="img/loader.svg">            Your browser does not support the VIDEO tag        </video>    </div>    <div class="toolbar">        <ul>        </ul>    </div>    <span class="version_number"></span></div><p class="LayoutIsFullWindow" hidden></p>',
                        js: "",
                        css: ".genymotion_god_default_body {    background-color: black;}.genymotion_god_default {    position: absolute;    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    width: 100%;    height: 100%;    min-height: 560px;    background-color: black;}.genymotion_god_default .video {    position: fixed;    top: 0;    left: 0;    width: calc(100vw\t- 57px);    height: 100vh;    padding: 0;    margin: 0;}.genymotion_god_default .toolbar {    position: absolute;    top: 10px;    right: 0;    padding-right: 5px;    margin: 0;    width: 50px;}.genymotion_god_default .version_number {    position: fixed;    right: 5px;    bottom: 5px;    z-index: 2;    color: white;}"
                    },
                    god_simple: {
                        html: '<div class="wrapper">    <div class="wrapper_video">        <video class="video" autoplay preload="none">            Your browser does not support the VIDEO tag        </video>    </div></div><p class="LayoutIsFullWindow" muted hidden></p>',
                        js: "",
                        css: ".genymotion_god_simple {    position: absolute;    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    width: 100%;    height: 100%;    background-color: black;}.genymotion_god_simple .video {    position: absolute;    top: 0;    left: 0;    width: 100%;    height: 100%;    padding: 0;}"
                    },
                    god_partial: {
                        html: '<div class="wrapper">    <div class="wrapper_video">        <video class="video" autoplay preload="none">            Your browser does not support the VIDEO tag        </video>    </div>    <div class="toolbar">        <ul>        </ul>    </div>    <span class="version_number"></span></div><p class="LayoutIsFullWindow" hidden></p>',
                        js: "",
                        css: ".genymotion_god_partial {    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    min-height: 800px;    height: 100%;    background-color: black;}.genymotion_god_partial .wrapper {    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    width: 100%;    height: 100%;}.genymotion_god_partial .wrapper_video {    position: relative;    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    width: 100%;    height: 100%;}.genymotion_god_partial .video {    position: relative;    top: 0;    left: 0;    width: calc(95% - 50px);    height: 100%;    padding: 0;    background: transparent url(data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCA2NCA2NCIgd2lkdGg9IjY0IiBoZWlnaHQ9IjY0IiBmaWxsPSJ3aGl0ZSI+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InRyYW5zbGF0ZSgxNiAxNikiIGN4PSIwIiBjeT0iMTYiIHI9IjAiPiAKICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDsgNDsgMDsgMCIgZHVyPSIxLjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAiCiAgICAgIGtleXRpbWVzPSIwOzAuMjswLjc7MSIga2V5U3BsaW5lcz0iMC4yIDAuMiAwLjQgMC44OzAuMiAwLjYgMC40IDAuODswLjIgMC42IDAuNCAwLjgiIGNhbGNNb2RlPSJzcGxpbmUiIC8+CiAgPC9jaXJjbGU+CiAgPGNpcmNsZSB0cmFuc2Zvcm09InRyYW5zbGF0ZSgzMiAxNikiIGN4PSIwIiBjeT0iMTYiIHI9IjAiPiAKICAgIDxhbmltYXRlIGF0dHJpYnV0ZU5hbWU9InIiIHZhbHVlcz0iMDsgNDsgMDsgMCIgZHVyPSIxLjJzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjAuMyIKICAgICAga2V5dGltZXM9IjA7MC4yOzAuNzsxIiBrZXlTcGxpbmVzPSIwLjIgMC4yIDAuNCAwLjg7MC4yIDAuNiAwLjQgMC44OzAuMiAwLjYgMC40IDAuOCIgY2FsY01vZGU9InNwbGluZSIgLz4KICA8L2NpcmNsZT4KICA8Y2lyY2xlIHRyYW5zZm9ybT0idHJhbnNsYXRlKDQ4IDE2KSIgY3g9IjAiIGN5PSIxNiIgcj0iMCI+IAogICAgPGFuaW1hdGUgYXR0cmlidXRlTmFtZT0iciIgdmFsdWVzPSIwOyA0OyAwOyAwIiBkdXI9IjEuMnMiIHJlcGVhdENvdW50PSJpbmRlZmluaXRlIiBiZWdpbj0iMC42IgogICAgICBrZXl0aW1lcz0iMDswLjI7MC43OzEiIGtleVNwbGluZXM9IjAuMiAwLjIgMC40IDAuODswLjIgMC42IDAuNCAwLjg7MC4yIDAuNiAwLjQgMC44IiBjYWxjTW9kZT0ic3BsaW5lIiAvPgogIDwvY2lyY2xlPgo8L3N2Zz4K) center no-repeat;    background-size: 40%;}.genymotion_god_partial .toolbar {    position: absolute;    top: 10px;    right: 0;    padding-right: 5px;    margin: 0;    width: 50px;}.genymotion_god_partial .version_number {    position: fixed;    right: 5px;    bottom: 5px;    z-index: 2;    color: white;}@media only screen and (max-width: 650px)  {    .genymotion-overlay {        left: auto;        width: calc(100vw - 100px);        right: 55px;        min-height: 0;    }}@media only screen and (min-width: 475px)  {    .genymotion_god_partial .click_to_unmute {        left: calc(50% - 190px) !important;    }}"
                    },
                    player: {
                        html: '<div class="wrapper">    <div class="player">        <div class="wrapper_video">            <video class="video" autoplay preload="none">                Your browser does not support the VIDEO tag            </video>        </div>        <div class="toolbars">            <div class="toolbar">                <ul>                </ul>            </div>        </div>    </div></div>',
                        js: "",
                        css: ".genymotion_player .player {    position: relative;    border-collapse: separate;    border-radius: 3px;    padding: 40px 10px 40px 10px;    margin-left: auto;    margin-right: auto;    background-color: black;}.genymotion_player .player video {    background: transparent url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz48c3ZnIHdpZHRoPScxMjJweCcgaGVpZ2h0PScxMjJweCcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCIgcHJlc2VydmVBc3BlY3RSYXRpbz0ieE1pZFlNaWQiIGNsYXNzPSJ1aWwtcmluZyI+PHJlY3QgeD0iMCIgeT0iMCIgd2lkdGg9IjEwMCIgaGVpZ2h0PSIxMDAiIGZpbGw9Im5vbmUiIGNsYXNzPSJiayI+PC9yZWN0PjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjQ1IiBzdHJva2UtZGFzaGFycmF5PSIxNTUuNTA4ODM2MzUyNjk0NzcgMTI3LjIzNDUwMjQ3MDM4NjYyIiBzdHJva2U9IiNFNjE5NUUiIGZpbGw9Im5vbmUiIHN0cm9rZS13aWR0aD0iMTAiPjxhbmltYXRlVHJhbnNmb3JtIGF0dHJpYnV0ZU5hbWU9InRyYW5zZm9ybSIgdHlwZT0icm90YXRlIiB2YWx1ZXM9IjAgNTAgNTA7MTgwIDUwIDUwOzM2MCA1MCA1MDsiIGtleVRpbWVzPSIwOzAuNTsxIiBkdXI9IjFzIiByZXBlYXRDb3VudD0iaW5kZWZpbml0ZSIgYmVnaW49IjBzIj48L2FuaW1hdGVUcmFuc2Zvcm0+PC9jaXJjbGU+PC9zdmc+) no-repeat center;    background-position: center;    width: 1024px;    height: 600px;    margin-right: 60px;}.genymotion_player .player .toolbars{    position: absolute;    top: 0;    right: 0;    width: 60px;}"
                    },
                    simple: {
                        html: '<div class="wrapper">    <div class="wrapper_video">        <video class="video" autoplay poster="img/screenshot.png">            Your browser does not support the VIDEO tag        </video>    </div></div>',
                        js: "",
                        css: ""
                    },
                    soge: {
                        html: '<div class="wrapper">    <div class="wrapper_video">        <video class="video" autoplay preload="none">            Your browser does not support the VIDEO tag        </video>    </div>    <div class="toolbar">        <ul>        </ul>    </div><p class="LayoutIsFullWindow" hidden></p></div>',
                        js: "",
                        css: ".genymotion_soge {    position: absolute;    top: 0;    left: 0;    margin: 0;    padding: 0;    display: block;    width: 100%;    height: 97%;    background-color: black;}.genymotion_soge .video {    background: transparent url(img/screenshot.png) no-repeat;    background-size: contain;    background-position: center;    position: absolute;    top: 0;    left: 0;    width: 95%;    height: 100%;    padding: 0;}.genymotion_soge .toolbar {    position: absolute;    top: 5%;    right: 1%;    margin: 0;}"
                    }
                }, this.AdapterJS = r, this.default_options = {
                    template: "player",
                    touch: !0,
                    mouse: !0,
                    volume: !0,
                    rotation: !0,
                    navbar: !0,
                    power: !0,
                    keyboard: !0,
                    fullscreen: !0,
                    camera: !1,
                    fileUpload: !1,
                    qualityChooser: !1,
                    clipboard: !0,
                    battery: !0,
                    lagometer: !1,
                    gps: !1,
                    capture: !0,
                    identifiers: !0,
                    network: !0,
                    phone: !0,
                    sizeChooser: !0,
                    resolution: !1,
                    diskIO: !1,
                    paas: !1,
                    openGappsAvailable: !1,
                    token: "",
                    i18n: {},
                    stun: {
                        urls: "stun:stun.genymotion.com:3478"
                    },
                    ConnectionErrorCallback: "https://www.genymotion.com/help/cloud-saas/iceconnectionstate-failed/",
                    turn: {}
                }, r.webRTCReady(function () {
                    a = !0, o.forEach(function (e) {
                        e.onwebrtcready()
                    })
                });
                this.add = function (e, t, n, r) {
                    return "string" == typeof e && (e = document.getElementById(e)), void 0 === r && (r = {}), r.webrtcAddress = t, r.fileUploadAddress = n, r.paas && (i.default_options.sizeChooser = !1, i.default_options.diskIO = !0, i.default_options.ConnectionErrorCallback = "https://www.genymotion.com/help/cloud-paas/iceconnectionstate-failed/"), (r = d.defaults(r, i.default_options)).buttons = r.volume || r.rotation || r.navbar || r.power, u.debug("Creating genymotion display on " + t), e.classList.add("genymotion_instance"), e.classList.add("genymotion_" + r.template), document.body.classList.add("genymotion_" + r.template + "_body"), s(e, i.templates[r.template], r)
                };
                var s = function (e, t, n) {
                    var r = document.getElementsByTagName("head")[0],
                        i = "genymotion-js-" + n.template,
                        o = "genymotion-css-" + n.template;
                    if (!document.getElementById(i)) {
                        var a = document.createElement("script");
                        a.id = i, a.text = t.js, r.appendChild(a)
                    }
                    if (!document.getElementById(o)) {
                        var s = document.createElement("style");
                        s.id = o, s.appendChild(document.createTextNode(t.css)), r.appendChild(s)
                    }
                    return e.innerHTML = t.html, c(e, n)
                },
                    c = function (e, t) {
                        var n = new l(e, t.webrtcAddress, t.fileUploadAddress, t.template, t.token, t.stun, t.turn, t.paas || t.openGappsAvailable, t.ConnectionErrorCallback);
                        o.push(n);
                        var r = t.paas,
                            i = t.paas;
                        return (t.touch || t.mouse) && new f(n), t.mouse && new h(n), t.touch && new v(n), t.lagometer && new m(n), t.fullscreen && new y(n), t.keyboard && new b(n), t.clipboard && new C(n, t.i18n), t.fileUpload && new w(n, t.i18n), t.camera && new T(n, t.i18n), t.battery && new E(n, t.i18n), t.qualityChooser && new _(n), t.gps && new p(n, t.i18n), t.capture && new S(n, t.i18n), t.identifiers && new R(n, t.i18n), t.network && new I(n, t.i18n, r), t.phone && new P(n, t.i18n), t.sizeChooser && new k(n), t.resolution && new L(n), t.diskIO && new x(n, t.i18n), t.buttons && new g(n, t, i), a && n.onwebrtcready(), n
                    }
            }
        }, {
            "./Genymotion": 1,
            "./plugins/Battery": 3,
            "./plugins/ButtonsEvents": 4,
            "./plugins/Camera": 5,
            "./plugins/Clipboard": 6,
            "./plugins/CoordinateUtils": 7,
            "./plugins/FileUpload": 8,
            "./plugins/Fullscreen": 9,
            "./plugins/GPS": 10,
            "./plugins/IOThrottling": 11,
            "./plugins/Identifiers": 12,
            "./plugins/KeyboardEvents": 13,
            "./plugins/Lagometer": 14,
            "./plugins/MouseEvents": 15,
            "./plugins/Network": 16,
            "./plugins/Phone": 17,
            "./plugins/QualityChooser": 18,
            "./plugins/ResolutionChooser": 19,
            "./plugins/Screencast": 20,
            "./plugins/SizeChooser": 21,
            "./plugins/TouchEvents": 22,
            adapterjs: 27,
            lodash: 28,
            loglevel: 29
        }],
        3: [function (e, t, n) {
            "use strict";
            var r = e("./util/OverlayPlugin");

            function i(e, t) {
                r.call(this, e), (this.genymotion = e).battery = this, e.on("BATTERY_STATUS", function (e) {
                    this.setCharging("true" === e)
                }.bind(this)), e.on("BATTERY_LEVEL", this.handleLevelChange.bind(this)), this.i18n = t || {}, this.renderToolbarButton(t), this.renderWidget(t)
            } (i.prototype = Object.create(r.prototype)).renderToolbarButton = function (e) {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var t = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        n = this.toolbarBtn = document.createElement("li"),
                        r = this.toolbarBtnImage = document.createElement("div");
                    r.className += "genymotion_button battery_button", r.title = e.BATTERY_TITLE || "Battery", n.appendChild(r), n.onclick = this.toggleWidget.bind(this), t.appendChild(n)
                }
            }, i.prototype.renderWidget = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.container = document.createElement("div"),
                    r = document.createElement("div");
                r.className += "title", r.innerHTML = e.BATTERY_TITLE || "Battery", n.appendChild(r);
                var i = document.createElement("div");
                i.className += "inputs";
                var o = e.BATTERY_CHARGE_LEVEL || "Charge level";
                i.innerHTML = "<label>" + o + "</label>", i.appendChild(this.renderLevelSection());
                var a = document.createElement("label");
                a.innerHTML = "State of charge", i.appendChild(a), i.appendChild(this.renderChargingSection()), n.appendChild(i), t.className = "genymotion-overlay battery-form hidden";
                var s = document.createElement("div");
                s.className += "close-btn", s.onclick = this.toggleWidget.bind(this), t.appendChild(s), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, i.prototype.renderChargingSection = function () {
                var e = document.createElement("div"),
                    t = this.chargingInput = document.createElement("input"),
                    n = this.chargingStatus = document.createElement("div");
                return e.className = "charging-group", t.type = "checkbox", t.className = "charging-checkbox", t.onchange = this.toggleCharging.bind(this), n.className = "charging-status", n.innerHTML = "Discharging", e.appendChild(t), e.appendChild(n), e
            }, i.prototype.renderLevelSection = function () {
                var e = document.createElement("div");
                e.className += "charge-level-group";
                var t = document.createElement("div"),
                    n = this.chargeInput = document.createElement("input"),
                    r = document.createElement("span");
                r.innerHTML = "%", n.className = "charge-input", n.type = "number", n.setAttribute("value", 50), n.max = 100, n.min = 0, n.addEventListener("input", this.onLevelInputChange.bind(this)), t.appendChild(n), t.appendChild(r), e.appendChild(t);
                var i = document.createElement("div"),
                    o = this.chargeSlider = document.createElement("input");
                o.className = "charge-slider", o.type = "range", o.orient = "vertical", o.setAttribute("value", 50), o.onchange = this.onLevelSliderChange.bind(this), i.appendChild(o), e.appendChild(i);
                var a = document.createElement("div"),
                    s = this.chargeImage = document.createElement("div"),
                    c = this.chargeImageOverlay = document.createElement("div");
                return s.className = "charge-image", c.className = "charge-image-overlay", c.style.cssText = "height: 40%;", a.appendChild(s), s.appendChild(c), e.appendChild(a), e
            }, i.prototype.toggleWidget = function () {
                this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable")) : this.genymotion.emit("keyboard-enable"), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, i.prototype.toggleCharging = function () {
                this.chargingStatus.classList.toggle("charging");
                var e = this.i18n.BATTERY_CHARGING || "Charging",
                    t = this.i18n.BATTERY_DISCHARGING || "Discharging";
                this.chargingStatus.innerHTML = this.chargingInput.checked ? e : t, this.submit()
            }, i.prototype.setCharging = function (e) {
                this.chargingInput.checked = e, this.chargingStatus.classList[e ? "add" : "remove"]("charging");
                var t = this.i18n.BATTERY_CHARGING || "Charging",
                    n = this.i18n.BATTERY_DISCHARGING || "Discharging";
                this.chargingStatus.innerHTML = e ? t : n
            }, i.prototype.onLevelInputChange = function () {
                var e = +this.chargeInput.value;
                100 < e ? e = this.chargeInput.value = 100 : e < 0 && (e = this.chargeInput.value = 0), this.handleLevelChange(e), this.submit()
            }, i.prototype.onLevelSliderChange = function () {
                var e = +this.chargeSlider.value;
                100 < e ? e = this.chargeSlider.value = 100 : e < 0 && (e = this.chargeSlider.value = 0), this.handleLevelChange(e), this.submit()
            }, i.prototype.submit = function () {
                var e = +this.chargeInput.value,
                    t = {};
                this.genymotion.useRedis ? t = {
                    channel: "battery",
                    messages: ["set state level " + e, "set state status " + (this.chargingInput.checked ? "charging" : "discharging")]
                } : t = {
                    type: "BATTERY",
                    level: e,
                    charging: this.chargingInput.checked ? 1 : 0
                };
                this.genymotion.sendEventMessage(JSON.stringify(t))
            }, i.prototype.handleLevelChange = function (e) {
                this.chargeSlider.value = e, this.chargeInput.value = e, this.chargeImageOverlay.style.cssText = "height: " + (.7 * e + 4) + "%;"
            }, t.exports = i
        }, {
            "./util/OverlayPlugin": 23
        }],
        4: [function (e, t, n) {
            "use strict";
            t.exports = function (e, t, r) {
                var i = this,
                    s = e;
                s.buttonEvents = this;
                var o = "0x01000022",
                    a = "0x01000005",
                    c = "0x01000010",
                    l = "rotation";
                this.keyPressEvent = function (e, t) {
                    var n = {
                        type: "KEYBOARD_PRESS",
                        keychar: t,
                        keycode: e
                    };
                    s.sendEventMessage(JSON.stringify(n))
                }, this.keyReleaseEvent = function (e, t) {
                    var n = {
                        type: "KEYBOARD_RELEASE",
                        keychar: t,
                        keycode: e
                    };
                    s.sendEventMessage(JSON.stringify(n))
                }, this.buttonPressed = function (e) {
                    var t = e.target.classList[1];
                    if (t === c && r) i.keyPressEvent(parseInt(o), ""), i.keyPressEvent(parseInt(a), "");
                    else if ("0x" === t.substring(0, 2)) {
                        var n = parseInt(t, 16);
                        i.keyPressEvent(n, "0\n")
                    }
                }, this.buttonReleased = function (e) {
                    var t = e.target.classList[1];
                    if (t === c && r) i.keyReleaseEvent(parseInt(a), ""), i.keyReleaseEvent(parseInt(o), "");
                    else if (t === l) s.sendEventMessage(JSON.stringify({
                        type: "ROTATE"
                    }));
                    else if ("0x" === t.substring(0, 2)) {
                        var n = parseInt(t, 16);
                        i.keyReleaseEvent(n, "0\n")
                    }
                }, this.saveState = function (e) {
                    var t = s.getChildByClass(s.root, e),
                        n = t.parentNode;
                    return {
                        image: {
                            className: t.className
                        },
                        button: {
                            className: n.className,
                            onclick: n.onclick
                        }
                    }
                }, this.restoreState = function (e, t) {
                    var n = s.getChildByClass(s.root, e),
                        r = n.parentNode;
                    n.className = t.image.className, r.className = t.button.className, r.onclick = t.button.onclick
                }, this.disableRotation = function () {
                    if (s.getChildByClass(s.root, "rotate")) {
                        this.savedRotationState || (this.savedRotationState = this.saveState("rotate"));
                        var e = s.getChildByClass(s.root, "rotate"),
                            t = e.parentNode;
                        t.className += " disabled-widget-pop-up", e.className += " disabled-widget-icon", t.onclick = null
                    }
                }, this.enableRotation = function () {
                    s.getChildByClass(s.root, "rotate") && this.savedRotationState && (this.restoreState("rotate", this.savedRotationState), this.savedRotationState = void 0)
                }, this.renderToolbarButtons = function (e, t, n, r) {
                    if (s.getChildByClass(s.root, "toolbar")) {
                        var i = s.getChildByClass(s.root, "toolbar").children[0],
                            o = document.createElement("li"),
                            a = document.createElement("div");
                        a.classList.add("genymotion_button"), a.classList.add(e), a.classList.add(t), a.title = n, o.appendChild(a), r ? i.appendChild(o) : i.insertBefore(o, i.firstChild)
                    }
                }, t.rotation && this.renderToolbarButtons(l, "rotate", "Rotate", !1), t.volume && (this.renderToolbarButtons("0x01000070", "sound_down", "Sound down", !1), this.renderToolbarButtons("0x01000072", "sound_up", "Sound up", !1)), t.navbar && (this.renderToolbarButtons("0x010000be", "recent", "Recent applications", !0), this.renderToolbarButtons(c, "home", "Home", !0), this.renderToolbarButtons("0x01000061", "back", "Back", !0)), t.power && this.renderToolbarButtons("0x0100010b", "power", "Power", !0);
                for (var n = document.getElementsByClassName("genymotion_button"), d = 0; d < n.length; d++) {
                    var u = n[d];
                    u.onmousedown = i.buttonPressed, u.onmouseup = i.buttonReleased
                }
            }
        }, {}],
        5: [function (e, t, n) {
            "use strict";
            var s = e("loglevel"),
                c = e("./util/OverlayPlugin"),
                r = function (t) {
                    c.call(this, t);
                    var e = this;
                    (t = t).camera = this;
                    var n = !1,
                        r = void 0;
                    if (t.getChildByClass(t.root, "toolbar")) {
                        var i = t.getChildByClass(t.root, "toolbar").children[0];
                        this.toolbarBtn = document.createElement("li"), this.toolbarBtnImage = document.createElement("div"), this.toolbarBtnImage.className += "genymotion_button videoUp", this.toolbarBtnImage.title = "Use webcam as camera", this.toolbarBtn.appendChild(this.toolbarBtnImage), i.appendChild(this.toolbarBtn), this.toggleStreaming = function () {
                            (n = !n) ? e.startStreaming() : e.stopStreaming(r)
                        }, "safari" === webrtcDetectedBrowser || "edge" === webrtcDetectedBrowser ? (this.toolbarBtn.className += " disabled-widget-pop-up", this.toolbarBtnImage.className += " disabled-widget-icon") : this.toolbarBtn.onclick = this.toggleStreaming, this.startStreaming = function () {
                            navigator.mediaDevices.getUserMedia({
                                video: {
                                    width: 1280,
                                    height: 720
                                }
                            }).then(function (e) {
                                a(e), r = e
                            }).catch(function (e) {
                                o(e)
                            })
                        };
                        var o = function (e) {
                            s.warn("can't have stream" + e)
                        },
                            a = function (e) {
                                s.debug("added local stream"), r = e, t.addLocalStream(e)
                            };
                        this.stopStreaming = function (e) {
                            s.debug("removed local stream"), t.removeLocalStream(e), r = void 0
                        }, this.getLocalVideo = function () {
                            return r
                        }
                    }
                };
            r.prototype = Object.create(c.prototype), t.exports = r
        }, {
            "./util/OverlayPlugin": 23,
            loglevel: 29
        }],
        6: [function (e, t, n) {
            "use strict";
            var r = e("./util/OverlayPlugin");

            function i(e, t) {
                r.call(this, e), ((this.genymotion = e).clipboard = this).clipboard = "", e.on("CLIPBOARD", function (e) {
                    this.clipboard = e
                }.bind(this)), this.i18n = t || {}, this.renderToolbarButton(t), this.renderWidget(t)
            } (i.prototype = Object.create(r.prototype)).renderToolbarButton = function (e) {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var t = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        n = this.toolbarBtn = document.createElement("li"),
                        r = this.toolbarBtnImage = document.createElement("div");
                    r.className += "genymotion_button clipboard_button", r.title = e.CLIPBOARD_TITLE || "clipboard", n.appendChild(r), n.onclick = this.toggleWidget.bind(this), t.appendChild(n)
                }
            }, i.prototype.renderWidget = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.container = document.createElement("div"),
                    r = document.createElement("div");
                r.className += "title", r.innerHTML = e.CLIPBOARD_TITLE || "Clipboard", n.appendChild(r), this.clipboardInput = document.createElement("textarea"), this.clipboardInput.className += "clipboard-input", this.textCopied = document.createElement("div"), this.textCopied.innerHTML = e.CLIPBOARD_COPIED || "Copied to your computer clipboard", this.textCopied.classList.add("textCopied"), this.textCopied.classList.add("invisible"), this.textCopied.classList.add("hidden"), n.appendChild(this.clipboardInput), n.appendChild(this.textCopied), t.className = "genymotion-overlay clipboard-form hidden";
                var i = document.createElement("div");
                i.className += "close-btn", i.onclick = this.toggleWidget.bind(this), t.appendChild(i), t.appendChild(n);
                var o = this;
                t.onclose = function () {
                    o.clipboard = o.clipboardInput.value, o.submit()
                }, this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, i.prototype.toggleWidget = function () {
                this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable"), this.clipboardInput.value = this.clipboard, "" !== this.clipboard && setTimeout(this.copyToClipBoard, 100, this.clipboardInput, this.textCopied)) : (this.genymotion.emit("keyboard-enable"), this.widget.onclose()), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, i.prototype.copyToClipBoard = function (e, t) {
                e.focus(), e.select(), document.execCommand("copy"), t.classList.remove("invisible"), t.classList.remove("hidden"), setTimeout(function () {
                    t.classList.add("invisible"), setTimeout(function () {
                        t.classList.add("hidden")
                    }, 500)
                }, 2e3)
            }, i.prototype.submit = function () {
                var e = {};
                e = this.genymotion.useRedis ? {
                    channel: "framework",
                    messages: ["set_device_clipboard " + window.btoa(unescape(encodeURIComponent(this.clipboard)))]
                } : {
                        type: "CLIPBOARD",
                        value: this.clipboard
                    }, this.genymotion.sendEventMessage(JSON.stringify(e))
            }, t.exports = i
        }, {
            "./util/OverlayPlugin": 23
        }],
        7: [function (e, t, n) {
            "use strict";
            t.exports = function (e) {
                var t = e,
                    a = t.video;
                t.coordinateUtils = this;
                var s = function () {
                    a = t.video
                };
                this.blackBordersOnWidth = function () {
                    return a.offsetWidth / a.offsetHeight > a.videoWidth / a.videoHeight
                }, this.screensOnSameOrientation = function () {
                    return 1 < a.videoWidth / a.videoHeight && 1 < a.offsetWidth / a.offsetHeight || a.videoWidth / a.videoHeight < 1 && a.offsetWidth / a.offsetHeight < 1
                };
                var n = function (e) {
                    for (var t = 0, n = 0; t += e.offsetTop || 0, n += e.offsetLeft || 0, e = e.offsetParent;);
                    return {
                        top: t,
                        left: n
                    }
                };
                this.getRawXcoordinateFromEvent = function (e) {
                    return void 0 !== e.pageX ? void 0 !== e.offsetX ? e.offsetX : e.pageX - n(a).left : e.clientX - n(a).left
                }, this.getRawYcoordinateFromEvent = function (e) {
                    return void 0 !== e.pageY ? void 0 !== e.offsetY ? e.offsetY : e.pageY - n(a).top : e.clientY - n(a).top
                }, this.getXcoordinate = function (e) {
                    c(), s();
                    var t, n, r, i = this.getRawXcoordinateFromEvent(e);
                    if (this.screensOnSameOrientation()) {
                        if (this.blackBordersOnWidth()) {
                            t = a.videoWidth / a.videoHeight * a.offsetHeight;
                            var o = a.videoWidth / t;
                            return (i - (a.offsetWidth - t) / 2) * o
                        }
                        return a.videoWidth / a.offsetWidth * i
                    }
                    return this.blackBordersOnWidth() ? (t = a.videoWidth / a.videoHeight * a.offsetHeight, r = a.videoWidth / t, (i - (a.offsetWidth - t) / 2) * r) : (n = a.videoHeight / a.videoWidth * a.offsetWidth, i * (r = a.videoHeight / n))
                }, this.getYcoordinate = function (e) {
                    s();
                    var t, n, r, i = this.getRawYcoordinateFromEvent(e);
                    if (this.screensOnSameOrientation()) {
                        if (this.blackBordersOnWidth()) return a.videoHeight / a.offsetHeight * i;
                        n = a.videoHeight / a.videoWidth * a.offsetWidth;
                        var o = a.videoHeight / n;
                        return (i - (a.offsetHeight - n) / 2) * o
                    }
                    return this.blackBordersOnWidth() ? (t = a.videoWidth / a.videoHeight * a.offsetHeight, i * (r = a.videoWidth / t)) : (n = a.videoHeight / a.videoWidth * a.offsetWidth, r = a.videoHeight / n, (i - (a.offsetHeight - n) / 2) * r)
                };
                var c = function () {
                    t.root.focus()
                };
                this.lagometer = function (e) {
                    t.lagometerIsEnabled && (t.lagometer.activated = !0, t.lagometer.last_x = this.getRawXcoordinateFromEvent(e), t.lagometer.last_y = this.getRawYcoordinateFromEvent(e))
                }
            }
        }, {}],
        8: [function (c, e, t) {
            "use strict";
            var l = c("./util/OverlayPlugin"),
                n = {},
                r = function (t, e) {
                    l.call(this, t);
                    var r = 2 * Math.PI,
                        i = Math.PI / 2,
                        o = this;
                    (this.genymotion = t).fileUpload = this;
                    var n = t.wrapper_video;
                    if (this.isUploading = !1, this.haveError = !1, this.flashing = !1, this.canvasContext = null, this.opengappsInstalled = !1, this.capabilityAvailable = !1, this.genymotion.on("SYSTEM_PATCHER_STATUS", this.onSystemPatcherStatus.bind(this)), this.genymotion.on("SYSTEM_PATCHER_LAST_RESULT", this.onSystemPatcherLastResult.bind(this)), this.buildStepper(), this.i18n = e || {}, this.renderToolbarButton(e), this.renderWidget(e), window.Worker) {
                        var a = c("../../worker/FileUploaderWorker");
                        a = a.toString().match(/^\s*function\s*\(\s*\)\s*\{(([\s\S](?!\}$))*[\s\S])/)[1];
                        var s = new Blob([a], {
                            type: "application/javascript"
                        });
                        this.loaderWorker = new Worker(URL.createObjectURL(s)), this.loaderWorker.onmessage = function (e) {
                            var t = e.data;
                            switch (t.code) {
                                case "SUCCESS":
                                    o.onSuccess();
                                    break;
                                case "FAIL":
                                    o.onFailure();
                                    break;
                                case "PROGRESS":
                                    o.setProgress(t.value)
                            }
                        }
                    }
                    n.ondragenter = function (e) {
                        e.stopPropagation(), e.preventDefault()
                    }, n.ondragover = function (e) {
                        e.stopPropagation(), e.preventDefault()
                    }, n.ondragleave = function (e) {
                        e.stopPropagation(), e.preventDefault()
                    }, n.ondrop = function (e) {
                        e.stopPropagation(), e.preventDefault(), o.isUploading || o.upload(e.dataTransfer.files)
                    }, o.upload = function (e) {
                        if (0 < e.length) {
                            o.setProgress(0), o.createCanvasIfNeeded();
                            var t = {
                                type: "upload",
                                file: e[0]
                            };
                            o.loaderWorker.postMessage(t), o.isUploading = !0, o.haveError = !1
                        }
                    }, o.onSuccess = function () {
                        o.isUploading = !1, o.canvasContext.putImageData(o.canvasImageData, 0, 0), o.canvasContext.fillText("âœ“", 30, 80), o.canvasContext.stroke(), setTimeout(function () {
                            o.canvasContext.putImageData(o.canvasImageData, 0, 0)
                        }, 750)
                    }, o.onFailure = function () {
                        o.isUploading = !1, o.haveError = !0
                    }, o.haveNoError = function () {
                        return !o.haveError
                    }, o.haveError = function () {
                        return o.haveError
                    }, o.setProgress = function (e, t) {
                        o.haveError || o.drawProgress(e, t)
                    }, o.createCanvasIfNeeded = function () {
                        if (null === o.canvasContext) {
                            var e = document.createElement("canvas");
                            e.classList.add("uploadProgress"), e.width = 120, e.height = 120, t.wrapper.insertBefore(e, t.wrapper.firstChild), o.canvasContext = e.getContext("2d"), o.canvasImageData = null, o.canvasContext.beginPath(), o.canvasContext.strokeStyle = "#E6195E", o.canvasContext.fillStyle = "#E6195E", o.canvasContext.lineCap = "square", o.canvasContext.font = "bold 60px Arial", o.canvasContext.lineWidth = 10, o.canvasContext.closePath(), o.canvasContext.fill(), o.canvasImageData = o.canvasContext.getImageData(0, 0, 120, 120)
                        }
                    }, o.drawProgress = function (e, t) {
                        t = void 0 !== t ? t : "#E6195E", o.canvasContext.strokeStyle = t, o.canvasContext.fillStyle = t, o.canvasContext.putImageData(o.canvasImageData, 0, 0), o.canvasContext.beginPath(), o.canvasContext.arc(60, 60, 55, -i, r * e - i, !1);
                        var n = 100 !== (e = Math.round(100 * e)) ? e : "99";
                        o.canvasContext.fillText(n, 25, 80), o.canvasContext.stroke()
                    }
                };
            (r.prototype = Object.create(l.prototype)).buildStepper = function () {
                n.homeScreen = this.buildHomeScreen, n.disclaimerScreen = this.buildDisclaimerScreen, n.uploadScreen = this.buildUploadScreen, n.stepSuccess = this.buildSuccessStep, n.stepError = this.buildErrorStep
            }, r.prototype.goTo = function (e) {
                this.inputs.innerHTML = "";
                var t = n[e](this, this.i18n);
                this.title.innerHTML = t.title, this.inputs.appendChild(t.body)
            }, r.prototype.toggleCapability = function (e) {
                this.capabilityAvailable = e
            }, r.prototype.buildHomeScreen = function (t, e) {
                var n = document.createElement("div"),
                    r = document.createElement("div");
                r.className = "upload_main", r.appendChild(t.generateIconDiv("upload_main-img")), r.appendChild(t.generateTextDiv("upload_main-txt", "<p>You can install Open GApps, or upload a file: APK files will be installed, flashable archives will be flashed, and other files types will be pushed to the /sdcard/download folder on the device.</p>")), n.appendChild(r);
                var i = t.uploader = document.createElement("input");
                i.type = "file", i.setAttribute("hidden", ""), n.appendChild(i), i.onchange = function () {
                    t.isUploading || (t.toggleWidget(), t.upload(t.uploader.files))
                };
                var o = document.createElement("div");
                o.className = "upload_main_bottom_buttons";
                var a = t.generateBottomButtons(o, "Install Open GApps", function (e) {
                    e.preventDefault(), !1 === t.opengappsInstalled && t.genymotion.openGappsAvailable && t.capabilityAvailable && (t.flashing = !0, t.goTo("disclaimerScreen"))
                }, "Browse", function (e) {
                    e.preventDefault(), t.uploader.click()
                });
                return t.installButton = a[0], t.updateOpenGAppsCaps(t.opengappsInstalled), n.appendChild(o), {
                    body: n,
                    title: e.FILE_UPLOAD_TITLE || "Upload file to the virtual device"
                }
            }, r.prototype.updateOpenGAppsCaps = function (e) {
                if (this.opengappsInstalled = e, this.installButton) return this.genymotion.openGappsAvailable ? this.capabilityAvailable ? void (this.installButton.title = e ? (this.installButton.className = "upload_main_bottom_buttons-left upload_main_bottom_buttons_disabled dont_close", this.installButton.innerHTML = "Open GApps installed", "Open GApps are already installed") : (this.installButton.className = "upload_main_bottom_buttons-left dont_close", this.installButton.innerHTML = "Install Open GApps")) : (this.installButton.className = "upload_main_bottom_buttons-left upload_main_bottom_buttons_disabled dont_close", this.installButton.innerHTML = "Install Open GApps", void (this.installButton.title = "Open GApps are not available for this virtual device")) : (this.installButton.className = "upload_main_bottom_buttons-left upload_main_bottom_buttons_disabled dont_close", this.installButton.innerHTML = "Install Open GApps", void (this.installButton.title = "Open GApps are not available for this Android version"))
            }, r.prototype.buildDisclaimerScreen = function (t, e) {
                var n = document.createElement("div"),
                    r = document.createElement("div");
                r.className = "upload_disclaimer", r.appendChild(t.generateTextDiv("upload_disclaimer-txt", "<p>PLEASE NOTE<br/>    GENYMOBILE INC., ASSUMES NO LIABILITY WHATSOEVER RESULTING FROM THE DOWNLOAD,    INSTALL AND USE OF GOOGLE PLAY SERVICES WITHIN YOUR VIRTUAL DEVICES. YOU ARE    SOLELY RESPONSIBLE FOR THE USE AND ASSUME ALL LIABILITY RELATED THERETO.    MOREOVER    <br/><br/>    GENYMOBILE INC. DISCLAIMS ANY WARRANTIES OF ANY KIND, EITHER EXPRESS OR IMPLIED,    INCLUDING, WITHOUT LIMITATION, IMPLIED WARRANTIES OF MERCHANTABILITY, OR FITNESS    FOR A PARTICULAR PURPOSE REGARDING THE COMPATIBILITY OF THE OPENGAPPS PACKAGES    WITH ANY VERSION OF GENYMOTION. IN NO EVENT SHALL GENYMOBILE INC. OR ITS AFFILIATES,    OR THEIR RESPECTIVE OFFICERS, DIRECTORS, EMPLOYEES, OR AGENTS BE LIABLE WITH RESPECT    TO YOUR DOWNLOAD OR USE OF THE GOOGLE PLAY SERVICES AND YOU RELEASE GENYMOBILE INC.    FROM ANY LIABILITY RELATED THERETO. YOU AGREE TO DEFEND, INDEMNIFY AND HOLD HARMLESS    GENYMOBILE INC. FOR ANY CLAIMS OR COSTS RELATED TO YOUR USE OR DOWNLOAD OF THE GOOGLE    PLAY SERVICES.        </p>")), n.appendChild(r);
                var i = document.createElement("div");
                return i.className = "upload_main_bottom_buttons", t.generateBottomButtons(i, "Back", function (e) {
                    e.preventDefault(), t.flashing = !1, t.goTo("homeScreen")
                }, "Install", function (e) {
                    e.preventDefault();
                    t.genymotion.sendEventMessage(JSON.stringify({
                        channel: "systempatcher",
                        messages: ["install opengapps"]
                    })), t.goTo("uploadScreen")
                }), n.appendChild(i), {
                        body: n,
                        title: e.UPLOAD_DISCLAIMER || "You are about to install Open GApps on your virtual device"
                    }
            }, r.prototype.onSystemPatcherStatus = function (e) {
                var t = e.split(" ");
                if ("downloading" === t[0]) {
                    var n = parseInt(t[2]);
                    if (0 !== n) {
                        var r = parseInt(t[1]),
                            i = Math.round(100 * r / n);
                        document.getElementsByClassName("upload_inprogress-txt-percent")[0].innerHTML = i + "%", document.getElementsByClassName("upload_inprogress-percent")[0].style.width = i + "%";
                        var o = "Downloading " + Math.round(10 * r / 1048576) / 10 + " Mb/" + Math.round(10 * n / 1048576) / 10 + " Mb";
                        document.getElementsByClassName("upload_inprogress-txt-progress")[0].innerHTML = o
                    }
                } else if ("installing" === t[0]) document.getElementsByClassName("upload_inprogress-txt-progress")[0].innerHTML = "Installing...";
                else if ("ready" === t[0]) {
                    if (t[1] && -1 !== t[1].indexOf("opengapps") && this.updateOpenGAppsCaps(!0), !this.flashing) return;
                    this.genymotion.sendEventMessage(JSON.stringify({
                        channel: "systempatcher",
                        messages: ["notify last_result"]
                    }))
                }
            }, r.prototype.onSystemPatcherLastResult = function (e) {
                switch (e) {
                    case "success":
                        this.goTo("stepSuccess");
                        break;
                    case "unavailable":
                    case "network_error":
                    case "corrupted_archive":
                    case "install_error":
                        this.goTo("stepError")
                }
            }, r.prototype.buildUploadScreen = function (t, e) {
                var n = document.createElement("div"),
                    r = document.createElement("div");
                r.className = "upload_inprogress";
                var i = t.generateTextDiv("upload_inprogress-txt-progress", ""),
                    o = t.generateTextDiv("upload_inprogress-txt-percent", ""),
                    a = t.generateTextDiv("upload_inprogress-bg-percent", ""),
                    s = t.generateTextDiv("upload_inprogress-percent", "");
                s.style.width = "0%", a.appendChild(s), r.appendChild(i), r.appendChild(o), r.appendChild(a), n.appendChild(r);
                var c = document.createElement("div");
                return c.className = "upload_main_bottom_buttons", t.generateBottomButtons(c, null, null, "Cancel", function (e) {
                    e.preventDefault();
                    t.genymotion.sendEventMessage(JSON.stringify({
                        channel: "systempatcher",
                        messages: ["cancel"]
                    })), t.goTo("disclaimerScreen")
                }), n.appendChild(c), {
                        body: n,
                        title: e.UPLOAD_INPROGRESS || "Downloading"
                    }
            }, r.prototype.buildSuccessStep = function (t, e) {
                var n = document.createElement("div"),
                    r = document.createElement("div");
                return r.className = "upload_success", r.appendChild(t.generateIconDiv("upload_success-img")), r.appendChild(t.generateTextDiv("upload_success-caption", "Congratulation!")), r.appendChild(t.generateTextDiv("upload_success-txt", "<p>Open GApps have been successfully     installed on the virtual device.<br/>Please restart the virtual device to complete the installation.<br/>    You will be redirected to the Open GApps website.</p>")), r.appendChild(t.generateButton("upload_success-button", "Reboot device", function (e) {
                    e.preventDefault();
                    t.genymotion.sendEventMessage(JSON.stringify({
                        channel: "systempatcher",
                        messages: ["reboot"]
                    })), t.toggleWidget()
                })), n.appendChild(r), {
                        body: n,
                        title: e.FILE_UPLOAD_TITLE || "Open GApps successfully installed"
                    }
            }, r.prototype.buildErrorStep = function (e, t) {
                var n = document.createElement("div"),
                    r = document.createElement("div");
                return r.className = "upload_error", r.appendChild(e.generateIconDiv("upload_error-img")), r.appendChild(e.generateTextDiv("upload_error-caption", "Failed to install Open GApps")), n.appendChild(r), {
                    body: n,
                    title: t.FILE_UPLOAD_TITLE || "Weâ€™ve got a problemâ€¦"
                }
            }, r.prototype.renderToolbarButton = function (e) {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var t = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        n = document.createElement("li"),
                        r = this.toolbarBtnImage = document.createElement("div");
                    r.className = "genymotion_button uploader_button", r.title = e.FILE_UPLOAD_TITLE || "File upload", n.appendChild(r), n.onclick = this.toggleWidget.bind(this), t.appendChild(n)
                }
            }, r.prototype.toggleWidget = function () {
                this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable"), this.goTo("homeScreen")) : this.genymotion.emit("keyboard-enable"), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, r.prototype.renderWidget = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.container = document.createElement("div");
                this.title = document.createElement("div"), this.title.className += "upload-title", n.appendChild(this.title), this.inputs = document.createElement("div"), this.inputs.className += "fileupload_content", n.appendChild(this.inputs), t.className = "genymotion-overlay upload-form hidden";
                var r = document.createElement("div");
                r.className += "close-btn", r.onclick = this.toggleWidget.bind(this), t.appendChild(r), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, r.prototype.generateBottomButtons = function (e, t, n, r, i) {
                e.innerHTML = "";
                var o = [null, null];
                if (t) {
                    var a = this.generateButton("upload_main_bottom_buttons-left dont_close", t, n);
                    e.appendChild(a), o[0] = a
                }
                if (r) {
                    var s = this.generateButton("upload_main_bottom_buttons-right dont_close", r, i);
                    e.appendChild(s), o[1] = s
                }
                return o
            }, r.prototype.generateButton = function (e, t, n) {
                var r = document.createElement("div");
                return r.className = e, r.innerHTML = t, r.onclick = n, r
            }, r.prototype.generateIconDiv = function (e) {
                var t = document.createElement("span");
                return t.className = "upload_icon " + e, t
            }, r.prototype.generateTextDiv = function (e, t) {
                var n = document.createElement("div");
                return n.className = e, n.innerHTML = t, n
            }, e.exports = r
        }, {
            "../../worker/FileUploaderWorker": 26,
            "./util/OverlayPlugin": 23
        }],
        9: [function (e, t, n) {
            "use strict";
            t.exports = function (e) {
                var t = e,
                    n = t.fullscreen = this;
                if (t.getChildByClass(t.root, "toolbar")) {
                    this.launchIntoFullscreen = function (e) {
                        t.wrapper.classList.add("fullscreen"), a.classList.add("active"), e.requestFullscreen ? e.requestFullscreen() : e.mozRequestFullScreen ? e.mozRequestFullScreen() : e.webkitRequestFullscreen ? e.webkitRequestFullscreen() : e.msRequestFullscreen && e.msRequestFullscreen()
                    };
                    var r = function () {
                        return document.fullScreenElement || document.msFullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement
                    };
                    if (this.exitFullscreen = function () {
                        t.wrapper.classList.remove("fullscreen"), a.classList.remove("active"), r() && (document.exitFullscreen ? document.exitFullscreen() : document.mozCancelFullScreen ? document.mozCancelFullScreen() : document.webkitExitFullscreen ? document.webkitExitFullscreen() : document.msExitFullscreen && document.msExitFullscreen())
                    }, void 0 !== t.getChildByClass(t.root, "fullscreen_message")) {
                        var i = t.getChildByClass(t.root, "fullscreen_message");
                        i.onclick = function () {
                            i.classList.add("hide"), t.wrapper.classList.remove("hide"), n.launchIntoFullscreen(t.root)
                        }
                    } else {
                        var o = t.getChildByClass(t.root, "toolbar").children[0];
                        n.button = document.createElement("li");
                        var a = document.createElement("div");
                        a.className += "genymotion_button fullscreenWidget", a.title = "Fullscreen", n.button.appendChild(a), o.appendChild(n.button), n.button.onclick = function () {
                            r() ? n.exitFullscreen() : n.launchIntoFullscreen(t.root)
                        }
                    }
                    document.addEventListener && (document.addEventListener("webkitfullscreenchange", s, !1), document.addEventListener("mozfullscreenchange", s, !1), document.addEventListener("fullscreenchange", s, !1), document.addEventListener("MSFullscreenChange", s, !1))
                }

                function s() {
                    (document.webkitIsFullScreen || document.mozFullScreen || null !== document.msFullscreenElement) && (r() || n.exitFullscreen())
                }
            }
        }, {}],
        10: [function (e, t, n) {
            "use strict";
            var r = e("./util/OverlayPlugin"),
                i = e("loglevel");

            function o(e, t) {
                r.call(this, e), (e.gps = this).genymotion = e, this.fields = ["altitude", "longitude", "latitude", "accuracy", "bearing"], this.map = null, "undefined" != typeof google ? this.elevationService = new google.maps.ElevationService : (i.error("Cant find Google Maps API object, did you forget to embed it?"), this.elevationService = !1), this.markers = [], this.mapLat = 65.9667, this.mapLng = -18.5333, this.elevation = 15.04444408, this.minimumZoomLevel = 8, this.i18n = t || {}, this.renderToolbarButton(t), this.renderGPSForm(t), this.renderMapView(t)
            } (o.prototype = Object.create(r.prototype)).renderToolbarButton = function (e) {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var t = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        n = this.toolbarBtn = document.createElement("li"),
                        r = this.toolbarBtnImage = document.createElement("div");
                    r.className += "genymotion_button gps_button", r.title = e.GPS_TITLE || "GPS", n.appendChild(r), n.onclick = this.toggleForm.bind(this), t.appendChild(n)
                }
            }, o.prototype.renderMapView = function (e) {
                var t = this.mapWidget = document.createElement("div"),
                    n = this.mapview = document.createElement("div"),
                    r = document.createElement("button");
                r.innerHTML = e.GPS_CAPTURE || "Capture", r.className += "gps-mapview-capture", r.onclick = this.onMapCaptureClick.bind(this);
                var i = document.createElement("button");
                i.innerHTML = e.GPS_CANCEL || "Cancel", i.className += "gps-mapview-cancel", i.onclick = this.onMapCancelClick.bind(this), n.className = "mapview", t.className += "genymotion-overlay gps-mapview hidden", t.appendChild(n), t.appendChild(r), t.appendChild(i), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, o.prototype.loadMap = function () {
                var e = {};
                this.getLocationInfo(e), "undefined" != typeof google && (this.map = new google.maps.Map(this.mapview, {
                    center: {
                        lat: e.latitude,
                        lng: e.longitude
                    },
                    zoom: this.minimumZoomLevel
                }), this.captureMapLocation(e.latitude, e.longitude), this.map.addListener("click", function (e) {
                    this.clearMapMarkers(), this.captureMapLocation(e.latLng.lat(), e.latLng.lng())
                }.bind(this)))
            }, o.prototype.toggleMapview = function () {
                this.mapWidget.classList.toggle("hidden")
            }, o.prototype.generateInput = function (e, t, n, r, i, o) {
                var a = document.createElement("div"),
                    s = document.createElement("label");
                s.innerHTML = t, a.appendChild(s);
                var c = document.createElement("input");
                return c.type = "number", c.id = "gps-" + e, c.defaultValue = n, c.min = r, c.max = i, c.step = o, c.addEventListener("keyup", this.checkErrors.bind(this)), a.appendChild(c), a
            }, o.prototype.checkErrors = function () {
                var n = !1;
                this.fields.forEach(function (e) {
                    var t = document.getElementById("gps-" + e);
                    !1 === t.checkValidity() ? (t.classList.add("error"), n = !0) : t.classList.remove("error")
                }), document.getElementById("gps-submit").disabled = n
            }, o.prototype.renderGPSForm = function (e) {
                var t = this.formWidget = document.createElement("div"),
                    n = this.form = document.createElement("form"),
                    r = document.createElement("div"),
                    i = document.createElement("div");
                i.className += "title", i.innerHTML = e.GPS_TITLE || "GPS", n.appendChild(i);
                var o = document.createElement("div");
                o.className += "col";
                var a = e.GPS_LATITUDE || "Latitude";
                o.appendChild(this.generateInput("latitude", a, this.mapLat, -90, 90, "any"));
                var s = e.GPS_LONGITUDE || "Longitude";
                o.appendChild(this.generateInput("longitude", s, this.mapLng, -180, 180, "any"));
                var c = e.GPS_ALTITUDE || "Altitude";
                o.appendChild(this.generateInput("altitude", c, this.elevation, -1e4, 1e4, "any"));
                var l = e.GPS_ACCURACY || "Accuracy (m)";
                o.appendChild(this.generateInput("accuracy", l, 0, 0, 200, "any"));
                var d = e.GPS_BEARING || "Bearing (Â°)";
                o.appendChild(this.generateInput("bearing", d, 0, 0, 360, "any"));
                var u = document.createElement("div"),
                    p = document.createElement("div"),
                    f = document.createElement("div"),
                    h = document.createElement("button"),
                    v = document.createElement("button");
                u.className += "col", p.className += "map-wrap", h.className += "map", h.innerHTML = e.GPS_MAP || "MAP", h.onclick = this.onMapBtnClick.bind(this), f.className += "geoloc-wrap", f.id = "geoloc-wrap", v.className += "gps-geoloc", v.id = "gps-geoloc", v.innerHTML = e.GPS_GEOLOC || "My position", v.onclick = this.onGeolocBtnClick.bind(this), p.appendChild(h), f.appendChild(v), u.appendChild(p), u.appendChild(f), r.className += "wrap", r.appendChild(o), r.appendChild(u), n.appendChild(r);
                var g = document.createElement("button");
                g.innerHTML = e.GPS_SUBMIT || "Submit", g.className += "gps-submit", g.id = "gps-submit", g.onclick = this.onFormSubmit.bind(this), n.appendChild(g), t.className += "genymotion-overlay gps-form hidden";
                var m = document.createElement("div");
                m.className += "close-btn", m.onclick = this.toggleForm.bind(this), t.appendChild(m), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, o.prototype.toggleForm = function () {
                this.formWidget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable")) : this.genymotion.emit("keyboard-enable"), this.checkForGeolocation(), this.formWidget.classList.toggle("hidden"), this.mapWidget.classList.add("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, o.prototype.toggleGeolocBtn = function (e, t) {
                document.getElementById("gps-geoloc").disabled = !e;
                var n = document.getElementById("geoloc-wrap");
                n.title = e ? t.GPS_GEOLOC_TOOLTIP || "Get my position from browser location" : t.GPS_NOGEOLOC_TOOLTIP || "Geolocation not supported"
            }, o.prototype.onMapBtnClick = function (e) {
                e.preventDefault(), this.toggleMapview(), this.loadMap()
            }, o.prototype.onGeolocBtnClick = function (e) {
                e.preventDefault(), this.getLocation()
            }, o.prototype.onMapCaptureClick = function (e) {
                e.preventDefault(), this.setFieldValue("gps-latitude", this.mapLat), this.setFieldValue("gps-longitude", this.mapLng), this.setFieldValue("gps-altitude", this.elevation), this.toggleMapview()
            }, o.prototype.onMapCancelClick = function (e) {
                e.preventDefault(), this.mapWidget.classList.add("hidden")
            }, o.prototype.onFormSubmit = function (e) {
                e.preventDefault();
                var t = this.buildEventJson();
                this.genymotion.sendEventMessage(JSON.stringify(t)), this.toggleForm()
            }, o.prototype.getLocation = function () {
                var n = this;
                "geolocation" in navigator && navigator.geolocation.getCurrentPosition(function (t) {
                    if (t && t.coords && (n.fields.forEach(function (e) {
                        t.coords[e] && n.setFieldValue("gps-" + e, t.coords[e])
                    }), !t.coords.altitude && n.elevationService && t.coords.latitude && t.coords.longitude)) {
                        var e = new google.maps.LatLng(t.coords.latitude, t.coords.longitude);
                        n.elevationService.getElevationForLocations({
                            locations: [e]
                        }, function (e, t) {
                            "OK" === t && e[0] && n.setFieldValue("gps-altitude", e[0].elevation)
                        })
                    }
                })
            }, o.prototype.checkForGeolocation = function () {
                var e = this;
                "geolocation" in navigator ? navigator.geolocation.getCurrentPosition(function () {
                    e.toggleGeolocBtn(!0, e.i18n)
                }, function () {
                    e.toggleGeolocBtn(!1, e.i18n)
                }) : e.toggleGeolocBtn(!1, e.i18n)
            }, o.prototype.setFieldValue = function (e, t) {
                var n = document.getElementById(e);
                n.max && n.max < t ? n.value = n.max : n.min && n.min > t ? n.value = n.min : n.value = t
            }, o.prototype.getLocationInfo = function (t) {
                return this.fields.map(function (e) {
                    t[e] = +document.getElementById("gps-" + e).value || 0
                })
            }, o.prototype.buildEventJson = function () {
                var t = {},
                    n = {};
                return this.getLocationInfo(t), this.genymotion.useRedis ? (n = {
                    channel: "gps",
                    messages: []
                }, this.fields.forEach(function (e) {
                    n.messages.push("set " + e + " " + t[e])
                }), n.messages.push("enable")) : (n = t).type = "GPS", n
            }, o.prototype.captureMapLocation = function (e, t) {
                var n = this;
                this.mapLat = e, this.mapLng = t;
                var r = new google.maps.Marker({
                    position: {
                        lat: this.mapLat,
                        lng: this.mapLng
                    },
                    map: this.map
                });
                if (this.markers.push(r), this.map && this.map.getZoom() < this.minimumZoomLevel && (this.map.setCenter(r.getPosition()), this.map.setZoom(this.minimumZoomLevel)), this.elevationService) {
                    var i = new google.maps.LatLng(e, t);
                    this.elevationService.getElevationForLocations({
                        locations: [i]
                    }, function (e, t) {
                        "OK" === t && e[0] && (n.elevation = e[0].elevation)
                    })
                }
            }, o.prototype.clearMapMarkers = function () {
                this.markers.forEach(function (e) {
                    e.setMap(null)
                }), this.markers = []
            }, t.exports = o
        }, {
            "./util/OverlayPlugin": 23,
            loglevel: 29
        }],
        11: [function (e, t, n) {
            "use strict";
            var r = e("./util/OverlayPlugin"),
                i = e("lodash"),
                v = e("./util/iothrottling-profiles");

            function o(e, t) {
                r.call(this, e), this.fields = {}, t = t || {}, ((this.genymotion = e).diskIO = this).renderToolbarButton(t), this.renderWidget(t)
            } (o.prototype = Object.create(r.prototype)).renderToolbarButton = function (e) {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var t = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        n = this.toolbarBtn = document.createElement("li"),
                        r = this.toolbarBtnImage = document.createElement("div");
                    r.className += "genymotion_button iothrottling_button", r.title = e.IOTHROTTLING_TITLE || "Disk I/O", n.appendChild(r), n.onclick = this.toggleWidget.bind(this), t.appendChild(n)
                }
            }, o.prototype.renderWidget = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.form = document.createElement("form"),
                    r = document.createElement("div");
                r.className += "title", r.innerHTML = e.IOTHROTTLING_TITLE || "Disk I/O", n.appendChild(r);
                var i = document.createElement("div");
                i.className += "inputs";
                var o = e.IOTHROTTLING_VALUE || "Profile";
                i.innerHTML = "<label>" + o + "</label>";
                var a = this.select = document.createElement("select"),
                    s = document.createElement("option");
                s.innerHTML = e.IOTHROTTLING_PROFILE || "None", a.appendChild(s), a.onchange = this.changeProfile.bind(this), i.appendChild(a), v.forEach(function (e) {
                    var t = document.createElement("option");
                    t.value = e.name, t.innerHTML = e.label, a.appendChild(t)
                });
                var c = this.readByteRateDiv = document.createElement("div");
                c.classList.add("fields");
                var l = document.createElement("label");
                l.innerHTML = e.READ_BYTE_RATE || "Read speed limit:";
                var d = this.readByteRate = document.createElement("input");
                d.placeholder = e.EXAMPLE_READ_BYTE_RATE || "eg: 100", d.title = e.READ_BYTE_RATE || "Read speed limit", d.required = !0, d.pattern = "[0-9]*", c.appendChild(l), (l = document.createElement("label")).innerHTML = e.UNIT_BYTERATE || "MiB per sec", l.classList.add("units"), c.appendChild(l), c.appendChild(d);
                var u = this.submitBtn = document.createElement("button");
                u.innerHTML = e.IOTHROTTLING_UPDATE || "Update", u.onclick = this.submit.bind(this);
                var p = this.clearCacheBtn = document.createElement("button");
                p.innerHTML = e.IOTHOTTLING_CLEARCACHE || "Clear cache", p.onclick = this.clearCache.bind(this);
                var f = document.createElement("div");
                f.appendChild(p), n.appendChild(i), n.appendChild(c), n.appendChild(f), n.appendChild(u), this.setFieldsReadonly(!0), this.resetFields("0"), this.displayFields(!1), t.className = "genymotion-overlay iothrottling-form hidden";
                var h = document.createElement("div");
                h.className += "close-btn", h.onclick = this.toggleWidget.bind(this), t.appendChild(h), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, o.prototype.setFieldsReadonly = function (e) {
                this.readByteRate.readOnly = e
            }, o.prototype.resetFields = function (e) {
                e = void 0 !== e ? e : "", this.readByteRate.value = e
            }, o.prototype.displayFields = function (e) {
                e ? this.readByteRateDiv.classList.remove("hidden") : this.readByteRateDiv.classList.add("hidden")
            }, o.prototype.toggleWidget = function () {
                this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable")) : this.genymotion.emit("keyboard-enable"), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, o.prototype.submit = function (e) {
                if (e.preventDefault(), this.form.checkValidity()) {
                    var t = {};
                    t = this.genymotion.useRedis ? {
                        channel: "diskio",
                        messages: ["set readbyterate " + 1048576 * this.readByteRate.value, "clearcache"]
                    } : {
                            type: "BLK",
                            partition: "data",
                            read_bps: 1048576 * this.readByteRate.value,
                            flush: "yes"
                        }, this.genymotion.sendEventMessage(JSON.stringify(t)), this.toggleWidget()
                }
            }, o.prototype.clearCache = function (e) {
                e.preventDefault();
                var t = {};
                t = this.genymotion.useRedis ? {
                    channel: "diskio",
                    messages: ["clearcache"]
                } : {
                        type: "BLK",
                        partition: "data",
                        flush: "yes"
                    }, this.genymotion.sendEventMessage(JSON.stringify(t))
            }, o.prototype.changeProfile = function () {
                var e = i.find(v, {
                    name: this.select.value
                });
                e && "Custom" !== e.name ? (this.loadDetails(e), this.displayFields(!0)) : e && "Custom" === e.name ? (this.setFieldsReadonly(!1), this.displayFields(!0)) : (this.resetFields("0"), this.displayFields(!1))
            }, o.prototype.loadDetails = function (e) {
                "Custom" !== e.name && (this.setFieldsReadonly(!0), this.readByteRate.value = e.readByteRate)
            }, t.exports = o
        }, {
            "./util/OverlayPlugin": 23,
            "./util/iothrottling-profiles": 24,
            lodash: 28
        }],
        12: [function (e, t, n) {
            "use strict";
            var r = e("./util/OverlayPlugin"),
                c = "0123456789abcdef";

            function i(e, t) {
                r.call(this, e), this.androidError = !1, this.deviceError = !1, t = t || {}, ((this.genymotion = e).identifiers = this).renderToolbarButton(t), this.renderWidget(t), this.genymotion.on("ANDROID_ID", function (e) {
                    this.androidInput.value = e
                }.bind(this)), this.genymotion.on("IMEI", function (e) {
                    this.deviceInput.value = e
                }.bind(this))
            } (i.prototype = Object.create(r.prototype)).renderToolbarButton = function (e) {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var t = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        n = this.toolbarBtn = document.createElement("li"),
                        r = this.toolbarBtnImage = document.createElement("div");
                    r.className += "genymotion_button imei_button", r.title = e.IDENTIFIERS_TITLE || "Identifiers", n.appendChild(r), n.onclick = this.toggleWidget.bind(this), t.appendChild(n)
                }
            }, i.prototype.renderWidget = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.container = document.createElement("div"),
                    r = document.createElement("div");
                r.className += "title", r.innerHTML = e.IDENTIFIERS || "Identifiers", n.appendChild(r);
                var i = document.createElement("div");
                i.className += "inputs";
                var o = this.generateField("android", "Android ID", "", e),
                    a = this.generateField("device", "Device ID", "(IMEI/MEID)", e);
                i.appendChild(o), i.appendChild(a);
                var s = this.submitBtn = document.createElement("button");
                s.innerHTML = e.IDENTIFIERS_UPDATE || "Update", s.className = "action", i.appendChild(s), s.onclick = this.submit.bind(this), n.appendChild(i), t.className = "genymotion-overlay imei-form hidden";
                var c = document.createElement("div");
                c.className += "close-btn", c.onclick = this.toggleWidget.bind(this), t.appendChild(c), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, i.prototype.toggleWidget = function () {
                this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable")) : this.genymotion.emit("keyboard-enable"), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, i.prototype.submit = function (e) {
                e.preventDefault();
                var t = this.androidInput.value,
                    n = this.deviceInput.value,
                    r = {};
                this.genymotion.useRedis ? (t && this.androidInput.checkValidity() && (r = {
                    channel: "framework",
                    messages: ["set parameter android_id:" + t]
                }, this.genymotion.sendEventMessage(JSON.stringify(r))), n && this.deviceInput.checkValidity() && (r = {
                    channel: "settings",
                    messages: ["set parameter device_id:" + n]
                }, this.genymotion.sendEventMessage(JSON.stringify(r)))) : (r = {
                    type: "IMEI",
                    imei: n,
                    androidId: t
                }, this.genymotion.sendEventMessage(JSON.stringify(r))), this.toggleWidget()
            }, i.prototype.generateandroid = function (e) {
                e && e.preventDefault(), this.androidInput.value = this.generateHash(16, c), this.androidError = !1, this.checkErrors()
            }, i.prototype.validateandroid = function () {
                this.androidError = !this.androidInput.checkValidity() && this.androidInput.value, this.checkErrors()
            }, i.prototype.generatedevice = function (e) {
                e && e.preventDefault(), this.deviceInput.value = this.generateHash(15, "0123456789"), this.deviceError = !1, this.checkErrors()
            }, i.prototype.validatedevice = function () {
                this.deviceError = !this.deviceInput.checkValidity() && this.deviceInput.value, this.checkErrors()
            }, i.prototype.checkErrors = function () {
                this.androidInput.classList[this.androidError ? "add" : "remove"]("error"), this.deviceInput.classList[this.deviceError ? "add" : "remove"]("error"), this.submitBtn.disabled = this.androidError || this.deviceError
            }, i.prototype.generateField = function (e, t, n, r) {
                var i = document.createElement("div"),
                    o = document.createElement("div");
                o.className = "input-group";
                var a = this[e + "Input"] = document.createElement("input");
                a.type = "text", a.required = !0, a.addEventListener("keyup", this["validate" + e].bind(this)), o.appendChild(a), "device" === e ? (a.maxLength = 15, a.pattern = "[" + c + "]{14,15}") : "android" === e && (a.maxLength = 16, a.pattern = "[" + c + "]{16}");
                var s = this[e + "Gen"] = document.createElement("button");
                return s.innerHTML = r.IDENTIFIERS_GENERATE || "Generate", s.onclick = this["generate" + e].bind(this), o.appendChild(s), i.className = e + "-id", i.innerHTML = "<label>" + t + '<i class="description">' + n + "</i></label>", i.appendChild(o), i
            }, i.prototype.generateHash = function (e, t) {
                for (var n = "", r = 0; r < e; r++) n += t.charAt(Math.floor(Math.random() * t.length));
                return n
            }, t.exports = i
        }, {
            "./util/OverlayPlugin": 23
        }],
        13: [function (e, t, n) {
            "use strict";
            t.exports = function (e) {
                var i = e,
                    t = this;
                this.transmitKeys = !0, this.isListenerAdded = !1, e.keyboardEvents = this, e.keyboardEventsAreEnabled = !0, this.invisibleKeys = {
                    8: "0x01000003",
                    9: "0x01000001",
                    13: "0x01000005",
                    16: "0x01000020",
                    17: "0x01000021",
                    18: "0x01000023",
                    20: "0x01000024",
                    27: "0x01000000",
                    32: "0x20",
                    33: "0x01000016",
                    34: "0x01000017",
                    35: "0x01000011",
                    36: "0x01000010",
                    37: "0x01000012",
                    38: "0x01000013",
                    39: "0x01000014",
                    40: "0x01000015",
                    45: "0x01000006",
                    46: "0x01000007",
                    91: "0x01000022",
                    93: "0x01000022",
                    224: "0x01000022"
                }, e.on("keyboard-disable", function () {
                    this.transmitKeys = !1
                }.bind(this)), e.on("keyboard-enable", function () {
                    this.transmitKeys = !0
                }.bind(this)), this.onKeyPress = function (e) {
                    if (this.transmitKeys) {
                        var t = e.charCode,
                            n = void 0 !== e.key ? e.key : String.fromCharCode(t);
                        "Spacebar" === n && (n = " ");
                        var r = {
                            type: "KEYBOARD_PRESS",
                            keychar: n,
                            keycode: t
                        };
                        i.sendEventMessage(JSON.stringify(r)), r = {
                            type: "KEYBOARD_RELEASE",
                            keychar: n,
                            keycode: t
                        }, i.sendEventMessage(JSON.stringify(r))
                    }
                }, this.onKeyDown = function (e) {
                    if (!this.transmitKeys) return !0;
                    var t = e.keyCode;
                    if (void 0 === this.invisibleKeys[t]) return !0;
                    var n = {
                        type: "KEYBOARD_PRESS",
                        keychar: "",
                        keycode: t = parseInt(this.invisibleKeys[t], 16)
                    };
                    return i.sendEventMessage(JSON.stringify(n)), e.preventDefault(), e.stopPropagation(), e.returnValue = !1
                }, this.onKeyUp = function (e) {
                    if (!this.transmitKeys) return !0;
                    var t = e.keyCode;
                    if (void 0 === this.invisibleKeys[t]) return !0;
                    var n = {
                        type: "KEYBOARD_RELEASE",
                        keychar: "",
                        keycode: t = parseInt(this.invisibleKeys[t], 16)
                    };
                    return i.sendEventMessage(JSON.stringify(n)), e.preventDefault(), e.stopPropagation(), e.returnValue = !1
                }, this.addKeyboardCallbacks = function () {
                    i.root.tabIndex = 0, t.isListenerAdded || (i.root.addEventListener("keypress", t.onKeyPress.bind(t)), i.root.addEventListener("keydown", t.onKeyDown.bind(t)), i.root.addEventListener("keyup", t.onKeyUp.bind(t)), i.root.focus(), t.isListenerAdded = !0)
                }
            }
        }, {}],
        14: [function (e, t, n) {
            "use strict";
            var d = e("loglevel");
            t.exports = function (e) {
                var n, r, i = this;
                (this.genymotion = e).lagometer = this, e.lagometerIsEnabled = !0, this.activated = !1, this.last_x = 0, this.last_y = 0;
                var o = [],
                    a = document.createElement("h3");
                e.root.insertBefore(a, e.root.firstChild);
                var s = document.createElement("canvas");
                e.root.appendChild(s), e.video.onresize = function () {
                    new this.lagCalculator(i.genymotion.video)
                }, this.lagCalculator = function (e) {
                    this.video = e, this.viewport = s.getContext("2d"), this.width = e.videoWidth, this.height = e.videoHeight, this.framebuffer = document.createElement("canvas"), this.framebuffer.width = this.width, this.framebuffer.height = this.height, this.ctx = this.framebuffer.getContext("2d");
                    var t = this;
                    this.video.addEventListener("play", function () {
                        t.render()
                    }, !1), this.render = function () {
                        if (!this.video.paused && !this.video.ended) {
                            this.renderFrame();
                            var e = this;
                            setTimeout(function () {
                                e.render()
                            }, 10)
                        }
                    }, this.renderFrame = function () {
                        if (this.ctx.drawImage(this.video, 0, 0, this.video.videoWidth, this.video.videoHeight, 0, 0, this.width, this.height), void 0 !== i.last_x && void 0 !== i.last_y && i.activated)
                            if (void 0 !== r) {
                                if (l(this.ctx.getImageData(i.last_x, i.last_y, 1, 1).data) !== r) {
                                    r = void 0, i.activated = !1;
                                    var e = Date.now() - n;
                                    o.push(e), c()
                                }
                            } else r = l(this.ctx.getImageData(i.last_x, i.last_y, 1, 1).data), n = Date.now()
                    }
                };
                var c = function () {
                    for (var e = 0, t = 0, n = o.length, r = n - 1; 0 <= r && n - 11 < r; r--) t++ , e += o[r];
                    var i = "last " + o[n - 1] + "ms | avg of 10 last:" + e / t + "ms";
                    a.innerHTML = i, d.debug(i)
                },
                    l = function (e) {
                        return e[0] << 16 + e[1] << 8 + e[2]
                    }
            }
        }, {
            loglevel: 29
        }],
        15: [function (e, t, n) {
            "use strict";
            t.exports = function (e) {
                var r = e,
                    n = this;
                r.mouseEvents = this, r.mouseEventsAreEnabled = !0, this.leftButtonPressed = !1, this.pressEvent = function (e) {
                    if (r.video.muted = !1, 0 === e.button) {
                        e.preventDefault(), e.stopPropagation(), this.leftButtonPressed = !0, r.x = r.coordinateUtils.getXcoordinate(e), r.y = r.coordinateUtils.getYcoordinate(e), r.coordinateUtils.lagometer(e);
                        var t = "";
                        t = e.ctrlKey || e.metaKey ? {
                            type: "FAKE_MULTI_TOUCH_PRESS",
                            mode: e.shiftKey ? 2 : 1,
                            x: r.x,
                            y: r.y
                        } : {
                                type: "MOUSE_PRESS",
                                x: r.x,
                                y: r.y
                            }, r.sendEventMessage(JSON.stringify(t)), document.addEventListener("mouseup", n.releaseAtPreviousPositionEvent, !1)
                    }
                }, this.releaseEvent = function (e) {
                    if (0 === e.button) {
                        e.preventDefault(), e.stopPropagation(), this.leftButtonPressed = !1, r.x = r.coordinateUtils.getXcoordinate(e), r.y = r.coordinateUtils.getYcoordinate(e);
                        var t = "";
                        t = e.ctrlKey || e.metaKey ? {
                            type: "FAKE_MULTI_TOUCH_RELEASE",
                            mode: e.shiftKey ? 2 : 1,
                            x: r.x,
                            y: r.y
                        } : {
                                type: "MOUSE_RELEASE",
                                x: r.x,
                                y: r.y
                            }, r.sendEventMessage(JSON.stringify(t)), document.removeEventListener("mouseup", n.releaseAtPreviousPositionEvent, !1)
                    }
                }, this.releaseAtPreviousPositionEvent = function (e) {
                    if (0 === e.button) {
                        e.preventDefault(), e.stopPropagation(), this.leftButtonPressed = !1;
                        var t = {
                            type: e.ctrlKey || e.metaKey ? "FAKE_MULTI_TOUCH_RELEASE" : "MOUSE_RELEASE",
                            x: r.x,
                            y: r.y
                        };
                        r.sendEventMessage(JSON.stringify(t)), document.removeEventListener("mouseup", n.releaseAtPreviousPositionEvent, !1)
                    }
                }, this.moveEvent = function (e) {
                    if (this.leftButtonPressed) {
                        e.preventDefault(), e.stopPropagation(), r.x = r.coordinateUtils.getXcoordinate(e), r.y = r.coordinateUtils.getYcoordinate(e);
                        var t = {
                            type: "MOUSE_MOVE",
                            x: r.x,
                            y: r.y
                        };
                        r.sendEventMessage(JSON.stringify(t))
                    }
                }, this.wheelEvent = function (e) {
                    e.preventDefault(), e.stopPropagation(), r.x = r.coordinateUtils.getXcoordinate(e), r.y = r.coordinateUtils.getYcoordinate(e);
                    var t = e.wheelDelta,
                        n = {
                            type: "WHEEL",
                            x: r.x,
                            y: r.y,
                            delta: t
                        };
                    r.sendEventMessage(JSON.stringify(n))
                }, this.cancelContextMenu = function (e) {
                    e.preventDefault(), e.stopPropagation(), e.returnValue = !1
                }, this.addMouseCallbacks = function () {
                    r.wrapper_video.addEventListener("mousedown", n.pressEvent, !1), r.wrapper_video.addEventListener("mouseup", n.releaseEvent, !1), r.wrapper_video.addEventListener("mousemove", n.moveEvent, !1), r.wrapper_video.addEventListener("mousewheel", n.wheelEvent, !1), r.wrapper_video.addEventListener("contextmenu", n.cancelContextMenu, !1)
                }
            }
        }, {}],
        16: [function (e, t, n) {
            "use strict";
            var r = e("./util/OverlayPlugin"),
                a = e("lodash"),
                B = e("./util/network-profiles");

            function i(e, t, n) {
                r.call(this, e), this.fields = {}, ((this.genymotion = e).network = this).enableBaseband = n, t = t || {}, this.renderToolbarButton(t), this.renderWidget(t), this.genymotion.on("NETWORK", this.setActive.bind(this))
            } (i.prototype = Object.create(r.prototype)).renderToolbarButton = function (e) {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var t = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        n = this.toolbarBtn = document.createElement("li"),
                        r = this.toolbarBtnImage = document.createElement("div");
                    r.className += "genymotion_button network_button", r.title = e.NETWORK_TITLE || "Network", n.appendChild(r), n.onclick = this.toggleWidget.bind(this), t.appendChild(n)
                }
            }, i.prototype.renderWidget = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.form = document.createElement("form"),
                    r = document.createElement("div");
                r.className += "title", r.innerHTML = e.NETWORK_TITLE || "Network & Baseband", n.appendChild(r);
                var i = document.createElement("div"),
                    o = document.createElement("div");
                o.className = "section";
                var a = document.createElement("label");
                a.innerHTML = e.NETWORK_PROFILE_VALUE || "Network speed", o.appendChild(a);
                var s = document.createElement("div");
                s.className += "inputs";
                var c = this.select = document.createElement("select"),
                    l = document.createElement("option");
                l.innerHTML = e.NETWORK_PROFILE || "Select a profile", c.appendChild(l), c.onchange = this.changeProfile.bind(this), s.appendChild(c), B.reverse().forEach(function (e) {
                    var t = document.createElement("option");
                    t.value = e.name, t.innerHTML = e.label, c.appendChild(t)
                });
                var d = this.profileDetails = document.createElement("div");
                if (d.className += "profile-details hidden", d.appendChild(this.createDetailSection("Download speed", "downSpeed")), d.appendChild(this.createDetailSection("Upload speed", "upSpeed")), d.appendChild(this.createDetailSection("Download delay", "downDelay")), d.appendChild(this.createDetailSection("Upload delay", "upDelay")), d.appendChild(this.createDetailSection("Download packet loss", "downPacketLoss")), d.appendChild(this.createDetailSection("Upload packet loss", "upPacketLoss")), d.appendChild(this.createDetailSection("DNS Delay", "dnsDelay")), i.appendChild(o), i.appendChild(s), i.appendChild(d), this.enableBaseband) {
                    var u = document.createElement("div"),
                        p = document.createElement("div");
                    p.className = "section";
                    var f = document.createElement("label");
                    f.innerHTML = e.NETWORK_OPERATOR_VALUE || "Network Operator", p.appendChild(f);
                    var h = document.createElement("div");
                    h.className = "fields";
                    var v = document.createElement("label");
                    v.innerHTML = "MCC/MNC";
                    var g = this.networkOperatorMMC = document.createElement("input");
                    g.placeholder = "eg: 20814", g.pattern = "[0-9]{5,6}", g.title = "Operator MCC/MNC", h.appendChild(v), h.appendChild(g);
                    var m = document.createElement("div");
                    m.className = "fields";
                    var y = document.createElement("label");
                    y.innerHTML = "Name";
                    var b = this.networkOperatorName = document.createElement("input");
                    b.placeholder = "eg: Verizon", b.title = "Operator Name", m.appendChild(y), m.appendChild(b), u.appendChild(p), u.appendChild(h), u.appendChild(m);
                    var C = document.createElement("div"),
                        w = document.createElement("div");
                    w.className = "section";
                    var T = document.createElement("label");
                    T.innerHTML = e.SIM_OPERATOR_VALUE || "SIM Operator", w.appendChild(T);
                    var E = document.createElement("div");
                    E.className = "fields";
                    var _ = document.createElement("label");
                    _.innerHTML = "MCC/MNC";
                    var S = this.simOperatorMMC = document.createElement("input");
                    S.placeholder = "eg: 20814", S.pattern = "[0-9]{5,6}", S.title = "SIM Operator MCC/MNC", S.addEventListener("keyup", this.checkSimImsiErrors.bind(this)), E.appendChild(_), E.appendChild(S);
                    var R = document.createElement("div");
                    R.className = "fields";
                    var I = document.createElement("label");
                    I.innerHTML = "Name";
                    var P = this.simOperatorName = document.createElement("input");
                    P.placeholder = "eg: AT&T", P.title = "SIM Operator Name", R.appendChild(I), R.appendChild(P);
                    var k = document.createElement("div");
                    k.className = "fields";
                    var L = document.createElement("label");
                    L.innerHTML = "MSIN";
                    var x = this.simMSIN = document.createElement("input");
                    x.placeholder = "eg: 2176510739", x.pattern = "[0-9]{9,10}", x.title = "SIM MSIN", x.addEventListener("keyup", this.checkSimImsiErrors.bind(this)), k.appendChild(L), k.appendChild(x);
                    var M = document.createElement("div");
                    M.className = "fields";
                    var O = document.createElement("label");
                    O.innerHTML = "Phone Number";
                    var D = this.simOperatorPhoneNumber = document.createElement("input");
                    D.placeholder = "eg: 8004337300", D.pattern = "[0-9]*", D.title = "Phone Number", M.appendChild(O), M.appendChild(D), C.appendChild(w), C.appendChild(E), C.appendChild(k), C.appendChild(R), C.appendChild(M)
                }
                var N = this.submitBtn = document.createElement("button");
                N.innerHTML = e.NETWORK_UPDATE || "Update", N.onclick = this.submit.bind(this), n.appendChild(s), n.appendChild(d), this.enableBaseband && (n.appendChild(u), n.appendChild(C)), n.appendChild(N), t.className = "genymotion-overlay network-form hidden";
                var A = document.createElement("div");
                A.className += "close-btn", A.onclick = this.toggleWidget.bind(this), t.appendChild(A), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, i.prototype.toggleWidget = function () {
                this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable")) : this.genymotion.emit("keyboard-enable"), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, i.prototype.checkSimImsiErrors = function () {
                this.simMSIN.setCustomValidity(""), 0 < this.simOperatorMMC.value.length && 0 < this.simMSIN.value.length && (6 === this.simOperatorMMC.value.length && 9 !== this.simMSIN.value.length ? this.simMSIN.setCustomValidity("Should be 9") : 5 === this.simOperatorMMC.value.length && 10 !== this.simMSIN.value.length && this.simMSIN.setCustomValidity("Should be 10"))
            }, i.prototype.submit = function (e) {
                if (e.preventDefault(), this.form.checkValidity()) {
                    var t = a.find(B, {
                        name: this.select.value
                    });
                    if (t && void 0 !== t.id)
                        if (this.genymotion.useRedis) {
                            var n = [];
                            0 === t.id ? n.push("disable wifi all") : (n.push("enable wifi all"), n.push("set wifi up_rate " + t.upSpeed.value), n.push("set wifi down_rate " + t.downSpeed.value), n.push("set wifi up_delay " + t.upDelay.value), n.push("set wifi down_delay " + t.downDelay.value), n.push("set wifi up_pkt_loss " + t.upPacketLoss.value), n.push("set wifi down_pkt_loss " + t.downPacketLoss.value), n.push("set wifi dns_delay " + t.dnsDelay.value));
                            var r = {
                                channel: "network_profile",
                                messages: n
                            };
                            this.genymotion.sendEventMessage(JSON.stringify(r))
                        } else this.genymotion.sendEventMessage({
                            type: "NETWORK",
                            mode: t.id
                        });
                    n = [];
                    if (this.enableBaseband && (this.networkOperatorMMC.value && n.push("network operator " + this.networkOperatorMMC.value), this.networkOperatorName.value && n.push("network operator_name " + this.networkOperatorName.value), this.simOperatorMMC.value && n.push("sim operator " + this.simOperatorMMC.value), this.simOperatorName.value && n.push("sim operator_name " + this.simOperatorName.value), this.simMSIN.value && n.push("sim imsi_id " + this.simMSIN.value), this.simOperatorPhoneNumber.value && n.push("sim phone_number " + this.simOperatorPhoneNumber.value), 0 < n.length))
                        if (this.genymotion.useRedis) {
                            r = {
                                channel: "baseband",
                                messages: n
                            };
                            this.genymotion.sendEventMessage(JSON.stringify(r))
                        } else {
                            var i = this;
                            n.forEach(function (e) {
                                var t = {
                                    type: "PHONE_RAW",
                                    command: e
                                };
                                i.genymotion.sendEventMessage(JSON.stringify(t))
                            })
                        }
                    this.toggleWidget()
                }
            }, i.prototype.changeProfile = function () {
                var e = a.find(B, {
                    name: this.select.value
                });
                e ? (this.loadDetails(e), this.profileDetails.classList.remove("hidden")) : this.profileDetails.classList.add("hidden")
            }, i.prototype.createDetailSection = function (e, t) {
                var n = document.createElement("section"),
                    r = this.fields[t] = document.createElement("span");
                return n.innerHTML = e + ": ", n.appendChild(r), n
            }, i.prototype.loadDetails = function (e) {
                var n = this;
                a.each(e, function (e, t) {
                    "label" !== t && "name" !== t && "id" !== t && (n.fields[t].innerHTML = e.label)
                })
            }, i.prototype.setActive = function (e) {
                if (this.select)
                    for (var t = a.find(B, {
                        id: +e
                    }), n = this.select.getElementsByTagName("option"), r = 0, i = n.length; r < i; r++) {
                        var o = n[r];
                        o.value === t.name && (o.selected = "selected")
                    } else setTimeout(this.setActive, 500, e)
            }, t.exports = i
        }, {
            "./util/OverlayPlugin": 23,
            "./util/network-profiles": 25,
            lodash: 28
        }],
        17: [function (e, t, n) {
            "use strict";
            var r = e("./util/OverlayPlugin");

            function i(e, t) {
                r.call(this, e), t = t || {}, ((this.genymotion = e).phone = this).renderToolbarButton(t), this.renderWidget(t)
            } (i.prototype = Object.create(r.prototype)).renderToolbarButton = function () {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var e = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0];
                    this.toolbarBtn = document.createElement("li");
                    var t = this.toolbarBtnImage = document.createElement("div");
                    t.className += "genymotion_button phone_button", t.title = "Phone", this.toolbarBtn.appendChild(t), this.toolbarBtn.onclick = this.toggleWidget.bind(this), e.appendChild(this.toolbarBtn)
                }
            }, i.prototype.renderWidget = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.container = document.createElement("div"),
                    r = document.createElement("div");
                r.className += "title", r.innerHTML = e.PHONE_TITLE || "Phone", n.appendChild(r);
                var i = document.createElement("div");
                i.className += "inputs";
                var o = document.createElement("div"),
                    a = this.phoneInput = document.createElement("input"),
                    s = this.phoneBtn = document.createElement("button");
                a.type = "text", a.placeholder = e.PHONE_CALL_PLACEHOLDER || "Please enter the phone number", a.addEventListener("keyup", this.validatePhone.bind(this)), s.innerHTML = e.PHONE_CALL || "Call", s.onclick = this.submitPhone.bind(this), s.disabled = !0;
                var c = e.PHONE_INCOMING || "Incoming phone number";
                o.innerHTML = "<label>" + c + "</label>", o.className = "phone-group", o.appendChild(a), o.appendChild(s), i.appendChild(o);
                var l = document.createElement("div"),
                    d = this.textInput = document.createElement("textarea"),
                    u = this.textBtn = document.createElement("button");
                d.placeholder = e.PHONE_MESSAGE_PLACEHOLDER || "Please enter the incoming message", d.rows = 5, d.addEventListener("keyup", this.validateText.bind(this)), u.innerHTML = e.PHONE_MESSAGE || "Send message", u.onclick = this.submitText.bind(this), u.disabled = !0;
                var p = e.PHONE_MESSAGE_VALUE || "Message";
                l.innerHTML = "<label>" + p + "</label>", l.className = "phone-group", l.appendChild(d), l.appendChild(u), i.appendChild(l), n.appendChild(i), t.className = "genymotion-overlay phone-form hidden";
                var f = document.createElement("div");
                f.className += "close-btn", f.onclick = this.toggleWidget.bind(this), t.appendChild(f), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, i.prototype.toggleWidget = function () {
                this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable")) : this.genymotion.emit("keyboard-enable"), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active")
            }, i.prototype.validatePhone = function () {
                var e = this.phoneInput.value.match(/^(\+[0-9]{1,14}|[0-9]{1,16})$/g);
                this.phoneBtn.disabled = !e
            }, i.prototype.submitPhone = function (e) {
                e.preventDefault();
                var t = {};
                t = this.genymotion.useRedis ? {
                    channel: "baseband",
                    messages: ["gsm call " + this.phoneInput.value]
                } : {
                        type: "PHONE_CALL",
                        number: this.phoneInput.value
                    }, this.genymotion.sendEventMessage(JSON.stringify(t)), this.toggleWidget()
            }, i.prototype.validateText = function () {
                this.textBtn.disabled = !(this.textInput.value && this.phoneInput.value)
            }, i.prototype.submitText = function (e) {
                e.preventDefault();
                var t = {};
                t = this.genymotion.useRedis ? {
                    channel: "baseband",
                    messages: ["sms send " + this.phoneInput.value + " " + this.textInput.value]
                } : {
                        type: "PHONE_SMS",
                        number: this.phoneInput.value,
                        message: this.textInput.value
                    }, this.genymotion.sendEventMessage(JSON.stringify(t)), this.toggleWidget()
            }, t.exports = i
        }, {
            "./util/OverlayPlugin": 23
        }],
        18: [function (e, t, n) {
            "use strict";
            t.exports = function (e) {
                var t = e,
                    n = this;
                if ((e.qualityChooser = this).high_quality = !1, t.getChildByClass(t.root, "toolbar")) {
                    var r = t.getChildByClass(t.root, "toolbar").children[0],
                        i = document.createElement("li"),
                        o = this.chooser = document.createElement("div");
                    o.className = "qualityChooser genymotion_button quality_button", o.title = "High quality", i.appendChild(o), r.appendChild(i), o.onclick = function () {
                        var e;
                        n.high_quality = !n.high_quality, o.classList.toggle("active"), e = n.high_quality ? {
                            type: "BITRATE",
                            videoBitrate: 5e3,
                            audioBitrate: 192e3
                        } : {
                                type: "BITRATE",
                                videoBitrate: 0,
                                audioBitrate: 0
                            }, t.sendEventMessage(JSON.stringify(e)), t.renegotiate()
                    }
                }
            }
        }, {}],
        19: [function (e, t, n) {
            "use strict";
            t.exports = function (t) {
                var n = (t.resolutionChooser = this).select = document.createElement("SELECT");
                n.className += "genymotion_button resolution_chooser_widget", n.title = "Resolution";
                [{
                    value: "240x320-120dpi",
                    innerHTML: "240x320 LDPI - e.g LG Optimus L3 II"
                }, {
                    value: "480x800-240dpi",
                    innerHTML: "480x800 HDPI - e.g Galaxy S2, Nexus One, Nexus S"
                }, {
                    value: "540x960-240dpi",
                    innerHTML: "540x960 HDPI - e.g Droid Razr"
                }, {
                    value: "720x1280-320dpi",
                    innerHTML: "720x1280 XHDPI - e.g Galaxy Nexus, Galaxy S3/Note 2, Xperia S/One/X/XL, Moto X"
                }, {
                    value: "768x1280-160dpi",
                    innerHTML: "768x1280 MDPI - e.g Custom phone"
                }, {
                    value: "768x1280-320dpi",
                    innerHTML: "768x1280 XHDPI - e.g Nexus 4"
                }, {
                    value: "800x1280-213dpi",
                    innerHTML: "800x1280 TVDPI - e.g Nexus 7"
                }, {
                    value: "800x1280-320dpi",
                    innerHTML: "800x1280 XHDPI - e.g Galaxy Note"
                }, {
                    value: "1080x1920-420dpi",
                    innerHTML: "1080x1920 XXHDPI - e.g Nexus 5X"
                }, {
                    value: "1080x1920-480dpi",
                    innerHTML: "1080x1920 XXHDPI - e.g Nexus 5, Galaxy S4/S5/Note 3, Xperia Z, HTC One"
                }, {
                    value: "1200x1920-320dpi",
                    innerHTML: "1200x1920 XHDPI - e.g Xperia Tablet Z"
                }, {
                    value: "1280x800-160dpi",
                    innerHTML: "1280x800 MDPI - e.g Xperia Tablet S, Motorola Xoom"
                }, {
                    value: "1440x2560-560dpi",
                    innerHTML: "1440x2560 XXXHDPI - e.g Nexus 6, Nexus 6P"
                }, {
                    value: "1440x2560-640dpi",
                    innerHTML: "1440x2560 XXXHDPI - e.g Galaxy S6"
                }, {
                    value: "1536x2048-320dpi",
                    innerHTML: "1536x2048 XHDPI - e.g Nexus 9"
                }, {
                    value: "1920x1200-320dpi",
                    innerHTML: "1920x1200 XHDPI - e.g Nexus 7 2013"
                }, {
                    value: "2560x1600-320dpi",
                    innerHTML: "2560x1600 XHDPI - e.g Nexus 10"
                }].forEach(function (e) {
                    var t = document.createElement("option");
                    t.innerHTML = e.innerHTML, t.value = e.value, n.add(t)
                }), this.onSizeChange = function () {
                    var e = {
                        type: "GEOMETRY",
                        graph_mode: n.value
                    };
                    confirm("This action will reboot the Virtual Device. Continue?") && (t.sendEventMessage(JSON.stringify(e)), console.log("Setting resolution to " + n.value)), n.blur()
                }, n.onchange = this.onSizeChange, t.getChildByClass(t.root, "toolbar") && t.getChildByClass(t.root, "toolbar").children[0].appendChild(n)
            }
        }, {}],
        20: [function (e, t, n) {
            var r, i = e("./util/OverlayPlugin"),
                o = e("loglevel");

            function a(e, t) {
                i.call(this, e), r = e.screencast = this, this.genymotion = e, t = t || {}, this.i18n = t, this.renderToolbarButton(t), this.renderForm(t), this.recordedBlobs = [], this.mediaRecorder = null, this.isRecording = !1, this.startTime = 0, this.displayInterval = null, this.MAX_SCREENCAST_LENGTH_IN_MINUTES = 3
            } (a.prototype = Object.create(i.prototype)).handleDataAvailable = function (e) {
                e.data && 0 < e.data.size && r.recordedBlobs.push(e.data)
            }, a.prototype.getExtensionFromMime = function (e) {
                return -1 !== (e = e.toLowerCase()).indexOf("video/x-msvideo") ? ".avi" : -1 !== e.indexOf("video/mpeg") ? ".mpeg" : -1 !== e.indexOf("video/ogg") ? ".ogv" : -1 !== e.indexOf("video/webm") ? ".webm" : -1 !== e.indexOf("video/3gpp") ? ".3gp" : -1 !== e.indexOf("video/3gpp2") ? ".3g2" : -1 !== e.indexOf("video/mp4") ? ".mp4" : -1 !== e.indexOf("video/x-matroska") ? ".mkv" : -1 !== e.indexOf("video/x-flv") ? ".f4v" : void o.warn("Unknown MIME type: ", e)
            }, a.prototype.downloadScreencast = function () {
                var e = new Blob(this.recordedBlobs, {
                    type: this.mediaRecorder.mimeType
                }),
                    t = window.URL.createObjectURL(e),
                    n = document.createElement("a");
                n.style.display = "none", n.href = t, n.download = "genymotion" + this.getExtensionFromMime(this.mediaRecorder.mimeType), document.body.appendChild(n), n.click(), setTimeout(function () {
                    document.body.removeChild(n), window.URL.revokeObjectURL(t)
                }, 100), this.isRecording = !1
            }, a.prototype.checkForMediarecorder = function () {
                "undefined" == typeof MediaRecorder && (this.screencast.classList.add("disabled"), this.screencastBtn.title = this.i18n.SCREENCAST_NOMEDIARECORDER_TOOLTIP || "Screencast not supported", this.screencastLabel.title = this.i18n.SCREENCAST_NOMEDIARECORDER_TOOLTIP || "Screencast not supported")
            }, a.prototype.displayTimer = function () {
                r.timer.classList.contains("timer-hidden") && (r.timer.classList.remove("timer-hidden"), r.displayInterval = setInterval(r.displayTimer, 1e3));
                var e = new Date - r.startTime;
                e /= 1e3;
                var t = Math.round(e % 60);
                e = Math.floor(e / 60);
                var n = Math.round(e % 60);
                r.timer.innerHTML = ("0" + n).slice(-2) + ":" + ("0" + t).slice(-2), n === r.MAX_SCREENCAST_LENGTH_IN_MINUTES && r.stopRecording()
            }, a.prototype.hideTimer = function () {
                clearInterval(this.displayInterval), this.timer.classList.add("timer-hidden"), this.timer.innerHTML = ""
            }, a.prototype.startRecording = function () {
                this.recordedBlobs = [], this.isRecording = !0, this.startTime = new Date;
                try {
                    this.mediaRecorder = new MediaRecorder(this.genymotion.stream)
                } catch (e) {
                    return o.error("Exception while creating MediaRecorder: " + e), this.isRecording = !1, this.hideTimer(), void this.toolbarBtnImage.classList.remove("screencast_button_recording")
                }
                o.debug("Created MediaRecorder", this.mediaRecorder), this.displayTimer(), this.mediaRecorder.ondataavailable = this.handleDataAvailable, this.mediaRecorder.start(50), o.debug("MediaRecorder started", this.mediaRecorder)
            }, a.prototype.stopRecording = function () {
                this.mediaRecorder.stop(), this.hideTimer(), this.toolbarBtnImage.classList.remove("screencast_button_recording"), this.downloadScreencast(), o.debug("MediaRecorder stopped", this.mediaRecorder)
            }, a.prototype.renderToolbarButton = function () {
                if (this.genymotion.getChildByClass(this.genymotion.root, "toolbar")) {
                    var e = this.genymotion.getChildByClass(this.genymotion.root, "toolbar").children[0],
                        t = this.toolbarBtn = document.createElement("li"),
                        n = this.toolbarBtnImage = document.createElement("div");
                    n.className += "genymotion_button screencast_button", n.title = "Screencast", this.timer = document.createElement("div"), this.timer.className = "screencast-timer timer-hidden", n.appendChild(this.timer), t.appendChild(n), "IE" === webrtcDetectedBrowser || "edge" === webrtcDetectedBrowser ? this.disable() : t.onclick = this.toggleForm.bind(this), e.appendChild(t)
                }
            }, a.prototype.renderForm = function (e) {
                var t = this.widget = document.createElement("div"),
                    n = this.form = document.createElement("form"),
                    r = document.createElement("div");
                r.className += "title", r.innerHTML = e.SCREENCAST_TITLE || "Capture", n.appendChild(r);
                var i = document.createElement("div");
                i.className += "inputs";
                var o = document.createElement("div"),
                    a = this.screenshotBtn = document.createElement("div");
                a.className = "action", o.onclick = this.onScreenshotClick.bind(this), o.className = "horizontal screenshot";
                var s = e.SCREENCAST_SHOT || "Screenshot";
                o.innerHTML = "<label>" + s + "</label>", o.appendChild(a), i.appendChild(o);
                var c = this.screencast = document.createElement("div"),
                    l = this.screencastBtn = document.createElement("div");
                l.className = "action", c.onclick = this.onScreencastClick.bind(this), c.className = "horizontal screencast";
                var d = this.screencastLabel = e.SCREENCAST_CAST || "Screencast";
                c.innerHTML = "<label>" + d + "</label>", c.appendChild(l), i.appendChild(c), n.appendChild(i), t.className = "genymotion-overlay screencast-form hidden";
                var u = document.createElement("div");
                u.className += "close-btn", u.onclick = this.toggleForm.bind(this), t.appendChild(u), t.appendChild(n), this.overlays.push(t), this.genymotion.root.appendChild(t)
            }, a.prototype.toggleForm = function (e) {
                this.checkForMediarecorder(), this.isRecording ? this.stopRecording() : (this.widget.classList.contains("hidden") ? (this.genymotion.emit("close-overlays"), this.genymotion.emit("keyboard-disable")) : this.genymotion.emit("keyboard-enable"), this.widget.classList.toggle("hidden"), this.toolbarBtnImage.classList.toggle("active"), !0 === e && this.toolbarBtnImage.classList.add("screencast_button_recording"))
            }, a.prototype.onScreenshotClick = function (e) {
                e.preventDefault(), this.toggleForm();
                var t, n = document.createElement("canvas"),
                    r = n.getContext("2d"),
                    i = this.genymotion.video;
                if (n.width = i.videoWidth, n.height = i.videoHeight, r && i instanceof HTMLVideoElement) {
                    r.drawImage(i, 0, 0, i.videoWidth, i.videoHeight, 0, 0, i.videoWidth, i.videoHeight);
                    var o = document.createElement("a");
                    o.download = "genymotion-screenshot.png", document.body.appendChild(o), (t = n.toDataURL("image/png")) && (t = t.replace(/^data:image\/[^;]*/, "data:application/octet-stream")), o.href = t, o.click(), setTimeout(function () {
                        document.body.removeChild(o)
                    }, 100)
                }
            }, a.prototype.onScreencastClick = function () {
                this.isRecording ? this.stopRecording() : (this.toggleForm(!0), this.startRecording())
            }, t.exports = a
        }, {
            "./util/OverlayPlugin": 23,
            loglevel: 29
        }],
        21: [function (e, t, n) {
            "use strict";
            t.exports = function (t) {
                var n = (t.sizeChooser = this).select = document.createElement("SELECT");
                n.className += "genymotion_button size_chooser_widget", n.title = "Quality";
                var e = document.createElement("option"),
                    r = document.createElement("option"),
                    i = document.createElement("option"),
                    o = document.createElement("option"),
                    a = document.createElement("option"),
                    s = document.createElement("option");
                e.innerHTML = "-", r.innerHTML = "240p", i.innerHTML = "360p", o.innerHTML = "480p", a.innerHTML = "720p", s.innerHTML = "1080p", e.value = "0", r.value = "320", i.value = "640", o.value = "848", a.value = "1280", s.value = "1920", n.add(e), n.add(r), n.add(i), n.add(o), n.add(a), n.add(s), this.onSizeChange = function () {
                    var e = {
                        type: "SIZE",
                        width: +n.value
                    };
                    t.sendEventMessage(JSON.stringify(e)), n.blur()
                }, n.onchange = this.onSizeChange, t.getChildByClass(t.root, "toolbar") && t.getChildByClass(t.root, "toolbar").children[0].appendChild(n)
            }
        }, {}],
        22: [function (e, t, n) {
            "use strict";
            t.exports = function (e) {
                var i = e,
                    t = this;
                i.touchEvents = this, i.touchEventsAreEnabled = !0, this.screenPress = function (e) {
                    e.preventDefault(), e.stopPropagation();
                    for (var t = {
                        type: "MULTI_TOUCH",
                        nb: e.targetTouches.length,
                        mode: 0,
                        points: []
                    }, n = 0; n < e.targetTouches.length; n++) {
                        var r = e.targetTouches[n];
                        i.x = i.coordinateUtils.getXcoordinate(r), i.y = i.coordinateUtils.getYcoordinate(r), i.coordinateUtils.lagometer(r), t.points.push({
                            x: i.x,
                            y: i.y
                        })
                    }
                    i.sendEventMessage(JSON.stringify(t))
                }, this.screenMove = function (e) {
                    e.preventDefault(), e.stopPropagation();
                    for (var t = {
                        type: "MULTI_TOUCH",
                        nb: e.targetTouches.length,
                        mode: 2,
                        points: []
                    }, n = 0; n < e.targetTouches.length; n++) {
                        var r = e.targetTouches[n];
                        i.x = i.coordinateUtils.getXcoordinate(r), i.y = i.coordinateUtils.getYcoordinate(r), t.points.push({
                            x: i.x,
                            y: i.y
                        })
                    }
                    i.sendEventMessage(JSON.stringify(t))
                }, this.screenRelease = function (e) {
                    e.preventDefault(), e.stopPropagation();
                    for (var t = {
                        type: "MULTI_TOUCH",
                        nb: e.targetTouches.length,
                        mode: 1,
                        points: []
                    }, n = 0; n < e.targetTouches.length; n++) {
                        var r = e.targetTouches[n];
                        i.x = i.coordinateUtils.getXcoordinate(r), i.y = i.coordinateUtils.getYcoordinate(r), t.points.push({
                            x: i.x,
                            y: i.y
                        })
                    }
                    i.sendEventMessage(JSON.stringify(t))
                }, this.addTouchCallbacks = function () {
                    i.wrapper_video.addEventListener("touchstart", t.screenPress, !1), i.wrapper_video.addEventListener("touchend", t.screenRelease, !1), i.wrapper_video.addEventListener("touchmove", t.screenMove, !1)
                }
            }
        }, {}],
        23: [function (e, t, n) {
            "use strict";

            function r(e) {
                this.overlays = [], this.savedState = void 0, this.toolbarBtnImage = null, (this.genymotion = e).on("close-overlays", this.closeOverlays.bind(this))
            }
            r.prototype.closeOverlays = function () {
                this.overlays.forEach(function (e) {
                    e && !e.classList.contains("hidden") && (e.classList.add("hidden"), e.onclose && e.onclose())
                }), this.genymotion.emit("keyboard-enable"), this.toolbarBtnImage && this.toolbarBtnImage.classList.remove("active")
            }, r.prototype.saveState = function () {
                this.savedState || (this.savedState = {
                    toolbarBtn: {
                        className: this.toolbarBtn.className,
                        onclick: this.toolbarBtn.onclick
                    },
                    toolbarBtnImage: {
                        className: this.toolbarBtnImage.className
                    }
                })
            }, r.prototype.restoreState = function () {
                this.savedState && (this.toolbarBtn.className = this.savedState.toolbarBtn.className, this.toolbarBtnImage.className = this.savedState.toolbarBtnImage.className, this.toolbarBtn.onclick = this.savedState.toolbarBtn.onclick, this.savedState = void 0)
            }, r.prototype.disable = function () {
                this.toolbarBtn && this.toolbarBtnImage && (this.saveState(), this.toolbarBtn.className += " disabled-widget-pop-up", this.toolbarBtnImage.className += " disabled-widget-icon", this.toolbarBtn.onclick = null)
            }, r.prototype.enable = function () {
                this.toolbarBtn && this.toolbarBtnImage && this.restoreState()
            }, t.exports = r
        }, {}],
        24: [function (e, t, n) {
            t.exports = [{
                name: "High-end device",
                label: "High-end device",
                readByteRate: 200
            }, {
                name: "Mid-range device",
                label: "Mid-range device",
                readByteRate: 100
            }, {
                name: "Low-end device",
                label: "Low-end device",
                readByteRate: 50
            }, {
                name: "Custom",
                label: "Custom device"
            }]
        }, {}],
        25: [function (e, t, n) {
            t.exports = [{
                id: 8,
                name: "wifi",
                label: "Wifi",
                downSpeed: {
                    label: "40.0Mb/s",
                    value: 4e4
                },
                downDelay: {
                    label: "0ms",
                    value: 0
                },
                downPacketLoss: {
                    label: "0%",
                    value: 0
                },
                upSpeed: {
                    label: "33.0Mb/s",
                    value: 33e3
                },
                upDelay: {
                    label: "0ms",
                    value: 0
                },
                upPacketLoss: {
                    label: "0%",
                    value: 0
                },
                dnsDelay: {
                    label: "0ms",
                    value: 0
                }
            }, {
                id: 7,
                name: "4g_with_loss",
                label: "4G (High packet losses)",
                downSpeed: {
                    label: "17.9Mb/s",
                    value: 17900
                },
                downDelay: {
                    label: "50ms",
                    value: 50
                },
                downPacketLoss: {
                    label: "10%",
                    value: 10
                },
                upSpeed: {
                    label: "5.5Mb/s",
                    value: 5500
                },
                upDelay: {
                    label: "50ms",
                    value: 50
                },
                upPacketLoss: {
                    label: "10%",
                    value: 10
                },
                dnsDelay: {
                    label: "100ms",
                    value: 100
                }
            }, {
                id: 6,
                name: "4g_with_delay",
                label: "4G (High DNS delay)",
                downSpeed: {
                    label: "17.9Mb/s",
                    value: 17900
                },
                downDelay: {
                    label: "50ms",
                    value: 50
                },
                downPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                upSpeed: {
                    label: "5.5Mb/s",
                    value: 5500
                },
                upDelay: {
                    label: "50ms",
                    value: 50
                },
                upPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                dnsDelay: {
                    label: "3000ms",
                    value: 3e3
                }
            }, {
                id: 5,
                name: "4g",
                label: "4G",
                downSpeed: {
                    label: "17.9Mb/s",
                    value: 17900
                },
                downDelay: {
                    label: "50ms",
                    value: 50
                },
                downPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                upSpeed: {
                    label: "5.5Mb/s",
                    value: 5500
                },
                upDelay: {
                    label: "50ms",
                    value: 50
                },
                upPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                dnsDelay: {
                    label: "100ms",
                    value: 100
                }
            }, {
                id: 4,
                name: "3g",
                label: "3G",
                downSpeed: {
                    label: "7.2Mb/s",
                    value: 7200
                },
                downDelay: {
                    label: "100ms",
                    value: 100
                },
                downPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                upSpeed: {
                    label: "1.5Mb/s",
                    value: 1500
                },
                upDelay: {
                    label: "100ms",
                    value: 100
                },
                upPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                dnsDelay: {
                    label: "200ms",
                    value: 200
                }
            }, {
                id: 3,
                name: "edge",
                label: "EDGE",
                downSpeed: {
                    label: "240Kb/s",
                    value: 240
                },
                downDelay: {
                    label: "400ms",
                    value: 400
                },
                downPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                upSpeed: {
                    label: "200Kb/s",
                    value: 200
                },
                upDelay: {
                    label: "400ms",
                    value: 400
                },
                upPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                dnsDelay: {
                    label: "800ms",
                    value: 800
                }
            }, {
                id: 2,
                name: "gprs",
                label: "GPRS",
                downSpeed: {
                    label: "40Kb/s",
                    value: 40
                },
                downDelay: {
                    label: "500ms",
                    value: 500
                },
                downPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                upSpeed: {
                    label: "40Kb/s",
                    value: 40
                },
                upDelay: {
                    label: "500ms",
                    value: 500
                },
                upPacketLoss: {
                    label: "0.01%",
                    value: .01
                },
                dnsDelay: {
                    label: "1000ms",
                    value: 1e3
                }
            }, {
                id: 1,
                name: "no_data",
                label: "No data",
                downSpeed: {
                    label: "0Kb/s",
                    value: 0
                },
                downDelay: {
                    label: "0ms",
                    value: 0
                },
                downPacketLoss: {
                    label: "0%",
                    value: 0
                },
                upSpeed: {
                    label: "0Kb/s",
                    value: 0
                },
                upDelay: {
                    label: "0ms",
                    value: 0
                },
                upPacketLoss: {
                    label: "0%",
                    value: 0
                },
                dnsDelay: {
                    label: "0ms",
                    value: 0
                }
            }, {
                id: 0,
                name: "native",
                label: "Native",
                downSpeed: {
                    label: "N/A",
                    value: 0
                },
                downDelay: {
                    label: "N/A",
                    value: 0
                },
                downPacketLoss: {
                    label: "N/A",
                    value: 0
                },
                upSpeed: {
                    label: "N/A",
                    value: 0
                },
                upDelay: {
                    label: "N/A",
                    value: 0
                },
                upPacketLoss: {
                    label: "N/A",
                    value: 0
                },
                dnsDelay: {
                    label: "N/A",
                    value: 0
                }
            }]
        }, {}],
        26: [function (e, t, n) {
            "use strict";
            t.exports = function () {
                this.socket = null, this.token = null, this.haveError = !1, this.isUploading = !1, this.uploadedSize = 0, this.file = null, this.address = null;
                var a = this;
                a.getChunkSize = function (e) {
                    return Math.max(5242880, Math.min(.1 * e, 104857600))
                }, a.onOpen = function () {
                    var e = {
                        type: "token",
                        token: token
                    };
                    a.socket.send(JSON.stringify(e))
                }, a.onClose = function () {
                    setTimeout(function () {
                        a.connect(a.address)
                    }, 1e3)
                }, a.connect = function (e) {
                    a.socket = new WebSocket(e), a.socket.binaryType = "arraybuffer", a.socket.onopen = a.onOpen, a.socket.onerror = a.onFailure, a.socket.onmessage = a.onSocketMsg, a.socket.onclose = a.onClose
                }, a.onFailure = function () {
                    a.isUploading = !1, postMessage({
                        type: "FILE_UPLOAD",
                        code: "FAIL"
                    })
                }, a.uploadData = function (e) {
                    !1 === haveError && a.socket.send(e.target.result, {
                        binary: !0
                    })
                }, a.onSocketMsg = function (e) {
                    var t, n = JSON.parse(e.data);
                    if ("FILE_UPLOAD" === n.type) switch (n.code) {
                        case "NEXT":
                            if (a.uploadedSize < file.size) {
                                var r, i = a.getChunkSize(file.size),
                                    o = new FileReader;
                                o.onload = a.uploadData, o.onabort = a.onFailure, o.onerror = a.onFailure, file.size - a.uploadedSize > i ? (r = file.slice(a.uploadedSize, a.uploadedSize + i), a.uploadedSize += i) : (r = file.slice(a.uploadedSize), a.uploadedSize = file.size), o.readAsArrayBuffer(r)
                            } else t = {
                                type: "FILE_UPLOAD",
                                done: !0
                            }, a.socket.send(JSON.stringify(t)), a.isUploading = !1;
                            break;
                        case "PROGRESS":
                        case "SUCCESS":
                            postMessage(n);
                            break;
                        case "FAIL":
                            a.haveError = !0, postMessage(n)
                    }
                }, a.onmessage = function (e) {
                    var t = e.data;
                    switch (t.type) {
                        case "address":
                            a.token = t.token, a.address = t.fileUploadAddress, a.connect(a.address);
                            break;
                        case "close":
                            a.isUploading = !1, null !== a.socket && (a.socket.onclose = null, a.socket.close());
                            break;
                        case "upload":
                            if (!a.isUploading) {
                                a.file = t.file, a.isUploading = !0, a.haveError = !1, a.uploadedSize = 0;
                                var n = {
                                    type: "FILE_UPLOAD",
                                    name: file.name,
                                    size: file.size
                                };
                                a.socket.send(JSON.stringify(n))
                            }
                    }
                }
            }
        }, {}],
        27: [function (u, i, o) {
            (function (t) {
                "use strict";
                var h = h || window.AdapterJS || {};
                if (h.options = h.options || {}, h.options.getAllCams = !!h.options.getAllCams, h.options.hidePluginInstallPrompt = !!h.options.hidePluginInstallPrompt, h.options.forceSafariPlugin = !!h.options.forceSafariPlugin, h.VERSION = "0.15.4", h.onwebrtcready = h.onwebrtcready || function (e) { }, h._onwebrtcreadies = [], h.webRTCReady = function (e) {
                    if ("function" != typeof e) throw new Error("Callback provided is not a function");
                    var t = function () {
                        "function" == typeof window.require && "function" == typeof h._defineMediaSourcePolyfill && h._defineMediaSourcePolyfill(), e(null !== h.WebRTCPlugin.plugin)
                    };
                    !0 === h.onwebrtcreadyDone ? t() : h._onwebrtcreadies.push(t)
                }, h.WebRTCPlugin = h.WebRTCPlugin || {}, h.WebRTCPlugin.pluginInfo = h.WebRTCPlugin.pluginInfo || {
                    prefix: "Tem",
                    plugName: "TemWebRTCPlugin",
                    pluginId: "plugin0",
                    type: "application/x-temwebrtcplugin",
                    onload: "__TemWebRTCReady0",
                    portalLink: "https://skylink.io/plugin/",
                    downloadLink: null,
                    companyName: "Temasys",
                    downloadLinks: {
                        mac: "https://bit.ly/webrtcpluginpkg",
                        win: "https://bit.ly/webrtcpluginmsi"
                    }
                }, void 0 !== h.WebRTCPlugin.pluginInfo.downloadLinks && null !== h.WebRTCPlugin.pluginInfo.downloadLinks && (navigator.platform.match(/^Mac/i) ? h.WebRTCPlugin.pluginInfo.downloadLink = h.WebRTCPlugin.pluginInfo.downloadLinks.mac : navigator.platform.match(/^Win/i) && (h.WebRTCPlugin.pluginInfo.downloadLink = h.WebRTCPlugin.pluginInfo.downloadLinks.win)), h.WebRTCPlugin.TAGS = {
                    NONE: "none",
                    AUDIO: "audio",
                    VIDEO: "video"
                }, h.WebRTCPlugin.pageId = Math.random().toString(36).slice(2), h.WebRTCPlugin.plugin = null, h.WebRTCPlugin.setLogLevel = null, h.WebRTCPlugin.defineWebRTCInterface = null, h.WebRTCPlugin.isPluginInstalled = null, h.WebRTCPlugin.pluginInjectionInterval = null, h.WebRTCPlugin.injectPlugin = null, h.WebRTCPlugin.PLUGIN_STATES = {
                    NONE: 0,
                    INITIALIZING: 1,
                    INJECTING: 2,
                    INJECTED: 3,
                    READY: 4
                }, h.WebRTCPlugin.pluginState = h.WebRTCPlugin.PLUGIN_STATES.NONE, h.onwebrtcreadyDone = !1, h.WebRTCPlugin.PLUGIN_LOG_LEVELS = {
                    NONE: "NONE",
                    ERROR: "ERROR",
                    WARNING: "WARNING",
                    INFO: "INFO",
                    VERBOSE: "VERBOSE",
                    SENSITIVE: "SENSITIVE"
                }, h.WebRTCPlugin.WaitForPluginReady = null, h.WebRTCPlugin.callWhenPluginReady = null, h.documentReady = function () {
                    return "interactive" === document.readyState && !!document.body || "complete" === document.readyState
                }, window.__TemWebRTCReady0 = function () {
                    h.documentReady() ? (h.WebRTCPlugin.pluginState = h.WebRTCPlugin.PLUGIN_STATES.READY, h.maybeThroughWebRTCReady()) : setTimeout(__TemWebRTCReady0, 100)
                }, h.maybeThroughWebRTCReady = function () {
                    h.onwebrtcreadyDone || (h.onwebrtcreadyDone = !0, h._onwebrtcreadies.length ? h._onwebrtcreadies.forEach(function (e) {
                        "function" == typeof e && e(null !== h.WebRTCPlugin.plugin)
                    }) : "function" == typeof h.onwebrtcready && h.onwebrtcready(null !== h.WebRTCPlugin.plugin))
                }, h.TEXT = {
                    PLUGIN: {
                        REQUIRE_INSTALLATION: "This website requires you to install a WebRTC-enabling plugin to work on this browser.",
                        REQUIRE_RESTART: "Your plugin is being downloaded. Please run the installer, and restart your browser to begin using it.",
                        NOT_SUPPORTED: "Your browser does not support WebRTC.",
                        BUTTON: "Install Now"
                    },
                    REFRESH: {
                        REQUIRE_REFRESH: "Please refresh page",
                        BUTTON: "Refresh Page"
                    }
                }, h._iceConnectionStates = {
                    starting: "starting",
                    checking: "checking",
                    connected: "connected",
                    completed: "connected",
                    done: "completed",
                    disconnected: "disconnected",
                    failed: "failed",
                    closed: "closed"
                }, h._iceConnectionFiredStates = [], h.isDefined = null, window.webrtcDetectedType = null, window.MediaStream = "function" == typeof MediaStream ? MediaStream : null, window.RTCPeerConnection = "function" == typeof RTCPeerConnection ? RTCPeerConnection : null, window.RTCSessionDescription = "function" == typeof RTCSessionDescription ? RTCSessionDescription : null, window.RTCIceCandidate = "function" == typeof RTCIceCandidate ? RTCIceCandidate : null, window.getUserMedia = "function" == typeof getUserMedia ? getUserMedia : null, window.attachMediaStream = null, window.reattachMediaStream = null, window.webrtcDetectedBrowser = null, window.webrtcDetectedVersion = null, window.webrtcMinimumVersion = null, window.webrtcDetectedDCSupport = null, h.parseWebrtcDetectedBrowser = function () {
                    var e = null;
                    if (window.opr && opr.addons || window.opera || 0 <= navigator.userAgent.indexOf(" OPR/")) e = navigator.userAgent.match(/OPR\/(\d+)/i) || [], window.webrtcDetectedBrowser = "opera", window.webrtcDetectedVersion = parseInt(e[1] || "0", 10), window.webrtcMinimumVersion = 26, window.webrtcDetectedType = "webkit", window.webrtcDetectedDCSupport = "SCTP";
                    else if (navigator.userAgent.match(/Bowser\/[0-9.]*/g)) {
                        e = navigator.userAgent.match(/Bowser\/[0-9.]*/g) || [];
                        var t = parseInt((navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || [])[2] || "0", 10);
                        window.webrtcDetectedBrowser = "bowser", window.webrtcDetectedVersion = parseFloat((e[0] || "0/0").split("/")[1], 10), window.webrtcMinimumVersion = 0, window.webrtcDetectedType = "webkit", window.webrtcDetectedDCSupport = 30 < t ? "SCTP" : "RTP"
                    } else if (0 < navigator.userAgent.indexOf("OPiOS")) e = navigator.userAgent.match(/OPiOS\/([0-9]+)\./), window.webrtcDetectedBrowser = "opera", window.webrtcDetectedVersion = parseInt(e[1] || "0", 10), window.webrtcMinimumVersion = 0, window.webrtcDetectedType = null, window.webrtcDetectedDCSupport = null;
                    else if (0 < navigator.userAgent.indexOf("CriOS")) e = navigator.userAgent.match(/CriOS\/([0-9]+)\./) || [], window.webrtcDetectedVersion = parseInt(e[1] || "0", 10), window.webrtcMinimumVersion = 0, window.webrtcDetectedType = null, window.webrtcDetectedBrowser = "chrome", window.webrtcDetectedDCSupport = null;
                    else if (0 < navigator.userAgent.indexOf("FxiOS")) e = navigator.userAgent.match(/FxiOS\/([0-9]+)\./) || [], window.webrtcDetectedBrowser = "firefox", window.webrtcDetectedVersion = parseInt(e[1] || "0", 10), window.webrtcMinimumVersion = 0, window.webrtcDetectedType = null, window.webrtcDetectedDCSupport = null;
                    else if (document.documentMode) e = /\brv[ :]+(\d+)/g.exec(navigator.userAgent) || [], window.webrtcDetectedBrowser = "IE", window.webrtcDetectedVersion = parseInt(e[1], 10), window.webrtcMinimumVersion = 9, window.webrtcDetectedType = "plugin", window.webrtcDetectedDCSupport = "SCTP", webrtcDetectedVersion || (e = /\bMSIE[ :]+(\d+)/g.exec(navigator.userAgent) || [], window.webrtcDetectedVersion = parseInt(e[1] || "0", 10));
                    else if (window.StyleMedia || navigator.userAgent.match(/Edge\/(\d+).(\d+)$/)) e = navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) || [], window.webrtcDetectedBrowser = "edge", window.webrtcDetectedVersion = parseFloat((e[0] || "0/0").split("/")[1], 10), window.webrtcMinimumVersion = 13.10547, window.webrtcDetectedType = "ms", window.webrtcDetectedDCSupport = null;
                    else if ("undefined" != typeof InstallTrigger || 0 < navigator.userAgent.indexOf("irefox")) e = navigator.userAgent.match(/Firefox\/([0-9]+)\./) || [], window.webrtcDetectedBrowser = "firefox", window.webrtcDetectedVersion = parseInt(e[1] || "0", 10), window.webrtcMinimumVersion = 33, window.webrtcDetectedType = "moz", window.webrtcDetectedDCSupport = "SCTP";
                    else if (window.chrome && window.chrome.webstore || 0 < navigator.userAgent.indexOf("Chrom")) e = navigator.userAgent.match(/Chrom(e|ium)\/([0-9]+)\./i) || [], window.webrtcDetectedBrowser = "chrome", window.webrtcDetectedVersion = parseInt(e[2] || "0", 10), window.webrtcMinimumVersion = 38, window.webrtcDetectedType = "webkit", window.webrtcDetectedDCSupport = 30 < window.webrtcDetectedVersion ? "SCTP" : "RTP";
                    else if (/constructor/i.test(window.HTMLElement) || "[object SafariRemoteNotification]" === (!window.safari || safari.pushNotification).toString() || navigator.userAgent.match(/AppleWebKit\/(\d+)\./) || navigator.userAgent.match(/Version\/(\d+).(\d+)/)) {
                        e = navigator.userAgent.match(/version\/(\d+)\.(\d+)/i) || [];
                        var n = navigator.userAgent.match(/AppleWebKit\/(\d+)/i) || [],
                            r = navigator.userAgent.match(/(iPhone|iPad)/gi),
                            i = 1 <= n.length && 604 <= n[1];
                        if (window.webrtcDetectedBrowser = "safari", window.webrtcDetectedVersion = parseInt(e[1] || "0", 10), window.webrtcMinimumVersion = 7, r) window.webrtcDetectedType = i ? "AppleWebKit" : null;
                        else {
                            var o = window.webrtcDetectedVersion,
                                a = parseInt(e[2] || "0", 10),
                                s = 11 == o && a < 2;
                            window.webrtcDetectedType = !i || h.options.forceSafariPlugin && s ? "plugin" : "AppleWebKit"
                        }
                        window.webrtcDetectedDCSupport = "SCTP"
                    }
                    h.webrtcDetectedBrowser = window.webrtcDetectedBrowser, h.webrtcDetectedVersion = window.webrtcDetectedVersion, h.webrtcMinimumVersion = window.webrtcMinimumVersion, h.webrtcDetectedType = window.webrtcDetectedType, h.webrtcDetectedDCSupport = window.webrtcDetectedDCSupport
                }, h.addEvent = function (e, t, n) {
                    e.addEventListener ? e.addEventListener(t, n, !1) : e.attachEvent ? e.attachEvent("on" + t, n) : e[t] = n
                }, h.renderNotificationBar = function (e, t, n) {
                    if (h.documentReady()) {
                        var r = window,
                            i = document.createElement("iframe");
                        i.name = "adapterjs-alert", i.style.position = "fixed", i.style.top = "-41px", i.style.left = 0, i.style.right = 0, i.style.width = "100%", i.style.height = "40px", i.style.backgroundColor = "#ffffe1", i.style.border = "none", i.style.borderBottom = "1px solid #888888", i.style.zIndex = "9999999", "string" == typeof i.style.webkitTransition ? i.style.webkitTransition = "all .5s ease-out" : "string" == typeof i.style.transition && (i.style.transition = "all .5s ease-out"), document.body.appendChild(i);
                        var o = i.contentWindow ? i.contentWindow : i.contentDocument.document ? i.contentDocument.document : i.contentDocument;
                        o.document.open(), o.document.write('<span style="display: inline-block; font-family: Helvetica, Arial,sans-serif; font-size: .9rem; padding: 4px; vertical-align: middle; cursor: default;">' + e + "</span>"), t && "function" == typeof n ? (o.document.write('<button id="okay">' + t + '</button><button id="cancel">Cancel</button>'), o.document.close(), h.addEvent(o.document.getElementById("okay"), "click", function (e) {
                            e.preventDefault();
                            try {
                                e.cancelBubble = !0
                            } catch (e) { }
                            n(e)
                        }), h.addEvent(o.document.getElementById("cancel"), "click", function (e) {
                            r.document.body.removeChild(i)
                        })) : o.document.close(), setTimeout(function () {
                            "string" == typeof i.style.webkitTransform ? i.style.webkitTransform = "translateY(40px)" : "string" == typeof i.style.transform ? i.style.transform = "translateY(40px)" : i.style.top = "0px"
                        }, 300)
                    }
                }, window.requestUserMedia = "function" == typeof requestUserMedia ? requestUserMedia : null, h.parseWebrtcDetectedBrowser(), -1 < ["webkit", "moz", "ms", "AppleWebKit"].indexOf(h.webrtcDetectedType)) {
                    navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) && window.RTCPeerConnection && (window.msRTCPeerConnection = window.RTCPeerConnection),
                        function (e) {
                            "object" == typeof o && void 0 !== i ? i.exports = e() : ("undefined" != typeof window ? window : void 0 !== t ? t : "undefined" != typeof self ? self : this).adapter = e()
                        }(function () {
                            return function o(a, s, c) {
                                function l(t, e) {
                                    if (!s[t]) {
                                        if (!a[t]) {
                                            var n = "function" == typeof u && u;
                                            if (!e && n) return n(t, !0);
                                            if (d) return d(t, !0);
                                            var r = new Error("Cannot find module '" + t + "'");
                                            throw r.code = "MODULE_NOT_FOUND", r
                                        }
                                        var i = s[t] = {
                                            exports: {}
                                        };
                                        a[t][0].call(i.exports, function (e) {
                                            return l(a[t][1][e] || e)
                                        }, i, i.exports, o, a, s, c)
                                    }
                                    return s[t].exports
                                }
                                for (var d = "function" == typeof u && u, e = 0; e < c.length; e++) l(c[e]);
                                return l
                            }({
                                1: [function (e, t, n) {
                                    function c(e, t, n, r, i) {
                                        var o = B.writeRtpDescription(e.kind, t);
                                        if (o += B.writeIceParameters(e.iceGatherer.getLocalParameters()), o += B.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : i || "active"), o += "a=mid:" + e.mid + "\r\n", e.rtpSender && e.rtpReceiver ? o += "a=sendrecv\r\n" : e.rtpSender ? o += "a=sendonly\r\n" : e.rtpReceiver ? o += "a=recvonly\r\n" : o += "a=inactive\r\n", e.rtpSender) {
                                            var a = e.rtpSender._initialTrackId || e.rtpSender.track.id;
                                            e.rtpSender._initialTrackId = a;
                                            var s = "msid:" + (r ? r.id : "-") + " " + a + "\r\n";
                                            o += "a=" + s, o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + s, e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + s, o += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
                                        }
                                        return o += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + B.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (o += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + B.localCName + "\r\n"), o
                                    }

                                    function h(l, d) {
                                        var u = {
                                            codecs: [],
                                            headerExtensions: [],
                                            fecMechanisms: []
                                        },
                                            p = function (e, t) {
                                                e = parseInt(e, 10);
                                                for (var n = 0; n < t.length; n++)
                                                    if (t[n].payloadType === e || t[n].preferredPayloadType === e) return t[n]
                                            };
                                        return l.codecs.forEach(function (n) {
                                            for (var e = 0; e < d.codecs.length; e++) {
                                                var t = d.codecs[e];
                                                if (n.name.toLowerCase() === t.name.toLowerCase() && n.clockRate === t.clockRate) {
                                                    if ("rtx" === n.name.toLowerCase() && n.parameters && t.parameters.apt && (r = n, i = t, o = l.codecs, a = d.codecs, c = s = void 0, s = p(r.parameters.apt, o), c = p(i.parameters.apt, a), !s || !c || s.name.toLowerCase() !== c.name.toLowerCase())) continue;
                                                    (t = JSON.parse(JSON.stringify(t))).numChannels = Math.min(n.numChannels, t.numChannels), u.codecs.push(t), t.rtcpFeedback = t.rtcpFeedback.filter(function (e) {
                                                        for (var t = 0; t < n.rtcpFeedback.length; t++)
                                                            if (n.rtcpFeedback[t].type === e.type && n.rtcpFeedback[t].parameter === e.parameter) return !0;
                                                        return !1
                                                    });
                                                    break
                                                }
                                            }
                                            var r, i, o, a, s, c
                                        }), l.headerExtensions.forEach(function (e) {
                                            for (var t = 0; t < d.headerExtensions.length; t++) {
                                                var n = d.headerExtensions[t];
                                                if (e.uri === n.uri) {
                                                    u.headerExtensions.push(n);
                                                    break
                                                }
                                            }
                                        }), u
                                    }

                                    function o(e, t, n) {
                                        return -1 !== {
                                            offer: {
                                                setLocalDescription: ["stable", "have-local-offer"],
                                                setRemoteDescription: ["stable", "have-remote-offer"]
                                            },
                                            answer: {
                                                setLocalDescription: ["have-remote-offer", "have-local-pranswer"],
                                                setRemoteDescription: ["have-local-offer", "have-remote-pranswer"]
                                            }
                                        }[t][e].indexOf(n)
                                    }

                                    function A(e, t) {
                                        var n = e.getRemoteCandidates().find(function (e) {
                                            return t.foundation === e.foundation && t.ip === e.ip && t.port === e.port && t.priority === e.priority && t.protocol === e.protocol && t.type === e.type
                                        });
                                        return n || e.addRemoteCandidate(t), !n
                                    }

                                    function v(e, t) {
                                        var n = new Error(t);
                                        return n.name = e, n.code = {
                                            NotSupportedError: 9,
                                            InvalidStateError: 11,
                                            InvalidAccessError: 15,
                                            TypeError: void 0,
                                            OperationError: void 0
                                        }[e], n
                                    }
                                    var B = e("sdp");
                                    t.exports = function (O, D) {
                                        function N(e, t) {
                                            t.addTrack(e), t.dispatchEvent(new O.MediaStreamTrackEvent("addtrack", {
                                                track: e
                                            }))
                                        }

                                        function i(e, t, n, r) {
                                            var i = new Event("track");
                                            i.track = t, i.receiver = n, i.transceiver = {
                                                receiver: n
                                            }, i.streams = r, O.setTimeout(function () {
                                                e._dispatchEvent("track", i)
                                            })
                                        }
                                        var r = function (e) {
                                            var t, r, i, n = this,
                                                o = document.createDocumentFragment();
                                            if (["addEventListener", "removeEventListener", "dispatchEvent"].forEach(function (e) {
                                                n[e] = o[e].bind(o)
                                            }), this.canTrickleIceCandidates = null, this.needNegotiation = !1, this.localStreams = [], this.remoteStreams = [], this._localDescription = null, this._remoteDescription = null, this.signalingState = "stable", this.iceConnectionState = "new", this.connectionState = "new", this.iceGatheringState = "new", e = JSON.parse(JSON.stringify(e || {})), this.usingBundle = "max-bundle" === e.bundlePolicy, "negotiate" === e.rtcpMuxPolicy) throw v("NotSupportedError", "rtcpMuxPolicy 'negotiate' is not supported");
                                            switch (e.rtcpMuxPolicy || (e.rtcpMuxPolicy = "require"), e.iceTransportPolicy) {
                                                case "all":
                                                case "relay":
                                                    break;
                                                default:
                                                    e.iceTransportPolicy = "all"
                                            }
                                            switch (e.bundlePolicy) {
                                                case "balanced":
                                                case "max-compat":
                                                case "max-bundle":
                                                    break;
                                                default:
                                                    e.bundlePolicy = "balanced"
                                            }
                                            if (e.iceServers = (t = e.iceServers || [], r = D, i = !1, (t = JSON.parse(JSON.stringify(t))).filter(function (e) {
                                                if (e && (e.urls || e.url)) {
                                                    var t = e.urls || e.url;
                                                    e.url && e.urls;
                                                    var n = "string" == typeof t;
                                                    return n && (t = [t]), t = t.filter(function (e) {
                                                        return 0 !== e.indexOf("turn:") || -1 === e.indexOf("transport=udp") || -1 !== e.indexOf("turn:[") || i ? 0 === e.indexOf("stun:") && 14393 <= r && -1 === e.indexOf("?transport=udp") : i = !0
                                                    }), delete e.url, e.urls = n ? t[0] : t, !!t.length
                                                }
                                            })), this._iceGatherers = [], e.iceCandidatePoolSize)
                                                for (var a = e.iceCandidatePoolSize; 0 < a; a--) this._iceGatherers.push(new O.RTCIceGatherer({
                                                    iceServers: e.iceServers,
                                                    gatherPolicy: e.iceTransportPolicy
                                                }));
                                            else e.iceCandidatePoolSize = 0;
                                            this._config = e, this.transceivers = [], this._sdpSessionId = B.generateSessionId(), this._sdpSessionVersion = 0, this._dtlsRole = void 0, this._isClosed = !1
                                        };
                                        Object.defineProperty(r.prototype, "localDescription", {
                                            configurable: !0,
                                            get: function () {
                                                return this._localDescription
                                            }
                                        }), Object.defineProperty(r.prototype, "remoteDescription", {
                                            configurable: !0,
                                            get: function () {
                                                return this._remoteDescription
                                            }
                                        }), r.prototype.onicecandidate = null, r.prototype.onaddstream = null, r.prototype.ontrack = null, r.prototype.onremovestream = null, r.prototype.onsignalingstatechange = null, r.prototype.oniceconnectionstatechange = null, r.prototype.onconnectionstatechange = null, r.prototype.onicegatheringstatechange = null, r.prototype.onnegotiationneeded = null, r.prototype.ondatachannel = null, r.prototype._dispatchEvent = function (e, t) {
                                            this._isClosed || (this.dispatchEvent(t), "function" == typeof this["on" + e] && this["on" + e](t))
                                        }, r.prototype._emitGatheringStateChange = function () {
                                            var e = new Event("icegatheringstatechange");
                                            this._dispatchEvent("icegatheringstatechange", e)
                                        }, r.prototype.getConfiguration = function () {
                                            return this._config
                                        }, r.prototype.getLocalStreams = function () {
                                            return this.localStreams
                                        }, r.prototype.getRemoteStreams = function () {
                                            return this.remoteStreams
                                        }, r.prototype._createTransceiver = function (e, t) {
                                            var n = 0 < this.transceivers.length,
                                                r = {
                                                    track: null,
                                                    iceGatherer: null,
                                                    iceTransport: null,
                                                    dtlsTransport: null,
                                                    localCapabilities: null,
                                                    remoteCapabilities: null,
                                                    rtpSender: null,
                                                    rtpReceiver: null,
                                                    kind: e,
                                                    mid: null,
                                                    sendEncodingParameters: null,
                                                    recvEncodingParameters: null,
                                                    stream: null,
                                                    associatedRemoteMediaStreams: [],
                                                    wantReceive: !0
                                                };
                                            if (this.usingBundle && n) r.iceTransport = this.transceivers[0].iceTransport, r.dtlsTransport = this.transceivers[0].dtlsTransport;
                                            else {
                                                var i = this._createIceAndDtlsTransports();
                                                r.iceTransport = i.iceTransport, r.dtlsTransport = i.dtlsTransport
                                            }
                                            return t || this.transceivers.push(r), r
                                        }, r.prototype.addTrack = function (t, e) {
                                            if (this._isClosed) throw v("InvalidStateError", "Attempted to call addTrack on a closed peerconnection.");
                                            if (this.transceivers.find(function (e) {
                                                return e.track === t
                                            })) throw v("InvalidAccessError", "Track already exists.");
                                            for (var n, r = 0; r < this.transceivers.length; r++) this.transceivers[r].track || this.transceivers[r].kind !== t.kind || (n = this.transceivers[r]);
                                            return n || (n = this._createTransceiver(t.kind)), this._maybeFireNegotiationNeeded(), -1 === this.localStreams.indexOf(e) && this.localStreams.push(e), n.track = t, n.stream = e, n.rtpSender = new O.RTCRtpSender(t, n.dtlsTransport), n.rtpSender
                                        }, r.prototype.addStream = function (t) {
                                            var n = this;
                                            if (15025 <= D) t.getTracks().forEach(function (e) {
                                                n.addTrack(e, t)
                                            });
                                            else {
                                                var r = t.clone();
                                                t.getTracks().forEach(function (e, t) {
                                                    var n = r.getTracks()[t];
                                                    e.addEventListener("enabled", function (e) {
                                                        n.enabled = e.enabled
                                                    })
                                                }), r.getTracks().forEach(function (e) {
                                                    n.addTrack(e, r)
                                                })
                                            }
                                        }, r.prototype.removeTrack = function (t) {
                                            if (this._isClosed) throw v("InvalidStateError", "Attempted to call removeTrack on a closed peerconnection.");
                                            if (!(t instanceof O.RTCRtpSender)) throw new TypeError("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.");
                                            var e = this.transceivers.find(function (e) {
                                                return e.rtpSender === t
                                            });
                                            if (!e) throw v("InvalidAccessError", "Sender was not created by this connection.");
                                            var n = e.stream;
                                            e.rtpSender.stop(), e.rtpSender = null, e.track = null, e.stream = null, -1 === this.transceivers.map(function (e) {
                                                return e.stream
                                            }).indexOf(n) && -1 < this.localStreams.indexOf(n) && this.localStreams.splice(this.localStreams.indexOf(n), 1), this._maybeFireNegotiationNeeded()
                                        }, r.prototype.removeStream = function (e) {
                                            var n = this;
                                            e.getTracks().forEach(function (t) {
                                                var e = n.getSenders().find(function (e) {
                                                    return e.track === t
                                                });
                                                e && n.removeTrack(e)
                                            })
                                        }, r.prototype.getSenders = function () {
                                            return this.transceivers.filter(function (e) {
                                                return !!e.rtpSender
                                            }).map(function (e) {
                                                return e.rtpSender
                                            })
                                        }, r.prototype.getReceivers = function () {
                                            return this.transceivers.filter(function (e) {
                                                return !!e.rtpReceiver
                                            }).map(function (e) {
                                                return e.rtpReceiver
                                            })
                                        }, r.prototype._createIceGatherer = function (n, e) {
                                            var r = this;
                                            if (e && 0 < n) return this.transceivers[0].iceGatherer;
                                            if (this._iceGatherers.length) return this._iceGatherers.shift();
                                            var i = new O.RTCIceGatherer({
                                                iceServers: this._config.iceServers,
                                                gatherPolicy: this._config.iceTransportPolicy
                                            });
                                            return Object.defineProperty(i, "state", {
                                                value: "new",
                                                writable: !0
                                            }), this.transceivers[n].bufferedCandidateEvents = [], this.transceivers[n].bufferCandidates = function (e) {
                                                var t = !e.candidate || 0 === Object.keys(e.candidate).length;
                                                i.state = t ? "completed" : "gathering", null !== r.transceivers[n].bufferedCandidateEvents && r.transceivers[n].bufferedCandidateEvents.push(e)
                                            }, i.addEventListener("localcandidate", this.transceivers[n].bufferCandidates), i
                                        }, r.prototype._gather = function (s, c) {
                                            var l = this,
                                                d = this.transceivers[c].iceGatherer;
                                            if (!d.onlocalcandidate) {
                                                var e = this.transceivers[c].bufferedCandidateEvents;
                                                this.transceivers[c].bufferedCandidateEvents = null, d.removeEventListener("localcandidate", this.transceivers[c].bufferCandidates), d.onlocalcandidate = function (e) {
                                                    if (!(l.usingBundle && 0 < c)) {
                                                        var t = new Event("icecandidate");
                                                        t.candidate = {
                                                            sdpMid: s,
                                                            sdpMLineIndex: c
                                                        };
                                                        var n = e.candidate,
                                                            r = !n || 0 === Object.keys(n).length;
                                                        if (r) "new" !== d.state && "gathering" !== d.state || (d.state = "completed");
                                                        else {
                                                            "new" === d.state && (d.state = "gathering"), n.component = 1, n.ufrag = d.getLocalParameters().usernameFragment;
                                                            var i = B.writeCandidate(n);
                                                            t.candidate = Object.assign(t.candidate, B.parseCandidate(i)), t.candidate.candidate = i, t.candidate.toJSON = function () {
                                                                return {
                                                                    candidate: t.candidate.candidate,
                                                                    sdpMid: t.candidate.sdpMid,
                                                                    sdpMLineIndex: t.candidate.sdpMLineIndex,
                                                                    usernameFragment: t.candidate.usernameFragment
                                                                }
                                                            }
                                                        }
                                                        var o = B.getMediaSections(l._localDescription.sdp);
                                                        o[t.candidate.sdpMLineIndex] += r ? "a=end-of-candidates\r\n" : "a=" + t.candidate.candidate + "\r\n", l._localDescription.sdp = B.getDescription(l._localDescription.sdp) + o.join("");
                                                        var a = l.transceivers.every(function (e) {
                                                            return e.iceGatherer && "completed" === e.iceGatherer.state
                                                        });
                                                        "gathering" !== l.iceGatheringState && (l.iceGatheringState = "gathering", l._emitGatheringStateChange()), r || l._dispatchEvent("icecandidate", t), a && (l._dispatchEvent("icecandidate", new Event("icecandidate")), l.iceGatheringState = "complete", l._emitGatheringStateChange())
                                                    }
                                                }, O.setTimeout(function () {
                                                    e.forEach(function (e) {
                                                        d.onlocalcandidate(e)
                                                    })
                                                }, 0)
                                            }
                                        }, r.prototype._createIceAndDtlsTransports = function () {
                                            var e = this,
                                                t = new O.RTCIceTransport(null);
                                            t.onicestatechange = function () {
                                                e._updateIceConnectionState(), e._updateConnectionState()
                                            };
                                            var n = new O.RTCDtlsTransport(t);
                                            return n.ondtlsstatechange = function () {
                                                e._updateConnectionState()
                                            }, n.onerror = function () {
                                                Object.defineProperty(n, "state", {
                                                    value: "failed",
                                                    writable: !0
                                                }), e._updateConnectionState()
                                            }, {
                                                    iceTransport: t,
                                                    dtlsTransport: n
                                                }
                                        }, r.prototype._disposeIceAndDtlsTransports = function (e) {
                                            var t = this.transceivers[e].iceGatherer;
                                            t && (delete t.onlocalcandidate, delete this.transceivers[e].iceGatherer);
                                            var n = this.transceivers[e].iceTransport;
                                            n && (delete n.onicestatechange, delete this.transceivers[e].iceTransport);
                                            var r = this.transceivers[e].dtlsTransport;
                                            r && (delete r.ondtlsstatechange, delete r.onerror, delete this.transceivers[e].dtlsTransport)
                                        }, r.prototype._transceive = function (e, t, n) {
                                            var r = h(e.localCapabilities, e.remoteCapabilities);
                                            t && e.rtpSender && (r.encodings = e.sendEncodingParameters, r.rtcp = {
                                                cname: B.localCName,
                                                compound: e.rtcpParameters.compound
                                            }, e.recvEncodingParameters.length && (r.rtcp.ssrc = e.recvEncodingParameters[0].ssrc), e.rtpSender.send(r)), n && e.rtpReceiver && 0 < r.codecs.length && ("video" === e.kind && e.recvEncodingParameters && D < 15019 && e.recvEncodingParameters.forEach(function (e) {
                                                delete e.rtx
                                            }), e.recvEncodingParameters.length ? r.encodings = e.recvEncodingParameters : r.encodings = [{}], r.rtcp = {
                                                compound: e.rtcpParameters.compound
                                            }, e.rtcpParameters.cname && (r.rtcp.cname = e.rtcpParameters.cname), e.sendEncodingParameters.length && (r.rtcp.ssrc = e.sendEncodingParameters[0].ssrc), e.rtpReceiver.receive(r))
                                        }, r.prototype.setLocalDescription = function (e) {
                                            var t, u, p = this;
                                            if (-1 === ["offer", "answer"].indexOf(e.type)) return Promise.reject(v("TypeError", 'Unsupported type "' + e.type + '"'));
                                            if (!o("setLocalDescription", e.type, p.signalingState) || p._isClosed) return Promise.reject(v("InvalidStateError", "Can not set local " + e.type + " in state " + p.signalingState));
                                            if ("offer" === e.type) t = B.splitSections(e.sdp), u = t.shift(), t.forEach(function (e, t) {
                                                var n = B.parseRtpParameters(e);
                                                p.transceivers[t].localCapabilities = n
                                            }), p.transceivers.forEach(function (e, t) {
                                                p._gather(e.mid, t)
                                            });
                                            else if ("answer" === e.type) {
                                                t = B.splitSections(p._remoteDescription.sdp), u = t.shift();
                                                var f = 0 < B.matchPrefix(u, "a=ice-lite").length;
                                                t.forEach(function (e, t) {
                                                    var n = p.transceivers[t],
                                                        r = n.iceGatherer,
                                                        i = n.iceTransport,
                                                        o = n.dtlsTransport,
                                                        a = n.localCapabilities,
                                                        s = n.remoteCapabilities;
                                                    if (!(B.isRejected(e) && 0 === B.matchPrefix(e, "a=bundle-only").length || n.rejected)) {
                                                        var c = B.getIceParameters(e, u),
                                                            l = B.getDtlsParameters(e, u);
                                                        f && (l.role = "server"), p.usingBundle && 0 !== t || (p._gather(n.mid, t), "new" === i.state && i.start(r, c, f ? "controlling" : "controlled"), "new" === o.state && o.start(l));
                                                        var d = h(a, s);
                                                        p._transceive(n, 0 < d.codecs.length, !1)
                                                    }
                                                })
                                            }
                                            return p._localDescription = {
                                                type: e.type,
                                                sdp: e.sdp
                                            }, "offer" === e.type ? p._updateSignalingState("have-local-offer") : p._updateSignalingState("stable"), Promise.resolve()
                                        }, r.prototype.setRemoteDescription = function (R) {
                                            var I = this;
                                            if (-1 === ["offer", "answer"].indexOf(R.type)) return Promise.reject(v("TypeError", 'Unsupported type "' + R.type + '"'));
                                            if (!o("setRemoteDescription", R.type, I.signalingState) || I._isClosed) return Promise.reject(v("InvalidStateError", "Can not set remote " + R.type + " in state " + I.signalingState));
                                            var P = {};
                                            I.remoteStreams.forEach(function (e) {
                                                P[e.id] = e
                                            });
                                            var k = [],
                                                e = B.splitSections(R.sdp),
                                                L = e.shift(),
                                                x = 0 < B.matchPrefix(L, "a=ice-lite").length,
                                                M = 0 < B.matchPrefix(L, "a=group:BUNDLE ").length;
                                            I.usingBundle = M;
                                            var t = B.matchPrefix(L, "a=ice-options:")[0];
                                            return I.canTrickleIceCandidates = !!t && 0 <= t.substr(14).split(" ").indexOf("trickle"), e.forEach(function (e, t) {
                                                var n = B.splitLines(e),
                                                    r = B.getKind(e),
                                                    i = B.isRejected(e) && 0 === B.matchPrefix(e, "a=bundle-only").length,
                                                    o = n[0].substr(2).split(" ")[2],
                                                    a = B.getDirection(e, L),
                                                    s = B.parseMsid(e),
                                                    c = B.getMid(e) || B.generateIdentifier();
                                                if (i || "application" === r && ("DTLS/SCTP" === o || "UDP/DTLS/SCTP" === o)) I.transceivers[t] = {
                                                    mid: c,
                                                    kind: r,
                                                    protocol: o,
                                                    rejected: !0
                                                };
                                                else {
                                                    !i && I.transceivers[t] && I.transceivers[t].rejected && (I.transceivers[t] = I._createTransceiver(r, !0));
                                                    var l, d, u, p, f, h, v, g, m, y, b, C = B.parseRtpParameters(e);
                                                    i || (y = B.getIceParameters(e, L), (b = B.getDtlsParameters(e, L)).role = "client"), v = B.parseRtpEncodingParameters(e);
                                                    var w = B.parseRtcpParameters(e),
                                                        T = 0 < B.matchPrefix(e, "a=end-of-candidates", L).length,
                                                        E = B.matchPrefix(e, "a=candidate:").map(function (e) {
                                                            return B.parseCandidate(e)
                                                        }).filter(function (e) {
                                                            return 1 === e.component
                                                        });
                                                    if (("offer" === R.type || "answer" === R.type) && !i && M && 0 < t && I.transceivers[t] && (I._disposeIceAndDtlsTransports(t), I.transceivers[t].iceGatherer = I.transceivers[0].iceGatherer, I.transceivers[t].iceTransport = I.transceivers[0].iceTransport, I.transceivers[t].dtlsTransport = I.transceivers[0].dtlsTransport, I.transceivers[t].rtpSender && I.transceivers[t].rtpSender.setTransport(I.transceivers[0].dtlsTransport), I.transceivers[t].rtpReceiver && I.transceivers[t].rtpReceiver.setTransport(I.transceivers[0].dtlsTransport)), "offer" !== R.type || i) "answer" !== R.type || i || (d = (l = I.transceivers[t]).iceGatherer, u = l.iceTransport, p = l.dtlsTransport, f = l.rtpReceiver, h = l.sendEncodingParameters, g = l.localCapabilities, I.transceivers[t].recvEncodingParameters = v, I.transceivers[t].remoteCapabilities = C, I.transceivers[t].rtcpParameters = w, E.length && "new" === u.state && (!x && !T || M && 0 !== t ? E.forEach(function (e) {
                                                        A(l.iceTransport, e)
                                                    }) : u.setRemoteCandidates(E)), M && 0 !== t || ("new" === u.state && u.start(d, y, "controlling"), "new" === p.state && p.start(b)), I._transceive(l, "sendrecv" === a || "recvonly" === a, "sendrecv" === a || "sendonly" === a), !f || "sendrecv" !== a && "sendonly" !== a ? delete l.rtpReceiver : (m = f.track, s ? (P[s.stream] || (P[s.stream] = new O.MediaStream), N(m, P[s.stream]), k.push([m, f, P[s.stream]])) : (P.default || (P.default = new O.MediaStream), N(m, P.default), k.push([m, f, P.default]))));
                                                    else {
                                                        (l = I.transceivers[t] || I._createTransceiver(r)).mid = c, l.iceGatherer || (l.iceGatherer = I._createIceGatherer(t, M)), E.length && "new" === l.iceTransport.state && (!T || M && 0 !== t ? E.forEach(function (e) {
                                                            A(l.iceTransport, e)
                                                        }) : l.iceTransport.setRemoteCandidates(E)), g = O.RTCRtpReceiver.getCapabilities(r), D < 15019 && (g.codecs = g.codecs.filter(function (e) {
                                                            return "rtx" !== e.name
                                                        })), h = l.sendEncodingParameters || [{
                                                            ssrc: 1001 * (2 * t + 2)
                                                        }];
                                                        var _, S = !1;
                                                        if ("sendrecv" === a || "sendonly" === a) {
                                                            if (S = !l.rtpReceiver, f = l.rtpReceiver || new O.RTCRtpReceiver(l.dtlsTransport, r), S) m = f.track, s && "-" === s.stream || (_ = s ? (P[s.stream] || (P[s.stream] = new O.MediaStream, Object.defineProperty(P[s.stream], "id", {
                                                                get: function () {
                                                                    return s.stream
                                                                }
                                                            })), Object.defineProperty(m, "id", {
                                                                get: function () {
                                                                    return s.track
                                                                }
                                                            }), P[s.stream]) : (P.default || (P.default = new O.MediaStream), P.default)), _ && (N(m, _), l.associatedRemoteMediaStreams.push(_)), k.push([m, f, _])
                                                        } else l.rtpReceiver && l.rtpReceiver.track && (l.associatedRemoteMediaStreams.forEach(function (e) {
                                                            var t, n, r = e.getTracks().find(function (e) {
                                                                return e.id === l.rtpReceiver.track.id
                                                            });
                                                            r && (t = r, (n = e).removeTrack(t), n.dispatchEvent(new O.MediaStreamTrackEvent("removetrack", {
                                                                track: t
                                                            })))
                                                        }), l.associatedRemoteMediaStreams = []);
                                                        l.localCapabilities = g, l.remoteCapabilities = C, l.rtpReceiver = f, l.rtcpParameters = w, l.sendEncodingParameters = h, l.recvEncodingParameters = v, I._transceive(I.transceivers[t], !1, S)
                                                    }
                                                }
                                            }), void 0 === I._dtlsRole && (I._dtlsRole = "offer" === R.type ? "active" : "passive"), I._remoteDescription = {
                                                type: R.type,
                                                sdp: R.sdp
                                            }, "offer" === R.type ? I._updateSignalingState("have-remote-offer") : I._updateSignalingState("stable"), Object.keys(P).forEach(function (e) {
                                                var r = P[e];
                                                if (r.getTracks().length) {
                                                    if (-1 === I.remoteStreams.indexOf(r)) {
                                                        I.remoteStreams.push(r);
                                                        var t = new Event("addstream");
                                                        t.stream = r, O.setTimeout(function () {
                                                            I._dispatchEvent("addstream", t)
                                                        })
                                                    }
                                                    k.forEach(function (e) {
                                                        var t = e[0],
                                                            n = e[1];
                                                        r.id === e[2].id && i(I, t, n, [r])
                                                    })
                                                }
                                            }), k.forEach(function (e) {
                                                e[2] || i(I, e[0], e[1], [])
                                            }), O.setTimeout(function () {
                                                I && I.transceivers && I.transceivers.forEach(function (e) {
                                                    e.iceTransport && "new" === e.iceTransport.state && 0 < e.iceTransport.getRemoteCandidates().length && e.iceTransport.addRemoteCandidate({})
                                                })
                                            }, 4e3), Promise.resolve()
                                        }, r.prototype.close = function () {
                                            this.transceivers.forEach(function (e) {
                                                e.iceTransport && e.iceTransport.stop(), e.dtlsTransport && e.dtlsTransport.stop(), e.rtpSender && e.rtpSender.stop(), e.rtpReceiver && e.rtpReceiver.stop()
                                            }), this._isClosed = !0, this._updateSignalingState("closed")
                                        }, r.prototype._updateSignalingState = function (e) {
                                            this.signalingState = e;
                                            var t = new Event("signalingstatechange");
                                            this._dispatchEvent("signalingstatechange", t)
                                        }, r.prototype._maybeFireNegotiationNeeded = function () {
                                            var t = this;
                                            "stable" === this.signalingState && !0 !== this.needNegotiation && (this.needNegotiation = !0, O.setTimeout(function () {
                                                if (t.needNegotiation) {
                                                    t.needNegotiation = !1;
                                                    var e = new Event("negotiationneeded");
                                                    t._dispatchEvent("negotiationneeded", e)
                                                }
                                            }, 0))
                                        }, r.prototype._updateIceConnectionState = function () {
                                            var e, t = {
                                                new: 0,
                                                closed: 0,
                                                checking: 0,
                                                connected: 0,
                                                completed: 0,
                                                disconnected: 0,
                                                failed: 0
                                            };
                                            if (this.transceivers.forEach(function (e) {
                                                t[e.iceTransport.state]++
                                            }), e = "new", 0 < t.failed ? e = "failed" : 0 < t.checking ? e = "checking" : 0 < t.disconnected ? e = "disconnected" : 0 < t.new ? e = "new" : 0 < t.connected ? e = "connected" : 0 < t.completed && (e = "completed"), e !== this.iceConnectionState) {
                                                this.iceConnectionState = e;
                                                var n = new Event("iceconnectionstatechange");
                                                this._dispatchEvent("iceconnectionstatechange", n)
                                            }
                                        }, r.prototype._updateConnectionState = function () {
                                            var e, t = {
                                                new: 0,
                                                closed: 0,
                                                connecting: 0,
                                                connected: 0,
                                                completed: 0,
                                                disconnected: 0,
                                                failed: 0
                                            };
                                            if (this.transceivers.forEach(function (e) {
                                                t[e.iceTransport.state]++ , t[e.dtlsTransport.state]++
                                            }), t.connected += t.completed, e = "new", 0 < t.failed ? e = "failed" : 0 < t.connecting ? e = "connecting" : 0 < t.disconnected ? e = "disconnected" : 0 < t.new ? e = "new" : 0 < t.connected && (e = "connected"), e !== this.connectionState) {
                                                this.connectionState = e;
                                                var n = new Event("connectionstatechange");
                                                this._dispatchEvent("connectionstatechange", n)
                                            }
                                        }, r.prototype.createOffer = function () {
                                            var s = this;
                                            if (s._isClosed) return Promise.reject(v("InvalidStateError", "Can not call createOffer after close"));
                                            var t = s.transceivers.filter(function (e) {
                                                return "audio" === e.kind
                                            }).length,
                                                n = s.transceivers.filter(function (e) {
                                                    return "video" === e.kind
                                                }).length,
                                                e = arguments[0];
                                            if (e) {
                                                if (e.mandatory || e.optional) throw new TypeError("Legacy mandatory/optional constraints not supported.");
                                                void 0 !== e.offerToReceiveAudio && (t = !0 === e.offerToReceiveAudio ? 1 : !1 === e.offerToReceiveAudio ? 0 : e.offerToReceiveAudio), void 0 !== e.offerToReceiveVideo && (n = !0 === e.offerToReceiveVideo ? 1 : !1 === e.offerToReceiveVideo ? 0 : e.offerToReceiveVideo)
                                            }
                                            for (s.transceivers.forEach(function (e) {
                                                "audio" === e.kind ? --t < 0 && (e.wantReceive = !1) : "video" === e.kind && --n < 0 && (e.wantReceive = !1)
                                            }); 0 < t || 0 < n;) 0 < t && (s._createTransceiver("audio"), t--), 0 < n && (s._createTransceiver("video"), n--);
                                            var r = B.writeSessionBoilerplate(s._sdpSessionId, s._sdpSessionVersion++);
                                            s.transceivers.forEach(function (e, t) {
                                                var n = e.track,
                                                    r = e.kind,
                                                    i = e.mid || B.generateIdentifier();
                                                e.mid = i, e.iceGatherer || (e.iceGatherer = s._createIceGatherer(t, s.usingBundle));
                                                var o = O.RTCRtpSender.getCapabilities(r);
                                                D < 15019 && (o.codecs = o.codecs.filter(function (e) {
                                                    return "rtx" !== e.name
                                                })), o.codecs.forEach(function (t) {
                                                    "H264" === t.name && void 0 === t.parameters["level-asymmetry-allowed"] && (t.parameters["level-asymmetry-allowed"] = "1"), e.remoteCapabilities && e.remoteCapabilities.codecs && e.remoteCapabilities.codecs.forEach(function (e) {
                                                        t.name.toLowerCase() === e.name.toLowerCase() && t.clockRate === e.clockRate && (t.preferredPayloadType = e.payloadType)
                                                    })
                                                }), o.headerExtensions.forEach(function (t) {
                                                    (e.remoteCapabilities && e.remoteCapabilities.headerExtensions || []).forEach(function (e) {
                                                        t.uri === e.uri && (t.id = e.id)
                                                    })
                                                });
                                                var a = e.sendEncodingParameters || [{
                                                    ssrc: 1001 * (2 * t + 1)
                                                }];
                                                n && 15019 <= D && "video" === r && !a[0].rtx && (a[0].rtx = {
                                                    ssrc: a[0].ssrc + 1
                                                }), e.wantReceive && (e.rtpReceiver = new O.RTCRtpReceiver(e.dtlsTransport, r)), e.localCapabilities = o, e.sendEncodingParameters = a
                                            }), "max-compat" !== s._config.bundlePolicy && (r += "a=group:BUNDLE " + s.transceivers.map(function (e) {
                                                return e.mid
                                            }).join(" ") + "\r\n"), r += "a=ice-options:trickle\r\n", s.transceivers.forEach(function (e, t) {
                                                r += c(e, e.localCapabilities, "offer", e.stream, s._dtlsRole), r += "a=rtcp-rsize\r\n", !e.iceGatherer || "new" === s.iceGatheringState || 0 !== t && s.usingBundle || (e.iceGatherer.getLocalCandidates().forEach(function (e) {
                                                    e.component = 1, r += "a=" + B.writeCandidate(e) + "\r\n"
                                                }), "completed" === e.iceGatherer.state && (r += "a=end-of-candidates\r\n"))
                                            });
                                            var i = new O.RTCSessionDescription({
                                                type: "offer",
                                                sdp: r
                                            });
                                            return Promise.resolve(i)
                                        }, r.prototype.createAnswer = function () {
                                            var i = this;
                                            if (i._isClosed) return Promise.reject(v("InvalidStateError", "Can not call createAnswer after close"));
                                            if ("have-remote-offer" !== i.signalingState && "have-local-pranswer" !== i.signalingState) return Promise.reject(v("InvalidStateError", "Can not call createAnswer in signalingState " + i.signalingState));
                                            var o = B.writeSessionBoilerplate(i._sdpSessionId, i._sdpSessionVersion++);
                                            i.usingBundle && (o += "a=group:BUNDLE " + i.transceivers.map(function (e) {
                                                return e.mid
                                            }).join(" ") + "\r\n");
                                            var a = B.getMediaSections(i._remoteDescription.sdp).length;
                                            i.transceivers.forEach(function (e, t) {
                                                if (!(a < t + 1)) {
                                                    if (e.rejected) return "application" === e.kind ? "DTLS/SCTP" === e.protocol ? o += "m=application 0 DTLS/SCTP 5000\r\n" : o += "m=application 0 " + e.protocol + " webrtc-datachannel\r\n" : "audio" === e.kind ? o += "m=audio 0 UDP/TLS/RTP/SAVPF 0\r\na=rtpmap:0 PCMU/8000\r\n" : "video" === e.kind && (o += "m=video 0 UDP/TLS/RTP/SAVPF 120\r\na=rtpmap:120 VP8/90000\r\n"), void (o += "c=IN IP4 0.0.0.0\r\na=inactive\r\na=mid:" + e.mid + "\r\n");
                                                    var n;
                                                    if (e.stream) "audio" === e.kind ? n = e.stream.getAudioTracks()[0] : "video" === e.kind && (n = e.stream.getVideoTracks()[0]), n && 15019 <= D && "video" === e.kind && !e.sendEncodingParameters[0].rtx && (e.sendEncodingParameters[0].rtx = {
                                                        ssrc: e.sendEncodingParameters[0].ssrc + 1
                                                    });
                                                    var r = h(e.localCapabilities, e.remoteCapabilities);
                                                    !r.codecs.filter(function (e) {
                                                        return "rtx" === e.name.toLowerCase()
                                                    }).length && e.sendEncodingParameters[0].rtx && delete e.sendEncodingParameters[0].rtx, o += c(e, r, "answer", e.stream, i._dtlsRole), e.rtcpParameters && e.rtcpParameters.reducedSize && (o += "a=rtcp-rsize\r\n")
                                                }
                                            });
                                            var e = new O.RTCSessionDescription({
                                                type: "answer",
                                                sdp: o
                                            });
                                            return Promise.resolve(e)
                                        }, r.prototype.addIceCandidate = function (c) {
                                            var l, d = this;
                                            return c && void 0 === c.sdpMLineIndex && !c.sdpMid ? Promise.reject(new TypeError("sdpMLineIndex or sdpMid required")) : new Promise(function (e, t) {
                                                if (!d._remoteDescription) return t(v("InvalidStateError", "Can not add ICE candidate without a remote description"));
                                                if (c && "" !== c.candidate) {
                                                    var n = c.sdpMLineIndex;
                                                    if (c.sdpMid)
                                                        for (var r = 0; r < d.transceivers.length; r++)
                                                            if (d.transceivers[r].mid === c.sdpMid) {
                                                                n = r;
                                                                break
                                                            }
                                                    var i = d.transceivers[n];
                                                    if (!i) return t(v("OperationError", "Can not add ICE candidate"));
                                                    if (i.rejected) return e();
                                                    var o = 0 < Object.keys(c.candidate).length ? B.parseCandidate(c.candidate) : {};
                                                    if ("tcp" === o.protocol && (0 === o.port || 9 === o.port)) return e();
                                                    if (o.component && 1 !== o.component) return e();
                                                    if ((0 === n || 0 < n && i.iceTransport !== d.transceivers[0].iceTransport) && !A(i.iceTransport, o)) return t(v("OperationError", "Can not add ICE candidate"));
                                                    var a = c.candidate.trim();
                                                    0 === a.indexOf("a=") && (a = a.substr(2)), (l = B.getMediaSections(d._remoteDescription.sdp))[n] += "a=" + (o.type ? a : "end-of-candidates") + "\r\n", d._remoteDescription.sdp = B.getDescription(d._remoteDescription.sdp) + l.join("")
                                                } else
                                                    for (var s = 0; s < d.transceivers.length && (d.transceivers[s].rejected || (d.transceivers[s].iceTransport.addRemoteCandidate({}), (l = B.getMediaSections(d._remoteDescription.sdp))[s] += "a=end-of-candidates\r\n", d._remoteDescription.sdp = B.getDescription(d._remoteDescription.sdp) + l.join(""), !d.usingBundle)); s++);
                                                e()
                                            })
                                        }, r.prototype.getStats = function (t) {
                                            if (t && t instanceof O.MediaStreamTrack) {
                                                var n = null;
                                                if (this.transceivers.forEach(function (e) {
                                                    e.rtpSender && e.rtpSender.track === t ? n = e.rtpSender : e.rtpReceiver && e.rtpReceiver.track === t && (n = e.rtpReceiver)
                                                }), !n) throw v("InvalidAccessError", "Invalid selector.");
                                                return n.getStats()
                                            }
                                            var r = [];
                                            return this.transceivers.forEach(function (t) {
                                                ["rtpSender", "rtpReceiver", "iceGatherer", "iceTransport", "dtlsTransport"].forEach(function (e) {
                                                    t[e] && r.push(t[e].getStats())
                                                })
                                            }), Promise.all(r).then(function (e) {
                                                var t = new Map;
                                                return e.forEach(function (e) {
                                                    e.forEach(function (e) {
                                                        t.set(e.id, e)
                                                    })
                                                }), t
                                            })
                                        }, ["RTCRtpSender", "RTCRtpReceiver", "RTCIceGatherer", "RTCIceTransport", "RTCDtlsTransport"].forEach(function (e) {
                                            var t = O[e];
                                            if (t && t.prototype && t.prototype.getStats) {
                                                var n = t.prototype.getStats;
                                                t.prototype.getStats = function () {
                                                    return n.apply(this).then(function (n) {
                                                        var r = new Map;
                                                        return Object.keys(n).forEach(function (e) {
                                                            var t;
                                                            n[e].type = {
                                                                inboundrtp: "inbound-rtp",
                                                                outboundrtp: "outbound-rtp",
                                                                candidatepair: "candidate-pair",
                                                                localcandidate: "local-candidate",
                                                                remotecandidate: "remote-candidate"
                                                            }[(t = n[e]).type] || t.type, r.set(e, n[e])
                                                        }), r
                                                    })
                                                }
                                            }
                                        });
                                        var e = ["createOffer", "createAnswer"];
                                        return e.forEach(function (e) {
                                            var n = r.prototype[e];
                                            r.prototype[e] = function () {
                                                var t = arguments;
                                                return "function" == typeof t[0] || "function" == typeof t[1] ? n.apply(this, [arguments[2]]).then(function (e) {
                                                    "function" == typeof t[0] && t[0].apply(null, [e])
                                                }, function (e) {
                                                    "function" == typeof t[1] && t[1].apply(null, [e])
                                                }) : n.apply(this, arguments)
                                            }
                                        }), (e = ["setLocalDescription", "setRemoteDescription", "addIceCandidate"]).forEach(function (e) {
                                            var n = r.prototype[e];
                                            r.prototype[e] = function () {
                                                var t = arguments;
                                                return "function" == typeof t[1] || "function" == typeof t[2] ? n.apply(this, arguments).then(function () {
                                                    "function" == typeof t[1] && t[1].apply(null)
                                                }, function (e) {
                                                    "function" == typeof t[2] && t[2].apply(null, [e])
                                                }) : n.apply(this, arguments)
                                            }
                                        }), ["getStats"].forEach(function (e) {
                                            var t = r.prototype[e];
                                            r.prototype[e] = function () {
                                                var e = arguments;
                                                return "function" == typeof e[1] ? t.apply(this, arguments).then(function () {
                                                    "function" == typeof e[1] && e[1].apply(null)
                                                }) : t.apply(this, arguments)
                                            }
                                        }), r
                                    }
                                }, {
                                    sdp: 2
                                }],
                                2: [function (e, t, n) {
                                    var d = {
                                        generateIdentifier: function () {
                                            return Math.random().toString(36).substr(2, 10)
                                        }
                                    };
                                    d.localCName = d.generateIdentifier(), d.splitLines = function (e) {
                                        return e.trim().split("\n").map(function (e) {
                                            return e.trim()
                                        })
                                    }, d.splitSections = function (e) {
                                        return e.split("\nm=").map(function (e, t) {
                                            return (0 < t ? "m=" + e : e).trim() + "\r\n"
                                        })
                                    }, d.getDescription = function (e) {
                                        var t = d.splitSections(e);
                                        return t && t[0]
                                    }, d.getMediaSections = function (e) {
                                        var t = d.splitSections(e);
                                        return t.shift(), t
                                    }, d.matchPrefix = function (e, t) {
                                        return d.splitLines(e).filter(function (e) {
                                            return 0 === e.indexOf(t)
                                        })
                                    }, d.parseCandidate = function (e) {
                                        for (var t, n = {
                                            foundation: (t = 0 === e.indexOf("a=candidate:") ? e.substring(12).split(" ") : e.substring(10).split(" "))[0],
                                            component: parseInt(t[1], 10),
                                            protocol: t[2].toLowerCase(),
                                            priority: parseInt(t[3], 10),
                                            ip: t[4],
                                            port: parseInt(t[5], 10),
                                            type: t[7]
                                        }, r = 8; r < t.length; r += 2) switch (t[r]) {
                                            case "raddr":
                                                n.relatedAddress = t[r + 1];
                                                break;
                                            case "rport":
                                                n.relatedPort = parseInt(t[r + 1], 10);
                                                break;
                                            case "tcptype":
                                                n.tcpType = t[r + 1];
                                                break;
                                            case "ufrag":
                                                n.ufrag = t[r + 1], n.usernameFragment = t[r + 1];
                                                break;
                                            default:
                                                n[t[r]] = t[r + 1]
                                        }
                                        return n
                                    }, d.writeCandidate = function (e) {
                                        var t = [];
                                        t.push(e.foundation), t.push(e.component), t.push(e.protocol.toUpperCase()), t.push(e.priority), t.push(e.ip), t.push(e.port);
                                        var n = e.type;
                                        return t.push("typ"), t.push(n), "host" !== n && e.relatedAddress && e.relatedPort && (t.push("raddr"), t.push(e.relatedAddress), t.push("rport"), t.push(e.relatedPort)), e.tcpType && "tcp" === e.protocol.toLowerCase() && (t.push("tcptype"), t.push(e.tcpType)), (e.usernameFragment || e.ufrag) && (t.push("ufrag"), t.push(e.usernameFragment || e.ufrag)), "candidate:" + t.join(" ")
                                    }, d.parseIceOptions = function (e) {
                                        return e.substr(14).split(" ")
                                    }, d.parseRtpMap = function (e) {
                                        var t = e.substr(9).split(" "),
                                            n = {
                                                payloadType: parseInt(t.shift(), 10)
                                            };
                                        return t = t[0].split("/"), n.name = t[0], n.clockRate = parseInt(t[1], 10), n.channels = 3 === t.length ? parseInt(t[2], 10) : 1, n.numChannels = n.channels, n
                                    }, d.writeRtpMap = function (e) {
                                        var t = e.payloadType;
                                        void 0 !== e.preferredPayloadType && (t = e.preferredPayloadType);
                                        var n = e.channels || e.numChannels || 1;
                                        return "a=rtpmap:" + t + " " + e.name + "/" + e.clockRate + (1 !== n ? "/" + n : "") + "\r\n"
                                    }, d.parseExtmap = function (e) {
                                        var t = e.substr(9).split(" ");
                                        return {
                                            id: parseInt(t[0], 10),
                                            direction: 0 < t[0].indexOf("/") ? t[0].split("/")[1] : "sendrecv",
                                            uri: t[1]
                                        }
                                    }, d.writeExtmap = function (e) {
                                        return "a=extmap:" + (e.id || e.preferredId) + (e.direction && "sendrecv" !== e.direction ? "/" + e.direction : "") + " " + e.uri + "\r\n"
                                    }, d.parseFmtp = function (e) {
                                        for (var t, n = {}, r = e.substr(e.indexOf(" ") + 1).split(";"), i = 0; i < r.length; i++) n[(t = r[i].trim().split("="))[0].trim()] = t[1];
                                        return n
                                    }, d.writeFmtp = function (t) {
                                        var e = "",
                                            n = t.payloadType;
                                        if (void 0 !== t.preferredPayloadType && (n = t.preferredPayloadType), t.parameters && Object.keys(t.parameters).length) {
                                            var r = [];
                                            Object.keys(t.parameters).forEach(function (e) {
                                                t.parameters[e] ? r.push(e + "=" + t.parameters[e]) : r.push(e)
                                            }), e += "a=fmtp:" + n + " " + r.join(";") + "\r\n"
                                        }
                                        return e
                                    }, d.parseRtcpFb = function (e) {
                                        var t = e.substr(e.indexOf(" ") + 1).split(" ");
                                        return {
                                            type: t.shift(),
                                            parameter: t.join(" ")
                                        }
                                    }, d.writeRtcpFb = function (e) {
                                        var t = "",
                                            n = e.payloadType;
                                        return void 0 !== e.preferredPayloadType && (n = e.preferredPayloadType), e.rtcpFeedback && e.rtcpFeedback.length && e.rtcpFeedback.forEach(function (e) {
                                            t += "a=rtcp-fb:" + n + " " + e.type + (e.parameter && e.parameter.length ? " " + e.parameter : "") + "\r\n"
                                        }), t
                                    }, d.parseSsrcMedia = function (e) {
                                        var t = e.indexOf(" "),
                                            n = {
                                                ssrc: parseInt(e.substr(7, t - 7), 10)
                                            },
                                            r = e.indexOf(":", t);
                                        return -1 < r ? (n.attribute = e.substr(t + 1, r - t - 1), n.value = e.substr(r + 1)) : n.attribute = e.substr(t + 1), n
                                    }, d.parseSsrcGroup = function (e) {
                                        var t = e.substr(13).split(" ");
                                        return {
                                            semantics: t.shift(),
                                            ssrcs: t.map(function (e) {
                                                return parseInt(e, 10)
                                            })
                                        }
                                    }, d.getMid = function (e) {
                                        var t = d.matchPrefix(e, "a=mid:")[0];
                                        if (t) return t.substr(6)
                                    }, d.parseFingerprint = function (e) {
                                        var t = e.substr(14).split(" ");
                                        return {
                                            algorithm: t[0].toLowerCase(),
                                            value: t[1]
                                        }
                                    }, d.getDtlsParameters = function (e, t) {
                                        return {
                                            role: "auto",
                                            fingerprints: d.matchPrefix(e + t, "a=fingerprint:").map(d.parseFingerprint)
                                        }
                                    }, d.writeDtlsParameters = function (e, t) {
                                        var n = "a=setup:" + t + "\r\n";
                                        return e.fingerprints.forEach(function (e) {
                                            n += "a=fingerprint:" + e.algorithm + " " + e.value + "\r\n"
                                        }), n
                                    }, d.getIceParameters = function (e, t) {
                                        var n = d.splitLines(e);
                                        return {
                                            usernameFragment: (n = n.concat(d.splitLines(t))).filter(function (e) {
                                                return 0 === e.indexOf("a=ice-ufrag:")
                                            })[0].substr(12),
                                            password: n.filter(function (e) {
                                                return 0 === e.indexOf("a=ice-pwd:")
                                            })[0].substr(10)
                                        }
                                    }, d.writeIceParameters = function (e) {
                                        return "a=ice-ufrag:" + e.usernameFragment + "\r\na=ice-pwd:" + e.password + "\r\n"
                                    }, d.parseRtpParameters = function (e) {
                                        for (var t = {
                                            codecs: [],
                                            headerExtensions: [],
                                            fecMechanisms: [],
                                            rtcp: []
                                        }, n = d.splitLines(e)[0].split(" "), r = 3; r < n.length; r++) {
                                            var i = n[r],
                                                o = d.matchPrefix(e, "a=rtpmap:" + i + " ")[0];
                                            if (o) {
                                                var a = d.parseRtpMap(o),
                                                    s = d.matchPrefix(e, "a=fmtp:" + i + " ");
                                                switch (a.parameters = s.length ? d.parseFmtp(s[0]) : {}, a.rtcpFeedback = d.matchPrefix(e, "a=rtcp-fb:" + i + " ").map(d.parseRtcpFb), t.codecs.push(a), a.name.toUpperCase()) {
                                                    case "RED":
                                                    case "ULPFEC":
                                                        t.fecMechanisms.push(a.name.toUpperCase())
                                                }
                                            }
                                        }
                                        return d.matchPrefix(e, "a=extmap:").forEach(function (e) {
                                            t.headerExtensions.push(d.parseExtmap(e))
                                        }), t
                                    }, d.writeRtpDescription = function (e, t) {
                                        var n = "";
                                        n += "m=" + e + " ", n += 0 < t.codecs.length ? "9" : "0", n += " UDP/TLS/RTP/SAVPF ", n += t.codecs.map(function (e) {
                                            return void 0 !== e.preferredPayloadType ? e.preferredPayloadType : e.payloadType
                                        }).join(" ") + "\r\n", n += "c=IN IP4 0.0.0.0\r\n", n += "a=rtcp:9 IN IP4 0.0.0.0\r\n", t.codecs.forEach(function (e) {
                                            n += d.writeRtpMap(e), n += d.writeFmtp(e), n += d.writeRtcpFb(e)
                                        });
                                        var r = 0;
                                        return t.codecs.forEach(function (e) {
                                            e.maxptime > r && (r = e.maxptime)
                                        }), 0 < r && (n += "a=maxptime:" + r + "\r\n"), n += "a=rtcp-mux\r\n", t.headerExtensions && t.headerExtensions.forEach(function (e) {
                                            n += d.writeExtmap(e)
                                        }), n
                                    }, d.parseRtpEncodingParameters = function (e) {
                                        var n, r = [],
                                            t = d.parseRtpParameters(e),
                                            i = -1 !== t.fecMechanisms.indexOf("RED"),
                                            o = -1 !== t.fecMechanisms.indexOf("ULPFEC"),
                                            a = d.matchPrefix(e, "a=ssrc:").map(function (e) {
                                                return d.parseSsrcMedia(e)
                                            }).filter(function (e) {
                                                return "cname" === e.attribute
                                            }),
                                            s = 0 < a.length && a[0].ssrc,
                                            c = d.matchPrefix(e, "a=ssrc-group:FID").map(function (e) {
                                                return e.substr(17).split(" ").map(function (e) {
                                                    return parseInt(e, 10)
                                                })
                                            });
                                        0 < c.length && 1 < c[0].length && c[0][0] === s && (n = c[0][1]), t.codecs.forEach(function (e) {
                                            if ("RTX" === e.name.toUpperCase() && e.parameters.apt) {
                                                var t = {
                                                    ssrc: s,
                                                    codecPayloadType: parseInt(e.parameters.apt, 10)
                                                };
                                                s && n && (t.rtx = {
                                                    ssrc: n
                                                }), r.push(t), i && ((t = JSON.parse(JSON.stringify(t))).fec = {
                                                    ssrc: n,
                                                    mechanism: o ? "red+ulpfec" : "red"
                                                }, r.push(t))
                                            }
                                        }), 0 === r.length && s && r.push({
                                            ssrc: s
                                        });
                                        var l = d.matchPrefix(e, "b=");
                                        return l.length && (l = 0 === l[0].indexOf("b=TIAS:") ? parseInt(l[0].substr(7), 10) : 0 === l[0].indexOf("b=AS:") ? 1e3 * parseInt(l[0].substr(5), 10) * .95 - 16e3 : void 0, r.forEach(function (e) {
                                            e.maxBitrate = l
                                        })), r
                                    }, d.parseRtcpParameters = function (e) {
                                        var t = {},
                                            n = d.matchPrefix(e, "a=ssrc:").map(function (e) {
                                                return d.parseSsrcMedia(e)
                                            }).filter(function (e) {
                                                return "cname" === e.attribute
                                            })[0];
                                        n && (t.cname = n.value, t.ssrc = n.ssrc);
                                        var r = d.matchPrefix(e, "a=rtcp-rsize");
                                        t.reducedSize = 0 < r.length, t.compound = 0 === r.length;
                                        var i = d.matchPrefix(e, "a=rtcp-mux");
                                        return t.mux = 0 < i.length, t
                                    }, d.parseMsid = function (e) {
                                        var t, n = d.matchPrefix(e, "a=msid:");
                                        if (1 === n.length) return {
                                            stream: (t = n[0].substr(7).split(" "))[0],
                                            track: t[1]
                                        };
                                        var r = d.matchPrefix(e, "a=ssrc:").map(function (e) {
                                            return d.parseSsrcMedia(e)
                                        }).filter(function (e) {
                                            return "msid" === e.attribute
                                        });
                                        return 0 < r.length ? {
                                            stream: (t = r[0].value.split(" "))[0],
                                            track: t[1]
                                        } : void 0
                                    }, d.generateSessionId = function () {
                                        return Math.random().toString().substr(2, 21)
                                    }, d.writeSessionBoilerplate = function (e, t) {
                                        var n = void 0 !== t ? t : 2;
                                        return "v=0\r\no=thisisadapterortc " + (e || d.generateSessionId()) + " " + n + " IN IP4 127.0.0.1\r\ns=-\r\nt=0 0\r\n"
                                    }, d.writeMediaSection = function (e, t, n, r) {
                                        var i = d.writeRtpDescription(e.kind, t);
                                        if (i += d.writeIceParameters(e.iceGatherer.getLocalParameters()), i += d.writeDtlsParameters(e.dtlsTransport.getLocalParameters(), "offer" === n ? "actpass" : "active"), i += "a=mid:" + e.mid + "\r\n", e.direction ? i += "a=" + e.direction + "\r\n" : e.rtpSender && e.rtpReceiver ? i += "a=sendrecv\r\n" : e.rtpSender ? i += "a=sendonly\r\n" : e.rtpReceiver ? i += "a=recvonly\r\n" : i += "a=inactive\r\n", e.rtpSender) {
                                            var o = "msid:" + r.id + " " + e.rtpSender.track.id + "\r\n";
                                            i += "a=" + o, i += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " " + o, e.sendEncodingParameters[0].rtx && (i += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " " + o, i += "a=ssrc-group:FID " + e.sendEncodingParameters[0].ssrc + " " + e.sendEncodingParameters[0].rtx.ssrc + "\r\n")
                                        }
                                        return i += "a=ssrc:" + e.sendEncodingParameters[0].ssrc + " cname:" + d.localCName + "\r\n", e.rtpSender && e.sendEncodingParameters[0].rtx && (i += "a=ssrc:" + e.sendEncodingParameters[0].rtx.ssrc + " cname:" + d.localCName + "\r\n"), i
                                    }, d.getDirection = function (e, t) {
                                        for (var n = d.splitLines(e), r = 0; r < n.length; r++) switch (n[r]) {
                                            case "a=sendrecv":
                                            case "a=sendonly":
                                            case "a=recvonly":
                                            case "a=inactive":
                                                return n[r].substr(2)
                                        }
                                        return t ? d.getDirection(t) : "sendrecv"
                                    }, d.getKind = function (e) {
                                        return d.splitLines(e)[0].split(" ")[0].substr(2)
                                    }, d.isRejected = function (e) {
                                        return "0" === e.split(" ", 2)[1]
                                    }, d.parseMLine = function (e) {
                                        var t = d.splitLines(e)[0].substr(2).split(" ");
                                        return {
                                            kind: t[0],
                                            port: parseInt(t[1], 10),
                                            protocol: t[2],
                                            fmt: t.slice(3).join(" ")
                                        }
                                    }, d.parseOLine = function (e) {
                                        var t = d.matchPrefix(e, "o=")[0].substr(2).split(" ");
                                        return {
                                            username: t[0],
                                            sessionId: t[1],
                                            sessionVersion: parseInt(t[2], 10),
                                            netType: t[3],
                                            addressType: t[4],
                                            address: t[5]
                                        }
                                    }, d.isValidSDP = function (e) {
                                        if ("string" != typeof e || 0 === e.length) return !1;
                                        for (var t = d.splitLines(e), n = 0; n < t.length; n++)
                                            if (t[n].length < 2 || "=" !== t[n].charAt(1)) return !1;
                                        return !0
                                    }, "object" == typeof t && (t.exports = d)
                                }, {}],
                                3: [function (n, r, e) {
                                    (function (e) {
                                        var t = n("./adapter_factory.js");
                                        r.exports = t({
                                            window: e.window
                                        })
                                    }).call(this, void 0 !== t ? t : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
                                }, {
                                    "./adapter_factory.js": 4
                                }],
                                4: [function (f, e, t) {
                                    var h = f("./utils");
                                    e.exports = function (e, t) {
                                        var n = e && e.window,
                                            r = {
                                                shimChrome: !0,
                                                shimFirefox: !0,
                                                shimEdge: !0,
                                                shimSafari: !0
                                            };
                                        for (var i in t) hasOwnProperty.call(t, i) && (r[i] = t[i]);
                                        var o = h.log,
                                            a = h.detectBrowser(n),
                                            s = f("./chrome/chrome_shim") || null,
                                            c = f("./edge/edge_shim") || null,
                                            l = f("./firefox/firefox_shim") || null,
                                            d = f("./safari/safari_shim") || null,
                                            u = f("./common_shim") || null,
                                            p = {
                                                browserDetails: a,
                                                commonShim: u,
                                                extractVersion: h.extractVersion,
                                                disableLog: h.disableLog,
                                                disableWarnings: h.disableWarnings
                                            };
                                        switch (a.browser) {
                                            case "chrome":
                                                if (!s || !s.shimPeerConnection || !r.shimChrome) return o("Chrome shim is not included in this adapter release."), p;
                                                o("adapter.js shimming chrome."), p.browserShim = s, u.shimCreateObjectURL(n), s.shimGetUserMedia(n), s.shimMediaStream(n), s.shimSourceObject(n), s.shimPeerConnection(n), s.shimOnTrack(n), s.shimAddTrackRemoveTrack(n), s.shimGetSendersWithDtmf(n), s.shimSenderReceiverGetStats(n), s.fixNegotiationNeeded(n), u.shimRTCIceCandidate(n), u.shimMaxMessageSize(n), u.shimSendThrowTypeError(n);
                                                break;
                                            case "firefox":
                                                if (!l || !l.shimPeerConnection || !r.shimFirefox) return o("Firefox shim is not included in this adapter release."), p;
                                                o("adapter.js shimming firefox."), p.browserShim = l, u.shimCreateObjectURL(n), l.shimGetUserMedia(n), l.shimSourceObject(n), l.shimPeerConnection(n), l.shimOnTrack(n), l.shimRemoveStream(n), l.shimSenderGetStats(n), l.shimReceiverGetStats(n), l.shimRTCDataChannel(n), u.shimRTCIceCandidate(n), u.shimMaxMessageSize(n), u.shimSendThrowTypeError(n);
                                                break;
                                            case "edge":
                                                if (!c || !c.shimPeerConnection || !r.shimEdge) return o("MS edge shim is not included in this adapter release."), p;
                                                o("adapter.js shimming edge."), p.browserShim = c, u.shimCreateObjectURL(n), c.shimGetUserMedia(n), c.shimPeerConnection(n), c.shimReplaceTrack(n), u.shimMaxMessageSize(n), u.shimSendThrowTypeError(n);
                                                break;
                                            case "safari":
                                                if (!d || !r.shimSafari) return o("Safari shim is not included in this adapter release."), p;
                                                o("adapter.js shimming safari."), p.browserShim = d, u.shimCreateObjectURL(n), d.shimRTCIceServerUrls(n), d.shimCreateOfferLegacy(n), d.shimCallbacksAPI(n), d.shimLocalStreamsAPI(n), d.shimRemoteStreamsAPI(n), d.shimTrackEventTransceiver(n), d.shimGetUserMedia(n), u.shimRTCIceCandidate(n), u.shimMaxMessageSize(n), u.shimSendThrowTypeError(n);
                                                break;
                                            default:
                                                o("Unsupported browser!")
                                        }
                                        return p
                                    }
                                }, {
                                    "./chrome/chrome_shim": 5,
                                    "./common_shim": 7,
                                    "./edge/edge_shim": 8,
                                    "./firefox/firefox_shim": 11,
                                    "./safari/safari_shim": 13,
                                    "./utils": 14
                                }],
                                5: [function (e, t, n) {
                                    function i(n, t, e) {
                                        var r = e ? "outbound-rtp" : "inbound-rtp",
                                            i = new Map;
                                        if (null === t) return i;
                                        var o = [];
                                        return n.forEach(function (e) {
                                            "track" === e.type && e.trackIdentifier === t.id && o.push(e)
                                        }), o.forEach(function (t) {
                                            n.forEach(function (e) {
                                                e.type === r && e.trackId === t.id && function t(n, r, i) {
                                                    r && !i.has(r.id) && (i.set(r.id, r), Object.keys(r).forEach(function (e) {
                                                        e.endsWith("Id") ? t(n, n.get(r[e]), i) : e.endsWith("Ids") && r[e].forEach(function (e) {
                                                            t(n, n.get(e), i)
                                                        })
                                                    }))
                                                }(n, e, i)
                                            })
                                        }), i
                                    }
                                    var c = e("../utils.js"),
                                        r = c.log;
                                    t.exports = {
                                        shimGetUserMedia: e("./getusermedia"),
                                        shimMediaStream: function (e) {
                                            e.MediaStream = e.MediaStream || e.webkitMediaStream
                                        },
                                        shimOnTrack: function (o) {
                                            if ("object" != typeof o || !o.RTCPeerConnection || "ontrack" in o.RTCPeerConnection.prototype) "RTCRtpTransceiver" in o || c.wrapPeerConnectionEvent(o, "track", function (e) {
                                                return e.transceiver || (e.transceiver = {
                                                    receiver: e.receiver
                                                }), e
                                            });
                                            else {
                                                Object.defineProperty(o.RTCPeerConnection.prototype, "ontrack", {
                                                    get: function () {
                                                        return this._ontrack
                                                    },
                                                    set: function (e) {
                                                        this._ontrack && this.removeEventListener("track", this._ontrack), this.addEventListener("track", this._ontrack = e)
                                                    },
                                                    enumerable: !0,
                                                    configurable: !0
                                                });
                                                var e = o.RTCPeerConnection.prototype.setRemoteDescription;
                                                o.RTCPeerConnection.prototype.setRemoteDescription = function () {
                                                    var i = this;
                                                    return i._ontrackpoly || (i._ontrackpoly = function (r) {
                                                        r.stream.addEventListener("addtrack", function (t) {
                                                            var e;
                                                            e = o.RTCPeerConnection.prototype.getReceivers ? i.getReceivers().find(function (e) {
                                                                return e.track && e.track.id === t.track.id
                                                            }) : {
                                                                    track: t.track
                                                                };
                                                            var n = new Event("track");
                                                            n.track = t.track, n.receiver = e, n.transceiver = {
                                                                receiver: e
                                                            }, n.streams = [r.stream], i.dispatchEvent(n)
                                                        }), r.stream.getTracks().forEach(function (t) {
                                                            var e;
                                                            e = o.RTCPeerConnection.prototype.getReceivers ? i.getReceivers().find(function (e) {
                                                                return e.track && e.track.id === t.id
                                                            }) : {
                                                                    track: t
                                                                };
                                                            var n = new Event("track");
                                                            n.track = t, n.receiver = e, n.transceiver = {
                                                                receiver: e
                                                            }, n.streams = [r.stream], i.dispatchEvent(n)
                                                        })
                                                    }, i.addEventListener("addstream", i._ontrackpoly)), e.apply(i, arguments)
                                                }
                                            }
                                        },
                                        shimGetSendersWithDtmf: function (e) {
                                            if ("object" == typeof e && e.RTCPeerConnection && !("getSenders" in e.RTCPeerConnection.prototype) && "createDTMFSender" in e.RTCPeerConnection.prototype) {
                                                var r = function (e, t) {
                                                    return {
                                                        track: t,
                                                        get dtmf() {
                                                            return void 0 === this._dtmf && ("audio" === t.kind ? this._dtmf = e.createDTMFSender(t) : this._dtmf = null), this._dtmf
                                                        },
                                                        _pc: e
                                                    }
                                                };
                                                if (!e.RTCPeerConnection.prototype.getSenders) {
                                                    e.RTCPeerConnection.prototype.getSenders = function () {
                                                        return this._senders = this._senders || [], this._senders.slice()
                                                    };
                                                    var i = e.RTCPeerConnection.prototype.addTrack;
                                                    e.RTCPeerConnection.prototype.addTrack = function (e, t) {
                                                        var n = i.apply(this, arguments);
                                                        return n || (n = r(this, e), this._senders.push(n)), n
                                                    };
                                                    var n = e.RTCPeerConnection.prototype.removeTrack;
                                                    e.RTCPeerConnection.prototype.removeTrack = function (e) {
                                                        n.apply(this, arguments);
                                                        var t = this._senders.indexOf(e); - 1 !== t && this._senders.splice(t, 1)
                                                    }
                                                }
                                                var o = e.RTCPeerConnection.prototype.addStream;
                                                e.RTCPeerConnection.prototype.addStream = function (e) {
                                                    var t = this;
                                                    t._senders = t._senders || [], o.apply(t, [e]), e.getTracks().forEach(function (e) {
                                                        t._senders.push(r(t, e))
                                                    })
                                                };
                                                var t = e.RTCPeerConnection.prototype.removeStream;
                                                e.RTCPeerConnection.prototype.removeStream = function (e) {
                                                    var n = this;
                                                    n._senders = n._senders || [], t.apply(n, [e]), e.getTracks().forEach(function (t) {
                                                        var e = n._senders.find(function (e) {
                                                            return e.track === t
                                                        });
                                                        e && n._senders.splice(n._senders.indexOf(e), 1)
                                                    })
                                                }
                                            } else if ("object" == typeof e && e.RTCPeerConnection && "getSenders" in e.RTCPeerConnection.prototype && "createDTMFSender" in e.RTCPeerConnection.prototype && e.RTCRtpSender && !("dtmf" in e.RTCRtpSender.prototype)) {
                                                var a = e.RTCPeerConnection.prototype.getSenders;
                                                e.RTCPeerConnection.prototype.getSenders = function () {
                                                    var t = this,
                                                        e = a.apply(t, []);
                                                    return e.forEach(function (e) {
                                                        e._pc = t
                                                    }), e
                                                }, Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
                                                    get: function () {
                                                        return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = this._pc.createDTMFSender(this.track) : this._dtmf = null), this._dtmf
                                                    }
                                                })
                                            }
                                        },
                                        shimSenderReceiverGetStats: function (e) {
                                            if ("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender && e.RTCRtpReceiver) {
                                                if (!("getStats" in e.RTCRtpSender.prototype)) {
                                                    var n = e.RTCPeerConnection.prototype.getSenders;
                                                    n && (e.RTCPeerConnection.prototype.getSenders = function () {
                                                        var t = this,
                                                            e = n.apply(t, []);
                                                        return e.forEach(function (e) {
                                                            e._pc = t
                                                        }), e
                                                    });
                                                    var t = e.RTCPeerConnection.prototype.addTrack;
                                                    t && (e.RTCPeerConnection.prototype.addTrack = function () {
                                                        var e = t.apply(this, arguments);
                                                        return e._pc = this, e
                                                    }), e.RTCRtpSender.prototype.getStats = function () {
                                                        var t = this;
                                                        return this._pc.getStats().then(function (e) {
                                                            return i(e, t.track, !0)
                                                        })
                                                    }
                                                }
                                                if (!("getStats" in e.RTCRtpReceiver.prototype)) {
                                                    var r = e.RTCPeerConnection.prototype.getReceivers;
                                                    r && (e.RTCPeerConnection.prototype.getReceivers = function () {
                                                        var t = this,
                                                            e = r.apply(t, []);
                                                        return e.forEach(function (e) {
                                                            e._pc = t
                                                        }), e
                                                    }), c.wrapPeerConnectionEvent(e, "track", function (e) {
                                                        return e.receiver._pc = e.srcElement, e
                                                    }), e.RTCRtpReceiver.prototype.getStats = function () {
                                                        var t = this;
                                                        return this._pc.getStats().then(function (e) {
                                                            return i(e, t.track, !1)
                                                        })
                                                    }
                                                }
                                                if ("getStats" in e.RTCRtpSender.prototype && "getStats" in e.RTCRtpReceiver.prototype) {
                                                    var o = e.RTCPeerConnection.prototype.getStats;
                                                    e.RTCPeerConnection.prototype.getStats = function () {
                                                        if (0 < arguments.length && arguments[0] instanceof e.MediaStreamTrack) {
                                                            var t, n, r, i = arguments[0];
                                                            return this.getSenders().forEach(function (e) {
                                                                e.track === i && (t ? r = !0 : t = e)
                                                            }), this.getReceivers().forEach(function (e) {
                                                                return e.track === i && (n ? r = !0 : n = e), e.track === i
                                                            }), r || t && n ? Promise.reject(new DOMException("There are more than one sender or receiver for the track.", "InvalidAccessError")) : t ? t.getStats() : n ? n.getStats() : Promise.reject(new DOMException("There is no sender or receiver for the track.", "InvalidAccessError"))
                                                        }
                                                        return o.apply(this, arguments)
                                                    }
                                                }
                                            }
                                        },
                                        shimSourceObject: function (e) {
                                            var n = e && e.URL;
                                            "object" == typeof e && (!e.HTMLMediaElement || "srcObject" in e.HTMLMediaElement.prototype || Object.defineProperty(e.HTMLMediaElement.prototype, "srcObject", {
                                                get: function () {
                                                    return this._srcObject
                                                },
                                                set: function (e) {
                                                    var t = this;
                                                    this._srcObject = e, this.src && n.revokeObjectURL(this.src), e ? (this.src = n.createObjectURL(e), e.addEventListener("addtrack", function () {
                                                        t.src && n.revokeObjectURL(t.src), t.src = n.createObjectURL(e)
                                                    }), e.addEventListener("removetrack", function () {
                                                        t.src && n.revokeObjectURL(t.src), t.src = n.createObjectURL(e)
                                                    })) : this.src = ""
                                                }
                                            }))
                                        },
                                        shimAddTrackRemoveTrackWithNative: function (e) {
                                            e.RTCPeerConnection.prototype.getLocalStreams = function () {
                                                var t = this;
                                                return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, Object.keys(this._shimmedLocalStreams).map(function (e) {
                                                    return t._shimmedLocalStreams[e][0]
                                                })
                                            };
                                            var r = e.RTCPeerConnection.prototype.addTrack;
                                            e.RTCPeerConnection.prototype.addTrack = function (e, t) {
                                                if (!t) return r.apply(this, arguments);
                                                this._shimmedLocalStreams = this._shimmedLocalStreams || {};
                                                var n = r.apply(this, arguments);
                                                return this._shimmedLocalStreams[t.id] ? -1 === this._shimmedLocalStreams[t.id].indexOf(n) && this._shimmedLocalStreams[t.id].push(n) : this._shimmedLocalStreams[t.id] = [t, n], n
                                            };
                                            var i = e.RTCPeerConnection.prototype.addStream;
                                            e.RTCPeerConnection.prototype.addStream = function (e) {
                                                var n = this;
                                                this._shimmedLocalStreams = this._shimmedLocalStreams || {}, e.getTracks().forEach(function (t) {
                                                    if (n.getSenders().find(function (e) {
                                                        return e.track === t
                                                    })) throw new DOMException("Track already exists.", "InvalidAccessError")
                                                });
                                                var t = n.getSenders();
                                                i.apply(this, arguments);
                                                var r = n.getSenders().filter(function (e) {
                                                    return -1 === t.indexOf(e)
                                                });
                                                this._shimmedLocalStreams[e.id] = [e].concat(r)
                                            };
                                            var t = e.RTCPeerConnection.prototype.removeStream;
                                            e.RTCPeerConnection.prototype.removeStream = function (e) {
                                                return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, delete this._shimmedLocalStreams[e.id], t.apply(this, arguments)
                                            };
                                            var o = e.RTCPeerConnection.prototype.removeTrack;
                                            e.RTCPeerConnection.prototype.removeTrack = function (n) {
                                                var r = this;
                                                return this._shimmedLocalStreams = this._shimmedLocalStreams || {}, n && Object.keys(this._shimmedLocalStreams).forEach(function (e) {
                                                    var t = r._shimmedLocalStreams[e].indexOf(n); - 1 !== t && r._shimmedLocalStreams[e].splice(t, 1), 1 === r._shimmedLocalStreams[e].length && delete r._shimmedLocalStreams[e]
                                                }), o.apply(this, arguments)
                                            }
                                        },
                                        shimAddTrackRemoveTrack: function (a) {
                                            function i(r, e) {
                                                var i = e.sdp;
                                                return Object.keys(r._reverseStreams || []).forEach(function (e) {
                                                    var t = r._reverseStreams[e],
                                                        n = r._streams[t.id];
                                                    i = i.replace(new RegExp(n.id, "g"), t.id)
                                                }), new RTCSessionDescription({
                                                    type: e.type,
                                                    sdp: i
                                                })
                                            }
                                            var e = c.detectBrowser(a);
                                            if (a.RTCPeerConnection.prototype.addTrack && 65 <= e.version) return this.shimAddTrackRemoveTrackWithNative(a);
                                            var n = a.RTCPeerConnection.prototype.getLocalStreams;
                                            a.RTCPeerConnection.prototype.getLocalStreams = function () {
                                                var t = this,
                                                    e = n.apply(this);
                                                return t._reverseStreams = t._reverseStreams || {}, e.map(function (e) {
                                                    return t._reverseStreams[e.id]
                                                })
                                            };
                                            var r = a.RTCPeerConnection.prototype.addStream;
                                            a.RTCPeerConnection.prototype.addStream = function (e) {
                                                var n = this;
                                                if (n._streams = n._streams || {}, n._reverseStreams = n._reverseStreams || {}, e.getTracks().forEach(function (t) {
                                                    if (n.getSenders().find(function (e) {
                                                        return e.track === t
                                                    })) throw new DOMException("Track already exists.", "InvalidAccessError")
                                                }), !n._reverseStreams[e.id]) {
                                                    var t = new a.MediaStream(e.getTracks());
                                                    n._streams[e.id] = t, n._reverseStreams[t.id] = e, e = t
                                                }
                                                r.apply(n, [e])
                                            };
                                            var o = a.RTCPeerConnection.prototype.removeStream;
                                            a.RTCPeerConnection.prototype.removeStream = function (e) {
                                                var t = this;
                                                t._streams = t._streams || {}, t._reverseStreams = t._reverseStreams || {}, o.apply(t, [t._streams[e.id] || e]), delete t._reverseStreams[t._streams[e.id] ? t._streams[e.id].id : e.id], delete t._streams[e.id]
                                            }, a.RTCPeerConnection.prototype.addTrack = function (t, e) {
                                                var n = this;
                                                if ("closed" === n.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
                                                var r = [].slice.call(arguments, 1);
                                                if (1 !== r.length || !r[0].getTracks().find(function (e) {
                                                    return e === t
                                                })) throw new DOMException("The adapter.js addTrack polyfill only supports a single  stream which is associated with the specified track.", "NotSupportedError");
                                                if (n.getSenders().find(function (e) {
                                                    return e.track === t
                                                })) throw new DOMException("Track already exists.", "InvalidAccessError");
                                                n._streams = n._streams || {}, n._reverseStreams = n._reverseStreams || {};
                                                var i = n._streams[e.id];
                                                if (i) i.addTrack(t), Promise.resolve().then(function () {
                                                    n.dispatchEvent(new Event("negotiationneeded"))
                                                });
                                                else {
                                                    var o = new a.MediaStream([t]);
                                                    n._streams[e.id] = o, n._reverseStreams[o.id] = e, n.addStream(o)
                                                }
                                                return n.getSenders().find(function (e) {
                                                    return e.track === t
                                                })
                                            }, ["createOffer", "createAnswer"].forEach(function (e) {
                                                var t = a.RTCPeerConnection.prototype[e];
                                                a.RTCPeerConnection.prototype[e] = function () {
                                                    var n = this,
                                                        r = arguments;
                                                    return arguments.length && "function" == typeof arguments[0] ? t.apply(n, [function (e) {
                                                        var t = i(n, e);
                                                        r[0].apply(null, [t])
                                                    }, function (e) {
                                                        r[1] && r[1].apply(null, e)
                                                    }, arguments[2]]) : t.apply(n, arguments).then(function (e) {
                                                        return i(n, e)
                                                    })
                                                }
                                            });
                                            var t = a.RTCPeerConnection.prototype.setLocalDescription;
                                            a.RTCPeerConnection.prototype.setLocalDescription = function () {
                                                var r, e, i;
                                                return arguments.length && arguments[0].type && (arguments[0] = (r = this, e = arguments[0], i = e.sdp, Object.keys(r._reverseStreams || []).forEach(function (e) {
                                                    var t = r._reverseStreams[e],
                                                        n = r._streams[t.id];
                                                    i = i.replace(new RegExp(t.id, "g"), n.id)
                                                }), new RTCSessionDescription({
                                                    type: e.type,
                                                    sdp: i
                                                }))), t.apply(this, arguments)
                                            };
                                            var s = Object.getOwnPropertyDescriptor(a.RTCPeerConnection.prototype, "localDescription");
                                            Object.defineProperty(a.RTCPeerConnection.prototype, "localDescription", {
                                                get: function () {
                                                    var e = s.get.apply(this);
                                                    return "" === e.type ? e : i(this, e)
                                                }
                                            }), a.RTCPeerConnection.prototype.removeTrack = function (t) {
                                                var n, r = this;
                                                if ("closed" === r.signalingState) throw new DOMException("The RTCPeerConnection's signalingState is 'closed'.", "InvalidStateError");
                                                if (!t._pc) throw new DOMException("Argument 1 of RTCPeerConnection.removeTrack does not implement interface RTCRtpSender.", "TypeError");
                                                if (t._pc !== r) throw new DOMException("Sender was not created by this connection.", "InvalidAccessError");
                                                r._streams = r._streams || {}, Object.keys(r._streams).forEach(function (e) {
                                                    r._streams[e].getTracks().find(function (e) {
                                                        return t.track === e
                                                    }) && (n = r._streams[e])
                                                }), n && (1 === n.getTracks().length ? r.removeStream(r._reverseStreams[n.id]) : n.removeTrack(t.track), r.dispatchEvent(new Event("negotiationneeded")))
                                            }
                                        },
                                        shimPeerConnection: function (n) {
                                            var e = c.detectBrowser(n);
                                            if (!n.RTCPeerConnection && n.webkitRTCPeerConnection) n.RTCPeerConnection = function (e, t) {
                                                return r("PeerConnection"), e && e.iceTransportPolicy && (e.iceTransports = e.iceTransportPolicy), new n.webkitRTCPeerConnection(e, t)
                                            }, n.RTCPeerConnection.prototype = n.webkitRTCPeerConnection.prototype, n.webkitRTCPeerConnection.generateCertificate && Object.defineProperty(n.RTCPeerConnection, "generateCertificate", {
                                                get: function () {
                                                    return n.webkitRTCPeerConnection.generateCertificate
                                                }
                                            });
                                            else {
                                                var o = n.RTCPeerConnection;
                                                n.RTCPeerConnection = function (e, t) {
                                                    if (e && e.iceServers) {
                                                        for (var n = [], r = 0; r < e.iceServers.length; r++) {
                                                            var i = e.iceServers[r];
                                                            !i.hasOwnProperty("urls") && i.hasOwnProperty("url") ? (c.deprecated("RTCIceServer.url", "RTCIceServer.urls"), (i = JSON.parse(JSON.stringify(i))).urls = i.url, n.push(i)) : n.push(e.iceServers[r])
                                                        }
                                                        e.iceServers = n
                                                    }
                                                    return new o(e, t)
                                                }, n.RTCPeerConnection.prototype = o.prototype, Object.defineProperty(n.RTCPeerConnection, "generateCertificate", {
                                                    get: function () {
                                                        return o.generateCertificate
                                                    }
                                                })
                                            }
                                            var s = n.RTCPeerConnection.prototype.getStats;
                                            n.RTCPeerConnection.prototype.getStats = function (e, t, n) {
                                                var r = this,
                                                    i = arguments;
                                                if (0 < arguments.length && "function" == typeof e) return s.apply(this, arguments);
                                                if (0 === s.length && (0 === arguments.length || "function" != typeof e)) return s.apply(this, []);
                                                var o = function (e) {
                                                    var r = {};
                                                    return e.result().forEach(function (t) {
                                                        var n = {
                                                            id: t.id,
                                                            timestamp: t.timestamp,
                                                            type: {
                                                                localcandidate: "local-candidate",
                                                                remotecandidate: "remote-candidate"
                                                            }[t.type] || t.type
                                                        };
                                                        t.names().forEach(function (e) {
                                                            n[e] = t.stat(e)
                                                        }), r[n.id] = n
                                                    }), r
                                                },
                                                    a = function (t) {
                                                        return new Map(Object.keys(t).map(function (e) {
                                                            return [e, t[e]]
                                                        }))
                                                    };
                                                if (2 <= arguments.length) {
                                                    return s.apply(this, [function (e) {
                                                        i[1](a(o(e)))
                                                    }, e])
                                                }
                                                return new Promise(function (t, e) {
                                                    s.apply(r, [function (e) {
                                                        t(a(o(e)))
                                                    }, e])
                                                }).then(t, n)
                                            }, e.version < 51 && ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                                                var i = n.RTCPeerConnection.prototype[e];
                                                n.RTCPeerConnection.prototype[e] = function () {
                                                    var n = arguments,
                                                        r = this,
                                                        e = new Promise(function (e, t) {
                                                            i.apply(r, [n[0], e, t])
                                                        });
                                                    return n.length < 2 ? e : e.then(function () {
                                                        n[1].apply(null, [])
                                                    }, function (e) {
                                                        3 <= n.length && n[2].apply(null, [e])
                                                    })
                                                }
                                            }), e.version < 52 && ["createOffer", "createAnswer"].forEach(function (e) {
                                                var i = n.RTCPeerConnection.prototype[e];
                                                n.RTCPeerConnection.prototype[e] = function () {
                                                    var n = this;
                                                    if (arguments.length < 1 || 1 === arguments.length && "object" == typeof arguments[0]) {
                                                        var r = 1 === arguments.length ? arguments[0] : void 0;
                                                        return new Promise(function (e, t) {
                                                            i.apply(n, [e, t, r])
                                                        })
                                                    }
                                                    return i.apply(this, arguments)
                                                }
                                            }), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                                                var t = n.RTCPeerConnection.prototype[e];
                                                n.RTCPeerConnection.prototype[e] = function () {
                                                    return arguments[0] = new ("addIceCandidate" === e ? n.RTCIceCandidate : n.RTCSessionDescription)(arguments[0]), t.apply(this, arguments)
                                                }
                                            });
                                            var t = n.RTCPeerConnection.prototype.addIceCandidate;
                                            n.RTCPeerConnection.prototype.addIceCandidate = function () {
                                                return arguments[0] ? t.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                                            }
                                        },
                                        fixNegotiationNeeded: function (e) {
                                            c.wrapPeerConnectionEvent(e, "negotiationneeded", function (e) {
                                                if ("stable" === e.target.signalingState) return e
                                            })
                                        },
                                        shimGetDisplayMedia: function (e, n) {
                                            "getDisplayMedia" in e.navigator || "function" == typeof n && (navigator.getDisplayMedia = function (t) {
                                                return n(t).then(function (e) {
                                                    return t.video = {
                                                        mandatory: {
                                                            chromeMediaSource: "desktop",
                                                            chromeMediaSourceId: e,
                                                            maxFrameRate: t.video.frameRate || 3
                                                        }
                                                    }, navigator.mediaDevices.getUserMedia(t)
                                                })
                                            })
                                        }
                                    }
                                }, {
                                    "../utils.js": 14,
                                    "./getusermedia": 6
                                }],
                                6: [function (e, t, n) {
                                    var o = e("../utils.js"),
                                        l = o.log;
                                    t.exports = function (e) {
                                        var a = o.detectBrowser(e),
                                            s = e && e.navigator,
                                            c = function (i) {
                                                if ("object" != typeof i || i.mandatory || i.optional) return i;
                                                var o = {};
                                                return Object.keys(i).forEach(function (t) {
                                                    if ("require" !== t && "advanced" !== t && "mediaSource" !== t) {
                                                        var n = "object" == typeof i[t] ? i[t] : {
                                                            ideal: i[t]
                                                        };
                                                        void 0 !== n.exact && "number" == typeof n.exact && (n.min = n.max = n.exact);
                                                        var r = function (e, t) {
                                                            return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                                                        };
                                                        if (void 0 !== n.ideal) {
                                                            o.optional = o.optional || [];
                                                            var e = {};
                                                            "number" == typeof n.ideal ? (e[r("min", t)] = n.ideal, o.optional.push(e), (e = {})[r("max", t)] = n.ideal) : e[r("", t)] = n.ideal, o.optional.push(e)
                                                        }
                                                        void 0 !== n.exact && "number" != typeof n.exact ? (o.mandatory = o.mandatory || {}, o.mandatory[r("", t)] = n.exact) : ["min", "max"].forEach(function (e) {
                                                            void 0 !== n[e] && (o.mandatory = o.mandatory || {}, o.mandatory[r(e, t)] = n[e])
                                                        })
                                                    }
                                                }), i.advanced && (o.optional = (o.optional || []).concat(i.advanced)), o
                                            },
                                            r = function (n, r) {
                                                if (61 <= a.version) return r(n);
                                                if ((n = JSON.parse(JSON.stringify(n))) && "object" == typeof n.audio) {
                                                    var e = function (e, t, n) {
                                                        t in e && !(n in e) && (e[n] = e[t], delete e[t])
                                                    };
                                                    e((n = JSON.parse(JSON.stringify(n))).audio, "autoGainControl", "googAutoGainControl"), e(n.audio, "noiseSuppression", "googNoiseSuppression"), n.audio = c(n.audio)
                                                }
                                                if (n && "object" == typeof n.video) {
                                                    var i = n.video.facingMode;
                                                    i = i && ("object" == typeof i ? i : {
                                                        ideal: i
                                                    });
                                                    var o, t = a.version < 66;
                                                    if (i && ("user" === i.exact || "environment" === i.exact || "user" === i.ideal || "environment" === i.ideal) && (!s.mediaDevices.getSupportedConstraints || !s.mediaDevices.getSupportedConstraints().facingMode || t))
                                                        if (delete n.video.facingMode, "environment" === i.exact || "environment" === i.ideal ? o = ["back", "rear"] : "user" !== i.exact && "user" !== i.ideal || (o = ["front"]), o) return s.mediaDevices.enumerateDevices().then(function (e) {
                                                            var t = (e = e.filter(function (e) {
                                                                return "videoinput" === e.kind
                                                            })).find(function (t) {
                                                                return o.some(function (e) {
                                                                    return -1 !== t.label.toLowerCase().indexOf(e)
                                                                })
                                                            });
                                                            return !t && e.length && -1 !== o.indexOf("back") && (t = e[e.length - 1]), t && (n.video.deviceId = i.exact ? {
                                                                exact: t.deviceId
                                                            } : {
                                                                    ideal: t.deviceId
                                                                }), n.video = c(n.video), l("chrome: " + JSON.stringify(n)), r(n)
                                                        });
                                                    n.video = c(n.video)
                                                }
                                                return l("chrome: " + JSON.stringify(n)), r(n)
                                            },
                                            i = function (e) {
                                                return 64 <= a.version ? e : {
                                                    name: {
                                                        PermissionDeniedError: "NotAllowedError",
                                                        PermissionDismissedError: "NotAllowedError",
                                                        InvalidStateError: "NotAllowedError",
                                                        DevicesNotFoundError: "NotFoundError",
                                                        ConstraintNotSatisfiedError: "OverconstrainedError",
                                                        TrackStartError: "NotReadableError",
                                                        MediaDeviceFailedDueToShutdown: "NotAllowedError",
                                                        MediaDeviceKillSwitchOn: "NotAllowedError",
                                                        TabCaptureError: "AbortError",
                                                        ScreenCaptureError: "AbortError",
                                                        DeviceCaptureError: "AbortError"
                                                    }[e.name] || e.name,
                                                    message: e.message,
                                                    constraint: e.constraint || e.constraintName,
                                                    toString: function () {
                                                        return this.name + (this.message && ": ") + this.message
                                                    }
                                                }
                                            };
                                        s.getUserMedia = function (e, t, n) {
                                            r(e, function (e) {
                                                s.webkitGetUserMedia(e, t, function (e) {
                                                    n && n(i(e))
                                                })
                                            })
                                        };
                                        var t = function (n) {
                                            return new Promise(function (e, t) {
                                                s.getUserMedia(n, e, t)
                                            })
                                        };
                                        if (s.mediaDevices || (s.mediaDevices = {
                                            getUserMedia: t,
                                            enumerateDevices: function () {
                                                return new Promise(function (t) {
                                                    var n = {
                                                        audio: "audioinput",
                                                        video: "videoinput"
                                                    };
                                                    return e.MediaStreamTrack.getSources(function (e) {
                                                        t(e.map(function (e) {
                                                            return {
                                                                label: e.label,
                                                                kind: n[e.kind],
                                                                deviceId: e.id,
                                                                groupId: ""
                                                            }
                                                        }))
                                                    })
                                                })
                                            },
                                            getSupportedConstraints: function () {
                                                return {
                                                    deviceId: !0,
                                                    echoCancellation: !0,
                                                    facingMode: !0,
                                                    frameRate: !0,
                                                    height: !0,
                                                    width: !0
                                                }
                                            }
                                        }), s.mediaDevices.getUserMedia) {
                                            var n = s.mediaDevices.getUserMedia.bind(s.mediaDevices);
                                            s.mediaDevices.getUserMedia = function (e) {
                                                return r(e, function (t) {
                                                    return n(t).then(function (e) {
                                                        if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach(function (e) {
                                                            e.stop()
                                                        }), new DOMException("", "NotFoundError");
                                                        return e
                                                    }, function (e) {
                                                        return Promise.reject(i(e))
                                                    })
                                                })
                                            }
                                        } else s.mediaDevices.getUserMedia = function (e) {
                                            return t(e)
                                        };
                                        void 0 === s.mediaDevices.addEventListener && (s.mediaDevices.addEventListener = function () {
                                            l("Dummy mediaDevices.addEventListener called.")
                                        }), void 0 === s.mediaDevices.removeEventListener && (s.mediaDevices.removeEventListener = function () {
                                            l("Dummy mediaDevices.removeEventListener called.")
                                        })
                                    }
                                }, {
                                    "../utils.js": 14
                                }],
                                7: [function (e, t, n) {
                                    var u = e("sdp"),
                                        c = e("./utils");
                                    t.exports = {
                                        shimRTCIceCandidate: function (t) {
                                            if (t.RTCIceCandidate && !(t.RTCIceCandidate && "foundation" in t.RTCIceCandidate.prototype)) {
                                                var i = t.RTCIceCandidate;
                                                t.RTCIceCandidate = function (e) {
                                                    if ("object" == typeof e && e.candidate && 0 === e.candidate.indexOf("a=") && ((e = JSON.parse(JSON.stringify(e))).candidate = e.candidate.substr(2)), e.candidate && e.candidate.length) {
                                                        var t = new i(e),
                                                            n = u.parseCandidate(e.candidate),
                                                            r = Object.assign(t, n);
                                                        return r.toJSON = function () {
                                                            return {
                                                                candidate: r.candidate,
                                                                sdpMid: r.sdpMid,
                                                                sdpMLineIndex: r.sdpMLineIndex,
                                                                usernameFragment: r.usernameFragment
                                                            }
                                                        }, r
                                                    }
                                                    return new i(e)
                                                }, t.RTCIceCandidate.prototype = i.prototype, c.wrapPeerConnectionEvent(t, "icecandidate", function (e) {
                                                    return e.candidate && Object.defineProperty(e, "candidate", {
                                                        value: new t.RTCIceCandidate(e.candidate),
                                                        writable: "false"
                                                    }), e
                                                })
                                            }
                                        },
                                        shimCreateObjectURL: function (e) {
                                            var t = e && e.URL;
                                            if ("object" == typeof e && e.HTMLMediaElement && "srcObject" in e.HTMLMediaElement.prototype && t.createObjectURL && t.revokeObjectURL) {
                                                var n = t.createObjectURL.bind(t),
                                                    r = t.revokeObjectURL.bind(t),
                                                    i = new Map,
                                                    o = 0;
                                                t.createObjectURL = function (e) {
                                                    if ("getTracks" in e) {
                                                        var t = "polyblob:" + ++o;
                                                        return i.set(t, e), c.deprecated("URL.createObjectURL(stream)", "elem.srcObject = stream"), t
                                                    }
                                                    return n(e)
                                                }, t.revokeObjectURL = function (e) {
                                                    r(e), i.delete(e)
                                                };
                                                var a = Object.getOwnPropertyDescriptor(e.HTMLMediaElement.prototype, "src");
                                                Object.defineProperty(e.HTMLMediaElement.prototype, "src", {
                                                    get: function () {
                                                        return a.get.apply(this)
                                                    },
                                                    set: function (e) {
                                                        return this.srcObject = i.get(e) || null, a.set.apply(this, [e])
                                                    }
                                                });
                                                var s = e.HTMLMediaElement.prototype.setAttribute;
                                                e.HTMLMediaElement.prototype.setAttribute = function () {
                                                    return 2 === arguments.length && "src" === ("" + arguments[0]).toLowerCase() && (this.srcObject = i.get(arguments[1]) || null), s.apply(this, arguments)
                                                }
                                            }
                                        },
                                        shimMaxMessageSize: function (e) {
                                            if (!e.RTCSctpTransport && e.RTCPeerConnection) {
                                                var l = c.detectBrowser(e);
                                                "sctp" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "sctp", {
                                                    get: function () {
                                                        return void 0 === this._sctp ? null : this._sctp
                                                    }
                                                });
                                                var d = e.RTCPeerConnection.prototype.setRemoteDescription;
                                                e.RTCPeerConnection.prototype.setRemoteDescription = function () {
                                                    var e, t, n, r;
                                                    if (this._sctp = null, n = arguments[0], (r = u.splitSections(n.sdp)).shift(), r.some(function (e) {
                                                        var t = u.parseMLine(e);
                                                        return t && "application" === t.kind && -1 !== t.protocol.indexOf("SCTP")
                                                    })) {
                                                        var i, o = function (e) {
                                                            var t = e.sdp.match(/mozilla...THIS_IS_SDPARTA-(\d+)/);
                                                            if (null === t || t.length < 2) return -1;
                                                            var n = parseInt(t[1], 10);
                                                            return n != n ? -1 : n
                                                        }(arguments[0]),
                                                            a = (e = o, t = 65536, "firefox" === l.browser && (t = l.version < 57 ? -1 === e ? 16384 : 2147483637 : l.version < 60 ? 57 === l.version ? 65535 : 65536 : 2147483637), t),
                                                            s = function (e, t) {
                                                                var n = 65536;
                                                                "firefox" === l.browser && 57 === l.version && (n = 65535);
                                                                var r = u.matchPrefix(e.sdp, "a=max-message-size:");
                                                                return 0 < r.length ? n = parseInt(r[0].substr(19), 10) : "firefox" === l.browser && -1 !== t && (n = 2147483637), n
                                                            }(arguments[0], o);
                                                        i = 0 === a && 0 === s ? Number.POSITIVE_INFINITY : 0 === a || 0 === s ? Math.max(a, s) : Math.min(a, s);
                                                        var c = {};
                                                        Object.defineProperty(c, "maxMessageSize", {
                                                            get: function () {
                                                                return i
                                                            }
                                                        }), this._sctp = c
                                                    }
                                                    return d.apply(this, arguments)
                                                }
                                            }
                                        },
                                        shimSendThrowTypeError: function (e) {
                                            function t(n, r) {
                                                var i = n.send;
                                                n.send = function () {
                                                    var e = arguments[0],
                                                        t = e.length || e.size || e.byteLength;
                                                    if ("open" === n.readyState && r.sctp && t > r.sctp.maxMessageSize) throw new TypeError("Message too large (can send a maximum of " + r.sctp.maxMessageSize + " bytes)");
                                                    return i.apply(n, arguments)
                                                }
                                            }
                                            if (e.RTCPeerConnection && "createDataChannel" in e.RTCPeerConnection.prototype) {
                                                var n = e.RTCPeerConnection.prototype.createDataChannel;
                                                e.RTCPeerConnection.prototype.createDataChannel = function () {
                                                    var e = n.apply(this, arguments);
                                                    return t(e, this), e
                                                }, c.wrapPeerConnectionEvent(e, "datachannel", function (e) {
                                                    return t(e.channel, e.target), e
                                                })
                                            }
                                        }
                                    }
                                }, {
                                    "./utils": 14,
                                    sdp: 2
                                }],
                                8: [function (e, t, n) {
                                    var i = e("../utils"),
                                        o = e("./filtericeservers"),
                                        a = e("rtcpeerconnection-shim");
                                    t.exports = {
                                        shimGetUserMedia: e("./getusermedia"),
                                        shimPeerConnection: function (e) {
                                            var t = i.detectBrowser(e);
                                            if (e.RTCIceGatherer && (e.RTCIceCandidate || (e.RTCIceCandidate = function (e) {
                                                return e
                                            }), e.RTCSessionDescription || (e.RTCSessionDescription = function (e) {
                                                return e
                                            }), t.version < 15025)) {
                                                var n = Object.getOwnPropertyDescriptor(e.MediaStreamTrack.prototype, "enabled");
                                                Object.defineProperty(e.MediaStreamTrack.prototype, "enabled", {
                                                    set: function (e) {
                                                        n.set.call(this, e);
                                                        var t = new Event("enabled");
                                                        t.enabled = e, this.dispatchEvent(t)
                                                    }
                                                })
                                            } !e.RTCRtpSender || "dtmf" in e.RTCRtpSender.prototype || Object.defineProperty(e.RTCRtpSender.prototype, "dtmf", {
                                                get: function () {
                                                    return void 0 === this._dtmf && ("audio" === this.track.kind ? this._dtmf = new e.RTCDtmfSender(this) : "video" === this.track.kind && (this._dtmf = null)), this._dtmf
                                                }
                                            }), e.RTCDtmfSender && !e.RTCDTMFSender && (e.RTCDTMFSender = e.RTCDtmfSender);
                                            var r = a(e, t.version);
                                            e.RTCPeerConnection = function (e) {
                                                return e && e.iceServers && (e.iceServers = o(e.iceServers)), new r(e)
                                            }, e.RTCPeerConnection.prototype = r.prototype
                                        },
                                        shimReplaceTrack: function (e) {
                                            !e.RTCRtpSender || "replaceTrack" in e.RTCRtpSender.prototype || (e.RTCRtpSender.prototype.replaceTrack = e.RTCRtpSender.prototype.setTrack)
                                        }
                                    }
                                }, {
                                    "../utils": 14,
                                    "./filtericeservers": 9,
                                    "./getusermedia": 10,
                                    "rtcpeerconnection-shim": 1
                                }],
                                9: [function (e, t, n) {
                                    var o = e("../utils");
                                    t.exports = function (e, r) {
                                        var i = !1;
                                        return (e = JSON.parse(JSON.stringify(e))).filter(function (e) {
                                            if (e && (e.urls || e.url)) {
                                                var t = e.urls || e.url;
                                                e.url && !e.urls && o.deprecated("RTCIceServer.url", "RTCIceServer.urls");
                                                var n = "string" == typeof t;
                                                return n && (t = [t]), t = t.filter(function (e) {
                                                    return 0 !== e.indexOf("turn:") || -1 === e.indexOf("transport=udp") || -1 !== e.indexOf("turn:[") || i ? 0 === e.indexOf("stun:") && 14393 <= r && -1 === e.indexOf("?transport=udp") : i = !0
                                                }), delete e.url, e.urls = n ? t[0] : t, !!t.length
                                            }
                                        })
                                    }
                                }, {
                                    "../utils": 14
                                }],
                                10: [function (e, t, n) {
                                    t.exports = function (e) {
                                        var t = e && e.navigator,
                                            n = t.mediaDevices.getUserMedia.bind(t.mediaDevices);
                                        t.mediaDevices.getUserMedia = function (e) {
                                            return n(e).catch(function (e) {
                                                return Promise.reject({
                                                    name: {
                                                        PermissionDeniedError: "NotAllowedError"
                                                    }[(t = e).name] || t.name,
                                                    message: t.message,
                                                    constraint: t.constraint,
                                                    toString: function () {
                                                        return this.name
                                                    }
                                                });
                                                var t
                                            })
                                        }
                                    }
                                }, {}],
                                11: [function (e, t, n) {
                                    var r = e("../utils");
                                    t.exports = {
                                        shimGetUserMedia: e("./getusermedia"),
                                        shimOnTrack: function (e) {
                                            "object" != typeof e || !e.RTCPeerConnection || "ontrack" in e.RTCPeerConnection.prototype || Object.defineProperty(e.RTCPeerConnection.prototype, "ontrack", {
                                                get: function () {
                                                    return this._ontrack
                                                },
                                                set: function (e) {
                                                    this._ontrack && (this.removeEventListener("track", this._ontrack), this.removeEventListener("addstream", this._ontrackpoly)), this.addEventListener("track", this._ontrack = e), this.addEventListener("addstream", this._ontrackpoly = function (n) {
                                                        n.stream.getTracks().forEach(function (e) {
                                                            var t = new Event("track");
                                                            t.track = e, t.receiver = {
                                                                track: e
                                                            }, t.transceiver = {
                                                                receiver: t.receiver
                                                            }, t.streams = [n.stream], this.dispatchEvent(t)
                                                        }.bind(this))
                                                    }.bind(this))
                                                },
                                                enumerable: !0,
                                                configurable: !0
                                            }), "object" == typeof e && e.RTCTrackEvent && "receiver" in e.RTCTrackEvent.prototype && !("transceiver" in e.RTCTrackEvent.prototype) && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
                                                get: function () {
                                                    return {
                                                        receiver: this.receiver
                                                    }
                                                }
                                            })
                                        },
                                        shimSourceObject: function (e) {
                                            "object" == typeof e && (!e.HTMLMediaElement || "srcObject" in e.HTMLMediaElement.prototype || Object.defineProperty(e.HTMLMediaElement.prototype, "srcObject", {
                                                get: function () {
                                                    return this.mozSrcObject
                                                },
                                                set: function (e) {
                                                    this.mozSrcObject = e
                                                }
                                            }))
                                        },
                                        shimPeerConnection: function (s) {
                                            var c = r.detectBrowser(s);
                                            if ("object" == typeof s && (s.RTCPeerConnection || s.mozRTCPeerConnection)) {
                                                s.RTCPeerConnection || (s.RTCPeerConnection = function (e, t) {
                                                    if (c.version < 38 && e && e.iceServers) {
                                                        for (var n = [], r = 0; r < e.iceServers.length; r++) {
                                                            var i = e.iceServers[r];
                                                            if (i.hasOwnProperty("urls"))
                                                                for (var o = 0; o < i.urls.length; o++) {
                                                                    var a = {
                                                                        url: i.urls[o]
                                                                    };
                                                                    0 === i.urls[o].indexOf("turn") && (a.username = i.username, a.credential = i.credential), n.push(a)
                                                                } else n.push(e.iceServers[r])
                                                        }
                                                        e.iceServers = n
                                                    }
                                                    return new s.mozRTCPeerConnection(e, t)
                                                }, s.RTCPeerConnection.prototype = s.mozRTCPeerConnection.prototype, s.mozRTCPeerConnection.generateCertificate && Object.defineProperty(s.RTCPeerConnection, "generateCertificate", {
                                                    get: function () {
                                                        return s.mozRTCPeerConnection.generateCertificate
                                                    }
                                                }), s.RTCSessionDescription = s.mozRTCSessionDescription, s.RTCIceCandidate = s.mozRTCIceCandidate), ["setLocalDescription", "setRemoteDescription", "addIceCandidate"].forEach(function (e) {
                                                    var t = s.RTCPeerConnection.prototype[e];
                                                    s.RTCPeerConnection.prototype[e] = function () {
                                                        return arguments[0] = new ("addIceCandidate" === e ? s.RTCIceCandidate : s.RTCSessionDescription)(arguments[0]), t.apply(this, arguments)
                                                    }
                                                });
                                                var e = s.RTCPeerConnection.prototype.addIceCandidate;
                                                s.RTCPeerConnection.prototype.addIceCandidate = function () {
                                                    return arguments[0] ? e.apply(this, arguments) : (arguments[1] && arguments[1].apply(null), Promise.resolve())
                                                };
                                                var o = {
                                                    inboundrtp: "inbound-rtp",
                                                    outboundrtp: "outbound-rtp",
                                                    candidatepair: "candidate-pair",
                                                    localcandidate: "local-candidate",
                                                    remotecandidate: "remote-candidate"
                                                },
                                                    n = s.RTCPeerConnection.prototype.getStats;
                                                s.RTCPeerConnection.prototype.getStats = function (e, i, t) {
                                                    return n.apply(this, [e || null]).then(function (n) {
                                                        if (c.version < 48 && (t = n, r = new Map, Object.keys(t).forEach(function (e) {
                                                            r.set(e, t[e]), r[e] = t[e]
                                                        }), n = r), c.version < 53 && !i) try {
                                                            n.forEach(function (e) {
                                                                e.type = o[e.type] || e.type
                                                            })
                                                        } catch (e) {
                                                            if ("TypeError" !== e.name) throw e;
                                                            n.forEach(function (e, t) {
                                                                n.set(t, Object.assign({}, e, {
                                                                    type: o[e.type] || e.type
                                                                }))
                                                            })
                                                        }
                                                        var t, r;
                                                        return n
                                                    }).then(i, t)
                                                }
                                            }
                                        },
                                        shimSenderGetStats: function (e) {
                                            if ("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender && !(e.RTCRtpSender && "getStats" in e.RTCRtpSender.prototype)) {
                                                var n = e.RTCPeerConnection.prototype.getSenders;
                                                n && (e.RTCPeerConnection.prototype.getSenders = function () {
                                                    var t = this,
                                                        e = n.apply(t, []);
                                                    return e.forEach(function (e) {
                                                        e._pc = t
                                                    }), e
                                                });
                                                var t = e.RTCPeerConnection.prototype.addTrack;
                                                t && (e.RTCPeerConnection.prototype.addTrack = function () {
                                                    var e = t.apply(this, arguments);
                                                    return e._pc = this, e
                                                }), e.RTCRtpSender.prototype.getStats = function () {
                                                    return this.track ? this._pc.getStats(this.track) : Promise.resolve(new Map)
                                                }
                                            }
                                        },
                                        shimReceiverGetStats: function (e) {
                                            if ("object" == typeof e && e.RTCPeerConnection && e.RTCRtpSender && !(e.RTCRtpSender && "getStats" in e.RTCRtpReceiver.prototype)) {
                                                var n = e.RTCPeerConnection.prototype.getReceivers;
                                                n && (e.RTCPeerConnection.prototype.getReceivers = function () {
                                                    var t = this,
                                                        e = n.apply(t, []);
                                                    return e.forEach(function (e) {
                                                        e._pc = t
                                                    }), e
                                                }), r.wrapPeerConnectionEvent(e, "track", function (e) {
                                                    return e.receiver._pc = e.srcElement, e
                                                }), e.RTCRtpReceiver.prototype.getStats = function () {
                                                    return this._pc.getStats(this.track)
                                                }
                                            }
                                        },
                                        shimRemoveStream: function (e) {
                                            !e.RTCPeerConnection || "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (t) {
                                                var n = this;
                                                r.deprecated("removeStream", "removeTrack"), this.getSenders().forEach(function (e) {
                                                    e.track && -1 !== t.getTracks().indexOf(e.track) && n.removeTrack(e)
                                                })
                                            })
                                        },
                                        shimRTCDataChannel: function (e) {
                                            e.DataChannel && !e.RTCDataChannel && (e.RTCDataChannel = e.DataChannel)
                                        },
                                        shimGetDisplayMedia: function (e, n) {
                                            "getDisplayMedia" in e.navigator || (navigator.getDisplayMedia = function (e) {
                                                if (e && e.video) return !0 === e.video ? e.video = {
                                                    mediaSource: n
                                                } : e.video.mediaSource = n, navigator.mediaDevices.getUserMedia(e);
                                                var t = new DOMException("getDisplayMedia without video constraints is undefined");
                                                return t.name = "NotFoundError", t.code = 8, Promise.reject(t)
                                            })
                                        }
                                    }
                                }, {
                                    "../utils": 14,
                                    "./getusermedia": 12
                                }],
                                12: [function (e, t, n) {
                                    var p = e("../utils"),
                                        f = p.log;
                                    t.exports = function (e) {
                                        var i = p.detectBrowser(e),
                                            o = e && e.navigator,
                                            t = e && e.MediaStreamTrack,
                                            a = function (e) {
                                                return {
                                                    name: {
                                                        InternalError: "NotReadableError",
                                                        NotSupportedError: "TypeError",
                                                        PermissionDeniedError: "NotAllowedError",
                                                        SecurityError: "NotAllowedError"
                                                    }[e.name] || e.name,
                                                    message: {
                                                        "The operation is insecure.": "The request is not allowed by the user agent or the platform in the current context."
                                                    }[e.message] || e.message,
                                                    constraint: e.constraint,
                                                    toString: function () {
                                                        return this.name + (this.message && ": ") + this.message
                                                    }
                                                }
                                            },
                                            r = function (e, t, n) {
                                                var r = function (r) {
                                                    if ("object" != typeof r || r.require) return r;
                                                    var i = [];
                                                    return Object.keys(r).forEach(function (e) {
                                                        if ("require" !== e && "advanced" !== e && "mediaSource" !== e) {
                                                            var t = r[e] = "object" == typeof r[e] ? r[e] : {
                                                                ideal: r[e]
                                                            };
                                                            if (void 0 === t.min && void 0 === t.max && void 0 === t.exact || i.push(e), void 0 !== t.exact && ("number" == typeof t.exact ? t.min = t.max = t.exact : r[e] = t.exact, delete t.exact), void 0 !== t.ideal) {
                                                                r.advanced = r.advanced || [];
                                                                var n = {};
                                                                "number" == typeof t.ideal ? n[e] = {
                                                                    min: t.ideal,
                                                                    max: t.ideal
                                                                } : n[e] = t.ideal, r.advanced.push(n), delete t.ideal, Object.keys(t).length || delete r[e]
                                                            }
                                                        }
                                                    }), i.length && (r.require = i), r
                                                };
                                                return e = JSON.parse(JSON.stringify(e)), i.version < 38 && (f("spec: " + JSON.stringify(e)), e.audio && (e.audio = r(e.audio)), e.video && (e.video = r(e.video)), f("ff37: " + JSON.stringify(e))), o.mozGetUserMedia(e, t, function (e) {
                                                    n(a(e))
                                                })
                                            };
                                        if (o.mediaDevices || (o.mediaDevices = {
                                            getUserMedia: function (n) {
                                                return new Promise(function (e, t) {
                                                    r(n, e, t)
                                                })
                                            },
                                            addEventListener: function () { },
                                            removeEventListener: function () { }
                                        }), o.mediaDevices.enumerateDevices = o.mediaDevices.enumerateDevices || function () {
                                            return new Promise(function (e) {
                                                e([{
                                                    kind: "audioinput",
                                                    deviceId: "default",
                                                    label: "",
                                                    groupId: ""
                                                }, {
                                                    kind: "videoinput",
                                                    deviceId: "default",
                                                    label: "",
                                                    groupId: ""
                                                }])
                                            })
                                        }, i.version < 41) {
                                            var n = o.mediaDevices.enumerateDevices.bind(o.mediaDevices);
                                            o.mediaDevices.enumerateDevices = function () {
                                                return n().then(void 0, function (e) {
                                                    if ("NotFoundError" === e.name) return [];
                                                    throw e
                                                })
                                            }
                                        }
                                        if (i.version < 49) {
                                            var s = o.mediaDevices.getUserMedia.bind(o.mediaDevices);
                                            o.mediaDevices.getUserMedia = function (t) {
                                                return s(t).then(function (e) {
                                                    if (t.audio && !e.getAudioTracks().length || t.video && !e.getVideoTracks().length) throw e.getTracks().forEach(function (e) {
                                                        e.stop()
                                                    }), new DOMException("The object can not be found here.", "NotFoundError");
                                                    return e
                                                }, function (e) {
                                                    return Promise.reject(a(e))
                                                })
                                            }
                                        }
                                        if (!(55 < i.version && "autoGainControl" in o.mediaDevices.getSupportedConstraints())) {
                                            var c = function (e, t, n) {
                                                t in e && !(n in e) && (e[n] = e[t], delete e[t])
                                            },
                                                l = o.mediaDevices.getUserMedia.bind(o.mediaDevices);
                                            if (o.mediaDevices.getUserMedia = function (e) {
                                                return "object" == typeof e && "object" == typeof e.audio && (e = JSON.parse(JSON.stringify(e)), c(e.audio, "autoGainControl", "mozAutoGainControl"), c(e.audio, "noiseSuppression", "mozNoiseSuppression")), l(e)
                                            }, t && t.prototype.getSettings) {
                                                var d = t.prototype.getSettings;
                                                t.prototype.getSettings = function () {
                                                    var e = d.apply(this, arguments);
                                                    return c(e, "mozAutoGainControl", "autoGainControl"), c(e, "mozNoiseSuppression", "noiseSuppression"), e
                                                }
                                            }
                                            if (t && t.prototype.applyConstraints) {
                                                var u = t.prototype.applyConstraints;
                                                t.prototype.applyConstraints = function (e) {
                                                    return "audio" === this.kind && "object" == typeof e && (e = JSON.parse(JSON.stringify(e)), c(e, "autoGainControl", "mozAutoGainControl"), c(e, "noiseSuppression", "mozNoiseSuppression")), u.apply(this, [e])
                                                }
                                            }
                                        }
                                        o.getUserMedia = function (e, t, n) {
                                            if (i.version < 44) return r(e, t, n);
                                            p.deprecated("navigator.getUserMedia", "navigator.mediaDevices.getUserMedia"), o.mediaDevices.getUserMedia(e).then(t, n)
                                        }
                                    }
                                }, {
                                    "../utils": 14
                                }],
                                13: [function (e, t, n) {
                                    var a = e("../utils");
                                    t.exports = {
                                        shimLocalStreamsAPI: function (e) {
                                            if ("object" == typeof e && e.RTCPeerConnection) {
                                                if ("getLocalStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getLocalStreams = function () {
                                                    return this._localStreams || (this._localStreams = []), this._localStreams
                                                }), "getStreamById" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getStreamById = function (t) {
                                                    var n = null;
                                                    return this._localStreams && this._localStreams.forEach(function (e) {
                                                        e.id === t && (n = e)
                                                    }), this._remoteStreams && this._remoteStreams.forEach(function (e) {
                                                        e.id === t && (n = e)
                                                    }), n
                                                }), !("addStream" in e.RTCPeerConnection.prototype)) {
                                                    var r = e.RTCPeerConnection.prototype.addTrack;
                                                    e.RTCPeerConnection.prototype.addStream = function (t) {
                                                        this._localStreams || (this._localStreams = []), -1 === this._localStreams.indexOf(t) && this._localStreams.push(t);
                                                        var n = this;
                                                        t.getTracks().forEach(function (e) {
                                                            r.call(n, e, t)
                                                        })
                                                    }, e.RTCPeerConnection.prototype.addTrack = function (e, t) {
                                                        return t && (this._localStreams ? -1 === this._localStreams.indexOf(t) && this._localStreams.push(t) : this._localStreams = [t]), r.call(this, e, t)
                                                    }
                                                }
                                                "removeStream" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.removeStream = function (e) {
                                                    this._localStreams || (this._localStreams = []);
                                                    var t = this._localStreams.indexOf(e);
                                                    if (-1 !== t) {
                                                        this._localStreams.splice(t, 1);
                                                        var n = this,
                                                            r = e.getTracks();
                                                        this.getSenders().forEach(function (e) {
                                                            -1 !== r.indexOf(e.track) && n.removeTrack(e)
                                                        })
                                                    }
                                                })
                                            }
                                        },
                                        shimRemoteStreamsAPI: function (e) {
                                            if ("object" == typeof e && e.RTCPeerConnection && ("getRemoteStreams" in e.RTCPeerConnection.prototype || (e.RTCPeerConnection.prototype.getRemoteStreams = function () {
                                                return this._remoteStreams ? this._remoteStreams : []
                                            }), !("onaddstream" in e.RTCPeerConnection.prototype))) {
                                                Object.defineProperty(e.RTCPeerConnection.prototype, "onaddstream", {
                                                    get: function () {
                                                        return this._onaddstream
                                                    },
                                                    set: function (e) {
                                                        this._onaddstream && this.removeEventListener("addstream", this._onaddstream), this.addEventListener("addstream", this._onaddstream = e)
                                                    }
                                                });
                                                var t = e.RTCPeerConnection.prototype.setRemoteDescription;
                                                e.RTCPeerConnection.prototype.setRemoteDescription = function () {
                                                    var n = this;
                                                    return this._onaddstreampoly || this.addEventListener("track", this._onaddstreampoly = function (e) {
                                                        e.streams.forEach(function (e) {
                                                            if (n._remoteStreams || (n._remoteStreams = []), !(0 <= n._remoteStreams.indexOf(e))) {
                                                                n._remoteStreams.push(e);
                                                                var t = new Event("addstream");
                                                                t.stream = e, n.dispatchEvent(t)
                                                            }
                                                        })
                                                    }), t.apply(n, arguments)
                                                }
                                            }
                                        },
                                        shimCallbacksAPI: function (e) {
                                            if ("object" == typeof e && e.RTCPeerConnection) {
                                                var t = e.RTCPeerConnection.prototype,
                                                    i = t.createOffer,
                                                    o = t.createAnswer,
                                                    a = t.setLocalDescription,
                                                    s = t.setRemoteDescription,
                                                    c = t.addIceCandidate;
                                                t.createOffer = function (e, t) {
                                                    var n = 2 <= arguments.length ? arguments[2] : e,
                                                        r = i.apply(this, [n]);
                                                    return t ? (r.then(e, t), Promise.resolve()) : r
                                                }, t.createAnswer = function (e, t) {
                                                    var n = 2 <= arguments.length ? arguments[2] : e,
                                                        r = o.apply(this, [n]);
                                                    return t ? (r.then(e, t), Promise.resolve()) : r
                                                };
                                                var n = function (e, t, n) {
                                                    var r = a.apply(this, [e]);
                                                    return n ? (r.then(t, n), Promise.resolve()) : r
                                                };
                                                t.setLocalDescription = n, n = function (e, t, n) {
                                                    var r = s.apply(this, [e]);
                                                    return n ? (r.then(t, n), Promise.resolve()) : r
                                                }, t.setRemoteDescription = n, n = function (e, t, n) {
                                                    var r = c.apply(this, [e]);
                                                    return n ? (r.then(t, n), Promise.resolve()) : r
                                                }, t.addIceCandidate = n
                                            }
                                        },
                                        shimGetUserMedia: function (e) {
                                            var r = e && e.navigator;
                                            r.getUserMedia || (r.webkitGetUserMedia ? r.getUserMedia = r.webkitGetUserMedia.bind(r) : r.mediaDevices && r.mediaDevices.getUserMedia && (r.getUserMedia = function (e, t, n) {
                                                r.mediaDevices.getUserMedia(e).then(t, n)
                                            }.bind(r)))
                                        },
                                        shimRTCIceServerUrls: function (e) {
                                            var o = e.RTCPeerConnection;
                                            e.RTCPeerConnection = function (e, t) {
                                                if (e && e.iceServers) {
                                                    for (var n = [], r = 0; r < e.iceServers.length; r++) {
                                                        var i = e.iceServers[r];
                                                        !i.hasOwnProperty("urls") && i.hasOwnProperty("url") ? (a.deprecated("RTCIceServer.url", "RTCIceServer.urls"), (i = JSON.parse(JSON.stringify(i))).urls = i.url, delete i.url, n.push(i)) : n.push(e.iceServers[r])
                                                    }
                                                    e.iceServers = n
                                                }
                                                return new o(e, t)
                                            }, e.RTCPeerConnection.prototype = o.prototype, "generateCertificate" in e.RTCPeerConnection && Object.defineProperty(e.RTCPeerConnection, "generateCertificate", {
                                                get: function () {
                                                    return o.generateCertificate
                                                }
                                            })
                                        },
                                        shimTrackEventTransceiver: function (e) {
                                            "object" == typeof e && e.RTCPeerConnection && "receiver" in e.RTCTrackEvent.prototype && !e.RTCTransceiver && Object.defineProperty(e.RTCTrackEvent.prototype, "transceiver", {
                                                get: function () {
                                                    return {
                                                        receiver: this.receiver
                                                    }
                                                }
                                            })
                                        },
                                        shimCreateOfferLegacy: function (e) {
                                            var i = e.RTCPeerConnection.prototype.createOffer;
                                            e.RTCPeerConnection.prototype.createOffer = function (e) {
                                                var t = this;
                                                if (e) {
                                                    void 0 !== e.offerToReceiveAudio && (e.offerToReceiveAudio = !!e.offerToReceiveAudio);
                                                    var n = t.getTransceivers().find(function (e) {
                                                        return e.sender.track && "audio" === e.sender.track.kind
                                                    });
                                                    !1 === e.offerToReceiveAudio && n ? "sendrecv" === n.direction ? n.setDirection ? n.setDirection("sendonly") : n.direction = "sendonly" : "recvonly" === n.direction && (n.setDirection ? n.setDirection("inactive") : n.direction = "inactive") : !0 !== e.offerToReceiveAudio || n || t.addTransceiver("audio"), void 0 !== e.offerToReceiveVideo && (e.offerToReceiveVideo = !!e.offerToReceiveVideo);
                                                    var r = t.getTransceivers().find(function (e) {
                                                        return e.sender.track && "video" === e.sender.track.kind
                                                    });
                                                    !1 === e.offerToReceiveVideo && r ? "sendrecv" === r.direction ? r.setDirection("sendonly") : "recvonly" === r.direction && r.setDirection("inactive") : !0 !== e.offerToReceiveVideo || r || t.addTransceiver("video")
                                                }
                                                return i.apply(t, arguments)
                                            }
                                        }
                                    }
                                }, {
                                    "../utils": 14
                                }],
                                14: [function (e, t, n) {
                                    function r(e, t, n) {
                                        var r = e.match(t);
                                        return r && r.length >= n && parseInt(r[n], 10)
                                    }
                                    var i = !0;
                                    t.exports = {
                                        extractVersion: r,
                                        wrapPeerConnectionEvent: function (e, r, i) {
                                            if (e.RTCPeerConnection) {
                                                var t = e.RTCPeerConnection.prototype,
                                                    o = t.addEventListener;
                                                t.addEventListener = function (e, n) {
                                                    if (e !== r) return o.apply(this, arguments);
                                                    var t = function (e) {
                                                        var t = i(e);
                                                        t && n(t)
                                                    };
                                                    return this._eventMap = this._eventMap || {}, this._eventMap[n] = t, o.apply(this, [e, t])
                                                };
                                                var a = t.removeEventListener;
                                                t.removeEventListener = function (e, t) {
                                                    if (e !== r || !this._eventMap || !this._eventMap[t]) return a.apply(this, arguments);
                                                    var n = this._eventMap[t];
                                                    return delete this._eventMap[t], a.apply(this, [e, n])
                                                }, Object.defineProperty(t, "on" + r, {
                                                    get: function () {
                                                        return this["_on" + r]
                                                    },
                                                    set: function (e) {
                                                        this["_on" + r] && (this.removeEventListener(r, this["_on" + r]), delete this["_on" + r]), e && this.addEventListener(r, this["_on" + r] = e)
                                                    },
                                                    enumerable: !0,
                                                    configurable: !0
                                                })
                                            }
                                        },
                                        disableLog: function (e) {
                                            return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (i = e) ? "adapter.js logging disabled" : "adapter.js logging enabled"
                                        },
                                        disableWarnings: function (e) {
                                            return "boolean" != typeof e ? new Error("Argument type: " + typeof e + ". Please use a boolean.") : (!e, "adapter.js deprecation warnings " + (e ? "disabled" : "enabled"))
                                        },
                                        log: function () {
                                            if ("object" == typeof window) {
                                                if (i) return;
                                                "undefined" != typeof console && console.log
                                            }
                                        },
                                        deprecated: function (e, t) { },
                                        detectBrowser: function (e) {
                                            var t = e && e.navigator,
                                                n = {
                                                    browser: null,
                                                    version: null
                                                };
                                            if (void 0 === e || !e.navigator) return n.browser = "Not a browser.", n;
                                            if (t.mozGetUserMedia) n.browser = "firefox", n.version = r(t.userAgent, /Firefox\/(\d+)\./, 1);
                                            else if (t.webkitGetUserMedia) n.browser = "chrome", n.version = r(t.userAgent, /Chrom(e|ium)\/(\d+)\./, 2);
                                            else if (t.mediaDevices && t.userAgent.match(/Edge\/(\d+).(\d+)$/)) n.browser = "edge", n.version = r(t.userAgent, /Edge\/(\d+).(\d+)$/, 2);
                                            else {
                                                if (!e.RTCPeerConnection || !t.userAgent.match(/AppleWebKit\/(\d+)\./)) return n.browser = "Not a supported browser.", n;
                                                n.browser = "safari", n.version = r(t.userAgent, /AppleWebKit\/(\d+)\./, 1)
                                            }
                                            return n
                                        }
                                    }
                                }, {}]
                            }, {}, [3])(3)
                        }), navigator.mozGetUserMedia ? (MediaStreamTrack.getSources = function (e) {
                            setTimeout(function () {
                                e([{
                                    kind: "audio",
                                    id: "default",
                                    label: "",
                                    facing: ""
                                }, {
                                    kind: "video",
                                    id: "default",
                                    label: "",
                                    facing: ""
                                }])
                            }, 0)
                        }, attachMediaStream = function (e, t) {
                            return e.srcObject = t, e
                        }, reattachMediaStream = function (e, t) {
                            return e.srcObject = t.srcObject, e
                        }) : navigator.webkitGetUserMedia ? (attachMediaStream = function (e, t) {
                            return 43 <= h.webrtcDetectedVersion ? e.srcObject = t : void 0 !== e.src && (e.src = URL.createObjectURL(t)), e
                        }, reattachMediaStream = function (e, t) {
                            return 43 <= h.webrtcDetectedVersion ? e.srcObject = t.srcObject : e.src = t.src, e
                        }) : "AppleWebKit" === h.webrtcDetectedType ? (attachMediaStream = function (e, t) {
                            return e.srcObject = t, e
                        }, reattachMediaStream = function (e, t) {
                            return e.srcObject = t.srcObject, e
                        }, navigator.mediaDevices && navigator.mediaDevices.getUserMedia && (navigator.getUserMedia = getUserMedia = function (e, t, n) {
                            navigator.mediaDevices.getUserMedia(e).then(t).catch(n)
                        })) : navigator.mediaDevices && navigator.userAgent.match(/Edge\/(\d+).(\d+)$/) && (attachMediaStream = function (e, t) {
                            return e.srcObject = t, e
                        }, reattachMediaStream = function (e, t) {
                            return e.srcObject = t.srcObject, e
                        });
                    var n = attachMediaStream;
                    "opera" === h.webrtcDetectedBrowser && (n = function (e, t) {
                        38 < h.webrtcDetectedVersion ? e.srcObject = t : void 0 !== e.src && (e.src = URL.createObjectURL(t))
                    }), attachMediaStream = function (e, t) {
                        return "chrome" !== h.webrtcDetectedBrowser && "opera" !== h.webrtcDetectedBrowser || t ? n(e, t) : e.src = "", e
                    };
                    var r = reattachMediaStream;
                    reattachMediaStream = function (e, t) {
                        return r(e, t), e
                    }, window.attachMediaStream = attachMediaStream, window.reattachMediaStream = reattachMediaStream, window.getUserMedia = function (e, t, n) {
                        navigator.getUserMedia(e, t, n)
                    }, h.attachMediaStream = attachMediaStream, h.reattachMediaStream = reattachMediaStream, h.getUserMedia = getUserMedia, "undefined" == typeof Promise && (requestUserMedia = null), h.maybeThroughWebRTCReady()
                } else "object" == typeof console && "function" == typeof console.log || (console = {}, console.log = function (e) { }, console.info = function (e) { }, console.error = function (e) { }, console.dir = function (e) { }, console.exception = function (e) { }, console.trace = function (e) { }, console.warn = function (e) { }, console.count = function (e) { }, console.debug = function (e) { }, console.count = function (e) { }, console.time = function (e) { }, console.timeEnd = function (e) { }, console.group = function (e) { }, console.groupCollapsed = function (e) { }, console.groupEnd = function (e) { }), h.WebRTCPlugin.WaitForPluginReady = function () {
                    for (; h.WebRTCPlugin.pluginState !== h.WebRTCPlugin.PLUGIN_STATES.READY;);
                }, h.WebRTCPlugin.callWhenPluginReady = function (e) {
                    if (h.WebRTCPlugin.pluginState === h.WebRTCPlugin.PLUGIN_STATES.READY) e();
                    else var t = setInterval(function () {
                        h.WebRTCPlugin.pluginState === h.WebRTCPlugin.PLUGIN_STATES.READY && (clearInterval(t), e())
                    }, 100)
                }, h.WebRTCPlugin.setLogLevel = function (e) {
                    h.WebRTCPlugin.callWhenPluginReady(function () {
                        h.WebRTCPlugin.plugin.setLogLevel(e)
                    })
                }, h.WebRTCPlugin.injectPlugin = function () {
                    if (h.documentReady() && h.WebRTCPlugin.pluginState === h.WebRTCPlugin.PLUGIN_STATES.INITIALIZING) {
                        h.WebRTCPlugin.pluginState = h.WebRTCPlugin.PLUGIN_STATES.INJECTING;
                        var e = document.getElementById(h.WebRTCPlugin.pluginInfo.pluginId);
                        if (e)
                            if (h.WebRTCPlugin.plugin = e, h.WebRTCPlugin.pluginState = h.WebRTCPlugin.PLUGIN_STATES.INJECTED, h.WebRTCPlugin.plugin.valid) window[h.WebRTCPlugin.pluginInfo.onload]();
                            else var t = setInterval(function () {
                                h.WebRTCPlugin.plugin.valid && (clearInterval(t), window[h.WebRTCPlugin.pluginInfo.onload]())
                            }, 100);
                        else {
                            if ("IE" === h.webrtcDetectedBrowser && h.webrtcDetectedVersion <= 10) {
                                var n = document.createDocumentFragment();
                                for (h.WebRTCPlugin.plugin = document.createElement("div"), h.WebRTCPlugin.plugin.innerHTML = '<object id="' + h.WebRTCPlugin.pluginInfo.pluginId + '" type="' + h.WebRTCPlugin.pluginInfo.type + '" width="1" height="1"><param name="pluginId" value="' + h.WebRTCPlugin.pluginInfo.pluginId + '" /> <param name="windowless" value="false" /> <param name="pageId" value="' + h.WebRTCPlugin.pageId + '" /> <param name="onload" value="' + h.WebRTCPlugin.pluginInfo.onload + '" /><param name="tag" value="' + h.WebRTCPlugin.TAGS.NONE + '" />' + (h.options.getAllCams ? '<param name="forceGetAllCams" value="True" />' : "") + "</object>"; h.WebRTCPlugin.plugin.firstChild;) n.appendChild(h.WebRTCPlugin.plugin.firstChild);
                                document.body.appendChild(n), h.WebRTCPlugin.plugin = document.getElementById(h.WebRTCPlugin.pluginInfo.pluginId)
                            } else h.WebRTCPlugin.plugin = document.createElement("object"), h.WebRTCPlugin.plugin.id = h.WebRTCPlugin.pluginInfo.pluginId, "IE" === h.webrtcDetectedBrowser ? (h.WebRTCPlugin.plugin.width = "1px", h.WebRTCPlugin.plugin.height = "1px") : (h.WebRTCPlugin.plugin.width = "0px", h.WebRTCPlugin.plugin.height = "0px"), h.WebRTCPlugin.plugin.type = h.WebRTCPlugin.pluginInfo.type, h.WebRTCPlugin.plugin.innerHTML = '<param name="onload" value="' + h.WebRTCPlugin.pluginInfo.onload + '"><param name="pluginId" value="' + h.WebRTCPlugin.pluginInfo.pluginId + '"><param name="windowless" value="false" /> ' + (h.options.getAllCams ? '<param name="forceGetAllCams" value="True" />' : "") + '<param name="pageId" value="' + h.WebRTCPlugin.pageId + '"><param name="tag" value="' + h.WebRTCPlugin.TAGS.NONE + '" />', document.body.appendChild(h.WebRTCPlugin.plugin);
                            h.WebRTCPlugin.pluginState = h.WebRTCPlugin.PLUGIN_STATES.INJECTED
                        }
                    }
                }, h.WebRTCPlugin.isPluginInstalled = function (e, t, n, r, i) {
                    if ("IE" !== h.webrtcDetectedBrowser) {
                        var o = navigator.mimeTypes;
                        if (void 0 !== o) {
                            for (var a = 0; a < o.length; a++)
                                if (0 <= o[a].type.indexOf(n)) return void r();
                            i()
                        } else h.renderNotificationBar(h.TEXT.PLUGIN.NOT_SUPPORTED)
                    } else {
                        try {
                            new ActiveXObject(e + "." + t)
                        } catch (e) {
                            return void i()
                        }
                        r()
                    }
                }, h.WebRTCPlugin.defineWebRTCInterface = function () {
                    if (h.WebRTCPlugin.pluginState !== h.WebRTCPlugin.PLUGIN_STATES.READY) {
                        h.WebRTCPlugin.pluginState = h.WebRTCPlugin.PLUGIN_STATES.INITIALIZING, h.isDefined = function (e) {
                            return null != e
                        }, RTCSessionDescription = function (e) {
                            return h.WebRTCPlugin.WaitForPluginReady(), h.WebRTCPlugin.plugin.ConstructSessionDescription(e.type, e.sdp)
                        }, MediaStream = function (e) {
                            return h.WebRTCPlugin.WaitForPluginReady(), h.WebRTCPlugin.plugin.MediaStream(e)
                        }, RTCPeerConnection = function (e, t) {
                            if (null != e && !Array.isArray(e.iceServers)) throw new Error("Failed to construct 'RTCPeerConnection': Malformed RTCConfiguration");
                            if (null != t) {
                                var n = !1;
                                if (n |= "object" != typeof t, n |= t.hasOwnProperty("mandatory") && void 0 !== t.mandatory && null !== t.mandatory && t.mandatory.constructor !== Object, n |= t.hasOwnProperty("optional") && void 0 !== t.optional && null !== t.optional && !Array.isArray(t.optional)) throw new Error("Failed to construct 'RTCPeerConnection': Malformed constraints object")
                            }
                            h.WebRTCPlugin.WaitForPluginReady();
                            var r = null;
                            if (e && Array.isArray(e.iceServers)) {
                                r = e.iceServers;
                                for (var i = 0; i < r.length; i++) r[i].urls && !r[i].url && (r[i].url = r[i].urls), r[i].hasCredentials = h.isDefined(r[i].username) && h.isDefined(r[i].credential)
                            }
                            if (h.WebRTCPlugin.plugin.PEER_CONNECTION_VERSION && 1 < h.WebRTCPlugin.plugin.PEER_CONNECTION_VERSION) return r && (e.iceServers = r), h.WebRTCPlugin.plugin.PeerConnection(e);
                            var o = t && t.mandatory ? t.mandatory : null,
                                a = t && t.optional ? t.optional : null;
                            return h.WebRTCPlugin.plugin.PeerConnection(h.WebRTCPlugin.pageId, r, o, a)
                        };
                        var e = function () { };
                        e.getSources = function (e) {
                            h.WebRTCPlugin.callWhenPluginReady(function () {
                                h.WebRTCPlugin.plugin.GetSources(e)
                            })
                        };
                        var i = function (i) {
                            if ("object" != typeof i || i.mandatory || i.optional) return i;
                            var o = {};
                            return Object.keys(i).forEach(function (t) {
                                if ("require" !== t && "advanced" !== t) {
                                    if ("string" == typeof i[t]) return void (o[t] = i[t]);
                                    var n = "object" == typeof i[t] ? i[t] : {
                                        ideal: i[t]
                                    };
                                    void 0 !== n.exact && "number" == typeof n.exact && (n.min = n.max = n.exact);
                                    var r = function (e, t) {
                                        return e ? e + t.charAt(0).toUpperCase() + t.slice(1) : "deviceId" === t ? "sourceId" : t
                                    };
                                    if ("sourceId" === r("", t) && void 0 !== n.exact && (n.ideal = n.exact, n.exact = void 0), void 0 !== n.ideal) {
                                        o.optional = o.optional || [];
                                        var e = {};
                                        "number" == typeof n.ideal ? (e[r("min", t)] = n.ideal, o.optional.push(e), (e = {})[r("max", t)] = n.ideal) : e[r("", t)] = n.ideal, o.optional.push(e)
                                    }
                                    void 0 !== n.exact && "number" != typeof n.exact ? (o.mandatory = o.mandatory || {}, o.mandatory[r("", t)] = n.exact) : ["min", "max"].forEach(function (e) {
                                        void 0 !== n[e] && (o.mandatory = o.mandatory || {}, o.mandatory[r(e, t)] = n[e])
                                    })
                                }
                            }), i.advanced && (o.optional = (o.optional || []).concat(i.advanced)), o
                        };
                        getUserMedia = function (e, t, n) {
                            var r = {};
                            r.audio = !!e.audio && i(e.audio), r.video = !!e.video && i(e.video), h.WebRTCPlugin.callWhenPluginReady(function () {
                                h.WebRTCPlugin.plugin.getUserMedia(r, t, n)
                            })
                        }, window.navigator.getUserMedia = getUserMedia, "undefined" != typeof Promise && (requestUserMedia = function (n) {
                            return new Promise(function (e, t) {
                                try {
                                    getUserMedia(n, e, t)
                                } catch (e) {
                                    t(e)
                                }
                            })
                        }, void 0 === navigator.mediaDevices && (navigator.mediaDevices = {}), navigator.mediaDevices.getUserMedia = requestUserMedia, navigator.mediaDevices.enumerateDevices = function () {
                            return new Promise(function (t) {
                                var n = {
                                    audio: "audioinput",
                                    video: "videoinput"
                                };
                                return e.getSources(function (e) {
                                    t(e.map(function (e) {
                                        return {
                                            label: e.label,
                                            kind: n[e.kind],
                                            id: e.id,
                                            deviceId: e.id,
                                            groupId: ""
                                        }
                                    }))
                                })
                            })
                        }), attachMediaStream = function (e, t) {
                            if (e && e.parentNode) {
                                var n;
                                n = null === t ? "" : (void 0 !== t.enableSoundTracks && t.enableSoundTracks(!0), t.id);
                                var r = 0 === e.id.length ? Math.random().toString(36).slice(2) : e.id,
                                    i = e.nodeName.toLowerCase();
                                if ("object" !== i) {
                                    var o;
                                    switch (i) {
                                        case "audio":
                                            o = h.WebRTCPlugin.TAGS.AUDIO;
                                            break;
                                        case "video":
                                            o = h.WebRTCPlugin.TAGS.VIDEO;
                                            break;
                                        default:
                                            o = h.WebRTCPlugin.TAGS.NONE
                                    }
                                    var a = document.createDocumentFragment(),
                                        s = document.createElement("div"),
                                        c = "";
                                    for (e.className ? c = 'class="' + e.className + '" ' : e.attributes && e.attributes.class && (c = 'class="' + e.attributes.class.value + '" '), s.innerHTML = '<object id="' + r + '" ' + c + 'type="' + h.WebRTCPlugin.pluginInfo.type + '"><param name="pluginId" value="' + r + '" /> <param name="pageId" value="' + h.WebRTCPlugin.pageId + '" /> <param name="windowless" value="true" /> <param name="streamId" value="' + n + '" /> <param name="tag" value="' + o + '" /> </object>'; s.firstChild;) a.appendChild(s.firstChild);
                                    var l = "",
                                        d = "";
                                    e.clientWidth || e.clientHeight ? (d = e.clientWidth, l = e.clientHeight) : (e.width || e.height) && (d = e.width, l = e.height), e.parentNode.insertBefore(a, e), (a = document.getElementById(r)).width = d, a.height = l, e.parentNode.removeChild(e)
                                } else {
                                    for (var u = e.children, p = 0; p !== u.length; ++p)
                                        if ("streamId" === u[p].name) {
                                            u[p].value = n;
                                            break
                                        }
                                    e.setStreamId(n)
                                }
                                var f = document.getElementById(r);
                                return h.forwardEventHandlers(f, e, Object.getPrototypeOf(e)), f
                            }
                        }, reattachMediaStream = function (e, t) {
                            for (var n = null, r = t.children, i = 0; i !== r.length; ++i)
                                if ("streamId" === r[i].name) {
                                    h.WebRTCPlugin.WaitForPluginReady(), n = h.WebRTCPlugin.plugin.getStreamWithId(h.WebRTCPlugin.pageId, r[i].value);
                                    break
                                }
                            if (null !== n) return attachMediaStream(e, n)
                        }, window.attachMediaStream = attachMediaStream, window.reattachMediaStream = reattachMediaStream, window.getUserMedia = getUserMedia, h.attachMediaStream = attachMediaStream, h.reattachMediaStream = reattachMediaStream, h.getUserMedia = getUserMedia, h.forwardEventHandlers = function (e, t, n) {
                            var r = Object.getOwnPropertyNames(n);
                            for (var i in r)
                                if (i) {
                                    var o = r[i];
                                    "function" == typeof o.slice && "on" === o.slice(0, 2) && "function" == typeof t[o] && h.addEvent(e, o.slice(2), t[o])
                                }
                            var a = Object.getPrototypeOf(n);
                            a && h.forwardEventHandlers(e, t, a)
                        }, RTCIceCandidate = function (e) {
                            return e.sdpMid || (e.sdpMid = ""), h.WebRTCPlugin.WaitForPluginReady(), h.WebRTCPlugin.plugin.ConstructIceCandidate(e.sdpMid, e.sdpMLineIndex, e.candidate)
                        }, h.addEvent(document, "readystatechange", h.WebRTCPlugin.injectPlugin), h.WebRTCPlugin.injectPlugin()
                    }
                }, h.WebRTCPlugin.pluginNeededButNotInstalledCb = h.WebRTCPlugin.pluginNeededButNotInstalledCb || function () {
                    h.addEvent(document, "readystatechange", h.WebRTCPlugin.pluginNeededButNotInstalledCbPriv), h.WebRTCPlugin.pluginNeededButNotInstalledCbPriv()
                }, h.WebRTCPlugin.pluginNeededButNotInstalledCbPriv = function () {
                    if (h.documentReady() && (document.removeEventListener("readystatechange", h.WebRTCPlugin.pluginNeededButNotInstalledCbPriv), !h.options.hidePluginInstallPrompt)) {
                        var e, t = h.WebRTCPlugin.pluginInfo.downloadLink;
                        if (t) h.WebRTCPlugin.pluginInfo.companyName ? (e = "This website requires you to install the ", h.WebRTCPlugin.pluginInfo.portalLink ? e += ' <a href="' + h.WebRTCPlugin.pluginInfo.portalLink + '" target="_blank">' + h.WebRTCPlugin.pluginInfo.companyName + " WebRTC Plugin</a>" : e += h.WebRTCPlugin.pluginInfo.companyName + " WebRTC Plugin", e += " to work on this browser.") : e = h.TEXT.PLUGIN.REQUIRE_INSTALLATION, h.renderNotificationBar(e, h.TEXT.PLUGIN.BUTTON, function () {
                            if (window.open(t, "_top"), "safari" === webrtcDetectedBrowser && 11 == webrtcDetectedVersion) h.renderNotificationBar(h.TEXT.PLUGIN.REQUIRE_RESTART);
                            else var e = setInterval(function () {
                                "IE" !== h.webrtcDetectedBrowser && navigator.plugins.refresh(!1), h.WebRTCPlugin.isPluginInstalled(h.WebRTCPlugin.pluginInfo.prefix, h.WebRTCPlugin.pluginInfo.plugName, h.WebRTCPlugin.pluginInfo.type, function () {
                                    clearInterval(e), h.WebRTCPlugin.defineWebRTCInterface()
                                }, function () { })
                            }, 500)
                        });
                        else h.renderNotificationBar(h.TEXT.PLUGIN.NOT_SUPPORTED)
                    }
                }, h.WebRTCPlugin.isPluginInstalled(h.WebRTCPlugin.pluginInfo.prefix, h.WebRTCPlugin.pluginInfo.plugName, h.WebRTCPlugin.pluginInfo.type, h.WebRTCPlugin.defineWebRTCInterface, h.WebRTCPlugin.pluginNeededButNotInstalledCb);
                void 0 !== o && (i.exports = h)
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        28: [function (e, F, H) {
            (function (G) {
                (function () {
                    var na, ra = "Expected a function",
                        ia = "__lodash_hash_undefined__",
                        oa = "__lodash_placeholder__",
                        aa = 128,
                        sa = 9007199254740991,
                        ca = NaN,
                        la = 4294967295,
                        da = [
                            ["ary", aa],
                            ["bind", 1],
                            ["bindKey", 2],
                            ["curry", 8],
                            ["curryRight", 16],
                            ["flip", 512],
                            ["partial", 32],
                            ["partialRight", 64],
                            ["rearg", 256]
                        ],
                        ua = "[object Arguments]",
                        pa = "[object Array]",
                        fa = "[object Boolean]",
                        ha = "[object Date]",
                        va = "[object Error]",
                        ga = "[object Function]",
                        ma = "[object GeneratorFunction]",
                        ya = "[object Map]",
                        ba = "[object Number]",
                        Ca = "[object Object]",
                        wa = "[object Promise]",
                        Ta = "[object RegExp]",
                        Ea = "[object Set]",
                        _a = "[object String]",
                        Sa = "[object Symbol]",
                        Ra = "[object WeakMap]",
                        Ia = "[object ArrayBuffer]",
                        Pa = "[object DataView]",
                        ka = "[object Float32Array]",
                        La = "[object Float64Array]",
                        xa = "[object Int8Array]",
                        Ma = "[object Int16Array]",
                        Oa = "[object Int32Array]",
                        Da = "[object Uint8Array]",
                        Na = "[object Uint8ClampedArray]",
                        Aa = "[object Uint16Array]",
                        Ba = "[object Uint32Array]",
                        Wa = /\b__p \+= '';/g,
                        ja = /\b(__p \+=) '' \+/g,
                        Ua = /(__e\(.*?\)|\b__t\)) \+\n'';/g,
                        Ga = /&(?:amp|lt|gt|quot|#39);/g,
                        Fa = /[&<>"']/g,
                        Ha = RegExp(Ga.source),
                        za = RegExp(Fa.source),
                        Va = /<%-([\s\S]+?)%>/g,
                        Ya = /<%([\s\S]+?)%>/g,
                        Ja = /<%=([\s\S]+?)%>/g,
                        Ka = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
                        Xa = /^\w*$/,
                        Za = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,
                        qa = /[\\^$.*+?()[\]{}|]/g,
                        $a = RegExp(qa.source),
                        Qa = /^\s+|\s+$/g,
                        es = /^\s+/,
                        ts = /\s+$/,
                        ns = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/,
                        rs = /\{\n\/\* \[wrapped with (.+)\] \*/,
                        is = /,? & /,
                        os = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g,
                        as = /\\(\\)?/g,
                        ss = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g,
                        cs = /\w*$/,
                        ls = /^[-+]0x[0-9a-f]+$/i,
                        ds = /^0b[01]+$/i,
                        us = /^\[object .+?Constructor\]$/,
                        ps = /^0o[0-7]+$/i,
                        fs = /^(?:0|[1-9]\d*)$/,
                        hs = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g,
                        vs = /($^)/,
                        gs = /['\n\r\u2028\u2029\\]/g,
                        e = "\\ud800-\\udfff",
                        t = "\\u0300-\\u036f\\ufe20-\\ufe2f\\u20d0-\\u20ff",
                        n = "\\u2700-\\u27bf",
                        r = "a-z\\xdf-\\xf6\\xf8-\\xff",
                        i = "A-Z\\xc0-\\xd6\\xd8-\\xde",
                        o = "\\ufe0e\\ufe0f",
                        a = "\\xac\\xb1\\xd7\\xf7\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf\\u2000-\\u206f \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000",
                        s = "['â€™]",
                        c = "[" + e + "]",
                        l = "[" + a + "]",
                        d = "[" + t + "]",
                        u = "\\d+",
                        p = "[" + n + "]",
                        f = "[" + r + "]",
                        h = "[^" + e + a + u + n + r + i + "]",
                        v = "\\ud83c[\\udffb-\\udfff]",
                        g = "[^" + e + "]",
                        m = "(?:\\ud83c[\\udde6-\\uddff]){2}",
                        y = "[\\ud800-\\udbff][\\udc00-\\udfff]",
                        b = "[" + i + "]",
                        C = "\\u200d",
                        w = "(?:" + f + "|" + h + ")",
                        T = "(?:" + b + "|" + h + ")",
                        E = "(?:['â€™](?:d|ll|m|re|s|t|ve))?",
                        _ = "(?:['â€™](?:D|LL|M|RE|S|T|VE))?",
                        S = "(?:" + d + "|" + v + ")" + "?",
                        R = "[" + o + "]?",
                        I = R + S + ("(?:" + C + "(?:" + [g, m, y].join("|") + ")" + R + S + ")*"),
                        P = "(?:" + [p, m, y].join("|") + ")" + I,
                        k = "(?:" + [g + d + "?", d, m, y, c].join("|") + ")",
                        ms = RegExp(s, "g"),
                        ys = RegExp(d, "g"),
                        L = RegExp(v + "(?=" + v + ")|" + k + I, "g"),
                        bs = RegExp([b + "?" + f + "+" + E + "(?=" + [l, b, "$"].join("|") + ")", T + "+" + _ + "(?=" + [l, b + w, "$"].join("|") + ")", b + "?" + w + "+" + E, b + "+" + _, "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", u, P].join("|"), "g"),
                        x = RegExp("[" + C + e + t + o + "]"),
                        Cs = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/,
                        ws = ["Array", "Buffer", "DataView", "Date", "Error", "Float32Array", "Float64Array", "Function", "Int8Array", "Int16Array", "Int32Array", "Map", "Math", "Object", "Promise", "RegExp", "Set", "String", "Symbol", "TypeError", "Uint8Array", "Uint8ClampedArray", "Uint16Array", "Uint32Array", "WeakMap", "_", "clearTimeout", "isFinite", "parseInt", "setTimeout"],
                        Ts = -1,
                        Es = {};
                    Es[ka] = Es[La] = Es[xa] = Es[Ma] = Es[Oa] = Es[Da] = Es[Na] = Es[Aa] = Es[Ba] = !0, Es[ua] = Es[pa] = Es[Ia] = Es[fa] = Es[Pa] = Es[ha] = Es[va] = Es[ga] = Es[ya] = Es[ba] = Es[Ca] = Es[Ta] = Es[Ea] = Es[_a] = Es[Ra] = !1;
                    var _s = {};
                    _s[ua] = _s[pa] = _s[Ia] = _s[Pa] = _s[fa] = _s[ha] = _s[ka] = _s[La] = _s[xa] = _s[Ma] = _s[Oa] = _s[ya] = _s[ba] = _s[Ca] = _s[Ta] = _s[Ea] = _s[_a] = _s[Sa] = _s[Da] = _s[Na] = _s[Aa] = _s[Ba] = !0, _s[va] = _s[ga] = _s[Ra] = !1;
                    var M = {
                        "\\": "\\",
                        "'": "'",
                        "\n": "n",
                        "\r": "r",
                        "\u2028": "u2028",
                        "\u2029": "u2029"
                    },
                        Ss = parseFloat,
                        Rs = parseInt,
                        O = "object" == typeof G && G && G.Object === Object && G,
                        D = "object" == typeof self && self && self.Object === Object && self,
                        Is = O || D || Function("return this")(),
                        N = "object" == typeof H && H && !H.nodeType && H,
                        A = N && "object" == typeof F && F && !F.nodeType && F,
                        Ps = A && A.exports === N,
                        B = Ps && O.process,
                        W = function () {
                            try {
                                var e = A && A.require && A.require("util").types;
                                return e || B && B.binding && B.binding("util")
                            } catch (e) { }
                        }(),
                        ks = W && W.isArrayBuffer,
                        Ls = W && W.isDate,
                        xs = W && W.isMap,
                        Ms = W && W.isRegExp,
                        Os = W && W.isSet,
                        Ds = W && W.isTypedArray;

                    function Ns(e, t, n) {
                        switch (n.length) {
                            case 0:
                                return e.call(t);
                            case 1:
                                return e.call(t, n[0]);
                            case 2:
                                return e.call(t, n[0], n[1]);
                            case 3:
                                return e.call(t, n[0], n[1], n[2])
                        }
                        return e.apply(t, n)
                    }

                    function As(e, t, n, r) {
                        for (var i = -1, o = null == e ? 0 : e.length; ++i < o;) {
                            var a = e[i];
                            t(r, a, n(a), e)
                        }
                        return r
                    }

                    function Bs(e, t) {
                        for (var n = -1, r = null == e ? 0 : e.length; ++n < r && !1 !== t(e[n], n, e););
                        return e
                    }

                    function Ws(e, t) {
                        for (var n = null == e ? 0 : e.length; n-- && !1 !== t(e[n], n, e););
                        return e
                    }

                    function js(e, t) {
                        for (var n = -1, r = null == e ? 0 : e.length; ++n < r;)
                            if (!t(e[n], n, e)) return !1;
                        return !0
                    }

                    function Us(e, t) {
                        for (var n = -1, r = null == e ? 0 : e.length, i = 0, o = []; ++n < r;) {
                            var a = e[n];
                            t(a, n, e) && (o[i++] = a)
                        }
                        return o
                    }

                    function Gs(e, t) {
                        return !!(null == e ? 0 : e.length) && -1 < Zs(e, t, 0)
                    }

                    function Fs(e, t, n) {
                        for (var r = -1, i = null == e ? 0 : e.length; ++r < i;)
                            if (n(t, e[r])) return !0;
                        return !1
                    }

                    function Hs(e, t) {
                        for (var n = -1, r = null == e ? 0 : e.length, i = Array(r); ++n < r;) i[n] = t(e[n], n, e);
                        return i
                    }

                    function zs(e, t) {
                        for (var n = -1, r = t.length, i = e.length; ++n < r;) e[i + n] = t[n];
                        return e
                    }

                    function Vs(e, t, n, r) {
                        var i = -1,
                            o = null == e ? 0 : e.length;
                        for (r && o && (n = e[++i]); ++i < o;) n = t(n, e[i], i, e);
                        return n
                    }

                    function Ys(e, t, n, r) {
                        var i = null == e ? 0 : e.length;
                        for (r && i && (n = e[--i]); i--;) n = t(n, e[i], i, e);
                        return n
                    }

                    function Js(e, t) {
                        for (var n = -1, r = null == e ? 0 : e.length; ++n < r;)
                            if (t(e[n], n, e)) return !0;
                        return !1
                    }
                    var j = ec("length");

                    function Ks(e, r, t) {
                        var i;
                        return t(e, function (e, t, n) {
                            if (r(e, t, n)) return i = t, !1
                        }), i
                    }

                    function Xs(e, t, n, r) {
                        for (var i = e.length, o = n + (r ? 1 : -1); r ? o-- : ++o < i;)
                            if (t(e[o], o, e)) return o;
                        return -1
                    }

                    function Zs(e, t, n) {
                        return t == t ? function (e, t, n) {
                            var r = n - 1,
                                i = e.length;
                            for (; ++r < i;)
                                if (e[r] === t) return r;
                            return -1
                        }(e, t, n) : Xs(e, $s, n)
                    }

                    function qs(e, t, n, r) {
                        for (var i = n - 1, o = e.length; ++i < o;)
                            if (r(e[i], t)) return i;
                        return -1
                    }

                    function $s(e) {
                        return e != e
                    }

                    function Qs(e, t) {
                        var n = null == e ? 0 : e.length;
                        return n ? nc(e, t) / n : ca
                    }

                    function ec(t) {
                        return function (e) {
                            return null == e ? na : e[t]
                        }
                    }

                    function U(t) {
                        return function (e) {
                            return null == t ? na : t[e]
                        }
                    }

                    function tc(e, r, i, o, t) {
                        return t(e, function (e, t, n) {
                            i = o ? (o = !1, e) : r(i, e, t, n)
                        }), i
                    }

                    function nc(e, t) {
                        for (var n, r = -1, i = e.length; ++r < i;) {
                            var o = t(e[r]);
                            o !== na && (n = n === na ? o : n + o)
                        }
                        return n
                    }

                    function rc(e, t) {
                        for (var n = -1, r = Array(e); ++n < e;) r[n] = t(n);
                        return r
                    }

                    function ic(t) {
                        return function (e) {
                            return t(e)
                        }
                    }

                    function oc(t, e) {
                        return Hs(e, function (e) {
                            return t[e]
                        })
                    }

                    function ac(e, t) {
                        return e.has(t)
                    }

                    function sc(e, t) {
                        for (var n = -1, r = e.length; ++n < r && -1 < Zs(t, e[n], 0););
                        return n
                    }

                    function cc(e, t) {
                        for (var n = e.length; n-- && -1 < Zs(t, e[n], 0););
                        return n
                    }
                    var lc = U({
                        "Ã€": "A",
                        "Ã": "A",
                        "Ã‚": "A",
                        "Ãƒ": "A",
                        "Ã„": "A",
                        "Ã…": "A",
                        "Ã ": "a",
                        "Ã¡": "a",
                        "Ã¢": "a",
                        "Ã£": "a",
                        "Ã¤": "a",
                        "Ã¥": "a",
                        "Ã‡": "C",
                        "Ã§": "c",
                        "Ã": "D",
                        "Ã°": "d",
                        "Ãˆ": "E",
                        "Ã‰": "E",
                        "ÃŠ": "E",
                        "Ã‹": "E",
                        "Ã¨": "e",
                        "Ã©": "e",
                        "Ãª": "e",
                        "Ã«": "e",
                        "ÃŒ": "I",
                        "Ã": "I",
                        "ÃŽ": "I",
                        "Ã": "I",
                        "Ã¬": "i",
                        "Ã­": "i",
                        "Ã®": "i",
                        "Ã¯": "i",
                        "Ã‘": "N",
                        "Ã±": "n",
                        "Ã’": "O",
                        "Ã“": "O",
                        "Ã”": "O",
                        "Ã•": "O",
                        "Ã–": "O",
                        "Ã˜": "O",
                        "Ã²": "o",
                        "Ã³": "o",
                        "Ã´": "o",
                        "Ãµ": "o",
                        "Ã¶": "o",
                        "Ã¸": "o",
                        "Ã™": "U",
                        "Ãš": "U",
                        "Ã›": "U",
                        "Ãœ": "U",
                        "Ã¹": "u",
                        "Ãº": "u",
                        "Ã»": "u",
                        "Ã¼": "u",
                        "Ã": "Y",
                        "Ã½": "y",
                        "Ã¿": "y",
                        "Ã†": "Ae",
                        "Ã¦": "ae",
                        "Ãž": "Th",
                        "Ã¾": "th",
                        "ÃŸ": "ss",
                        "Ä€": "A",
                        "Ä‚": "A",
                        "Ä„": "A",
                        "Ä": "a",
                        "Äƒ": "a",
                        "Ä…": "a",
                        "Ä†": "C",
                        "Äˆ": "C",
                        "ÄŠ": "C",
                        "ÄŒ": "C",
                        "Ä‡": "c",
                        "Ä‰": "c",
                        "Ä‹": "c",
                        "Ä": "c",
                        "ÄŽ": "D",
                        "Ä": "D",
                        "Ä": "d",
                        "Ä‘": "d",
                        "Ä’": "E",
                        "Ä”": "E",
                        "Ä–": "E",
                        "Ä˜": "E",
                        "Äš": "E",
                        "Ä“": "e",
                        "Ä•": "e",
                        "Ä—": "e",
                        "Ä™": "e",
                        "Ä›": "e",
                        "Äœ": "G",
                        "Äž": "G",
                        "Ä ": "G",
                        "Ä¢": "G",
                        "Ä": "g",
                        "ÄŸ": "g",
                        "Ä¡": "g",
                        "Ä£": "g",
                        "Ä¤": "H",
                        "Ä¦": "H",
                        "Ä¥": "h",
                        "Ä§": "h",
                        "Ä¨": "I",
                        "Äª": "I",
                        "Ä¬": "I",
                        "Ä®": "I",
                        "Ä°": "I",
                        "Ä©": "i",
                        "Ä«": "i",
                        "Ä­": "i",
                        "Ä¯": "i",
                        "Ä±": "i",
                        "Ä´": "J",
                        "Äµ": "j",
                        "Ä¶": "K",
                        "Ä·": "k",
                        "Ä¸": "k",
                        "Ä¹": "L",
                        "Ä»": "L",
                        "Ä½": "L",
                        "Ä¿": "L",
                        "Å": "L",
                        "Äº": "l",
                        "Ä¼": "l",
                        "Ä¾": "l",
                        "Å€": "l",
                        "Å‚": "l",
                        "Åƒ": "N",
                        "Å…": "N",
                        "Å‡": "N",
                        "ÅŠ": "N",
                        "Å„": "n",
                        "Å†": "n",
                        "Åˆ": "n",
                        "Å‹": "n",
                        "ÅŒ": "O",
                        "ÅŽ": "O",
                        "Å": "O",
                        "Å": "o",
                        "Å": "o",
                        "Å‘": "o",
                        "Å”": "R",
                        "Å–": "R",
                        "Å˜": "R",
                        "Å•": "r",
                        "Å—": "r",
                        "Å™": "r",
                        "Åš": "S",
                        "Åœ": "S",
                        "Åž": "S",
                        "Å ": "S",
                        "Å›": "s",
                        "Å": "s",
                        "ÅŸ": "s",
                        "Å¡": "s",
                        "Å¢": "T",
                        "Å¤": "T",
                        "Å¦": "T",
                        "Å£": "t",
                        "Å¥": "t",
                        "Å§": "t",
                        "Å¨": "U",
                        "Åª": "U",
                        "Å¬": "U",
                        "Å®": "U",
                        "Å°": "U",
                        "Å²": "U",
                        "Å©": "u",
                        "Å«": "u",
                        "Å­": "u",
                        "Å¯": "u",
                        "Å±": "u",
                        "Å³": "u",
                        "Å´": "W",
                        "Åµ": "w",
                        "Å¶": "Y",
                        "Å·": "y",
                        "Å¸": "Y",
                        "Å¹": "Z",
                        "Å»": "Z",
                        "Å½": "Z",
                        "Åº": "z",
                        "Å¼": "z",
                        "Å¾": "z",
                        "Ä²": "IJ",
                        "Ä³": "ij",
                        "Å’": "Oe",
                        "Å“": "oe",
                        "Å‰": "'n",
                        "Å¿": "s"
                    }),
                        dc = U({
                            "&": "&amp;",
                            "<": "&lt;",
                            ">": "&gt;",
                            '"': "&quot;",
                            "'": "&#39;"
                        });

                    function uc(e) {
                        return "\\" + M[e]
                    }

                    function pc(e) {
                        return x.test(e)
                    }

                    function fc(e) {
                        var n = -1,
                            r = Array(e.size);
                        return e.forEach(function (e, t) {
                            r[++n] = [t, e]
                        }), r
                    }

                    function hc(t, n) {
                        return function (e) {
                            return t(n(e))
                        }
                    }

                    function vc(e, t) {
                        for (var n = -1, r = e.length, i = 0, o = []; ++n < r;) {
                            var a = e[n];
                            a !== t && a !== oa || (e[n] = oa, o[i++] = n)
                        }
                        return o
                    }

                    function gc(e) {
                        var t = -1,
                            n = Array(e.size);
                        return e.forEach(function (e) {
                            n[++t] = e
                        }), n
                    }

                    function mc(e) {
                        return pc(e) ? function (e) {
                            var t = L.lastIndex = 0;
                            for (; L.test(e);)++t;
                            return t
                        }(e) : j(e)
                    }

                    function yc(e) {
                        return pc(e) ? e.match(L) || [] : e.split("")
                    }
                    var bc = U({
                        "&amp;": "&",
                        "&lt;": "<",
                        "&gt;": ">",
                        "&quot;": '"',
                        "&#39;": "'"
                    });
                    var Cc = function e(t) {
                        var n, P = (t = null == t ? Is : Cc.defaults(Is.Object(), t, Cc.pick(Is, ws))).Array,
                            r = t.Date,
                            i = t.Error,
                            g = t.Function,
                            o = t.Math,
                            _ = t.Object,
                            m = t.RegExp,
                            d = t.String,
                            k = t.TypeError,
                            a = P.prototype,
                            s = g.prototype,
                            u = _.prototype,
                            c = t["__core-js_shared__"],
                            l = s.toString,
                            S = u.hasOwnProperty,
                            p = 0,
                            f = (n = /[^.]+$/.exec(c && c.keys && c.keys.IE_PROTO || "")) ? "Symbol(src)_1." + n : "",
                            h = u.toString,
                            v = l.call(_),
                            y = Is._,
                            b = m("^" + l.call(S).replace(qa, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$"),
                            C = Ps ? t.Buffer : na,
                            w = t.Symbol,
                            T = t.Uint8Array,
                            E = C ? C.allocUnsafe : na,
                            R = hc(_.getPrototypeOf, _),
                            I = _.create,
                            L = u.propertyIsEnumerable,
                            x = a.splice,
                            M = w ? w.isConcatSpreadable : na,
                            O = w ? w.iterator : na,
                            D = w ? w.toStringTag : na,
                            N = function () {
                                try {
                                    var e = Un(_, "defineProperty");
                                    return e({}, "", {}), e
                                } catch (e) { }
                            }(),
                            A = t.clearTimeout !== Is.clearTimeout && t.clearTimeout,
                            B = r && r.now !== Is.Date.now && r.now,
                            W = t.setTimeout !== Is.setTimeout && t.setTimeout,
                            j = o.ceil,
                            U = o.floor,
                            G = _.getOwnPropertySymbols,
                            F = C ? C.isBuffer : na,
                            H = t.isFinite,
                            z = a.join,
                            V = hc(_.keys, _),
                            Y = o.max,
                            J = o.min,
                            K = r.now,
                            X = t.parseInt,
                            Z = o.random,
                            q = a.reverse,
                            $ = Un(t, "DataView"),
                            Q = Un(t, "Map"),
                            ee = Un(t, "Promise"),
                            te = Un(t, "Set"),
                            ne = Un(t, "WeakMap"),
                            re = Un(_, "create"),
                            ie = ne && new ne,
                            oe = {},
                            ae = hr($),
                            se = hr(Q),
                            ce = hr(ee),
                            le = hr(te),
                            de = hr(ne),
                            ue = w ? w.prototype : na,
                            pe = ue ? ue.valueOf : na,
                            fe = ue ? ue.toString : na;

                        function he(e) {
                            if (xi(e) && !Ci(e) && !(e instanceof ye)) {
                                if (e instanceof me) return e;
                                if (S.call(e, "__wrapped__")) return vr(e)
                            }
                            return new me(e)
                        }
                        var ve = function () {
                            function n() { }
                            return function (e) {
                                if (!Li(e)) return {};
                                if (I) return I(e);
                                n.prototype = e;
                                var t = new n;
                                return n.prototype = na, t
                            }
                        }();

                        function ge() { }

                        function me(e, t) {
                            this.__wrapped__ = e, this.__actions__ = [], this.__chain__ = !!t, this.__index__ = 0, this.__values__ = na
                        }

                        function ye(e) {
                            this.__wrapped__ = e, this.__actions__ = [], this.__dir__ = 1, this.__filtered__ = !1, this.__iteratees__ = [], this.__takeCount__ = la, this.__views__ = []
                        }

                        function be(e) {
                            var t = -1,
                                n = null == e ? 0 : e.length;
                            for (this.clear(); ++t < n;) {
                                var r = e[t];
                                this.set(r[0], r[1])
                            }
                        }

                        function Ce(e) {
                            var t = -1,
                                n = null == e ? 0 : e.length;
                            for (this.clear(); ++t < n;) {
                                var r = e[t];
                                this.set(r[0], r[1])
                            }
                        }

                        function we(e) {
                            var t = -1,
                                n = null == e ? 0 : e.length;
                            for (this.clear(); ++t < n;) {
                                var r = e[t];
                                this.set(r[0], r[1])
                            }
                        }

                        function Te(e) {
                            var t = -1,
                                n = null == e ? 0 : e.length;
                            for (this.__data__ = new we; ++t < n;) this.add(e[t])
                        }

                        function Ee(e) {
                            var t = this.__data__ = new Ce(e);
                            this.size = t.size
                        }

                        function _e(e, t) {
                            var n = Ci(e),
                                r = !n && bi(e),
                                i = !n && !r && _i(e),
                                o = !n && !r && !i && ji(e),
                                a = n || r || i || o,
                                s = a ? rc(e.length, d) : [],
                                c = s.length;
                            for (var l in e) !t && !S.call(e, l) || a && ("length" == l || i && ("offset" == l || "parent" == l) || o && ("buffer" == l || "byteLength" == l || "byteOffset" == l) || Jn(l, c)) || s.push(l);
                            return s
                        }

                        function Se(e) {
                            var t = e.length;
                            return t ? e[Tt(0, t - 1)] : na
                        }

                        function Re(e, t) {
                            return lr(rn(e), Ne(t, 0, e.length))
                        }

                        function Ie(e) {
                            return lr(rn(e))
                        }

                        function Pe(e, t, n) {
                            (n === na || gi(e[t], n)) && (n !== na || t in e) || Oe(e, t, n)
                        }

                        function ke(e, t, n) {
                            var r = e[t];
                            S.call(e, t) && gi(r, n) && (n !== na || t in e) || Oe(e, t, n)
                        }

                        function Le(e, t) {
                            for (var n = e.length; n--;)
                                if (gi(e[n][0], t)) return n;
                            return -1
                        }

                        function xe(e, r, i, o) {
                            return Ue(e, function (e, t, n) {
                                r(o, e, i(e), n)
                            }), o
                        }

                        function Me(e, t) {
                            return e && on(t, so(t), e)
                        }

                        function Oe(e, t, n) {
                            "__proto__" == t && N ? N(e, t, {
                                configurable: !0,
                                enumerable: !0,
                                value: n,
                                writable: !0
                            }) : e[t] = n
                        }

                        function De(e, t) {
                            for (var n = -1, r = t.length, i = P(r), o = null == e; ++n < r;) i[n] = o ? na : no(e, t[n]);
                            return i
                        }

                        function Ne(e, t, n) {
                            return e == e && (n !== na && (e = e <= n ? e : n), t !== na && (e = t <= e ? e : t)), e
                        }

                        function Ae(n, r, i, e, t, o) {
                            var a, s = 1 & r,
                                c = 2 & r,
                                l = 4 & r;
                            if (i && (a = t ? i(n, e, t, o) : i(n)), a !== na) return a;
                            if (!Li(n)) return n;
                            var d, u, p, f, h, v, g, m, y, b = Ci(n);
                            if (b) {
                                if (m = (g = n).length, y = new g.constructor(m), m && "string" == typeof g[0] && S.call(g, "index") && (y.index = g.index, y.input = g.input), a = y, !s) return rn(n, a)
                            } else {
                                var C = Hn(n),
                                    w = C == ga || C == ma;
                                if (_i(n)) return qt(n, s);
                                if (C == Ca || C == ua || w && !t) {
                                    if (a = c || w ? {} : Vn(n), !s) return c ? (v = p = n, f = (h = a) && on(v, co(v), h), on(p, Fn(p), f)) : (u = Me(a, d = n), on(d, Gn(d), u))
                                } else {
                                    if (!_s[C]) return t ? n : {};
                                    a = function (e, t, n) {
                                        var r, i, o, a, s, c = e.constructor;
                                        switch (t) {
                                            case Ia:
                                                return $t(e);
                                            case fa:
                                            case ha:
                                                return new c(+e);
                                            case Pa:
                                                return a = e, s = n ? $t(a.buffer) : a.buffer, new a.constructor(s, a.byteOffset, a.byteLength);
                                            case ka:
                                            case La:
                                            case xa:
                                            case Ma:
                                            case Oa:
                                            case Da:
                                            case Na:
                                            case Aa:
                                            case Ba:
                                                return Qt(e, n);
                                            case ya:
                                                return new c;
                                            case ba:
                                            case _a:
                                                return new c(e);
                                            case Ta:
                                                return (o = new (i = e).constructor(i.source, cs.exec(i))).lastIndex = i.lastIndex, o;
                                            case Ea:
                                                return new c;
                                            case Sa:
                                                return r = e, pe ? _(pe.call(r)) : {}
                                        }
                                    }(n, C, s)
                                }
                            }
                            o || (o = new Ee);
                            var T = o.get(n);
                            if (T) return T;
                            if (o.set(n, a), Ai(n)) return n.forEach(function (e) {
                                a.add(Ae(e, r, i, e, n, o))
                            }), a;
                            if (Mi(n)) return n.forEach(function (e, t) {
                                a.set(t, Ae(e, r, i, t, n, o))
                            }), a;
                            var E = b ? na : (l ? c ? On : Mn : c ? co : so)(n);
                            return Bs(E || n, function (e, t) {
                                E && (e = n[t = e]), ke(a, t, Ae(e, r, i, t, n, o))
                            }), a
                        }

                        function Be(e, t, n) {
                            var r = n.length;
                            if (null == e) return !r;
                            for (e = _(e); r--;) {
                                var i = n[r],
                                    o = t[i],
                                    a = e[i];
                                if (a === na && !(i in e) || !o(a)) return !1
                            }
                            return !0
                        }

                        function We(e, t, n) {
                            if ("function" != typeof e) throw new k(ra);
                            return or(function () {
                                e.apply(na, n)
                            }, t)
                        }

                        function je(e, t, n, r) {
                            var i = -1,
                                o = Gs,
                                a = !0,
                                s = e.length,
                                c = [],
                                l = t.length;
                            if (!s) return c;
                            n && (t = Hs(t, ic(n))), r ? (o = Fs, a = !1) : 200 <= t.length && (o = ac, a = !1, t = new Te(t));
                            e: for (; ++i < s;) {
                                var d = e[i],
                                    u = null == n ? d : n(d);
                                if (d = r || 0 !== d ? d : 0, a && u == u) {
                                    for (var p = l; p--;)
                                        if (t[p] === u) continue e;
                                    c.push(d)
                                } else o(t, u, r) || c.push(d)
                            }
                            return c
                        }
                        he.templateSettings = {
                            escape: Va,
                            evaluate: Ya,
                            interpolate: Ja,
                            variable: "",
                            imports: {
                                _: he
                            }
                        }, (he.prototype = ge.prototype).constructor = he, (me.prototype = ve(ge.prototype)).constructor = me, (ye.prototype = ve(ge.prototype)).constructor = ye, be.prototype.clear = function () {
                            this.__data__ = re ? re(null) : {}, this.size = 0
                        }, be.prototype.delete = function (e) {
                            var t = this.has(e) && delete this.__data__[e];
                            return this.size -= t ? 1 : 0, t
                        }, be.prototype.get = function (e) {
                            var t = this.__data__;
                            if (re) {
                                var n = t[e];
                                return n === ia ? na : n
                            }
                            return S.call(t, e) ? t[e] : na
                        }, be.prototype.has = function (e) {
                            var t = this.__data__;
                            return re ? t[e] !== na : S.call(t, e)
                        }, be.prototype.set = function (e, t) {
                            var n = this.__data__;
                            return this.size += this.has(e) ? 0 : 1, n[e] = re && t === na ? ia : t, this
                        }, Ce.prototype.clear = function () {
                            this.__data__ = [], this.size = 0
                        }, Ce.prototype.delete = function (e) {
                            var t = this.__data__,
                                n = Le(t, e);
                            return !(n < 0 || (n == t.length - 1 ? t.pop() : x.call(t, n, 1), --this.size, 0))
                        }, Ce.prototype.get = function (e) {
                            var t = this.__data__,
                                n = Le(t, e);
                            return n < 0 ? na : t[n][1]
                        }, Ce.prototype.has = function (e) {
                            return -1 < Le(this.__data__, e)
                        }, Ce.prototype.set = function (e, t) {
                            var n = this.__data__,
                                r = Le(n, e);
                            return r < 0 ? (++this.size, n.push([e, t])) : n[r][1] = t, this
                        }, we.prototype.clear = function () {
                            this.size = 0, this.__data__ = {
                                hash: new be,
                                map: new (Q || Ce),
                                string: new be
                            }
                        }, we.prototype.delete = function (e) {
                            var t = Wn(this, e).delete(e);
                            return this.size -= t ? 1 : 0, t
                        }, we.prototype.get = function (e) {
                            return Wn(this, e).get(e)
                        }, we.prototype.has = function (e) {
                            return Wn(this, e).has(e)
                        }, we.prototype.set = function (e, t) {
                            var n = Wn(this, e),
                                r = n.size;
                            return n.set(e, t), this.size += n.size == r ? 0 : 1, this
                        }, Te.prototype.add = Te.prototype.push = function (e) {
                            return this.__data__.set(e, ia), this
                        }, Te.prototype.has = function (e) {
                            return this.__data__.has(e)
                        }, Ee.prototype.clear = function () {
                            this.__data__ = new Ce, this.size = 0
                        }, Ee.prototype.delete = function (e) {
                            var t = this.__data__,
                                n = t.delete(e);
                            return this.size = t.size, n
                        }, Ee.prototype.get = function (e) {
                            return this.__data__.get(e)
                        }, Ee.prototype.has = function (e) {
                            return this.__data__.has(e)
                        }, Ee.prototype.set = function (e, t) {
                            var n = this.__data__;
                            if (n instanceof Ce) {
                                var r = n.__data__;
                                if (!Q || r.length < 199) return r.push([e, t]), this.size = ++n.size, this;
                                n = this.__data__ = new we(r)
                            }
                            return n.set(e, t), this.size = n.size, this
                        };
                        var Ue = cn(Ke),
                            Ge = cn(Xe, !0);

                        function Fe(e, r) {
                            var i = !0;
                            return Ue(e, function (e, t, n) {
                                return i = !!r(e, t, n)
                            }), i
                        }

                        function He(e, t, n) {
                            for (var r = -1, i = e.length; ++r < i;) {
                                var o = e[r],
                                    a = t(o);
                                if (null != a && (s === na ? a == a && !Wi(a) : n(a, s))) var s = a,
                                    c = o
                            }
                            return c
                        }

                        function ze(e, r) {
                            var i = [];
                            return Ue(e, function (e, t, n) {
                                r(e, t, n) && i.push(e)
                            }), i
                        }

                        function Ve(e, t, n, r, i) {
                            var o = -1,
                                a = e.length;
                            for (n || (n = Yn), i || (i = []); ++o < a;) {
                                var s = e[o];
                                0 < t && n(s) ? 1 < t ? Ve(s, t - 1, n, r, i) : zs(i, s) : r || (i[i.length] = s)
                            }
                            return i
                        }
                        var Ye = ln(),
                            Je = ln(!0);

                        function Ke(e, t) {
                            return e && Ye(e, t, so)
                        }

                        function Xe(e, t) {
                            return e && Je(e, t, so)
                        }

                        function Ze(t, e) {
                            return Us(e, function (e) {
                                return Ii(t[e])
                            })
                        }

                        function qe(e, t) {
                            for (var n = 0, r = (t = Jt(t, e)).length; null != e && n < r;) e = e[fr(t[n++])];
                            return n && n == r ? e : na
                        }

                        function $e(e, t, n) {
                            var r = t(e);
                            return Ci(e) ? r : zs(r, n(e))
                        }

                        function Qe(e) {
                            return null == e ? e === na ? "[object Undefined]" : "[object Null]" : D && D in _(e) ? function (e) {
                                var t = S.call(e, D),
                                    n = e[D];
                                try {
                                    e[D] = na;
                                    var r = !0
                                } catch (e) { }
                                var i = h.call(e);
                                return r && (t ? e[D] = n : delete e[D]), i
                            }(e) : (t = e, h.call(t));
                            var t
                        }

                        function et(e, t) {
                            return t < e
                        }

                        function tt(e, t) {
                            return null != e && S.call(e, t)
                        }

                        function nt(e, t) {
                            return null != e && t in _(e)
                        }

                        function rt(e, t, n) {
                            for (var r = n ? Fs : Gs, i = e[0].length, o = e.length, a = o, s = P(o), c = 1 / 0, l = []; a--;) {
                                var d = e[a];
                                a && t && (d = Hs(d, ic(t))), c = J(d.length, c), s[a] = !n && (t || 120 <= i && 120 <= d.length) ? new Te(a && d) : na
                            }
                            d = e[0];
                            var u = -1,
                                p = s[0];
                            e: for (; ++u < i && l.length < c;) {
                                var f = d[u],
                                    h = t ? t(f) : f;
                                if (f = n || 0 !== f ? f : 0, !(p ? ac(p, h) : r(l, h, n))) {
                                    for (a = o; --a;) {
                                        var v = s[a];
                                        if (!(v ? ac(v, h) : r(e[a], h, n))) continue e
                                    }
                                    p && p.push(h), l.push(f)
                                }
                            }
                            return l
                        }

                        function it(e, t, n) {
                            var r = null == (e = nr(e, t = Jt(t, e))) ? e : e[fr(Rr(t))];
                            return null == r ? na : Ns(r, e, n)
                        }

                        function ot(e) {
                            return xi(e) && Qe(e) == ua
                        }

                        function at(e, t, n, r, i) {
                            return e === t || (null == e || null == t || !xi(e) && !xi(t) ? e != e && t != t : function (e, t, n, r, i, o) {
                                var a = Ci(e),
                                    s = Ci(t),
                                    c = a ? pa : Hn(e),
                                    l = s ? pa : Hn(t),
                                    d = (c = c == ua ? Ca : c) == Ca,
                                    u = (l = l == ua ? Ca : l) == Ca,
                                    p = c == l;
                                if (p && _i(e)) {
                                    if (!_i(t)) return !1;
                                    d = !(a = !0)
                                }
                                if (p && !d) return o || (o = new Ee), a || ji(e) ? Ln(e, t, n, r, i, o) : function (e, t, n, r, i, o, a) {
                                    switch (n) {
                                        case Pa:
                                            if (e.byteLength != t.byteLength || e.byteOffset != t.byteOffset) return !1;
                                            e = e.buffer, t = t.buffer;
                                        case Ia:
                                            return !(e.byteLength != t.byteLength || !o(new T(e), new T(t)));
                                        case fa:
                                        case ha:
                                        case ba:
                                            return gi(+e, +t);
                                        case va:
                                            return e.name == t.name && e.message == t.message;
                                        case Ta:
                                        case _a:
                                            return e == t + "";
                                        case ya:
                                            var s = fc;
                                        case Ea:
                                            var c = 1 & r;
                                            if (s || (s = gc), e.size != t.size && !c) return !1;
                                            var l = a.get(e);
                                            if (l) return l == t;
                                            r |= 2, a.set(e, t);
                                            var d = Ln(s(e), s(t), r, i, o, a);
                                            return a.delete(e), d;
                                        case Sa:
                                            if (pe) return pe.call(e) == pe.call(t)
                                    }
                                    return !1
                                }(e, t, c, n, r, i, o);
                                if (!(1 & n)) {
                                    var f = d && S.call(e, "__wrapped__"),
                                        h = u && S.call(t, "__wrapped__");
                                    if (f || h) {
                                        var v = f ? e.value() : e,
                                            g = h ? t.value() : t;
                                        return o || (o = new Ee), i(v, g, n, r, o)
                                    }
                                }
                                return !!p && (o || (o = new Ee), function (e, t, n, r, i, o) {
                                    var a = 1 & n,
                                        s = Mn(e),
                                        c = s.length,
                                        l = Mn(t).length;
                                    if (c != l && !a) return !1;
                                    for (var d = c; d--;) {
                                        var u = s[d];
                                        if (!(a ? u in t : S.call(t, u))) return !1
                                    }
                                    var p = o.get(e);
                                    if (p && o.get(t)) return p == t;
                                    var f = !0;
                                    o.set(e, t), o.set(t, e);
                                    for (var h = a; ++d < c;) {
                                        u = s[d];
                                        var v = e[u],
                                            g = t[u];
                                        if (r) var m = a ? r(g, v, u, t, e, o) : r(v, g, u, e, t, o);
                                        if (!(m === na ? v === g || i(v, g, n, r, o) : m)) {
                                            f = !1;
                                            break
                                        }
                                        h || (h = "constructor" == u)
                                    }
                                    if (f && !h) {
                                        var y = e.constructor,
                                            b = t.constructor;
                                        y != b && "constructor" in e && "constructor" in t && !("function" == typeof y && y instanceof y && "function" == typeof b && b instanceof b) && (f = !1)
                                    }
                                    return o.delete(e), o.delete(t), f
                                }(e, t, n, r, i, o))
                            }(e, t, n, r, at, i))
                        }

                        function st(e, t, n, r) {
                            var i = n.length,
                                o = i,
                                a = !r;
                            if (null == e) return !o;
                            for (e = _(e); i--;) {
                                var s = n[i];
                                if (a && s[2] ? s[1] !== e[s[0]] : !(s[0] in e)) return !1
                            }
                            for (; ++i < o;) {
                                var c = (s = n[i])[0],
                                    l = e[c],
                                    d = s[1];
                                if (a && s[2]) {
                                    if (l === na && !(c in e)) return !1
                                } else {
                                    var u = new Ee;
                                    if (r) var p = r(l, d, c, e, t, u);
                                    if (!(p === na ? at(d, l, 3, r, u) : p)) return !1
                                }
                            }
                            return !0
                        }

                        function ct(e) {
                            return !(!Li(e) || (t = e, f && f in t)) && (Ii(e) ? b : us).test(hr(e));
                            var t
                        }

                        function lt(e) {
                            return "function" == typeof e ? e : null == e ? Do : "object" == typeof e ? Ci(e) ? vt(e[0], e[1]) : ht(e) : Ho(e)
                        }

                        function dt(e) {
                            if (!$n(e)) return V(e);
                            var t = [];
                            for (var n in _(e)) S.call(e, n) && "constructor" != n && t.push(n);
                            return t
                        }

                        function ut(e) {
                            if (!Li(e)) return function (e) {
                                var t = [];
                                if (null != e)
                                    for (var n in _(e)) t.push(n);
                                return t
                            }(e);
                            var t = $n(e),
                                n = [];
                            for (var r in e) ("constructor" != r || !t && S.call(e, r)) && n.push(r);
                            return n
                        }

                        function pt(e, t) {
                            return e < t
                        }

                        function ft(e, r) {
                            var i = -1,
                                o = Ti(e) ? P(e.length) : [];
                            return Ue(e, function (e, t, n) {
                                o[++i] = r(e, t, n)
                            }), o
                        }

                        function ht(t) {
                            var n = jn(t);
                            return 1 == n.length && n[0][2] ? er(n[0][0], n[0][1]) : function (e) {
                                return e === t || st(e, t, n)
                            }
                        }

                        function vt(n, r) {
                            return Xn(n) && Qn(r) ? er(fr(n), r) : function (e) {
                                var t = no(e, n);
                                return t === na && t === r ? ro(e, n) : at(r, t, 3)
                            }
                        }

                        function gt(r, i, o, a, s) {
                            r !== i && Ye(i, function (e, t) {
                                if (Li(e)) s || (s = new Ee),
                                    function (e, t, n, r, i, o, a) {
                                        var s = rr(e, n),
                                            c = rr(t, n),
                                            l = a.get(c);
                                        if (l) return Pe(e, n, l);
                                        var d = o ? o(s, c, n + "", e, t, a) : na,
                                            u = d === na;
                                        if (u) {
                                            var p = Ci(c),
                                                f = !p && _i(c),
                                                h = !p && !f && ji(c);
                                            d = c, p || f || h ? d = Ci(s) ? s : Ei(s) ? rn(s) : f ? qt(c, !(u = !1)) : h ? Qt(c, !(u = !1)) : [] : Di(c) || bi(c) ? bi(d = s) ? d = Ji(s) : Li(s) && !Ii(s) || (d = Vn(c)) : u = !1
                                        }
                                        u && (a.set(c, d), i(d, c, r, o, a), a.delete(c)), Pe(e, n, d)
                                    }(r, i, t, o, gt, a, s);
                                else {
                                    var n = a ? a(rr(r, t), e, t + "", r, i, s) : na;
                                    n === na && (n = e), Pe(r, t, n)
                                }
                            }, co)
                        }

                        function mt(e, t) {
                            var n = e.length;
                            if (n) return Jn(t += t < 0 ? n : 0, n) ? e[t] : na
                        }

                        function yt(e, r, n) {
                            var i = -1;
                            return r = Hs(r.length ? r : [Do], ic(Bn())),
                                function (e, t) {
                                    var n = e.length;
                                    for (e.sort(t); n--;) e[n] = e[n].value;
                                    return e
                                }(ft(e, function (t, e, n) {
                                    return {
                                        criteria: Hs(r, function (e) {
                                            return e(t)
                                        }),
                                        index: ++i,
                                        value: t
                                    }
                                }), function (e, t) {
                                    return function (e, t, n) {
                                        for (var r = -1, i = e.criteria, o = t.criteria, a = i.length, s = n.length; ++r < a;) {
                                            var c = en(i[r], o[r]);
                                            if (c) {
                                                if (s <= r) return c;
                                                var l = n[r];
                                                return c * ("desc" == l ? -1 : 1)
                                            }
                                        }
                                        return e.index - t.index
                                    }(e, t, n)
                                })
                        }

                        function bt(e, t, n) {
                            for (var r = -1, i = t.length, o = {}; ++r < i;) {
                                var a = t[r],
                                    s = qe(e, a);
                                n(s, a) && It(o, Jt(a, e), s)
                            }
                            return o
                        }

                        function Ct(e, t, n, r) {
                            var i = r ? qs : Zs,
                                o = -1,
                                a = t.length,
                                s = e;
                            for (e === t && (t = rn(t)), n && (s = Hs(e, ic(n))); ++o < a;)
                                for (var c = 0, l = t[o], d = n ? n(l) : l; - 1 < (c = i(s, d, c, r));) s !== e && x.call(s, c, 1), x.call(e, c, 1);
                            return e
                        }

                        function wt(e, t) {
                            for (var n = e ? t.length : 0, r = n - 1; n--;) {
                                var i = t[n];
                                if (n == r || i !== o) {
                                    var o = i;
                                    Jn(i) ? x.call(e, i, 1) : jt(e, i)
                                }
                            }
                            return e
                        }

                        function Tt(e, t) {
                            return e + U(Z() * (t - e + 1))
                        }

                        function Et(e, t) {
                            var n = "";
                            if (!e || t < 1 || sa < t) return n;
                            for (; t % 2 && (n += e), (t = U(t / 2)) && (e += e), t;);
                            return n
                        }

                        function _t(e, t) {
                            return ar(tr(e, t, Do), e + "")
                        }

                        function St(e) {
                            return Se(mo(e))
                        }

                        function Rt(e, t) {
                            var n = mo(e);
                            return lr(n, Ne(t, 0, n.length))
                        }

                        function It(e, t, n, r) {
                            if (!Li(e)) return e;
                            for (var i = -1, o = (t = Jt(t, e)).length, a = o - 1, s = e; null != s && ++i < o;) {
                                var c = fr(t[i]),
                                    l = n;
                                if (i != a) {
                                    var d = s[c];
                                    (l = r ? r(d, c, s) : na) === na && (l = Li(d) ? d : Jn(t[i + 1]) ? [] : {})
                                }
                                ke(s, c, l), s = s[c]
                            }
                            return e
                        }
                        var Pt = ie ? function (e, t) {
                            return ie.set(e, t), e
                        } : Do,
                            kt = N ? function (e, t) {
                                return N(e, "toString", {
                                    configurable: !0,
                                    enumerable: !1,
                                    value: xo(t),
                                    writable: !0
                                })
                            } : Do;

                        function Lt(e) {
                            return lr(mo(e))
                        }

                        function xt(e, t, n) {
                            var r = -1,
                                i = e.length;
                            t < 0 && (t = i < -t ? 0 : i + t), (n = i < n ? i : n) < 0 && (n += i), i = n < t ? 0 : n - t >>> 0, t >>>= 0;
                            for (var o = P(i); ++r < i;) o[r] = e[r + t];
                            return o
                        }

                        function Mt(e, r) {
                            var i;
                            return Ue(e, function (e, t, n) {
                                return !(i = r(e, t, n))
                            }), !!i
                        }

                        function Ot(e, t, n) {
                            var r = 0,
                                i = null == e ? r : e.length;
                            if ("number" == typeof t && t == t && i <= 2147483647) {
                                for (; r < i;) {
                                    var o = r + i >>> 1,
                                        a = e[o];
                                    null !== a && !Wi(a) && (n ? a <= t : a < t) ? r = o + 1 : i = o
                                }
                                return i
                            }
                            return Dt(e, t, Do, n)
                        }

                        function Dt(e, t, n, r) {
                            t = n(t);
                            for (var i = 0, o = null == e ? 0 : e.length, a = t != t, s = null === t, c = Wi(t), l = t === na; i < o;) {
                                var d = U((i + o) / 2),
                                    u = n(e[d]),
                                    p = u !== na,
                                    f = null === u,
                                    h = u == u,
                                    v = Wi(u);
                                if (a) var g = r || h;
                                else g = l ? h && (r || p) : s ? h && p && (r || !f) : c ? h && p && !f && (r || !v) : !f && !v && (r ? u <= t : u < t);
                                g ? i = d + 1 : o = d
                            }
                            return J(o, 4294967294)
                        }

                        function Nt(e, t) {
                            for (var n = -1, r = e.length, i = 0, o = []; ++n < r;) {
                                var a = e[n],
                                    s = t ? t(a) : a;
                                if (!n || !gi(s, c)) {
                                    var c = s;
                                    o[i++] = 0 === a ? 0 : a
                                }
                            }
                            return o
                        }

                        function At(e) {
                            return "number" == typeof e ? e : Wi(e) ? ca : +e
                        }

                        function Bt(e) {
                            if ("string" == typeof e) return e;
                            if (Ci(e)) return Hs(e, Bt) + "";
                            if (Wi(e)) return fe ? fe.call(e) : "";
                            var t = e + "";
                            return "0" == t && 1 / e == -1 / 0 ? "-0" : t
                        }

                        function Wt(e, t, n) {
                            var r = -1,
                                i = Gs,
                                o = e.length,
                                a = !0,
                                s = [],
                                c = s;
                            if (n) a = !1, i = Fs;
                            else if (200 <= o) {
                                var l = t ? null : _n(e);
                                if (l) return gc(l);
                                a = !1, i = ac, c = new Te
                            } else c = t ? [] : s;
                            e: for (; ++r < o;) {
                                var d = e[r],
                                    u = t ? t(d) : d;
                                if (d = n || 0 !== d ? d : 0, a && u == u) {
                                    for (var p = c.length; p--;)
                                        if (c[p] === u) continue e;
                                    t && c.push(u), s.push(d)
                                } else i(c, u, n) || (c !== s && c.push(u), s.push(d))
                            }
                            return s
                        }

                        function jt(e, t) {
                            return null == (e = nr(e, t = Jt(t, e))) || delete e[fr(Rr(t))]
                        }

                        function Ut(e, t, n, r) {
                            return It(e, t, n(qe(e, t)), r)
                        }

                        function Gt(e, t, n, r) {
                            for (var i = e.length, o = r ? i : -1;
                                (r ? o-- : ++o < i) && t(e[o], o, e););
                            return n ? xt(e, r ? 0 : o, r ? o + 1 : i) : xt(e, r ? o + 1 : 0, r ? i : o)
                        }

                        function Ft(e, t) {
                            var n = e;
                            return n instanceof ye && (n = n.value()), Vs(t, function (e, t) {
                                return t.func.apply(t.thisArg, zs([e], t.args))
                            }, n)
                        }

                        function Ht(e, t, n) {
                            var r = e.length;
                            if (r < 2) return r ? Wt(e[0]) : [];
                            for (var i = -1, o = P(r); ++i < r;)
                                for (var a = e[i], s = -1; ++s < r;) s != i && (o[i] = je(o[i] || a, e[s], t, n));
                            return Wt(Ve(o, 1), t, n)
                        }

                        function zt(e, t, n) {
                            for (var r = -1, i = e.length, o = t.length, a = {}; ++r < i;) {
                                var s = r < o ? t[r] : na;
                                n(a, e[r], s)
                            }
                            return a
                        }

                        function Vt(e) {
                            return Ei(e) ? e : []
                        }

                        function Yt(e) {
                            return "function" == typeof e ? e : Do
                        }

                        function Jt(e, t) {
                            return Ci(e) ? e : Xn(e, t) ? [e] : pr(Ki(e))
                        }
                        var Kt = _t;

                        function Xt(e, t, n) {
                            var r = e.length;
                            return n = n === na ? r : n, !t && r <= n ? e : xt(e, t, n)
                        }
                        var Zt = A || function (e) {
                            return Is.clearTimeout(e)
                        };

                        function qt(e, t) {
                            if (t) return e.slice();
                            var n = e.length,
                                r = E ? E(n) : new e.constructor(n);
                            return e.copy(r), r
                        }

                        function $t(e) {
                            var t = new e.constructor(e.byteLength);
                            return new T(t).set(new T(e)), t
                        }

                        function Qt(e, t) {
                            var n = t ? $t(e.buffer) : e.buffer;
                            return new e.constructor(n, e.byteOffset, e.length)
                        }

                        function en(e, t) {
                            if (e !== t) {
                                var n = e !== na,
                                    r = null === e,
                                    i = e == e,
                                    o = Wi(e),
                                    a = t !== na,
                                    s = null === t,
                                    c = t == t,
                                    l = Wi(t);
                                if (!s && !l && !o && t < e || o && a && c && !s && !l || r && a && c || !n && c || !i) return 1;
                                if (!r && !o && !l && e < t || l && n && i && !r && !o || s && n && i || !a && i || !c) return -1
                            }
                            return 0
                        }

                        function tn(e, t, n, r) {
                            for (var i = -1, o = e.length, a = n.length, s = -1, c = t.length, l = Y(o - a, 0), d = P(c + l), u = !r; ++s < c;) d[s] = t[s];
                            for (; ++i < a;)(u || i < o) && (d[n[i]] = e[i]);
                            for (; l--;) d[s++] = e[i++];
                            return d
                        }

                        function nn(e, t, n, r) {
                            for (var i = -1, o = e.length, a = -1, s = n.length, c = -1, l = t.length, d = Y(o - s, 0), u = P(d + l), p = !r; ++i < d;) u[i] = e[i];
                            for (var f = i; ++c < l;) u[f + c] = t[c];
                            for (; ++a < s;)(p || i < o) && (u[f + n[a]] = e[i++]);
                            return u
                        }

                        function rn(e, t) {
                            var n = -1,
                                r = e.length;
                            for (t || (t = P(r)); ++n < r;) t[n] = e[n];
                            return t
                        }

                        function on(e, t, n, r) {
                            var i = !n;
                            n || (n = {});
                            for (var o = -1, a = t.length; ++o < a;) {
                                var s = t[o],
                                    c = r ? r(n[s], e[s], s, n, e) : na;
                                c === na && (c = e[s]), i ? Oe(n, s, c) : ke(n, s, c)
                            }
                            return n
                        }

                        function an(i, o) {
                            return function (e, t) {
                                var n = Ci(e) ? As : xe,
                                    r = o ? o() : {};
                                return n(e, i, Bn(t, 2), r)
                            }
                        }

                        function sn(s) {
                            return _t(function (e, t) {
                                var n = -1,
                                    r = t.length,
                                    i = 1 < r ? t[r - 1] : na,
                                    o = 2 < r ? t[2] : na;
                                for (i = 3 < s.length && "function" == typeof i ? (r-- , i) : na, o && Kn(t[0], t[1], o) && (i = r < 3 ? na : i, r = 1), e = _(e); ++n < r;) {
                                    var a = t[n];
                                    a && s(e, a, n, i)
                                }
                                return e
                            })
                        }

                        function cn(o, a) {
                            return function (e, t) {
                                if (null == e) return e;
                                if (!Ti(e)) return o(e, t);
                                for (var n = e.length, r = a ? n : -1, i = _(e);
                                    (a ? r-- : ++r < n) && !1 !== t(i[r], r, i););
                                return e
                            }
                        }

                        function ln(c) {
                            return function (e, t, n) {
                                for (var r = -1, i = _(e), o = n(e), a = o.length; a--;) {
                                    var s = o[c ? a : ++r];
                                    if (!1 === t(i[s], s, i)) break
                                }
                                return e
                            }
                        }

                        function dn(i) {
                            return function (e) {
                                var t = pc(e = Ki(e)) ? yc(e) : na,
                                    n = t ? t[0] : e.charAt(0),
                                    r = t ? Xt(t, 1).join("") : e.slice(1);
                                return n[i]() + r
                            }
                        }

                        function un(t) {
                            return function (e) {
                                return Vs(Po(Co(e).replace(ms, "")), t, "")
                            }
                        }

                        function pn(r) {
                            return function () {
                                var e = arguments;
                                switch (e.length) {
                                    case 0:
                                        return new r;
                                    case 1:
                                        return new r(e[0]);
                                    case 2:
                                        return new r(e[0], e[1]);
                                    case 3:
                                        return new r(e[0], e[1], e[2]);
                                    case 4:
                                        return new r(e[0], e[1], e[2], e[3]);
                                    case 5:
                                        return new r(e[0], e[1], e[2], e[3], e[4]);
                                    case 6:
                                        return new r(e[0], e[1], e[2], e[3], e[4], e[5]);
                                    case 7:
                                        return new r(e[0], e[1], e[2], e[3], e[4], e[5], e[6])
                                }
                                var t = ve(r.prototype),
                                    n = r.apply(t, e);
                                return Li(n) ? n : t
                            }
                        }

                        function fn(a) {
                            return function (e, t, n) {
                                var r = _(e);
                                if (!Ti(e)) {
                                    var i = Bn(t, 3);
                                    e = so(e), t = function (e) {
                                        return i(r[e], e, r)
                                    }
                                }
                                var o = a(e, t, n);
                                return -1 < o ? r[i ? e[o] : o] : na
                            }
                        }

                        function hn(c) {
                            return xn(function (i) {
                                var o = i.length,
                                    e = o,
                                    t = me.prototype.thru;
                                for (c && i.reverse(); e--;) {
                                    var n = i[e];
                                    if ("function" != typeof n) throw new k(ra);
                                    if (t && !a && "wrapper" == Nn(n)) var a = new me([], !0)
                                }
                                for (e = a ? e : o; ++e < o;) {
                                    var r = Nn(n = i[e]),
                                        s = "wrapper" == r ? Dn(n) : na;
                                    a = s && Zn(s[0]) && 424 == s[1] && !s[4].length && 1 == s[9] ? a[Nn(s[0])].apply(a, s[3]) : 1 == n.length && Zn(n) ? a[r]() : a.thru(n)
                                }
                                return function () {
                                    var e = arguments,
                                        t = e[0];
                                    if (a && 1 == e.length && Ci(t)) return a.plant(t).value();
                                    for (var n = 0, r = o ? i[n].apply(this, e) : t; ++n < o;) r = i[n].call(this, r);
                                    return r
                                }
                            })
                        }

                        function vn(l, d, u, p, f, h, v, g, m, y) {
                            var b = d & aa,
                                C = 1 & d,
                                w = 2 & d,
                                T = 24 & d,
                                E = 512 & d,
                                _ = w ? na : pn(l);
                            return function e() {
                                for (var t = arguments.length, n = P(t), r = t; r--;) n[r] = arguments[r];
                                if (T) var i = An(e),
                                    o = function (e, t) {
                                        for (var n = e.length, r = 0; n--;) e[n] === t && ++r;
                                        return r
                                    }(n, i);
                                if (p && (n = tn(n, p, f, T)), h && (n = nn(n, h, v, T)), t -= o, T && t < y) {
                                    var a = vc(n, i);
                                    return Tn(l, d, vn, e.placeholder, u, n, a, g, m, y - t)
                                }
                                var s = C ? u : this,
                                    c = w ? s[l] : l;
                                return t = n.length, g ? n = function (e, t) {
                                    for (var n = e.length, r = J(t.length, n), i = rn(e); r--;) {
                                        var o = t[r];
                                        e[r] = Jn(o, n) ? i[o] : na
                                    }
                                    return e
                                }(n, g) : E && 1 < t && n.reverse(), b && m < t && (n.length = m), this && this !== Is && this instanceof e && (c = _ || pn(c)), c.apply(s, n)
                            }
                        }

                        function gn(a, s) {
                            return function (e, t) {
                                return n = e, r = a, i = s(t), o = {}, Ke(n, function (e, t, n) {
                                    r(o, i(e), t, n)
                                }), o;
                                var n, r, i, o
                            }
                        }

                        function mn(r, i) {
                            return function (e, t) {
                                var n;
                                if (e === na && t === na) return i;
                                if (e !== na && (n = e), t !== na) {
                                    if (n === na) return t;
                                    t = "string" == typeof e || "string" == typeof t ? (e = Bt(e), Bt(t)) : (e = At(e), At(t)), n = r(e, t)
                                }
                                return n
                            }
                        }

                        function yn(r) {
                            return xn(function (e) {
                                return e = Hs(e, ic(Bn())), _t(function (t) {
                                    var n = this;
                                    return r(e, function (e) {
                                        return Ns(e, n, t)
                                    })
                                })
                            })
                        }

                        function bn(e, t) {
                            var n = (t = t === na ? " " : Bt(t)).length;
                            if (n < 2) return n ? Et(t, e) : t;
                            var r = Et(t, j(e / mc(t)));
                            return pc(t) ? Xt(yc(r), 0, e).join("") : r.slice(0, e)
                        }

                        function Cn(r) {
                            return function (e, t, n) {
                                return n && "number" != typeof n && Kn(e, t, n) && (t = n = na), e = Hi(e), t === na ? (t = e, e = 0) : t = Hi(t),
                                    function (e, t, n, r) {
                                        for (var i = -1, o = Y(j((t - e) / (n || 1)), 0), a = P(o); o--;) a[r ? o : ++i] = e, e += n;
                                        return a
                                    }(e, t, n = n === na ? e < t ? 1 : -1 : Hi(n), r)
                            }
                        }

                        function wn(n) {
                            return function (e, t) {
                                return "string" == typeof e && "string" == typeof t || (e = Yi(e), t = Yi(t)), n(e, t)
                            }
                        }

                        function Tn(e, t, n, r, i, o, a, s, c, l) {
                            var d = 8 & t;
                            t |= d ? 32 : 64, 4 & (t &= ~(d ? 64 : 32)) || (t &= -4);
                            var u = [e, t, i, d ? o : na, d ? a : na, d ? na : o, d ? na : a, s, c, l],
                                p = n.apply(na, u);
                            return Zn(e) && ir(p, u), p.placeholder = r, sr(p, e, t)
                        }

                        function En(e) {
                            var r = o[e];
                            return function (e, t) {
                                if (e = Yi(e), t = null == t ? 0 : J(zi(t), 292)) {
                                    var n = (Ki(e) + "e").split("e");
                                    return +((n = (Ki(r(n[0] + "e" + (+n[1] + t))) + "e").split("e"))[0] + "e" + (+n[1] - t))
                                }
                                return r(e)
                            }
                        }
                        var _n = te && 1 / gc(new te([, -0]))[1] == 1 / 0 ? function (e) {
                            return new te(e)
                        } : jo;

                        function Sn(a) {
                            return function (e) {
                                var t, n, r, i, o = Hn(e);
                                return o == ya ? fc(e) : o == Ea ? (t = e, n = -1, r = Array(t.size), t.forEach(function (e) {
                                    r[++n] = [e, e]
                                }), r) : Hs(a(i = e), function (e) {
                                    return [e, i[e]]
                                })
                            }
                        }

                        function Rn(e, t, n, r, i, o, a, s) {
                            var c = 2 & t;
                            if (!c && "function" != typeof e) throw new k(ra);
                            var l = r ? r.length : 0;
                            if (l || (t &= -97, r = i = na), a = a === na ? a : Y(zi(a), 0), s = s === na ? s : zi(s), l -= i ? i.length : 0, 64 & t) {
                                var d = r,
                                    u = i;
                                r = i = na
                            }
                            var p, f, h, v, g, m, y, b, C, w, T, E, _, S = c ? na : Dn(e),
                                R = [e, t, n, r, i, d, u, o, a, s];
                            if (S && function (e, t) {
                                var n = e[1],
                                    r = t[1],
                                    i = n | r,
                                    o = i < 131,
                                    a = r == aa && 8 == n || r == aa && 256 == n && e[7].length <= t[8] || 384 == r && t[7].length <= t[8] && 8 == n;
                                if (o || a) {
                                    1 & r && (e[2] = t[2], i |= 1 & n ? 0 : 4);
                                    var s = t[3];
                                    if (s) {
                                        var c = e[3];
                                        e[3] = c ? tn(c, s, t[4]) : s, e[4] = c ? vc(e[3], oa) : t[4]
                                    } (s = t[5]) && (c = e[5], e[5] = c ? nn(c, s, t[6]) : s, e[6] = c ? vc(e[5], oa) : t[6]), (s = t[7]) && (e[7] = s), r & aa && (e[8] = null == e[8] ? t[8] : J(e[8], t[8])), null == e[9] && (e[9] = t[9]), e[0] = t[0], e[1] = i
                                }
                            }(R, S), e = R[0], t = R[1], n = R[2], r = R[3], i = R[4], !(s = R[9] = R[9] === na ? c ? 0 : e.length : Y(R[9] - l, 0)) && 24 & t && (t &= -25), t && 1 != t) I = 8 == t || 16 == t ? (y = t, b = s, C = pn(m = e), function e() {
                                for (var t = arguments.length, n = P(t), r = t, i = An(e); r--;) n[r] = arguments[r];
                                var o = t < 3 && n[0] !== i && n[t - 1] !== i ? [] : vc(n, i);
                                return (t -= o.length) < b ? Tn(m, y, vn, e.placeholder, na, n, o, na, na, b - t) : Ns(this && this !== Is && this instanceof e ? C : m, this, n)
                            }) : 32 != t && 33 != t || i.length ? vn.apply(na, R) : (f = n, h = r, v = 1 & t, g = pn(p = e), function e() {
                                for (var t = -1, n = arguments.length, r = -1, i = h.length, o = P(i + n), a = this && this !== Is && this instanceof e ? g : p; ++r < i;) o[r] = h[r];
                                for (; n--;) o[r++] = arguments[++t];
                                return Ns(a, v ? f : this, o)
                            });
                            else var I = (T = n, E = 1 & t, _ = pn(w = e), function e() {
                                return (this && this !== Is && this instanceof e ? _ : w).apply(E ? T : this, arguments)
                            });
                            return sr((S ? Pt : ir)(I, R), e, t)
                        }

                        function In(e, t, n, r) {
                            return e === na || gi(e, u[n]) && !S.call(r, n) ? t : e
                        }

                        function Pn(e, t, n, r, i, o) {
                            return Li(e) && Li(t) && (o.set(t, e), gt(e, t, na, Pn, o), o.delete(t)), e
                        }

                        function kn(e) {
                            return Di(e) ? na : e
                        }

                        function Ln(e, t, n, r, i, o) {
                            var a = 1 & n,
                                s = e.length,
                                c = t.length;
                            if (s != c && !(a && s < c)) return !1;
                            var l = o.get(e);
                            if (l && o.get(t)) return l == t;
                            var d = -1,
                                u = !0,
                                p = 2 & n ? new Te : na;
                            for (o.set(e, t), o.set(t, e); ++d < s;) {
                                var f = e[d],
                                    h = t[d];
                                if (r) var v = a ? r(h, f, d, t, e, o) : r(f, h, d, e, t, o);
                                if (v !== na) {
                                    if (v) continue;
                                    u = !1;
                                    break
                                }
                                if (p) {
                                    if (!Js(t, function (e, t) {
                                        if (!ac(p, t) && (f === e || i(f, e, n, r, o))) return p.push(t)
                                    })) {
                                        u = !1;
                                        break
                                    }
                                } else if (f !== h && !i(f, h, n, r, o)) {
                                    u = !1;
                                    break
                                }
                            }
                            return o.delete(e), o.delete(t), u
                        }

                        function xn(e) {
                            return ar(tr(e, na, wr), e + "")
                        }

                        function Mn(e) {
                            return $e(e, so, Gn)
                        }

                        function On(e) {
                            return $e(e, co, Fn)
                        }
                        var Dn = ie ? function (e) {
                            return ie.get(e)
                        } : jo;

                        function Nn(e) {
                            for (var t = e.name + "", n = oe[t], r = S.call(oe, t) ? n.length : 0; r--;) {
                                var i = n[r],
                                    o = i.func;
                                if (null == o || o == e) return i.name
                            }
                            return t
                        }

                        function An(e) {
                            return (S.call(he, "placeholder") ? he : e).placeholder
                        }

                        function Bn() {
                            var e = he.iteratee || No;
                            return e = e === No ? lt : e, arguments.length ? e(arguments[0], arguments[1]) : e
                        }

                        function Wn(e, t) {
                            var n, r, i = e.__data__;
                            return ("string" == (r = typeof (n = t)) || "number" == r || "symbol" == r || "boolean" == r ? "__proto__" !== n : null === n) ? i["string" == typeof t ? "string" : "hash"] : i.map
                        }

                        function jn(e) {
                            for (var t = so(e), n = t.length; n--;) {
                                var r = t[n],
                                    i = e[r];
                                t[n] = [r, i, Qn(i)]
                            }
                            return t
                        }

                        function Un(e, t) {
                            var n, r, i = (r = t, null == (n = e) ? na : n[r]);
                            return ct(i) ? i : na
                        }
                        var Gn = G ? function (t) {
                            return null == t ? [] : (t = _(t), Us(G(t), function (e) {
                                return L.call(t, e)
                            }))
                        } : Yo,
                            Fn = G ? function (e) {
                                for (var t = []; e;) zs(t, Gn(e)), e = R(e);
                                return t
                            } : Yo,
                            Hn = Qe;

                        function zn(e, t, n) {
                            for (var r = -1, i = (t = Jt(t, e)).length, o = !1; ++r < i;) {
                                var a = fr(t[r]);
                                if (!(o = null != e && n(e, a))) break;
                                e = e[a]
                            }
                            return o || ++r != i ? o : !!(i = null == e ? 0 : e.length) && ki(i) && Jn(a, i) && (Ci(e) || bi(e))
                        }

                        function Vn(e) {
                            return "function" != typeof e.constructor || $n(e) ? {} : ve(R(e))
                        }

                        function Yn(e) {
                            return Ci(e) || bi(e) || !!(M && e && e[M])
                        }

                        function Jn(e, t) {
                            var n = typeof e;
                            return !!(t = null == t ? sa : t) && ("number" == n || "symbol" != n && fs.test(e)) && -1 < e && e % 1 == 0 && e < t
                        }

                        function Kn(e, t, n) {
                            if (!Li(n)) return !1;
                            var r = typeof t;
                            return !!("number" == r ? Ti(n) && Jn(t, n.length) : "string" == r && t in n) && gi(n[t], e)
                        }

                        function Xn(e, t) {
                            if (Ci(e)) return !1;
                            var n = typeof e;
                            return !("number" != n && "symbol" != n && "boolean" != n && null != e && !Wi(e)) || Xa.test(e) || !Ka.test(e) || null != t && e in _(t)
                        }

                        function Zn(e) {
                            var t = Nn(e),
                                n = he[t];
                            if ("function" != typeof n || !(t in ye.prototype)) return !1;
                            if (e === n) return !0;
                            var r = Dn(n);
                            return !!r && e === r[0]
                        } ($ && Hn(new $(new ArrayBuffer(1))) != Pa || Q && Hn(new Q) != ya || ee && Hn(ee.resolve()) != wa || te && Hn(new te) != Ea || ne && Hn(new ne) != Ra) && (Hn = function (e) {
                            var t = Qe(e),
                                n = t == Ca ? e.constructor : na,
                                r = n ? hr(n) : "";
                            if (r) switch (r) {
                                case ae:
                                    return Pa;
                                case se:
                                    return ya;
                                case ce:
                                    return wa;
                                case le:
                                    return Ea;
                                case de:
                                    return Ra
                            }
                            return t
                        });
                        var qn = c ? Ii : Jo;

                        function $n(e) {
                            var t = e && e.constructor;
                            return e === ("function" == typeof t && t.prototype || u)
                        }

                        function Qn(e) {
                            return e == e && !Li(e)
                        }

                        function er(t, n) {
                            return function (e) {
                                return null != e && e[t] === n && (n !== na || t in _(e))
                            }
                        }

                        function tr(o, a, s) {
                            return a = Y(a === na ? o.length - 1 : a, 0),
                                function () {
                                    for (var e = arguments, t = -1, n = Y(e.length - a, 0), r = P(n); ++t < n;) r[t] = e[a + t];
                                    t = -1;
                                    for (var i = P(a + 1); ++t < a;) i[t] = e[t];
                                    return i[a] = s(r), Ns(o, this, i)
                                }
                        }

                        function nr(e, t) {
                            return t.length < 2 ? e : qe(e, xt(t, 0, -1))
                        }

                        function rr(e, t) {
                            if ("__proto__" != t) return e[t]
                        }
                        var ir = cr(Pt),
                            or = W || function (e, t) {
                                return Is.setTimeout(e, t)
                            },
                            ar = cr(kt);

                        function sr(e, t, n) {
                            var r, i, o, a = t + "";
                            return ar(e, function (e, t) {
                                var n = t.length;
                                if (!n) return e;
                                var r = n - 1;
                                return t[r] = (1 < n ? "& " : "") + t[r], t = t.join(2 < n ? ", " : " "), e.replace(ns, "{\n/* [wrapped with " + t + "] */\n")
                            }(a, (o = a.match(rs), r = o ? o[1].split(is) : [], i = n, Bs(da, function (e) {
                                var t = "_." + e[0];
                                i & e[1] && !Gs(r, t) && r.push(t)
                            }), r.sort())))
                        }

                        function cr(n) {
                            var r = 0,
                                i = 0;
                            return function () {
                                var e = K(),
                                    t = 16 - (e - i);
                                if (i = e, 0 < t) {
                                    if (800 <= ++r) return arguments[0]
                                } else r = 0;
                                return n.apply(na, arguments)
                            }
                        }

                        function lr(e, t) {
                            var n = -1,
                                r = e.length,
                                i = r - 1;
                            for (t = t === na ? r : t; ++n < t;) {
                                var o = Tt(n, i),
                                    a = e[o];
                                e[o] = e[n], e[n] = a
                            }
                            return e.length = t, e
                        }
                        var dr, ur, pr = (ur = (dr = di(function (e) {
                            var i = [];
                            return 46 === e.charCodeAt(0) && i.push(""), e.replace(Za, function (e, t, n, r) {
                                i.push(n ? r.replace(as, "$1") : t || e)
                            }), i
                        }, function (e) {
                            return 500 === ur.size && ur.clear(), e
                        })).cache, dr);

                        function fr(e) {
                            if ("string" == typeof e || Wi(e)) return e;
                            var t = e + "";
                            return "0" == t && 1 / e == -1 / 0 ? "-0" : t
                        }

                        function hr(e) {
                            if (null != e) {
                                try {
                                    return l.call(e)
                                } catch (e) { }
                                try {
                                    return e + ""
                                } catch (e) { }
                            }
                            return ""
                        }

                        function vr(e) {
                            if (e instanceof ye) return e.clone();
                            var t = new me(e.__wrapped__, e.__chain__);
                            return t.__actions__ = rn(e.__actions__), t.__index__ = e.__index__, t.__values__ = e.__values__, t
                        }
                        var gr = _t(function (e, t) {
                            return Ei(e) ? je(e, Ve(t, 1, Ei, !0)) : []
                        }),
                            mr = _t(function (e, t) {
                                var n = Rr(t);
                                return Ei(n) && (n = na), Ei(e) ? je(e, Ve(t, 1, Ei, !0), Bn(n, 2)) : []
                            }),
                            yr = _t(function (e, t) {
                                var n = Rr(t);
                                return Ei(n) && (n = na), Ei(e) ? je(e, Ve(t, 1, Ei, !0), na, n) : []
                            });

                        function br(e, t, n) {
                            var r = null == e ? 0 : e.length;
                            if (!r) return -1;
                            var i = null == n ? 0 : zi(n);
                            return i < 0 && (i = Y(r + i, 0)), Xs(e, Bn(t, 3), i)
                        }

                        function Cr(e, t, n) {
                            var r = null == e ? 0 : e.length;
                            if (!r) return -1;
                            var i = r - 1;
                            return n !== na && (i = zi(n), i = n < 0 ? Y(r + i, 0) : J(i, r - 1)), Xs(e, Bn(t, 3), i, !0)
                        }

                        function wr(e) {
                            return null != e && e.length ? Ve(e, 1) : []
                        }

                        function Tr(e) {
                            return e && e.length ? e[0] : na
                        }
                        var Er = _t(function (e) {
                            var t = Hs(e, Vt);
                            return t.length && t[0] === e[0] ? rt(t) : []
                        }),
                            _r = _t(function (e) {
                                var t = Rr(e),
                                    n = Hs(e, Vt);
                                return t === Rr(n) ? t = na : n.pop(), n.length && n[0] === e[0] ? rt(n, Bn(t, 2)) : []
                            }),
                            Sr = _t(function (e) {
                                var t = Rr(e),
                                    n = Hs(e, Vt);
                                return (t = "function" == typeof t ? t : na) && n.pop(), n.length && n[0] === e[0] ? rt(n, na, t) : []
                            });

                        function Rr(e) {
                            var t = null == e ? 0 : e.length;
                            return t ? e[t - 1] : na
                        }
                        var Ir = _t(Pr);

                        function Pr(e, t) {
                            return e && e.length && t && t.length ? Ct(e, t) : e
                        }
                        var kr = xn(function (e, t) {
                            var n = null == e ? 0 : e.length,
                                r = De(e, t);
                            return wt(e, Hs(t, function (e) {
                                return Jn(e, n) ? +e : e
                            }).sort(en)), r
                        });

                        function Lr(e) {
                            return null == e ? e : q.call(e)
                        }
                        var xr = _t(function (e) {
                            return Wt(Ve(e, 1, Ei, !0))
                        }),
                            Mr = _t(function (e) {
                                var t = Rr(e);
                                return Ei(t) && (t = na), Wt(Ve(e, 1, Ei, !0), Bn(t, 2))
                            }),
                            Or = _t(function (e) {
                                var t = Rr(e);
                                return t = "function" == typeof t ? t : na, Wt(Ve(e, 1, Ei, !0), na, t)
                            });

                        function Dr(t) {
                            if (!t || !t.length) return [];
                            var n = 0;
                            return t = Us(t, function (e) {
                                if (Ei(e)) return n = Y(e.length, n), !0
                            }), rc(n, function (e) {
                                return Hs(t, ec(e))
                            })
                        }

                        function Nr(e, t) {
                            if (!e || !e.length) return [];
                            var n = Dr(e);
                            return null == t ? n : Hs(n, function (e) {
                                return Ns(t, na, e)
                            })
                        }
                        var Ar = _t(function (e, t) {
                            return Ei(e) ? je(e, t) : []
                        }),
                            Br = _t(function (e) {
                                return Ht(Us(e, Ei))
                            }),
                            Wr = _t(function (e) {
                                var t = Rr(e);
                                return Ei(t) && (t = na), Ht(Us(e, Ei), Bn(t, 2))
                            }),
                            jr = _t(function (e) {
                                var t = Rr(e);
                                return t = "function" == typeof t ? t : na, Ht(Us(e, Ei), na, t)
                            }),
                            Ur = _t(Dr);
                        var Gr = _t(function (e) {
                            var t = e.length,
                                n = 1 < t ? e[t - 1] : na;
                            return Nr(e, n = "function" == typeof n ? (e.pop(), n) : na)
                        });

                        function Fr(e) {
                            var t = he(e);
                            return t.__chain__ = !0, t
                        }

                        function Hr(e, t) {
                            return t(e)
                        }
                        var zr = xn(function (t) {
                            var n = t.length,
                                e = n ? t[0] : 0,
                                r = this.__wrapped__,
                                i = function (e) {
                                    return De(e, t)
                                };
                            return !(1 < n || this.__actions__.length) && r instanceof ye && Jn(e) ? ((r = r.slice(e, +e + (n ? 1 : 0))).__actions__.push({
                                func: Hr,
                                args: [i],
                                thisArg: na
                            }), new me(r, this.__chain__).thru(function (e) {
                                return n && !e.length && e.push(na), e
                            })) : this.thru(i)
                        });
                        var Vr = an(function (e, t, n) {
                            S.call(e, n) ? ++e[n] : Oe(e, n, 1)
                        });
                        var Yr = fn(br),
                            Jr = fn(Cr);

                        function Kr(e, t) {
                            return (Ci(e) ? Bs : Ue)(e, Bn(t, 3))
                        }

                        function Xr(e, t) {
                            return (Ci(e) ? Ws : Ge)(e, Bn(t, 3))
                        }
                        var Zr = an(function (e, t, n) {
                            S.call(e, n) ? e[n].push(t) : Oe(e, n, [t])
                        });
                        var qr = _t(function (e, t, n) {
                            var r = -1,
                                i = "function" == typeof t,
                                o = Ti(e) ? P(e.length) : [];
                            return Ue(e, function (e) {
                                o[++r] = i ? Ns(t, e, n) : it(e, t, n)
                            }), o
                        }),
                            $r = an(function (e, t, n) {
                                Oe(e, n, t)
                            });

                        function Qr(e, t) {
                            return (Ci(e) ? Hs : ft)(e, Bn(t, 3))
                        }
                        var ei = an(function (e, t, n) {
                            e[n ? 0 : 1].push(t)
                        }, function () {
                            return [
                                [],
                                []
                            ]
                        });
                        var ti = _t(function (e, t) {
                            if (null == e) return [];
                            var n = t.length;
                            return 1 < n && Kn(e, t[0], t[1]) ? t = [] : 2 < n && Kn(t[0], t[1], t[2]) && (t = [t[0]]), yt(e, Ve(t, 1), [])
                        }),
                            ni = B || function () {
                                return Is.Date.now()
                            };

                        function ri(e, t, n) {
                            return t = n ? na : t, t = e && null == t ? e.length : t, Rn(e, aa, na, na, na, na, t)
                        }

                        function ii(e, t) {
                            var n;
                            if ("function" != typeof t) throw new k(ra);
                            return e = zi(e),
                                function () {
                                    return 0 < --e && (n = t.apply(this, arguments)), e <= 1 && (t = na), n
                                }
                        }
                        var oi = _t(function (e, t, n) {
                            var r = 1;
                            if (n.length) {
                                var i = vc(n, An(oi));
                                r |= 32
                            }
                            return Rn(e, r, t, n, i)
                        }),
                            ai = _t(function (e, t, n) {
                                var r = 3;
                                if (n.length) {
                                    var i = vc(n, An(ai));
                                    r |= 32
                                }
                                return Rn(t, r, e, n, i)
                            });

                        function si(r, i, e) {
                            var o, a, s, c, l, d, u = 0,
                                p = !1,
                                f = !1,
                                t = !0;
                            if ("function" != typeof r) throw new k(ra);

                            function h(e) {
                                var t = o,
                                    n = a;
                                return o = a = na, u = e, c = r.apply(n, t)
                            }

                            function v(e) {
                                var t = e - d;
                                return d === na || i <= t || t < 0 || f && s <= e - u
                            }

                            function g() {
                                var e, t, n = ni();
                                if (v(n)) return m(n);
                                l = or(g, (t = i - ((e = n) - d), f ? J(t, s - (e - u)) : t))
                            }

                            function m(e) {
                                return l = na, t && o ? h(e) : (o = a = na, c)
                            }

                            function n() {
                                var e, t = ni(),
                                    n = v(t);
                                if (o = arguments, a = this, d = t, n) {
                                    if (l === na) return u = e = d, l = or(g, i), p ? h(e) : c;
                                    if (f) return l = or(g, i), h(d)
                                }
                                return l === na && (l = or(g, i)), c
                            }
                            return i = Yi(i) || 0, Li(e) && (p = !!e.leading, s = (f = "maxWait" in e) ? Y(Yi(e.maxWait) || 0, i) : s, t = "trailing" in e ? !!e.trailing : t), n.cancel = function () {
                                l !== na && Zt(l), u = 0, o = d = a = l = na
                            }, n.flush = function () {
                                return l === na ? c : m(ni())
                            }, n
                        }
                        var ci = _t(function (e, t) {
                            return We(e, 1, t)
                        }),
                            li = _t(function (e, t, n) {
                                return We(e, Yi(t) || 0, n)
                            });

                        function di(i, o) {
                            if ("function" != typeof i || null != o && "function" != typeof o) throw new k(ra);
                            var a = function () {
                                var e = arguments,
                                    t = o ? o.apply(this, e) : e[0],
                                    n = a.cache;
                                if (n.has(t)) return n.get(t);
                                var r = i.apply(this, e);
                                return a.cache = n.set(t, r) || n, r
                            };
                            return a.cache = new (di.Cache || we), a
                        }

                        function ui(t) {
                            if ("function" != typeof t) throw new k(ra);
                            return function () {
                                var e = arguments;
                                switch (e.length) {
                                    case 0:
                                        return !t.call(this);
                                    case 1:
                                        return !t.call(this, e[0]);
                                    case 2:
                                        return !t.call(this, e[0], e[1]);
                                    case 3:
                                        return !t.call(this, e[0], e[1], e[2])
                                }
                                return !t.apply(this, e)
                            }
                        }
                        di.Cache = we;
                        var pi = Kt(function (r, i) {
                            var o = (i = 1 == i.length && Ci(i[0]) ? Hs(i[0], ic(Bn())) : Hs(Ve(i, 1), ic(Bn()))).length;
                            return _t(function (e) {
                                for (var t = -1, n = J(e.length, o); ++t < n;) e[t] = i[t].call(this, e[t]);
                                return Ns(r, this, e)
                            })
                        }),
                            fi = _t(function (e, t) {
                                var n = vc(t, An(fi));
                                return Rn(e, 32, na, t, n)
                            }),
                            hi = _t(function (e, t) {
                                var n = vc(t, An(hi));
                                return Rn(e, 64, na, t, n)
                            }),
                            vi = xn(function (e, t) {
                                return Rn(e, 256, na, na, na, t)
                            });

                        function gi(e, t) {
                            return e === t || e != e && t != t
                        }
                        var mi = wn(et),
                            yi = wn(function (e, t) {
                                return t <= e
                            }),
                            bi = ot(function () {
                                return arguments
                            }()) ? ot : function (e) {
                                return xi(e) && S.call(e, "callee") && !L.call(e, "callee")
                            },
                            Ci = P.isArray,
                            wi = ks ? ic(ks) : function (e) {
                                return xi(e) && Qe(e) == Ia
                            };

                        function Ti(e) {
                            return null != e && ki(e.length) && !Ii(e)
                        }

                        function Ei(e) {
                            return xi(e) && Ti(e)
                        }
                        var _i = F || Jo,
                            Si = Ls ? ic(Ls) : function (e) {
                                return xi(e) && Qe(e) == ha
                            };

                        function Ri(e) {
                            if (!xi(e)) return !1;
                            var t = Qe(e);
                            return t == va || "[object DOMException]" == t || "string" == typeof e.message && "string" == typeof e.name && !Di(e)
                        }

                        function Ii(e) {
                            if (!Li(e)) return !1;
                            var t = Qe(e);
                            return t == ga || t == ma || "[object AsyncFunction]" == t || "[object Proxy]" == t
                        }

                        function Pi(e) {
                            return "number" == typeof e && e == zi(e)
                        }

                        function ki(e) {
                            return "number" == typeof e && -1 < e && e % 1 == 0 && e <= sa
                        }

                        function Li(e) {
                            var t = typeof e;
                            return null != e && ("object" == t || "function" == t)
                        }

                        function xi(e) {
                            return null != e && "object" == typeof e
                        }
                        var Mi = xs ? ic(xs) : function (e) {
                            return xi(e) && Hn(e) == ya
                        };

                        function Oi(e) {
                            return "number" == typeof e || xi(e) && Qe(e) == ba
                        }

                        function Di(e) {
                            if (!xi(e) || Qe(e) != Ca) return !1;
                            var t = R(e);
                            if (null === t) return !0;
                            var n = S.call(t, "constructor") && t.constructor;
                            return "function" == typeof n && n instanceof n && l.call(n) == v
                        }
                        var Ni = Ms ? ic(Ms) : function (e) {
                            return xi(e) && Qe(e) == Ta
                        };
                        var Ai = Os ? ic(Os) : function (e) {
                            return xi(e) && Hn(e) == Ea
                        };

                        function Bi(e) {
                            return "string" == typeof e || !Ci(e) && xi(e) && Qe(e) == _a
                        }

                        function Wi(e) {
                            return "symbol" == typeof e || xi(e) && Qe(e) == Sa
                        }
                        var ji = Ds ? ic(Ds) : function (e) {
                            return xi(e) && ki(e.length) && !!Es[Qe(e)]
                        };
                        var Ui = wn(pt),
                            Gi = wn(function (e, t) {
                                return e <= t
                            });

                        function Fi(e) {
                            if (!e) return [];
                            if (Ti(e)) return Bi(e) ? yc(e) : rn(e);
                            if (O && e[O]) return function (e) {
                                for (var t, n = []; !(t = e.next()).done;) n.push(t.value);
                                return n
                            }(e[O]());
                            var t = Hn(e);
                            return (t == ya ? fc : t == Ea ? gc : mo)(e)
                        }

                        function Hi(e) {
                            return e ? (e = Yi(e)) !== 1 / 0 && e !== -1 / 0 ? e == e ? e : 0 : 17976931348623157e292 * (e < 0 ? -1 : 1) : 0 === e ? e : 0
                        }

                        function zi(e) {
                            var t = Hi(e),
                                n = t % 1;
                            return t == t ? n ? t - n : t : 0
                        }

                        function Vi(e) {
                            return e ? Ne(zi(e), 0, la) : 0
                        }

                        function Yi(e) {
                            if ("number" == typeof e) return e;
                            if (Wi(e)) return ca;
                            if (Li(e)) {
                                var t = "function" == typeof e.valueOf ? e.valueOf() : e;
                                e = Li(t) ? t + "" : t
                            }
                            if ("string" != typeof e) return 0 === e ? e : +e;
                            e = e.replace(Qa, "");
                            var n = ds.test(e);
                            return n || ps.test(e) ? Rs(e.slice(2), n ? 2 : 8) : ls.test(e) ? ca : +e
                        }

                        function Ji(e) {
                            return on(e, co(e))
                        }

                        function Ki(e) {
                            return null == e ? "" : Bt(e)
                        }
                        var Xi = sn(function (e, t) {
                            if ($n(t) || Ti(t)) on(t, so(t), e);
                            else
                                for (var n in t) S.call(t, n) && ke(e, n, t[n])
                        }),
                            Zi = sn(function (e, t) {
                                on(t, co(t), e)
                            }),
                            qi = sn(function (e, t, n, r) {
                                on(t, co(t), e, r)
                            }),
                            $i = sn(function (e, t, n, r) {
                                on(t, so(t), e, r)
                            }),
                            Qi = xn(De);
                        var eo = _t(function (e, t) {
                            e = _(e);
                            var n = -1,
                                r = t.length,
                                i = 2 < r ? t[2] : na;
                            for (i && Kn(t[0], t[1], i) && (r = 1); ++n < r;)
                                for (var o = t[n], a = co(o), s = -1, c = a.length; ++s < c;) {
                                    var l = a[s],
                                        d = e[l];
                                    (d === na || gi(d, u[l]) && !S.call(e, l)) && (e[l] = o[l])
                                }
                            return e
                        }),
                            to = _t(function (e) {
                                return e.push(na, Pn), Ns(uo, na, e)
                            });

                        function no(e, t, n) {
                            var r = null == e ? na : qe(e, t);
                            return r === na ? n : r
                        }

                        function ro(e, t) {
                            return null != e && zn(e, t, nt)
                        }
                        var io = gn(function (e, t, n) {
                            null != t && "function" != typeof t.toString && (t = h.call(t)), e[t] = n
                        }, xo(Do)),
                            oo = gn(function (e, t, n) {
                                null != t && "function" != typeof t.toString && (t = h.call(t)), S.call(e, t) ? e[t].push(n) : e[t] = [n]
                            }, Bn),
                            ao = _t(it);

                        function so(e) {
                            return Ti(e) ? _e(e) : dt(e)
                        }

                        function co(e) {
                            return Ti(e) ? _e(e, !0) : ut(e)
                        }
                        var lo = sn(function (e, t, n) {
                            gt(e, t, n)
                        }),
                            uo = sn(function (e, t, n, r) {
                                gt(e, t, n, r)
                            }),
                            po = xn(function (t, e) {
                                var n = {};
                                if (null == t) return n;
                                var r = !1;
                                e = Hs(e, function (e) {
                                    return e = Jt(e, t), r || (r = 1 < e.length), e
                                }), on(t, On(t), n), r && (n = Ae(n, 7, kn));
                                for (var i = e.length; i--;) jt(n, e[i]);
                                return n
                            });
                        var fo = xn(function (e, t) {
                            return null == e ? {} : bt(n = e, t, function (e, t) {
                                return ro(n, t)
                            });
                            var n
                        });

                        function ho(e, n) {
                            if (null == e) return {};
                            var t = Hs(On(e), function (e) {
                                return [e]
                            });
                            return n = Bn(n), bt(e, t, function (e, t) {
                                return n(e, t[0])
                            })
                        }
                        var vo = Sn(so),
                            go = Sn(co);

                        function mo(e) {
                            return null == e ? [] : oc(e, so(e))
                        }
                        var yo = un(function (e, t, n) {
                            return t = t.toLowerCase(), e + (n ? bo(t) : t)
                        });

                        function bo(e) {
                            return Io(Ki(e).toLowerCase())
                        }

                        function Co(e) {
                            return (e = Ki(e)) && e.replace(hs, lc).replace(ys, "")
                        }
                        var wo = un(function (e, t, n) {
                            return e + (n ? "-" : "") + t.toLowerCase()
                        }),
                            To = un(function (e, t, n) {
                                return e + (n ? " " : "") + t.toLowerCase()
                            }),
                            Eo = dn("toLowerCase");
                        var _o = un(function (e, t, n) {
                            return e + (n ? "_" : "") + t.toLowerCase()
                        });
                        var So = un(function (e, t, n) {
                            return e + (n ? " " : "") + Io(t)
                        });
                        var Ro = un(function (e, t, n) {
                            return e + (n ? " " : "") + t.toUpperCase()
                        }),
                            Io = dn("toUpperCase");

                        function Po(e, t, n) {
                            return e = Ki(e), (t = n ? na : t) === na ? (r = e, Cs.test(r) ? e.match(bs) || [] : e.match(os) || []) : e.match(t) || [];
                            var r
                        }
                        var ko = _t(function (e, t) {
                            try {
                                return Ns(e, na, t)
                            } catch (e) {
                                return Ri(e) ? e : new i(e)
                            }
                        }),
                            Lo = xn(function (t, e) {
                                return Bs(e, function (e) {
                                    e = fr(e), Oe(t, e, oi(t[e], t))
                                }), t
                            });

                        function xo(e) {
                            return function () {
                                return e
                            }
                        }
                        var Mo = hn(),
                            Oo = hn(!0);

                        function Do(e) {
                            return e
                        }

                        function No(e) {
                            return lt("function" == typeof e ? e : Ae(e, 1))
                        }
                        var Ao = _t(function (t, n) {
                            return function (e) {
                                return it(e, t, n)
                            }
                        }),
                            Bo = _t(function (t, n) {
                                return function (e) {
                                    return it(t, e, n)
                                }
                            });

                        function Wo(r, t, e) {
                            var n = so(t),
                                i = Ze(t, n);
                            null != e || Li(t) && (i.length || !n.length) || (e = t, t = r, r = this, i = Ze(t, so(t)));
                            var o = !(Li(e) && "chain" in e && !e.chain),
                                a = Ii(r);
                            return Bs(i, function (e) {
                                var n = t[e];
                                r[e] = n, a && (r.prototype[e] = function () {
                                    var e = this.__chain__;
                                    if (o || e) {
                                        var t = r(this.__wrapped__);
                                        return (t.__actions__ = rn(this.__actions__)).push({
                                            func: n,
                                            args: arguments,
                                            thisArg: r
                                        }), t.__chain__ = e, t
                                    }
                                    return n.apply(r, zs([this.value()], arguments))
                                })
                            }), r
                        }

                        function jo() { }
                        var Uo = yn(Hs),
                            Go = yn(js),
                            Fo = yn(Js);

                        function Ho(e) {
                            return Xn(e) ? ec(fr(e)) : (t = e, function (e) {
                                return qe(e, t)
                            });
                            var t
                        }
                        var zo = Cn(),
                            Vo = Cn(!0);

                        function Yo() {
                            return []
                        }

                        function Jo() {
                            return !1
                        }
                        var Ko = mn(function (e, t) {
                            return e + t
                        }, 0),
                            Xo = En("ceil"),
                            Zo = mn(function (e, t) {
                                return e / t
                            }, 1),
                            qo = En("floor");
                        var $o, Qo = mn(function (e, t) {
                            return e * t
                        }, 1),
                            ea = En("round"),
                            ta = mn(function (e, t) {
                                return e - t
                            }, 0);
                        return he.after = function (e, t) {
                            if ("function" != typeof t) throw new k(ra);
                            return e = zi(e),
                                function () {
                                    if (--e < 1) return t.apply(this, arguments)
                                }
                        }, he.ary = ri, he.assign = Xi, he.assignIn = Zi, he.assignInWith = qi, he.assignWith = $i, he.at = Qi, he.before = ii, he.bind = oi, he.bindAll = Lo, he.bindKey = ai, he.castArray = function () {
                            if (!arguments.length) return [];
                            var e = arguments[0];
                            return Ci(e) ? e : [e]
                        }, he.chain = Fr, he.chunk = function (e, t, n) {
                            t = (n ? Kn(e, t, n) : t === na) ? 1 : Y(zi(t), 0);
                            var r = null == e ? 0 : e.length;
                            if (!r || t < 1) return [];
                            for (var i = 0, o = 0, a = P(j(r / t)); i < r;) a[o++] = xt(e, i, i += t);
                            return a
                        }, he.compact = function (e) {
                            for (var t = -1, n = null == e ? 0 : e.length, r = 0, i = []; ++t < n;) {
                                var o = e[t];
                                o && (i[r++] = o)
                            }
                            return i
                        }, he.concat = function () {
                            var e = arguments.length;
                            if (!e) return [];
                            for (var t = P(e - 1), n = arguments[0], r = e; r--;) t[r - 1] = arguments[r];
                            return zs(Ci(n) ? rn(n) : [n], Ve(t, 1))
                        }, he.cond = function (r) {
                            var i = null == r ? 0 : r.length,
                                t = Bn();
                            return r = i ? Hs(r, function (e) {
                                if ("function" != typeof e[1]) throw new k(ra);
                                return [t(e[0]), e[1]]
                            }) : [], _t(function (e) {
                                for (var t = -1; ++t < i;) {
                                    var n = r[t];
                                    if (Ns(n[0], this, e)) return Ns(n[1], this, e)
                                }
                            })
                        }, he.conforms = function (e) {
                            return t = Ae(e, 1), n = so(t),
                                function (e) {
                                    return Be(e, t, n)
                                };
                            var t, n
                        }, he.constant = xo, he.countBy = Vr, he.create = function (e, t) {
                            var n = ve(e);
                            return null == t ? n : Me(n, t)
                        }, he.curry = function e(t, n, r) {
                            var i = Rn(t, 8, na, na, na, na, na, n = r ? na : n);
                            return i.placeholder = e.placeholder, i
                        }, he.curryRight = function e(t, n, r) {
                            var i = Rn(t, 16, na, na, na, na, na, n = r ? na : n);
                            return i.placeholder = e.placeholder, i
                        }, he.debounce = si, he.defaults = eo, he.defaultsDeep = to, he.defer = ci, he.delay = li, he.difference = gr, he.differenceBy = mr, he.differenceWith = yr, he.drop = function (e, t, n) {
                            var r = null == e ? 0 : e.length;
                            return r ? xt(e, (t = n || t === na ? 1 : zi(t)) < 0 ? 0 : t, r) : []
                        }, he.dropRight = function (e, t, n) {
                            var r = null == e ? 0 : e.length;
                            return r ? xt(e, 0, (t = r - (t = n || t === na ? 1 : zi(t))) < 0 ? 0 : t) : []
                        }, he.dropRightWhile = function (e, t) {
                            return e && e.length ? Gt(e, Bn(t, 3), !0, !0) : []
                        }, he.dropWhile = function (e, t) {
                            return e && e.length ? Gt(e, Bn(t, 3), !0) : []
                        }, he.fill = function (e, t, n, r) {
                            var i = null == e ? 0 : e.length;
                            return i ? (n && "number" != typeof n && Kn(e, t, n) && (n = 0, r = i), function (e, t, n, r) {
                                var i = e.length;
                                for ((n = zi(n)) < 0 && (n = i < -n ? 0 : i + n), (r = r === na || i < r ? i : zi(r)) < 0 && (r += i), r = r < n ? 0 : Vi(r); n < r;) e[n++] = t;
                                return e
                            }(e, t, n, r)) : []
                        }, he.filter = function (e, t) {
                            return (Ci(e) ? Us : ze)(e, Bn(t, 3))
                        }, he.flatMap = function (e, t) {
                            return Ve(Qr(e, t), 1)
                        }, he.flatMapDeep = function (e, t) {
                            return Ve(Qr(e, t), 1 / 0)
                        }, he.flatMapDepth = function (e, t, n) {
                            return n = n === na ? 1 : zi(n), Ve(Qr(e, t), n)
                        }, he.flatten = wr, he.flattenDeep = function (e) {
                            return null != e && e.length ? Ve(e, 1 / 0) : []
                        }, he.flattenDepth = function (e, t) {
                            return null != e && e.length ? Ve(e, t = t === na ? 1 : zi(t)) : []
                        }, he.flip = function (e) {
                            return Rn(e, 512)
                        }, he.flow = Mo, he.flowRight = Oo, he.fromPairs = function (e) {
                            for (var t = -1, n = null == e ? 0 : e.length, r = {}; ++t < n;) {
                                var i = e[t];
                                r[i[0]] = i[1]
                            }
                            return r
                        }, he.functions = function (e) {
                            return null == e ? [] : Ze(e, so(e))
                        }, he.functionsIn = function (e) {
                            return null == e ? [] : Ze(e, co(e))
                        }, he.groupBy = Zr, he.initial = function (e) {
                            return null != e && e.length ? xt(e, 0, -1) : []
                        }, he.intersection = Er, he.intersectionBy = _r, he.intersectionWith = Sr, he.invert = io, he.invertBy = oo, he.invokeMap = qr, he.iteratee = No, he.keyBy = $r, he.keys = so, he.keysIn = co, he.map = Qr, he.mapKeys = function (e, r) {
                            var i = {};
                            return r = Bn(r, 3), Ke(e, function (e, t, n) {
                                Oe(i, r(e, t, n), e)
                            }), i
                        }, he.mapValues = function (e, r) {
                            var i = {};
                            return r = Bn(r, 3), Ke(e, function (e, t, n) {
                                Oe(i, t, r(e, t, n))
                            }), i
                        }, he.matches = function (e) {
                            return ht(Ae(e, 1))
                        }, he.matchesProperty = function (e, t) {
                            return vt(e, Ae(t, 1))
                        }, he.memoize = di, he.merge = lo, he.mergeWith = uo, he.method = Ao, he.methodOf = Bo, he.mixin = Wo, he.negate = ui, he.nthArg = function (t) {
                            return t = zi(t), _t(function (e) {
                                return mt(e, t)
                            })
                        }, he.omit = po, he.omitBy = function (e, t) {
                            return ho(e, ui(Bn(t)))
                        }, he.once = function (e) {
                            return ii(2, e)
                        }, he.orderBy = function (e, t, n, r) {
                            return null == e ? [] : (Ci(t) || (t = null == t ? [] : [t]), Ci(n = r ? na : n) || (n = null == n ? [] : [n]), yt(e, t, n))
                        }, he.over = Uo, he.overArgs = pi, he.overEvery = Go, he.overSome = Fo, he.partial = fi, he.partialRight = hi, he.partition = ei, he.pick = fo, he.pickBy = ho, he.property = Ho, he.propertyOf = function (t) {
                            return function (e) {
                                return null == t ? na : qe(t, e)
                            }
                        }, he.pull = Ir, he.pullAll = Pr, he.pullAllBy = function (e, t, n) {
                            return e && e.length && t && t.length ? Ct(e, t, Bn(n, 2)) : e
                        }, he.pullAllWith = function (e, t, n) {
                            return e && e.length && t && t.length ? Ct(e, t, na, n) : e
                        }, he.pullAt = kr, he.range = zo, he.rangeRight = Vo, he.rearg = vi, he.reject = function (e, t) {
                            return (Ci(e) ? Us : ze)(e, ui(Bn(t, 3)))
                        }, he.remove = function (e, t) {
                            var n = [];
                            if (!e || !e.length) return n;
                            var r = -1,
                                i = [],
                                o = e.length;
                            for (t = Bn(t, 3); ++r < o;) {
                                var a = e[r];
                                t(a, r, e) && (n.push(a), i.push(r))
                            }
                            return wt(e, i), n
                        }, he.rest = function (e, t) {
                            if ("function" != typeof e) throw new k(ra);
                            return _t(e, t = t === na ? t : zi(t))
                        }, he.reverse = Lr, he.sampleSize = function (e, t, n) {
                            return t = (n ? Kn(e, t, n) : t === na) ? 1 : zi(t), (Ci(e) ? Re : Rt)(e, t)
                        }, he.set = function (e, t, n) {
                            return null == e ? e : It(e, t, n)
                        }, he.setWith = function (e, t, n, r) {
                            return r = "function" == typeof r ? r : na, null == e ? e : It(e, t, n, r)
                        }, he.shuffle = function (e) {
                            return (Ci(e) ? Ie : Lt)(e)
                        }, he.slice = function (e, t, n) {
                            var r = null == e ? 0 : e.length;
                            return r ? xt(e, t, n = n && "number" != typeof n && Kn(e, t, n) ? (t = 0, r) : (t = null == t ? 0 : zi(t), n === na ? r : zi(n))) : []
                        }, he.sortBy = ti, he.sortedUniq = function (e) {
                            return e && e.length ? Nt(e) : []
                        }, he.sortedUniqBy = function (e, t) {
                            return e && e.length ? Nt(e, Bn(t, 2)) : []
                        }, he.split = function (e, t, n) {
                            return n && "number" != typeof n && Kn(e, t, n) && (t = n = na), (n = n === na ? la : n >>> 0) ? (e = Ki(e)) && ("string" == typeof t || null != t && !Ni(t)) && !(t = Bt(t)) && pc(e) ? Xt(yc(e), 0, n) : e.split(t, n) : []
                        }, he.spread = function (r, i) {
                            if ("function" != typeof r) throw new k(ra);
                            return i = null == i ? 0 : Y(zi(i), 0), _t(function (e) {
                                var t = e[i],
                                    n = Xt(e, 0, i);
                                return t && zs(n, t), Ns(r, this, n)
                            })
                        }, he.tail = function (e) {
                            var t = null == e ? 0 : e.length;
                            return t ? xt(e, 1, t) : []
                        }, he.take = function (e, t, n) {
                            return e && e.length ? xt(e, 0, (t = n || t === na ? 1 : zi(t)) < 0 ? 0 : t) : []
                        }, he.takeRight = function (e, t, n) {
                            var r = null == e ? 0 : e.length;
                            return r ? xt(e, (t = r - (t = n || t === na ? 1 : zi(t))) < 0 ? 0 : t, r) : []
                        }, he.takeRightWhile = function (e, t) {
                            return e && e.length ? Gt(e, Bn(t, 3), !1, !0) : []
                        }, he.takeWhile = function (e, t) {
                            return e && e.length ? Gt(e, Bn(t, 3)) : []
                        }, he.tap = function (e, t) {
                            return t(e), e
                        }, he.throttle = function (e, t, n) {
                            var r = !0,
                                i = !0;
                            if ("function" != typeof e) throw new k(ra);
                            return Li(n) && (r = "leading" in n ? !!n.leading : r, i = "trailing" in n ? !!n.trailing : i), si(e, t, {
                                leading: r,
                                maxWait: t,
                                trailing: i
                            })
                        }, he.thru = Hr, he.toArray = Fi, he.toPairs = vo, he.toPairsIn = go, he.toPath = function (e) {
                            return Ci(e) ? Hs(e, fr) : Wi(e) ? [e] : rn(pr(Ki(e)))
                        }, he.toPlainObject = Ji, he.transform = function (e, r, i) {
                            var t = Ci(e),
                                n = t || _i(e) || ji(e);
                            if (r = Bn(r, 4), null == i) {
                                var o = e && e.constructor;
                                i = n ? t ? new o : [] : Li(e) && Ii(o) ? ve(R(e)) : {}
                            }
                            return (n ? Bs : Ke)(e, function (e, t, n) {
                                return r(i, e, t, n)
                            }), i
                        }, he.unary = function (e) {
                            return ri(e, 1)
                        }, he.union = xr, he.unionBy = Mr, he.unionWith = Or, he.uniq = function (e) {
                            return e && e.length ? Wt(e) : []
                        }, he.uniqBy = function (e, t) {
                            return e && e.length ? Wt(e, Bn(t, 2)) : []
                        }, he.uniqWith = function (e, t) {
                            return t = "function" == typeof t ? t : na, e && e.length ? Wt(e, na, t) : []
                        }, he.unset = function (e, t) {
                            return null == e || jt(e, t)
                        }, he.unzip = Dr, he.unzipWith = Nr, he.update = function (e, t, n) {
                            return null == e ? e : Ut(e, t, Yt(n))
                        }, he.updateWith = function (e, t, n, r) {
                            return r = "function" == typeof r ? r : na, null == e ? e : Ut(e, t, Yt(n), r)
                        }, he.values = mo, he.valuesIn = function (e) {
                            return null == e ? [] : oc(e, co(e))
                        }, he.without = Ar, he.words = Po, he.wrap = function (e, t) {
                            return fi(Yt(t), e)
                        }, he.xor = Br, he.xorBy = Wr, he.xorWith = jr, he.zip = Ur, he.zipObject = function (e, t) {
                            return zt(e || [], t || [], ke)
                        }, he.zipObjectDeep = function (e, t) {
                            return zt(e || [], t || [], It)
                        }, he.zipWith = Gr, he.entries = vo, he.entriesIn = go, he.extend = Zi, he.extendWith = qi, Wo(he, he), he.add = Ko, he.attempt = ko, he.camelCase = yo, he.capitalize = bo, he.ceil = Xo, he.clamp = function (e, t, n) {
                            return n === na && (n = t, t = na), n !== na && (n = (n = Yi(n)) == n ? n : 0), t !== na && (t = (t = Yi(t)) == t ? t : 0), Ne(Yi(e), t, n)
                        }, he.clone = function (e) {
                            return Ae(e, 4)
                        }, he.cloneDeep = function (e) {
                            return Ae(e, 5)
                        }, he.cloneDeepWith = function (e, t) {
                            return Ae(e, 5, t = "function" == typeof t ? t : na)
                        }, he.cloneWith = function (e, t) {
                            return Ae(e, 4, t = "function" == typeof t ? t : na)
                        }, he.conformsTo = function (e, t) {
                            return null == t || Be(e, t, so(t))
                        }, he.deburr = Co, he.defaultTo = function (e, t) {
                            return null == e || e != e ? t : e
                        }, he.divide = Zo, he.endsWith = function (e, t, n) {
                            e = Ki(e), t = Bt(t);
                            var r = e.length,
                                i = n = n === na ? r : Ne(zi(n), 0, r);
                            return 0 <= (n -= t.length) && e.slice(n, i) == t
                        }, he.eq = gi, he.escape = function (e) {
                            return (e = Ki(e)) && za.test(e) ? e.replace(Fa, dc) : e
                        }, he.escapeRegExp = function (e) {
                            return (e = Ki(e)) && $a.test(e) ? e.replace(qa, "\\$&") : e
                        }, he.every = function (e, t, n) {
                            var r = Ci(e) ? js : Fe;
                            return n && Kn(e, t, n) && (t = na), r(e, Bn(t, 3))
                        }, he.find = Yr, he.findIndex = br, he.findKey = function (e, t) {
                            return Ks(e, Bn(t, 3), Ke)
                        }, he.findLast = Jr, he.findLastIndex = Cr, he.findLastKey = function (e, t) {
                            return Ks(e, Bn(t, 3), Xe)
                        }, he.floor = qo, he.forEach = Kr, he.forEachRight = Xr, he.forIn = function (e, t) {
                            return null == e ? e : Ye(e, Bn(t, 3), co)
                        }, he.forInRight = function (e, t) {
                            return null == e ? e : Je(e, Bn(t, 3), co)
                        }, he.forOwn = function (e, t) {
                            return e && Ke(e, Bn(t, 3))
                        }, he.forOwnRight = function (e, t) {
                            return e && Xe(e, Bn(t, 3))
                        }, he.get = no, he.gt = mi, he.gte = yi, he.has = function (e, t) {
                            return null != e && zn(e, t, tt)
                        }, he.hasIn = ro, he.head = Tr, he.identity = Do, he.includes = function (e, t, n, r) {
                            e = Ti(e) ? e : mo(e), n = n && !r ? zi(n) : 0;
                            var i = e.length;
                            return n < 0 && (n = Y(i + n, 0)), Bi(e) ? n <= i && -1 < e.indexOf(t, n) : !!i && -1 < Zs(e, t, n)
                        }, he.indexOf = function (e, t, n) {
                            var r = null == e ? 0 : e.length;
                            if (!r) return -1;
                            var i = null == n ? 0 : zi(n);
                            return i < 0 && (i = Y(r + i, 0)), Zs(e, t, i)
                        }, he.inRange = function (e, t, n) {
                            return t = Hi(t), n === na ? (n = t, t = 0) : n = Hi(n), e = Yi(e), (r = e) >= J(i = t, o = n) && r < Y(i, o);
                            var r, i, o
                        }, he.invoke = ao, he.isArguments = bi, he.isArray = Ci, he.isArrayBuffer = wi, he.isArrayLike = Ti, he.isArrayLikeObject = Ei, he.isBoolean = function (e) {
                            return !0 === e || !1 === e || xi(e) && Qe(e) == fa
                        }, he.isBuffer = _i, he.isDate = Si, he.isElement = function (e) {
                            return xi(e) && 1 === e.nodeType && !Di(e)
                        }, he.isEmpty = function (e) {
                            if (null == e) return !0;
                            if (Ti(e) && (Ci(e) || "string" == typeof e || "function" == typeof e.splice || _i(e) || ji(e) || bi(e))) return !e.length;
                            var t = Hn(e);
                            if (t == ya || t == Ea) return !e.size;
                            if ($n(e)) return !dt(e).length;
                            for (var n in e)
                                if (S.call(e, n)) return !1;
                            return !0
                        }, he.isEqual = function (e, t) {
                            return at(e, t)
                        }, he.isEqualWith = function (e, t, n) {
                            var r = (n = "function" == typeof n ? n : na) ? n(e, t) : na;
                            return r === na ? at(e, t, na, n) : !!r
                        }, he.isError = Ri, he.isFinite = function (e) {
                            return "number" == typeof e && H(e)
                        }, he.isFunction = Ii, he.isInteger = Pi, he.isLength = ki, he.isMap = Mi, he.isMatch = function (e, t) {
                            return e === t || st(e, t, jn(t))
                        }, he.isMatchWith = function (e, t, n) {
                            return n = "function" == typeof n ? n : na, st(e, t, jn(t), n)
                        }, he.isNaN = function (e) {
                            return Oi(e) && e != +e
                        }, he.isNative = function (e) {
                            if (qn(e)) throw new i("Unsupported core-js use. Try https://npms.io/search?q=ponyfill.");
                            return ct(e)
                        }, he.isNil = function (e) {
                            return null == e
                        }, he.isNull = function (e) {
                            return null === e
                        }, he.isNumber = Oi, he.isObject = Li, he.isObjectLike = xi, he.isPlainObject = Di, he.isRegExp = Ni, he.isSafeInteger = function (e) {
                            return Pi(e) && -sa <= e && e <= sa
                        }, he.isSet = Ai, he.isString = Bi, he.isSymbol = Wi, he.isTypedArray = ji, he.isUndefined = function (e) {
                            return e === na
                        }, he.isWeakMap = function (e) {
                            return xi(e) && Hn(e) == Ra
                        }, he.isWeakSet = function (e) {
                            return xi(e) && "[object WeakSet]" == Qe(e)
                        }, he.join = function (e, t) {
                            return null == e ? "" : z.call(e, t)
                        }, he.kebabCase = wo, he.last = Rr, he.lastIndexOf = function (e, t, n) {
                            var r = null == e ? 0 : e.length;
                            if (!r) return -1;
                            var i = r;
                            return n !== na && (i = (i = zi(n)) < 0 ? Y(r + i, 0) : J(i, r - 1)), t == t ? function (e, t, n) {
                                for (var r = n + 1; r--;)
                                    if (e[r] === t) return r;
                                return r
                            }(e, t, i) : Xs(e, $s, i, !0)
                        }, he.lowerCase = To, he.lowerFirst = Eo, he.lt = Ui, he.lte = Gi, he.max = function (e) {
                            return e && e.length ? He(e, Do, et) : na
                        }, he.maxBy = function (e, t) {
                            return e && e.length ? He(e, Bn(t, 2), et) : na
                        }, he.mean = function (e) {
                            return Qs(e, Do)
                        }, he.meanBy = function (e, t) {
                            return Qs(e, Bn(t, 2))
                        }, he.min = function (e) {
                            return e && e.length ? He(e, Do, pt) : na
                        }, he.minBy = function (e, t) {
                            return e && e.length ? He(e, Bn(t, 2), pt) : na
                        }, he.stubArray = Yo, he.stubFalse = Jo, he.stubObject = function () {
                            return {}
                        }, he.stubString = function () {
                            return ""
                        }, he.stubTrue = function () {
                            return !0
                        }, he.multiply = Qo, he.nth = function (e, t) {
                            return e && e.length ? mt(e, zi(t)) : na
                        }, he.noConflict = function () {
                            return Is._ === this && (Is._ = y), this
                        }, he.noop = jo, he.now = ni, he.pad = function (e, t, n) {
                            e = Ki(e);
                            var r = (t = zi(t)) ? mc(e) : 0;
                            if (!t || t <= r) return e;
                            var i = (t - r) / 2;
                            return bn(U(i), n) + e + bn(j(i), n)
                        }, he.padEnd = function (e, t, n) {
                            e = Ki(e);
                            var r = (t = zi(t)) ? mc(e) : 0;
                            return t && r < t ? e + bn(t - r, n) : e
                        }, he.padStart = function (e, t, n) {
                            e = Ki(e);
                            var r = (t = zi(t)) ? mc(e) : 0;
                            return t && r < t ? bn(t - r, n) + e : e
                        }, he.parseInt = function (e, t, n) {
                            return n || null == t ? t = 0 : t && (t = +t), X(Ki(e).replace(es, ""), t || 0)
                        }, he.random = function (e, t, n) {
                            if (n && "boolean" != typeof n && Kn(e, t, n) && (t = n = na), n === na && ("boolean" == typeof t ? (n = t, t = na) : "boolean" == typeof e && (n = e, e = na)), e === na && t === na ? (e = 0, t = 1) : (e = Hi(e), t === na ? (t = e, e = 0) : t = Hi(t)), t < e) {
                                var r = e;
                                e = t, t = r
                            }
                            if (n || e % 1 || t % 1) {
                                var i = Z();
                                return J(e + i * (t - e + Ss("1e-" + ((i + "").length - 1))), t)
                            }
                            return Tt(e, t)
                        }, he.reduce = function (e, t, n) {
                            var r = Ci(e) ? Vs : tc,
                                i = arguments.length < 3;
                            return r(e, Bn(t, 4), n, i, Ue)
                        }, he.reduceRight = function (e, t, n) {
                            var r = Ci(e) ? Ys : tc,
                                i = arguments.length < 3;
                            return r(e, Bn(t, 4), n, i, Ge)
                        }, he.repeat = function (e, t, n) {
                            return t = (n ? Kn(e, t, n) : t === na) ? 1 : zi(t), Et(Ki(e), t)
                        }, he.replace = function () {
                            var e = arguments,
                                t = Ki(e[0]);
                            return e.length < 3 ? t : t.replace(e[1], e[2])
                        }, he.result = function (e, t, n) {
                            var r = -1,
                                i = (t = Jt(t, e)).length;
                            for (i || (i = 1, e = na); ++r < i;) {
                                var o = null == e ? na : e[fr(t[r])];
                                o === na && (r = i, o = n), e = Ii(o) ? o.call(e) : o
                            }
                            return e
                        }, he.round = ea, he.runInContext = e, he.sample = function (e) {
                            return (Ci(e) ? Se : St)(e)
                        }, he.size = function (e) {
                            if (null == e) return 0;
                            if (Ti(e)) return Bi(e) ? mc(e) : e.length;
                            var t = Hn(e);
                            return t == ya || t == Ea ? e.size : dt(e).length
                        }, he.snakeCase = _o, he.some = function (e, t, n) {
                            var r = Ci(e) ? Js : Mt;
                            return n && Kn(e, t, n) && (t = na), r(e, Bn(t, 3))
                        }, he.sortedIndex = function (e, t) {
                            return Ot(e, t)
                        }, he.sortedIndexBy = function (e, t, n) {
                            return Dt(e, t, Bn(n, 2))
                        }, he.sortedIndexOf = function (e, t) {
                            var n = null == e ? 0 : e.length;
                            if (n) {
                                var r = Ot(e, t);
                                if (r < n && gi(e[r], t)) return r
                            }
                            return -1
                        }, he.sortedLastIndex = function (e, t) {
                            return Ot(e, t, !0)
                        }, he.sortedLastIndexBy = function (e, t, n) {
                            return Dt(e, t, Bn(n, 2), !0)
                        }, he.sortedLastIndexOf = function (e, t) {
                            if (null != e && e.length) {
                                var n = Ot(e, t, !0) - 1;
                                if (gi(e[n], t)) return n
                            }
                            return -1
                        }, he.startCase = So, he.startsWith = function (e, t, n) {
                            return e = Ki(e), n = null == n ? 0 : Ne(zi(n), 0, e.length), t = Bt(t), e.slice(n, n + t.length) == t
                        }, he.subtract = ta, he.sum = function (e) {
                            return e && e.length ? nc(e, Do) : 0
                        }, he.sumBy = function (e, t) {
                            return e && e.length ? nc(e, Bn(t, 2)) : 0
                        }, he.template = function (a, e, t) {
                            var n = he.templateSettings;
                            t && Kn(a, e, t) && (e = na), a = Ki(a), e = qi({}, e, n, In);
                            var s, c, r = qi({}, e.imports, n.imports, In),
                                i = so(r),
                                o = oc(r, i),
                                l = 0,
                                d = e.interpolate || vs,
                                u = "__p += '",
                                p = m((e.escape || vs).source + "|" + d.source + "|" + (d === Ja ? ss : vs).source + "|" + (e.evaluate || vs).source + "|$", "g"),
                                f = "//# sourceURL=" + ("sourceURL" in e ? e.sourceURL : "lodash.templateSources[" + ++Ts + "]") + "\n";
                            a.replace(p, function (e, t, n, r, i, o) {
                                return n || (n = r), u += a.slice(l, o).replace(gs, uc), t && (s = !0, u += "' +\n__e(" + t + ") +\n'"), i && (c = !0, u += "';\n" + i + ";\n__p += '"), n && (u += "' +\n((__t = (" + n + ")) == null ? '' : __t) +\n'"), l = o + e.length, e
                            }), u += "';\n";
                            var h = e.variable;
                            h || (u = "with (obj) {\n" + u + "\n}\n"), u = (c ? u.replace(Wa, "") : u).replace(ja, "$1").replace(Ua, "$1;"), u = "function(" + (h || "obj") + ") {\n" + (h ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (s ? ", __e = _.escape" : "") + (c ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + u + "return __p\n}";
                            var v = ko(function () {
                                return g(i, f + "return " + u).apply(na, o)
                            });
                            if (v.source = u, Ri(v)) throw v;
                            return v
                        }, he.times = function (e, t) {
                            if ((e = zi(e)) < 1 || sa < e) return [];
                            var n = la,
                                r = J(e, la);
                            t = Bn(t), e -= la;
                            for (var i = rc(r, t); ++n < e;) t(n);
                            return i
                        }, he.toFinite = Hi, he.toInteger = zi, he.toLength = Vi, he.toLower = function (e) {
                            return Ki(e).toLowerCase()
                        }, he.toNumber = Yi, he.toSafeInteger = function (e) {
                            return e ? Ne(zi(e), -sa, sa) : 0 === e ? e : 0
                        }, he.toString = Ki, he.toUpper = function (e) {
                            return Ki(e).toUpperCase()
                        }, he.trim = function (e, t, n) {
                            if ((e = Ki(e)) && (n || t === na)) return e.replace(Qa, "");
                            if (!e || !(t = Bt(t))) return e;
                            var r = yc(e),
                                i = yc(t);
                            return Xt(r, sc(r, i), cc(r, i) + 1).join("")
                        }, he.trimEnd = function (e, t, n) {
                            if ((e = Ki(e)) && (n || t === na)) return e.replace(ts, "");
                            if (!e || !(t = Bt(t))) return e;
                            var r = yc(e);
                            return Xt(r, 0, cc(r, yc(t)) + 1).join("")
                        }, he.trimStart = function (e, t, n) {
                            if ((e = Ki(e)) && (n || t === na)) return e.replace(es, "");
                            if (!e || !(t = Bt(t))) return e;
                            var r = yc(e);
                            return Xt(r, sc(r, yc(t))).join("")
                        }, he.truncate = function (e, t) {
                            var n = 30,
                                r = "...";
                            if (Li(t)) {
                                var i = "separator" in t ? t.separator : i;
                                n = "length" in t ? zi(t.length) : n, r = "omission" in t ? Bt(t.omission) : r
                            }
                            var o = (e = Ki(e)).length;
                            if (pc(e)) {
                                var a = yc(e);
                                o = a.length
                            }
                            if (o <= n) return e;
                            var s = n - mc(r);
                            if (s < 1) return r;
                            var c = a ? Xt(a, 0, s).join("") : e.slice(0, s);
                            if (i === na) return c + r;
                            if (a && (s += c.length - s), Ni(i)) {
                                if (e.slice(s).search(i)) {
                                    var l, d = c;
                                    for (i.global || (i = m(i.source, Ki(cs.exec(i)) + "g")), i.lastIndex = 0; l = i.exec(d);) var u = l.index;
                                    c = c.slice(0, u === na ? s : u)
                                }
                            } else if (e.indexOf(Bt(i), s) != s) {
                                var p = c.lastIndexOf(i); - 1 < p && (c = c.slice(0, p))
                            }
                            return c + r
                        }, he.unescape = function (e) {
                            return (e = Ki(e)) && Ha.test(e) ? e.replace(Ga, bc) : e
                        }, he.uniqueId = function (e) {
                            var t = ++p;
                            return Ki(e) + t
                        }, he.upperCase = Ro, he.upperFirst = Io, he.each = Kr, he.eachRight = Xr, he.first = Tr, Wo(he, ($o = {}, Ke(he, function (e, t) {
                            S.call(he.prototype, t) || ($o[t] = e)
                        }), $o), {
                            chain: !1
                        }), he.VERSION = "4.17.11", Bs(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function (e) {
                            he[e].placeholder = he
                        }), Bs(["drop", "take"], function (n, r) {
                            ye.prototype[n] = function (e) {
                                e = e === na ? 1 : Y(zi(e), 0);
                                var t = this.__filtered__ && !r ? new ye(this) : this.clone();
                                return t.__filtered__ ? t.__takeCount__ = J(e, t.__takeCount__) : t.__views__.push({
                                    size: J(e, la),
                                    type: n + (t.__dir__ < 0 ? "Right" : "")
                                }), t
                            }, ye.prototype[n + "Right"] = function (e) {
                                return this.reverse()[n](e).reverse()
                            }
                        }), Bs(["filter", "map", "takeWhile"], function (e, t) {
                            var n = t + 1,
                                r = 1 == n || 3 == n;
                            ye.prototype[e] = function (e) {
                                var t = this.clone();
                                return t.__iteratees__.push({
                                    iteratee: Bn(e, 3),
                                    type: n
                                }), t.__filtered__ = t.__filtered__ || r, t
                            }
                        }), Bs(["head", "last"], function (e, t) {
                            var n = "take" + (t ? "Right" : "");
                            ye.prototype[e] = function () {
                                return this[n](1).value()[0]
                            }
                        }), Bs(["initial", "tail"], function (e, t) {
                            var n = "drop" + (t ? "" : "Right");
                            ye.prototype[e] = function () {
                                return this.__filtered__ ? new ye(this) : this[n](1)
                            }
                        }), ye.prototype.compact = function () {
                            return this.filter(Do)
                        }, ye.prototype.find = function (e) {
                            return this.filter(e).head()
                        }, ye.prototype.findLast = function (e) {
                            return this.reverse().find(e)
                        }, ye.prototype.invokeMap = _t(function (t, n) {
                            return "function" == typeof t ? new ye(this) : this.map(function (e) {
                                return it(e, t, n)
                            })
                        }), ye.prototype.reject = function (e) {
                            return this.filter(ui(Bn(e)))
                        }, ye.prototype.slice = function (e, t) {
                            e = zi(e);
                            var n = this;
                            return n.__filtered__ && (0 < e || t < 0) ? new ye(n) : (e < 0 ? n = n.takeRight(-e) : e && (n = n.drop(e)), t !== na && (n = (t = zi(t)) < 0 ? n.dropRight(-t) : n.take(t - e)), n)
                        }, ye.prototype.takeRightWhile = function (e) {
                            return this.reverse().takeWhile(e).reverse()
                        }, ye.prototype.toArray = function () {
                            return this.take(la)
                        }, Ke(ye.prototype, function (u, e) {
                            var p = /^(?:filter|find|map|reject)|While$/.test(e),
                                f = /^(?:head|last)$/.test(e),
                                h = he[f ? "take" + ("last" == e ? "Right" : "") : e],
                                v = f || /^find/.test(e);
                            h && (he.prototype[e] = function () {
                                var e = this.__wrapped__,
                                    n = f ? [1] : arguments,
                                    t = e instanceof ye,
                                    r = n[0],
                                    i = t || Ci(e),
                                    o = function (e) {
                                        var t = h.apply(he, zs([e], n));
                                        return f && a ? t[0] : t
                                    };
                                i && p && "function" == typeof r && 1 != r.length && (t = i = !1);
                                var a = this.__chain__,
                                    s = !!this.__actions__.length,
                                    c = v && !a,
                                    l = t && !s;
                                if (v || !i) return c && l ? u.apply(this, n) : (d = this.thru(o), c ? f ? d.value()[0] : d.value() : d);
                                e = l ? e : new ye(this);
                                var d = u.apply(e, n);
                                return d.__actions__.push({
                                    func: Hr,
                                    args: [o],
                                    thisArg: na
                                }), new me(d, a)
                            })
                        }), Bs(["pop", "push", "shift", "sort", "splice", "unshift"], function (e) {
                            var n = a[e],
                                r = /^(?:push|sort|unshift)$/.test(e) ? "tap" : "thru",
                                i = /^(?:pop|shift)$/.test(e);
                            he.prototype[e] = function () {
                                var t = arguments;
                                if (!i || this.__chain__) return this[r](function (e) {
                                    return n.apply(Ci(e) ? e : [], t)
                                });
                                var e = this.value();
                                return n.apply(Ci(e) ? e : [], t)
                            }
                        }), Ke(ye.prototype, function (e, t) {
                            var n = he[t];
                            if (n) {
                                var r = n.name + "";
                                (oe[r] || (oe[r] = [])).push({
                                    name: t,
                                    func: n
                                })
                            }
                        }), oe[vn(na, 2).name] = [{
                            name: "wrapper",
                            func: na
                        }], ye.prototype.clone = function () {
                            var e = new ye(this.__wrapped__);
                            return e.__actions__ = rn(this.__actions__), e.__dir__ = this.__dir__, e.__filtered__ = this.__filtered__, e.__iteratees__ = rn(this.__iteratees__), e.__takeCount__ = this.__takeCount__, e.__views__ = rn(this.__views__), e
                        }, ye.prototype.reverse = function () {
                            if (this.__filtered__) {
                                var e = new ye(this);
                                e.__dir__ = -1, e.__filtered__ = !0
                            } else (e = this.clone()).__dir__ *= -1;
                            return e
                        }, ye.prototype.value = function () {
                            var e = this.__wrapped__.value(),
                                t = this.__dir__,
                                n = Ci(e),
                                r = t < 0,
                                i = n ? e.length : 0,
                                o = function (e, t, n) {
                                    for (var r = -1, i = n.length; ++r < i;) {
                                        var o = n[r],
                                            a = o.size;
                                        switch (o.type) {
                                            case "drop":
                                                e += a;
                                                break;
                                            case "dropRight":
                                                t -= a;
                                                break;
                                            case "take":
                                                t = J(t, e + a);
                                                break;
                                            case "takeRight":
                                                e = Y(e, t - a)
                                        }
                                    }
                                    return {
                                        start: e,
                                        end: t
                                    }
                                }(0, i, this.__views__),
                                a = o.start,
                                s = o.end,
                                c = s - a,
                                l = r ? s : a - 1,
                                d = this.__iteratees__,
                                u = d.length,
                                p = 0,
                                f = J(c, this.__takeCount__);
                            if (!n || !r && i == c && f == c) return Ft(e, this.__actions__);
                            var h = [];
                            e: for (; c-- && p < f;) {
                                for (var v = -1, g = e[l += t]; ++v < u;) {
                                    var m = d[v],
                                        y = m.iteratee,
                                        b = m.type,
                                        C = y(g);
                                    if (2 == b) g = C;
                                    else if (!C) {
                                        if (1 == b) continue e;
                                        break e
                                    }
                                }
                                h[p++] = g
                            }
                            return h
                        }, he.prototype.at = zr, he.prototype.chain = function () {
                            return Fr(this)
                        }, he.prototype.commit = function () {
                            return new me(this.value(), this.__chain__)
                        }, he.prototype.next = function () {
                            this.__values__ === na && (this.__values__ = Fi(this.value()));
                            var e = this.__index__ >= this.__values__.length;
                            return {
                                done: e,
                                value: e ? na : this.__values__[this.__index__++]
                            }
                        }, he.prototype.plant = function (e) {
                            for (var t, n = this; n instanceof ge;) {
                                var r = vr(n);
                                r.__index__ = 0, r.__values__ = na, t ? i.__wrapped__ = r : t = r;
                                var i = r;
                                n = n.__wrapped__
                            }
                            return i.__wrapped__ = e, t
                        }, he.prototype.reverse = function () {
                            var e = this.__wrapped__;
                            if (e instanceof ye) {
                                var t = e;
                                return this.__actions__.length && (t = new ye(this)), (t = t.reverse()).__actions__.push({
                                    func: Hr,
                                    args: [Lr],
                                    thisArg: na
                                }), new me(t, this.__chain__)
                            }
                            return this.thru(Lr)
                        }, he.prototype.toJSON = he.prototype.valueOf = he.prototype.value = function () {
                            return Ft(this.__wrapped__, this.__actions__)
                        }, he.prototype.first = he.prototype.head, O && (he.prototype[O] = function () {
                            return this
                        }), he
                    }();
                    A ? ((A.exports = Cc)._ = Cc, N._ = Cc) : Is._ = Cc
                }).call(this)
            }).call(this, "undefined" != typeof global ? global : "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
        }, {}],
        29: [function (e, n, t) {
            ! function (e, t) {
                "use strict";
                "object" == typeof n && n.exports ? n.exports = t() : e.log = t()
            }(this, function () {
                "use strict";
                var i = function () { },
                    c = "undefined",
                    l = ["trace", "debug", "info", "warn", "error"];

                function o(t, e) {
                    var n = t[e];
                    if ("function" == typeof n.bind) return n.bind(t);
                    try {
                        return Function.prototype.bind.call(n, t)
                    } catch (e) {
                        return function () {
                            return Function.prototype.apply.apply(n, [t, arguments])
                        }
                    }
                }

                function d(e, t) {
                    for (var n = 0; n < l.length; n++) {
                        var r = l[n];
                        this[r] = n < e ? i : this.methodFactory(r, e, t)
                    }
                    this.log = this.debug
                }

                function u(e, t, n) {
                    return "debug" === (r = e) && (r = "log"), typeof console !== c && (void 0 !== console[r] ? o(console, r) : void 0 !== console.log ? o(console, "log") : i) || function (e, t, n) {
                        return function () {
                            typeof console !== c && (d.call(this, t, n), this[e].apply(this, arguments))
                        }
                    }.apply(this, arguments);
                    var r
                }

                function n(n, e, t) {
                    var r, i = this,
                        o = "loglevel";

                    function a() {
                        var e;
                        if (typeof window !== c) {
                            try {
                                e = window.localStorage[o]
                            } catch (e) { }
                            if (typeof e === c) try {
                                var t = window.document.cookie,
                                    n = t.indexOf(encodeURIComponent(o) + "="); - 1 !== n && (e = /^([^;]+)/.exec(t.slice(n))[1])
                            } catch (e) { }
                            return void 0 === i.levels[e] && (e = void 0), e
                        }
                    }
                    n && (o += ":" + n), i.name = n, i.levels = {
                        TRACE: 0,
                        DEBUG: 1,
                        INFO: 2,
                        WARN: 3,
                        ERROR: 4,
                        SILENT: 5
                    }, i.methodFactory = t || u, i.getLevel = function () {
                        return r
                    }, i.setLevel = function (e, t) {
                        if ("string" == typeof e && void 0 !== i.levels[e.toUpperCase()] && (e = i.levels[e.toUpperCase()]), !("number" == typeof e && 0 <= e && e <= i.levels.SILENT)) throw "log.setLevel() called with invalid level: " + e;
                        if (r = e, !1 !== t && function (e) {
                            var t = (l[e] || "silent").toUpperCase();
                            if (typeof window !== c) {
                                try {
                                    return window.localStorage[o] = t
                                } catch (e) { }
                                try {
                                    window.document.cookie = encodeURIComponent(o) + "=" + t + ";"
                                } catch (e) { }
                            }
                        }(e), d.call(i, e, n), typeof console === c && e < i.levels.SILENT) return "No console available for logging"
                    }, i.setDefaultLevel = function (e) {
                        a() || i.setLevel(e, !1)
                    }, i.enableAll = function (e) {
                        i.setLevel(i.levels.TRACE, e)
                    }, i.disableAll = function (e) {
                        i.setLevel(i.levels.SILENT, e)
                    };
                    var s = a();
                    null == s && (s = null == e ? "WARN" : e), i.setLevel(s, !1)
                }
                var r = new n,
                    a = {};
                r.getLogger = function (e) {
                    if ("string" != typeof e || "" === e) throw new TypeError("You must supply a name when creating a logger.");
                    var t = a[e];
                    return t || (t = a[e] = new n(e, r.getLevel(), r.methodFactory)), t
                };
                var e = typeof window !== c ? window.log : void 0;
                return r.noConflict = function () {
                    return typeof window !== c && window.log === r && (window.log = e), r
                }, r.getLoggers = function () {
                    return a
                }, r
            })
        }, {}]
    }, {}, [2])(2)
};
const GreyManager = Grey();
export default GreyManager;
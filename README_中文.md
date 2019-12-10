<h1 align='center'>PlayIN-JS</h1>

<p align="center">PlayIN ADs -The Next Generation Playable ADs Solution</p>

README: [English](https://github.com/playinads/playin-js) | [中文](https://github.com/playinads/playin-js/blob/master/README_中文.md)


## 使用方法：


### 1. 引入PlayIN-JS SDK

PlayIN-JS SDK 可以直接在通过html script标签里面嵌入

```html
<script src="https://playin.tech/static/js/playin.js"></script>
```

也可以使用npm

```
npm install playin-js --save
```

```javascript
import playin from "playin";
```

### 2. 使用PlayIN-JS SDK

如果使用html中嵌入js sdk，那么将获得全局的playin实例，或者通过npm引入playin的实例。

html里面需要一个div作为挂载点来承载视频输出。比如：

```html
<div id="playinbox"></div>
```

然后调用playin.init来初始化，支持下列方法和属性：

- `target_id` 视频挂载点
- `ad_id` 试玩的广告id
- `options` 试玩的配置，具体参考下面


options 支持下列方法和属性：

- `playReady()` 试玩准备好的回调
- `playError(err: String)` 试玩出错的回调
- `playEnd()` 试玩结束的回调
- `install()` 用户点击安装的回调
- `minDuration: Number` 用户最短试玩时间，单位秒，默认`30`
- `closebtn: bool` 显示内置的关闭倒计时，默认`false`
- `download_modal: bool` 显示内置的应用信息模态框，默认`false`

---

## 示例：

index.html:

```html
<html>
<head>
</head>
<body>
    <div id="playinbox"></div>
    <script src="dist/main.js"></script>
</body>
</html>
```

src/main.js:

```javascript
import playin from "playin";


function playReady() {
  console.log('ready')
}
function playError(error) {
  console.log("error: " + error)
}
function playEnd() {
  console.log("end.")
}
function install() {
  console.log("install")
}

playin.init(
  "#playinbox", 
  "ad_id", 
  {
    playReady, playError, playEnd, install, minDuration: 25, closebtn:false, download_modal: false
  }
)
```

---

## License

```
The MIT License (MIT)

Copyright (c) 2019 playin

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
<h1 align='center'>PlayIN-JS</h1>

<p align="center">PlayIN ADs -The Next Generation Playable ADs Solution</p>

README: [English](https://github.com/playinads/playin-js) | [中文](https://github.com/playinads/playin-js/blob/master/README_中文.md)


## Usage:

### 1. Import PlayIN-JS SDK

PlayIN-JS SDK can be imported by an html script tag

```html
<script src="https://playin.tech/static/js/playin.js"></script>
```

Or by using npm

```
npm install playin-js --save
```

```javascript
import playin from "playin";
```

### 2. Use PlayIN-JS SDK

If you import sdk by script tag, then you get a global playin instance, or imported playin by npm.

It needs a div element to mount video output. For example:

```html
<div id="playinbox"></div>
```

Then call playin.init to initiate, it supports following methods and properties:

- `target_id` video output mounting point
- `ad_id` playin advertising identifier
- `options` playin sdk options， see more info as below

`options` supports following methods and properties:

- `playReady()` playin ready callback
- `playError(err: String)` playin error callback
- `playEnd()` playin end callback
- `install()` user click to install callback
- `minDuration: Number` user minimum playing time, in seconds, default `30`
- `closebtn: bool` show internal close timer, default `false`
- `download_modal: bool` show internal app modal, default `false`

---

## Example:

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
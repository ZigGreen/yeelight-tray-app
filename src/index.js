const { ipcRenderer, remote } = require('electron');
const vuecolor = require('vue-color/dist/vue-color');
const path = require('path');
const mainProcess = remote.require('./main');
const Vue = require('vue/dist/vue.min');
const throttle = require('lodash.throttle');

function parseRGB(rgb) {
    const r = rgb.slice(1,3)
    const g = rgb.slice(3,5)
    const b = rgb.slice(5,7)
    return [r,g,b].map(x => parseInt(x, 16));
}
/*
Alpha
:
Object
Checkboard
:
Object
Chrome
:
Object
ColorMixin
:
Object
Compact
:
Object
EditableInput
:
Object
Grayscale
:
Object
Hue
:
Object
Material
:
Object
Photoshop
:
Object
Saturation
:
Object
Sketch
:
Object
Slider
:
Object
Swatches
:
Object
 */

console.log(vuecolor);

var i = true;
document.addEventListener('DOMContentLoaded', () => {

    const vueApp = new Vue({
        el: '#app',
        components: {
            'slider': vuecolor.Slider
        },
        methods: {
            exit() {
                mainProcess.exit();
            },
            toggle() {
                i = !i;
                mainProcess.setPower(i);
            },
            brightness(e) {
                mainProcess.setBrightness(Number(e.target.value));
            },
            color: throttle(e => {
                mainProcess.color(parseRGB(e.hex));
            }, 1000)
        },
        data: {
            colors: '#194d33'
        }
    });
});

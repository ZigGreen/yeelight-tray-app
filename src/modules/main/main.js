const { app, BrowserWindow, ipcMain, Tray, dialog, remote } = require('electron');
const path = require('path');
const fixPath = require('fix-path');

fixPath();

const assetsDirectory = path.join(__dirname, '../../../assets');

let tray = undefined;
let window = undefined;

// Don't show the app in the doc
app.dock.hide();

app.on('ready', () => {
    createTray();
    createWindow();
});

// Quit the app when the window is closed
app.on('window-all-closed', () => {
    app.quit()
});

const createTray = () => {
    tray = new Tray(path.join(assetsDirectory, 'atom-shape.png'));
    tray.on('right-click', () => {
        toggleWindow();
    });
    tray.on('double-click', toggleWindow);
    tray.on('click', function (event) {
        toggleWindow();
        // Show devtools when command clicked
        if (window.isVisible() && process.defaultApp && event.shiftKey) {
            window.openDevTools({ mode: 'detach' })
        }
    })
};

const getWindowPosition = () => {
    const windowBounds = window.getBounds();
    const trayBounds = tray.getBounds();

    // Center window horizontally below the tray icon
    const x = Math.round(trayBounds.x + (trayBounds.width / 2) - (windowBounds.width / 2));

    // Position window 4 pixels vertically below the tray icon
    const y = Math.round(trayBounds.y + trayBounds.height + 4);

    return { x: x, y: y };
};

const createWindow = () => {
    window = new BrowserWindow({
        width: 440,
        height: 130,
        show: false,
        frame: false,
        fullscreenable: false,
        resizable: false,
        transparent: true,
        webPreferences: {
            // Prevents renderer process code from not running when window is
            // hidden
            backgroundThrottling: false
        }
    });
    window.loadURL(`file://${path.join(__dirname, '../../index.html')}`);

    window.on('blur', () => {
        if (!window.webContents.isDevToolsOpened()) {
            window.hide()
        }
    })
};

const toggleWindow = () => {
    if (window.isVisible()) {
        window.hide()
    } else {
        showWindow()
    }
};
console.log(process.version);
const showWindow = () => {
    const position = getWindowPosition();
    window.setPosition(position.x, position.y, false);
    window.setVisibleOnAllWorkspaces(true);
    window.show();
    window.focus();
    window.setVisibleOnAllWorkspaces(true);
};


var Yeelight = require('node-yeelight');
var y = new Yeelight;

y.on('ready', function() {
    y.discover();
});

y.on('deviceadded', function(device) {
    y.connect(device);
});

y.on('deviceconnected', function(device) {
    console.log('device connected');
});

y.listen();


exports.setPower = state => {
    y.devices.forEach(device => {
        y.setPower(device, state, 10);
    })
};
exports.setBrightness = state => {
    y.devices.forEach(device => {
        console.log(state);
        y.setBrightness(device, state, 10);
    })
};
exports.color = state => {
    y.devices.forEach(device => {
        console.log(state);
        y.setRGB(device, state, 10);
    });
    console.log(state);
};
exports.exit = () => {
    app.quit();
};

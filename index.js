var Yeelight = require('node-yeelight');
var y = new Yeelight;

y.on('ready', function() {
    console.log('ready');
    y.discover();
});

y.on('deviceadded', function(device) {
    console.log('device added');

    y.connect(device);
});

y.on('deviceconnected', function(device) {
    console.log('device connected');

    var state = true;
    setInterval(function() {
        y.setPower(device, state, 10);

        state = state ? false : true;
    }, 1000);
});

y.listen();

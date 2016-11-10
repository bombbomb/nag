var logs = require('node-elk-logger'),
    request = require('request');

logs.configure({
    host: 'publogging.bombbomb.com:9200',
    elasticSearchIndexPrefix: 'nag',
    messageDecorations: {environment: process.env.ENVIRONMENT},
    level: process.env.LOGGING_LEVEL,
    logToConsole: (process.env.ENVIRONMENT != 'Production')
});

var tasks = [
    {name: 'google', url: 'https://google.com', frequency: 1, active: true},
    {name: 'yahoo', url: 'https://yahoo.com', frequency: 5, active: true},
];

var runners = {};

var runTask = function(task) {
    logs.log(task.name + " asked for  " + task.url);
    request(task.url, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            logs.log(task.name + " got " + body.length + 'bytes or something');
        }
    })

};

for (var i=0;i<tasks.length;i++) {

    (function(t) {
        runners[t.name] = setInterval(function() {
            runTask(t);
        }, t.frequency*1000);
    })(tasks[i]);
}
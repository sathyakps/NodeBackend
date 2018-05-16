var express = require('express');
var path = require('path');
var app = express();
app.use(express.static(path.join(__dirname,'dist/index.html')));
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname,'dist/v4Hackers/index.html'));
})

app.listen(4100, console.log('Angular hosted in 4100'));
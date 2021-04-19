const express = require('express');
const app = express();

const webserver = app.listen(5003, '127.0.0.1', function () {
    console.log('Node web server loaded and listening');
});

var scraper = require('table-scraper');

var data;
var total_km=0;
var total_participants=0;

async function scrap() {
    return scraper
  .get('https://prod.chronorace.be/VirtualChallenge/1000Bornes/SoutienClub.aspx?chal=38&eventId=1188112508252308&lng=FR&c=1412&hash=aCt7iuoOkoFJSknX6CP8f2NhIFQ')
  .then(function(tableData) {
      console.log(tableData);
    total_km=0;
    total_participants=0;
    data = tableData[0];
    data.shift();
    console.log(total_km);
    data.forEach(people => {
        people["4"] = people["4"].slice(0, -2);
        total_km = total_km + (people["4"]=='' ? 0.0 : parseFloat(people["4"]));
        total_participants = total_participants + (people["3"]=='' ? 0 : 1);
    });
    console.log(total_km);
    console.log(total_participants);
    console.log("Scrapped");
  })
  .catch(function (error) {
      console.log(error);
  });
}

scrap();
setInterval(scrap, 300000);


app.get('/data-jmbpmc-lra', function (req, res) {
    var dataToSend = {data : data};
    res.send(dataToSend);
});

app.get('/data-total-km-lra', function (req, res) {
    var dataToSend = {total_km : total_km};
    res.send(dataToSend);
});

app.get('/data-total-participants-lra', function (req, res) {
    var dataToSend = {total_participants : total_participants};
    res.send(dataToSend);
});

app.use(express.static('public'));
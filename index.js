const dotenv = require('dotenv');
const express = require('express');
const https = require('https');

dotenv.config();

const app = express();

app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
	res.sendFile(__dirname + '/index.html');
});

app.post('/', (req, res) => {
	const query = req.body.cityName;

	const unit = 'metric';
	const url = `https://api.openweathermap.org/data/2.5/weather?q=${query}&appid=${process.env.API}&units=${unit}`;

	https.get(url, (response) => {
		response.on('data', (data) => {
			const weatherData = JSON.parse(data);

			const temp = weatherData.main?.temp;
			const description = weatherData.weather[0].description;
			const icon = weatherData.weather[0].icon;
			const imageUrl = `http://openweathermap.org/img/wn/${icon}@2x.png`;

			res.write(`<p>the description is ${description}</p>`);
			res.write(
				`<h1>The temperature is actually on ${query} ${temp}</h1>`
			);
			res.write(`<img src=${imageUrl}>`);
			res.send();
		});
	});
});

app.listen('3000', () => console.log('port work'));

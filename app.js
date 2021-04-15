let req = new XMLHttpRequest();
let req1 = new XMLHttpRequest();

let string = "";
let string1 = "";

let minute = String(new Date()).substring(19, 21);
function fToC(fahrenheit) {
  		let fTemp = fahrenheit;
  		let fToCel = (fTemp - 32) * 5 / 9;
  		let temp = Math.round(fToCel) + '\xB0C';
    return temp;
}
window.onload = function() {
	findLocation();
}
function findLocation() {
    navigator.geolocation.getCurrentPosition(showPosition);
}
function showPosition(position) {
    let lat = parseFloat(position.coords.latitude).toFixed(3)
    let long = parseFloat(position.coords.longitude).toFixed(3)
    let urlLoc = "https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=%092TZ34TvME35eADyjYSl60hsTGBk8lGr0&q="+ lat +"%2C%20"+ long +"";
  
	// start of location request
	req.open('GET', urlLoc, true);
	req.onload = function(){
	if(this.status === 200){
		let data = JSON.parse(this.responseText);
		console.log(data);
		document.getElementById('lokacija').insertAdjacentHTML('afterbegin', data.EnglishName);
			let url12hour = "https://dataservice.accuweather.com/forecasts/v1/hourly/12hour/"+ data.Key +"?apikey=2TZ34TvME35eADyjYSl60hsTGBk8lGr0";
			
			// start 12 hours of request
			req1.open('GET', url12hour, true);
			req1.onload = function(){
			if(this.status === 200){
				let data1 = JSON.parse(this.responseText);
				console.log(data1);
				for ( let i = 0; i < data1.length; i++ ) {
					let data = data1[i];
					string1 += "<div class='swiper-slide'>";
					string1 += "<div class='h-box'>";
					string1 += "<p>"+ data.DateTime.substring(11,16) +"</p>";
					string1 += "<img src='https://developer.accuweather.com/sites/default/files/"+ ('0' + data.WeatherIcon).slice(-2) +"-s.png'/>";
					string1 += "<p>"+ fToC(data.Temperature.Value) +"</p>";
					string1 += "</div>";
					string1 += "</div>";
					document.getElementById('sweeper').innerHTML = string1;
				}

						if (data1[0].IsDaylight == true) {
						document.getElementsByClassName('cover')[0].classList.add('day');
						} else {
						document.getElementsByClassName('cover')[0].classList.add('night');
						}
			

				document.getElementsByClassName('temp')[0].insertAdjacentHTML('afterbegin', '<h3>'+ fToC(data1[0].Temperature.Value) +'</h3><h4>'+ data1[0].IconPhrase +'</h4>');
				document.getElementById('temp-minmax').insertAdjacentHTML('afterend', '<div class="upd"><div class="update"><p>Updated '+ minute +' minutes ago</p><p>AccuWeather</p></div></div>');
				let mySwiper = new Swiper ('.swiper-container', {
    				slidesPerView: 6
					})
				}
			}
		req1.send();
		// end of 12 hours of request
			}
		}
	req.send();
// end of location request
}

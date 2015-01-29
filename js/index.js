function getTemp() {
    $.getJSON("https://api.forecast.io/forecast/b256c7265d34624d74461320aa5211c7/35.300399,-120.662362?callback=?", 
        function(data) {
            $("#forecastLabel").html(data.daily.summary);
            $("#forecastIcon").attr("src", "img/" + data.currently.icon + ".png"); 
            //console.log(data.daily.data[0].temperatureMax)
            $("body").addClass(getClassNameForTemperature(data.daily.data[0].temperatureMax));
        })
}

function getGeolocation() {
    navigator.geolocation.getCurrentPosition(function(pos) {
        console.log(pos);
    })
}

function getClassNameForTemperature(temp) {
    // Lord, please forgive me for this transgression.
    if (temp >= 90) {
        return "hot"
    }
    else if (temp >= 80) {
        return "warm"
    }
    else if (temp >= 70) {
        return "nice"
    }
    else if (temp >= 60) {
        return "chilly"
    }
    return "cold"
}

window.addEventListener("load", getTemp)
window.addEventListener("load", getGeolocation)
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

function showAlarmPopup() {
    $('#mask').removeClass('hide')
    $('#popup').removeClass('hide')
    console.log('showAlarmPopup')
}

function hideAlarmPopup() {
    $('#mask').addClass('hide')
    $('#popup').addClass('hide')
    console.log('hideAlarmPopup') 
}

function insertAlarm(hours, mins, ampm, alarmName) {
    console.log(hours + ":" + mins + ":" + ampm + " " + alarmName)
    var new_div = $("<div>")
    new_div.addClass('flexable')

    var name_div = $("<div>")
    name_div.addClass('name')
    name_div.html($("#alarmName").val())
    new_div.append(name_div)

    var time_div = $("<div>")
    time_div.addClass('time')
    time_div.html(hours + ":" + mins + " " + ampm)
    new_div.append(time_div)

    $('#alarms').append(new_div)
}

function addAlarm() {
    var hours = $("#hours option:selected").text()
    var mins = $("#mins option:selected").text()
    var ampm = $("#ampm option:selected").text()
    var alarmName = $("#alarmName").val()
    insertAlarm(hours, mins, ampm, alarmName)
}

window.addEventListener("load", getTemp)
window.addEventListener("load", getGeolocation)
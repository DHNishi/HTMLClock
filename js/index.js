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

function insertAlarm(hours, mins, ampm, alarmName, parseObject) {
    console.log(hours + ":" + mins + ":" + ampm + " " + alarmName)
    var new_div = $("<div>")
    new_div.addClass('flexable')
    new_div.attr('id', parseObject.id)

    var name_div = $("<div>")
    name_div.addClass('name')
    name_div.html(alarmName)
    new_div.append(name_div)

    var time_div = $("<div>")
    time_div.addClass('time')
    time_div.html(hours + ":" + mins + " " + ampm)
    new_div.append(time_div)

    var delete_button = $("<input type='button'>")
    delete_button.addClass('button')
    delete_button.addClass('deleteButton')
    delete_button.click(deleteAlarm(parseObject))
    delete_button.val('Delete')
    new_div.append(delete_button)

    $('#alarms').append(new_div)
}

function addAlarm() {
    var hours = $("#hours option:selected").text()
    var mins = $("#mins option:selected").text()
    var ampm = $("#ampm option:selected").text()
    var alarmName = $("#alarmName").val()

    var time = hours + ":" + mins + " " + ampm
    var timeObj = {hours: hours, mins: mins, ampm: ampm}
    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
    alarmObject.save({"time": timeObj,"alarmName": alarmName}, {
      success: function(object) {
        insertAlarm(hours, mins, ampm, alarmName, alarmObject)
        hideAlarmPopup(); 
      }
    });

}

function getAllAlarms() {
    Parse.initialize("h9V0LNEiBKG9vIQUAiupYLcfvtV5brkCcTjnmL0J", "4RIa6mfefrJw0lJHErokreuWTz3vxzBCN03n2Zx7");
    var AlarmObject = Parse.Object.extend("Alarm");
    var query = new Parse.Query(AlarmObject);
    query.find({
        success: function(results) {
          for (var i = 0; i < results.length; i++) { 
            time = results[i].get("time")
            insertAlarm(time.hours, time.mins, time.ampm, results[i].get("alarmName"), results[i]);
          }
        }
    });
}

function deleteAlarm(parseObject) {
    // Holla holla, get closures.
    return function () {
        parseObject.destroy({
          success: function(myObject) {
            // The object was deleted from the Parse Cloud
            console.log("deleting ", parseObject.id)      
            console.log ("deleted successfully")
            $('#' + parseObject.id).remove()
          },
          error: function(myObject, error) {
            console.log(error)
            // The delete failed.
            // error is a Parse.Error with an error code and message.
          }
        });
    }
}

window.addEventListener("load", getTemp)
window.addEventListener("load", getGeolocation)
window.addEventListener("load", getAllAlarms)
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

function addAlarm(userId) {
    var hours = $("#hours option:selected").text()
    var mins = $("#mins option:selected").text()
    var ampm = $("#ampm option:selected").text()
    var alarmName = $("#alarmName").val()

    var time = hours + ":" + mins + " " + ampm
    console.log("Really adding " + userId)
    console.log("userId", userId)
    var timeObj = {hours: hours, mins: mins, ampm: ampm, userId:userId}
    var AlarmObject = Parse.Object.extend("Alarm");
    var alarmObject = new AlarmObject();
    alarmObject.save({"time": timeObj, "userId": userId, "alarmName": alarmName}, {
      success: function(object) {
        _gaq.push(["_trackEvent", "Alarm", "Add"]);
        insertAlarm(hours, mins, ampm, alarmName, alarmObject)
        hideAlarmPopup(); 
      }
    });

}

function makeAddAlarm(userId) {
    return (function() {
        addAlarm(userId);
    })
}

function getAllAlarms(userId) {
    Parse.initialize("h9V0LNEiBKG9vIQUAiupYLcfvtV5brkCcTjnmL0J", "4RIa6mfefrJw0lJHErokreuWTz3vxzBCN03n2Zx7");
    var AlarmObject = Parse.Object.extend("Alarm");
    console.log("Only get the ", userId)
    var query = new Parse.Query(AlarmObject).containedIn('userId', [userId]);
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
            _gaq.push(["_trackEvent", "Alarm", "Delete"]);

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

 function render() {

   // Additional params including the callback, the rest of the params will
   // come from the page-level configuration.
   console.log("YEAH")
   var additionalParams = {
     'callback': signinCallback
   };

   // Attach a click listener to a button to trigger the flow.
   var signinButton = document.getElementById('signinButton');
   signinButton.addEventListener('click', function() {
     console.log("Hello World")
     gapi.auth.signIn(additionalParams); // Will use page level configuration
   });
 }

function signinCallback(authResult) {
  if (authResult['status']['signed_in']) {
    // Update the app to reflect a signed in user
    // Hide the sign-in button now that the user is authorized, for example:
    gapi.client.load('plus','v1').then(function() {
        if (authResult['status']['method'] == 'PROMPT') {
            var request = gapi.client.plus.people.get({
              'userId' : 'me'
            });

            request.execute(function(resp) {
              $('#my_clock').html(resp.displayName + "'s Clock")
              console.log('ID: ' + resp.id);
              console.log('Display Name: ' + resp.displayName);
              console.log('Image URL: ' + resp.image.url);
              console.log('Profile URL: ' + resp.url);

              getAllAlarms(resp.id);
              $('.alarmAdder').click(makeAddAlarm(resp.id))
              document.getElementById('signinButton').setAttribute('style', 'display: none');
              document.getElementById('alarmContainer').setAttribute('style', 'display: block');
            });
        }
    })
  } else {
    // Update the app to reflect a signed out user
    // Possible error values:
    //   "user_signed_out" - User is signed-out
    //   "access_denied" - User denied access to your app
    //   "immediate_failed" - Could not automatically log in the user
    console.log('Sign-in state: ' + authResult['error']);
  }
}

window.addEventListener("load", getTemp)
window.addEventListener("load", getGeolocation)
//window.addEventListener("load", getAllAlarms)
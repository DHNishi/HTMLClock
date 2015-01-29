function getTime() {
    var myDate = new Date();
    var timeString = myDate.toString();
    // Ghetto substringing to get the time formatted properly.
    // I make no guarantees that this stands up to localization.
    timeString = timeString.substring(timeString.indexOf(":") - 2);
    timeString = timeString.substring(0, timeString.lastIndexOf(":") + 3);
    document.getElementById("my_time").innerHTML = timeString;
    setTimeout(getTime, 1000);
}

// Test.

//window.onload = getTime;
window.addEventListener("load", getTime)

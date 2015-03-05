function redirect_init() {
    // First, parse the query string
    var params = {}, queryString = location.hash.substring(1),
        regex = /([^&=]+)=([^&]*)/g, m;
    while (m = regex.exec(queryString)) {
      params[decodeURIComponent(m[1])] = decodeURIComponent(m[2]);
    }

    console.log(params)
    localStorage.setItem('accessToken', params['access_token']);

    if (params['error']){ 
        console.log(params['error'])
    }
    else {
        window.opener.callback_function()
    }

    window.close()
}

/*Lookup the hash fragment, get and store the access token into the browser’s local storage.
Then invoke the original callback function.
Finally, close the current popup window.
On failure, log the error and still close the current popup window.
*/
var evernotemodule = angular.module('leder.evernoteService', [])

evernotemodule.service('Evernote', function() {
    //todo write a function that says, if authtoken exists, initiliaze notestore, etc.


    //these will change once app is deployed
	var evernoteHostName = 'https://sandbox.evernote.com';
	var internalCallback = 'http://localhost:8100/#/app/oauth';

    var success = function(data) {
        var isCallBackConfirmed = false;
        var token = '';
        var vars = data.text.split("&");
        
        for (var i = 0; i < vars.length; i++) {
            var y = vars[i].split('=');	
            if(y[0] === 'oauth_token')  {
                token = y[1];
            }
            else if(y[0] === 'oauth_token_secret') {
                this.oauth_token_secret = y[1];
                localStorage.setItem("oauth_token_secret", y[1]);
            }
            else if(y[0] === 'oauth_callback_confirmed') {
                isCallBackConfirmed = true;
            }
        }
        var ref;
        if(isCallBackConfirmed) {

            // step 2
            //call evernote, pass in oauth token
            ref = window.open(evernoteHostName + '/OAuth.action?oauth_token=' + token, '_blank');

            ref.addEventListener('loadstart',
                function(event) {
                    var loc = event.url;
                    
                    // if we have been redirected back to our own callback url
					if (loc.indexOf(internalCallback) >= 0) {
                       	var index, verifier = '';
                        var got_oauth = '';
                        var params = loc.substr(loc.indexOf('?') + 1);
                        params = params.split('&');
                        
                        //parse params to get oauth verifier and oauth token
                        for (var i = 0; i < params.length; i++) {
                            var y = params[i].split('=');
                            if(y[0] === 'oauth_verifier') {
                                verifier = y[1];
                            } else if(y[0] === 'oauth_token') {
		                        got_oauth = y[1];
		                    }
                        }

	                    // step 3
	                    oauth.setVerifier(verifier);
	                    oauth.setAccessToken([got_oauth, localStorage.getItem("oauth_token_secret")]);
	 
	                    var getData = {'oauth_verifier':verifier};
	                    ref.close();

	                    // now make the final request to evernote to get the access token
	                    oauth.request({'method': 'GET', 'url': evernoteHostName + '/oauth',
	                        'success': success, 'failure': failure});
	 
                	}
                }
            );
        } else {

            // Step 4 : Get the final token
			var getQueryParams = function(queryParams) {
				var i, query_array,
			    query_array_length, key_value, decode = OAuth.urlDecode,querystring = {};
			    // split string on '&'
			    query_array = queryParams.split('&');
			    // iterate over each of the array items
			    for (i = 0, query_array_length = query_array.length; i < query_array_length; i++) {
			        // split on '=' to get key, value
			        key_value = query_array[i].split('=');
			        if (key_value[0] != "") {
			            querystring[key_value[0]] = decode(key_value[1]);
			        }
			    }
			    return querystring;
			}

	         var querystring = getQueryParams(data.text);
	         var noteStoreURL = querystring.edam_noteStoreUrl;
	         var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
	         var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
	         var noteStore = new NoteStoreClient(noteStoreProtocol);
	         var authTokenEvernote = querystring.oauth_token; 


             // authtokenevernote = S=s1:U=90553:E=155a472a89b:C=14e4cc17a28:P=185:A=ssktanaka-8134:V=2:H=49da0dfacc9a2491eec0c0c3b69c2f38

             localStorage.setItem("authTokenEvernote", authTokenEvernote);

             //list notebooks
	         noteStore.listNotebooks(authTokenEvernote, function (notebooks) {
                 console.log('success!')
                 console.log(notebooks);
             },
         	    function onerror(error) {
         	    console.log('errror :(')
        	     console.log(error);
             });

            // Here, we connect to the Evernote Cloud API and get a list of all of the
            // notebooks in the authenticated user's account:

   //          var noteStoreTransport = new Thrift.BinaryHttpTransport("noteStoreURL");
   //          var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
   //          var noteStore = new NoteStoreClient(noteStoreProtocol);

	  //       noteStore.listNotebooks(authTokenEvernote, function (notebooks) {
   //              console.log('success!! : ');
   //              console.log(notebooks);
			
			// }, function onerror(error) {
   //              console.log('error:')
   //              console.log(error);         		
	  //       });        

        }; 
    };
    
    var failure = function(error) {
        console.log('error ' + error.text);
    };



	return {	

      getAuthToken: function() {
        return localStorage.getItem("authTokenEvernote");
      },  

      getAuthTokenTESTING: function() {
        var authToken = "S=s1:U=90553:E=155a48b6862:C=14e4cda3a18:P=185:A=ssktanaka-8134:V=2:H=5764ef25dfbf6f3ee15636e48512c685";
        return authToken; 
      },

	  loginWithEvernote: function() {
	    options = {
	        consumerKey: "ssktanaka-8134",
	        consumerSecret: "ccd528cbed56377d",
	        callbackUrl : "http://localhost:8100/#/app/oauth", // this filename doesn't matter in this example. eventually redirect to correct part in app
	        signatureMethod : "HMAC-SHA1",
	    };
	    oauth = OAuth(options);
	    
	    // OAuth Step 1: Get temporaryrequest token
	    oauth.request({'method': 'GET', 'url': 'https://sandbox.evernote.com' + '/oauth', 'success': success, 'failure': failure});
	  }

    };
});

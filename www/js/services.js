
var ledermodule = angular.module('leder.services', [])

ledermodule.service('Notes', function() {
  // Might use a resource here that returns a JSON array

  // Some fake testing data notes[1].title
  var notes = [
	    { title: 'Maya Angelou', id: 1, sources: 
    	[
		    {
		        "age": 0, 
		        "id": "benhoen", 
		        "name": "Ben Hoen", 
		        "snippet": "What exactly are solar photovoltaic (PV) systems? PV energy systems are colelctors that one can put on the roof to convert the sun’s energy to electricity. Those panels can be installed nthe roof of the home or installed next to the house and allow the homeowner to generate energy form the sun and potentially offset their electricity bill. There are two main parts to a PV system. One is the panels. Those convert solar energy to electricity. They do so in direct current. What is used in your homw is alternating current. Then there’s an inverter. That takes the current and changes it so it can be synced up with the energy that the house uses. With those two parts, you can use the energy that comes off the roof in your panels. How do they work?  Often times there’s something called a net meter arrangement. Let’s think of two scenarios – if it’s night and you have no electricity, then the meter isn’t being used. In that case, what happens to that net meter is it spins the other direction. Electricity is going back from your house ot the power lines. The power company looks at the electricity meter and says in this period of itme, you’ve used it, and in thise period of time, you’ve produced it, so the net use is X. Systems are designed to produce roughly what you’ve used. Your overall use will be zero. Your net use is zero."
		    }, 
		    {
		        "age": 1, 
		        "id": "benjaminleaskou", 
		        "name": "Benjamin Leaskou", 
		        "snippet": "Are they common in your market? Most certainly, out of 365 days a year, 360 of those are sun. It’s very prolific. And we’re a green city. The mayor and city council has gone. There are photovoltaic cells generate a lot of  It’s really big.  I just had a client who I sold a home to in TK vas Palmas, and they just put a system on their house as well and they love it. Most people do. We have so much sun and an abundance of it. We have a lot of sun coming donw. A listing before? Yes, I have. And it helps sell a property, to be quite honest."
		    }, 
		    {
		        "age": 2, 
		        "id": "denisegannalo", 
		        "name": "Denise Gannalo ", 
		        "snippet": "1.  Are they more common? NO, there are not at all. They are very uncommong here. Homeowners in Conn are looking for you’ll find geotrhermal. Tnhe owners of this house were very interested in building an eco-family house. They have systems on the roof. As they were building it, it’s very very forward-thinking in terms of energy reduction. It’s a very tight house. The house is made out of a lot of recycled and organic materials. There’s al ot of vegetable gardens and orchards. It cost her very very little for electricity. It would probably not cost her anything had she not have a heated swimming pool and spa. There is central air in the summer. If you add the heat and pool and AC, the electric bill is very little. Less than $100 per month, which is amazing for this"
		    }, 
		    {
		        "age": 3, 
		        "id": "ettakantor", 
		        "name": "Etta Kantor", 
		        "snippet": "Any other neighbors on your street have it? No. When we first bought the property and decided to build, I thought it would be nice for them to know who owns this place. I found the names and addresses of everyone, and sent them a little box of organic cookies and explained who we are, and that we were building a sustainable home. And I gave them my phione number to call. When we built the house and moved in, we had a neighbor party to get ot know anyone. They were all amazed at the house. There is another LEED-platinum in New Canaan. The photovolatics are right in the front. Eveyrone’s different. When I do house tours, people are amazed. People are interested in the fist place though. There are always some people who think what’s the big deal? But for the most part, people are amazed. Not so much mysurrounding neighborhors.  Some ppl have too many trees on their house."
		    }, 
		    {
		        "age": 4, 
		        "id": "karenbail", 
		        "name": "Karen Bail", 
		        "snippet": "Are they common in your market? They are very common but the utility company is discouraging it some. When you produce, it goes back into the grid and at night, you take from the grid.  They say they run the AC at night. Utilities are so high here. We’re four times the national average. They’re running it at night and still only pay $60 a month. There’s a $25 a month fee. What’s happening right now is teh energy company is worried about the grid. They were supposed to give us up to 20% in the grid, and they stopped that at 10% because they want to make sure that the solar places don’t destablisze the grid."
		    } 
  		]},
	    { title: 'Downtown Crossing', id: 2, sources: [] },
	    { title: 'Penthouses', id: 3, sources: [] },
	    { title: 'Lucky Numbers', id: 4, sources: [] },
	    { title: 'Luxury Auctions', id: 5, sources: [] },
	    { title: 'Grammar', id: 6, sources: [] }
  ];

  return {

	    all: function() {
	      return notes;
	    },

	    getSourcesForProject: function(projectId) {
			var notes = this.all();
			for (var i=0; i<notes.length; i++) {
				if (notes[i].id == projectId) {
					return notes[i].sources;
				}
			}
			return null;
	    },

	   getNoteText: function(noteID) {
	   		//get text of source note
			var notes = this.all();
			for (var i=0; i<notes.length; i++) {
				for (var j=0; j<notes[i].sources.length; j++) {	
					if (notes[i].sources[j].id == noteID) {
						return notes[i].sources[j].snippet;
					}
				}
			}
			return null;
	   },

	};

});

ledermodule.service('Quotes', function() {
  //highlighted words into an array of quote arrays of objects
	var highlightedWords = [];
	var quoteArray = [];

	return {

		getHighlightedWords: function() {
	      	return highlightedWords;
	    },

		getQuoteArray: function() {
	      	return quoteArray;
	    },

	    setHighlightedWords: function(value){
	    	highlightedWords = value;
	    },

	};

});

ledermodule.service('Evernote', function() {

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
            console.log('sending user to the evernote oauth page')
            ref = window.open(evernoteHostName + '/OAuth.action?oauth_token=' + token, '_blank');

            ref.addEventListener('loadstart',
                function(event) {
                    var loc = event.url;
                    
                    console.log('loading url in inAppBrowser:', loc);

                    // if we have been redirected back to our own callback url
					if (loc.indexOf(internalCallback) >= 0) {
						console.log('we have been redirected to our internal cb')

                       	var index, verifier = '';
                        var got_oauth = '';
                        var params = loc.substr(loc.indexOf('?') + 1);
                        params = params.split('&');
                        
                        for (var i = 0; i < params.length; i++) {
                            var y = params[i].split('=');
                            if(y[0] === 'oauth_verifier') {
                                verifier = y[1];
                            } else if(y[0] === 'oauth_token') {
		                        got_oauth = y[1];
		                    }
                        }

	                 	console.log("Step 3");
	                 	console.log('now we have the verifier: ', verifier, 'and oauth_token', got_oauth)
	                    
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
            console.log("Step 4");

   //          var authTokenEvernote = null;
   //          var noteStoreURL = null;

			// var vars = data.text.split("&");
   //      	for (var i = 0; i < vars.length; i++) {
	  //           var y = vars[i].split('=');	
	  //           if(y[0] === 'oauth_token')  {
	  //               authTokenEvernote = decodeURIComponent(y[1]);
	  //           } else if (y[0] === 'edam_noteStoreUrl') {
	  //           	noteStoreURL = decodeURIComponent(y[1]);
	  //           }
			// }

   //          // authTokenEvernote can now be used to send request to the Evernote Cloud API
   //          console.log('full url: ', data.text)
   //          console.log('got access token:', authTokenEvernote)
   //          console.log('got notestore url:', noteStoreURL)


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
	         noteStore.listNotebooks(authTokenEvernote, function (notebooks) {
                 console.log('success!')
                 console.log(notebooks);
             },
         	    function onerror(error) {
         	    console.log('errror :(')
        	     console.log(error);
             });


            // TODO store the authTokenEvernote for this user, so we can use it in the future without
            // going through the whole oauth flow
                    
            // Here, we connect to the Evernote Cloud API and get a list of all of the
            // notebooks in the authenticated user's account:
            var noteStoreTransport = new Thrift.BinaryHttpTransport("noteStoreURL");
            var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
            var noteStore = new NoteStoreClient(noteStoreProtocol);

	        noteStore.listNotebooks(authTokenEvernote, function (notebooks) {
                console.log('success!! : ');
                console.log(notebooks);
			
			}, function onerror(error) {
                console.log('error:')
                console.log(error);         		
	        });        

        }; 
    };
    
    
    var failure = function(error) {
        console.log('error ' + error.text);
    };



	return {	

	  loginWithEvernote: function() {
	  	console.log("Working");
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

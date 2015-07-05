var evernotemodule = angular.module('leder.evernoteService', [])

evernotemodule.service('EvernoteOAuth', function($localstorage, $rootScope, $q, $timeout) {

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

                $localstorage.set('oauth_token_secret', y[1]);
                console.log($localstorage.get('oauth_token_secret'));

                // localStorage.setItem("oauth_token_secret", y[1]);
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

                        oauth.setAccessToken([got_oauth, $localstorage.get('oauth_token_secret')]);

	                    // oauth.setAccessToken([got_oauth, localStorage.getItem("oauth_token_secret")]);
	 
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
            $localstorage.setObject("querystring", querystring);
            console.log("querystring");

            console.log($localstorage.getObject('querystring'));
             // authtokenevernote = S=s1:U=90553:E=155a472a89b:C=14e4cc17a28:P=185:A=ssktanaka-8134:V=2:H=49da0dfacc9a2491eec0c0c3b69c2f38
            //querystring = {"oauth_token":"S=s1:U=90553:E=155b6887ef9:C=14e5ed75070:P=185:A=ssktanaka-8134:V=2:H=b48d8ce04303a3ac9e6086077c142dc3","oauth_token_secret":"","edam_shard":"s1","edam_userId":"591187","edam_expires":"1467646246649","edam_noteStoreUrl":"https://sandbox.evernote.com/shard/s1/notestore","edam_webApiUrlPrefix":"https://sandbox.evernote.com/shard/s1/"}
            var noteStoreURL = querystring.edam_noteStoreUrl;
            var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
            var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
            var noteStore = new NoteStoreClient(noteStoreProtocol);
            var authTokenEvernote = querystring.oauth_token; 

            $localstorage.set("authTokenEvernote", authTokenEvernote);
            console.log($localstorage.get('authTokenEvernote'));

             //list notebooks to test
	        noteStore.listNotebooks($localstorage.get('authTokenEvernote'), function (notebooks) {
                console.log('success!');
                console.log(notebooks);   
            },
         	    function onerror(error) {
         	    console.log('errror :(');
        	   console.log(error);
            });


        }; 
    };
    
    var failure = function(error) {
        console.log('error ' + error.text);
    };


	return {	

      initializeNoteStore: function() {
        //normally, use localstorage to get querystring
        // var querystring = $localstorage.getObject('querystring');
        var querystring = {"oauth_token":"S=s1:U=90553:E=155b6887ef9:C=14e5ed75070:P=185:A=ssktanaka-8134:V=2:H=b48d8ce04303a3ac9e6086077c142dc3","oauth_token_secret":"","edam_shard":"s1","edam_userId":"591187","edam_expires":"1467646246649","edam_noteStoreUrl":"https://sandbox.evernote.com/shard/s1/notestore","edam_webApiUrlPrefix":"https://sandbox.evernote.com/shard/s1/"};
     
        //initializing notestore...
        var noteStoreURL = querystring.edam_noteStoreUrl;
        var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
        var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
        var noteStore = new NoteStoreClient(noteStoreProtocol);

        //save notestore
        this.noteStore = noteStore;

         //normally, use localstorage to get auth token
        var authToken = "S=s1:U=90553:E=155a48b6862:C=14e4cda3a18:P=185:A=ssktanaka-8134:V=2:H=5764ef25dfbf6f3ee15636e48512c685";
        this.authToken = authToken;

      },  

      getAllNotes: function(callback) {
        //save a reference to self
        var self = this;
        //get notebooks, pass callback 
        this.getNotebooks(function(error, notebooks) {

            //get all notebook GUIDS
            var guidsArray = self.getNotebookGUIDS(notebooks);

            //get notemetadata, pass callback
            self.getNoteMetaData(guidsArray, function(error, noteMetadatas){

                //get all note GUIDS
                var noteGuidsArray = self.getNoteGUIDS(noteMetadatas.notes);

                //get all note content in ENML
                self.getNoteContent(noteGuidsArray, function(error, noteContent) {
                    var noteContentAsString = self.getNoteContentAsString(noteContent);
                });
            });
        });
      },

      getNotebooks: function(callback) {
        this.noteStore.listNotebooks(this.authToken, function (notebooks) {
            callback(null, notebooks);
        },
            function onerror(error) {
            console.log('errror :(');
            console.log(error);
            callback(error);
        });

      },

      getNotebookGUIDS: function (notebooksArray){
        var notebookGUIDSarray = [];
        for (i=0; i<notebooksArray.length; i++){
            notebookGUIDSarray.push(notebooksArray[i].guid);
        }
        return notebookGUIDSarray;
      },

      getNoteMetaData: function (notebookGUIDSarray, callback) {
        var filter = new NoteFilter();
        filter.ascending = true;

        var resultSpec = new NotesMetadataResultSpec();
        resultSpec.includeTitle  = true;
        resultSpec.includeContentLength = true;
        resultSpec.includeCreated = true;
        resultSpec.includeNotebookGuid = true;

        for (i=0; i<notebookGUIDSarray.length; i++){
            filter.notebookGuid = notebookGUIDSarray[i]
            this.noteStore.findNotesMetadata(this.authToken, filter, 0, 10, resultSpec, function (noteMetadata) {
                callback(null, noteMetadata);
            },
            function onerror(error) {
                callback(error);
            });    
        };
      },

      getNoteGUIDS: function(notesArray) {
        var noteGUIDarray = [];
        for (i=0; i<notesArray.length; i++){
            noteGUIDarray.push(notesArray[i].guid);
        }
        return noteGUIDarray;
      },

      getNoteContent: function(noteGUIDarray, callback) {
        for (i=0; i<noteGUIDarray.length; i++){
            this.noteStore.getNoteContent(this.authToken, noteGUIDarray[i], function (noteContent) {
                callback(null, noteContent);

            },
            function onerror(error) {
                console.log('Error- ' + JSON.stringify(error));
                callback(error);
            });        

        }
      },

      getNoteContentAsString: function(noteContent){
            console.log(noteContent);
                  // var textArray = [];
                  //   var text = noteContent || '';
                  //   text = text.replace(/(<\/(div|ui|li)>)/ig,"\n");
                  //   text = text.replace(/(<(li)>)/ig," - ");
                  //   text = text.replace(/(<([^>]+)>)/ig,"");
                  //   text = text.replace(/(\r\n|\n|\r)/gm," ");
                  //   text = text.replace(/(\s+)/gm," ");
                  //   console.log(text);
                  //   textArray.push(text);
                  //   console.log(textArray);
                  //   return textArray;

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

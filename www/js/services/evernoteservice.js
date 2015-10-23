var evernotemodule = angular.module('leder.evernoteService', [])

evernotemodule.service('EvernoteOAuth', function($localstorage, $rootScope, $q, $timeout) {
  
	// var evernoteHostName = 'https://sandbox.evernote.com';
  var evernoteHostName = 'https://www.evernote.com';
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
                console.log("GET SECRET TOKEN");
                console.log($localstorage.get('oauth_token_secret'));

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
            console.log("authToken");
            console.log($localstorage.get('authTokenEvernote'));

             //list notebooks to test
	        noteStore.listNotebooks($localstorage.get('authTokenEvernote'), function (notebooks) {
                console.log('success!');
                console.log(notebooks);
                return true;   
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
        var querystring = $localstorage.getObject('querystring');
        // var querystring = {"oauth_token":"S=s1:U=90553:E=155b6887ef9:C=14e5ed75070:P=185:A=ssktanaka-8134:V=2:H=b48d8ce04303a3ac9e6086077c142dc3","oauth_token_secret":"","edam_shard":"s1","edam_userId":"591187","edam_expires":"1467646246649","edam_noteStoreUrl":"https://sandbox.evernote.com/shard/s1/notestore","edam_webApiUrlPrefix":"https://sandbox.evernote.com/shard/s1/"};
        // var querystring = {"oauth_token":"S=s204:U=17be0a2:E=1575623d70f:C=14ffe72a778:P=185:A=ssktanaka-8134:V=2:H=91a259db75b7ac92374a0509bc755a14","oauth_token_secret":"","edam_shard":"s1","edam_userId":"591187","edam_expires":"1467646246649","edam_noteStoreUrl":"https://www.evernote.com/shard/s1/notestore","edam_webApiUrlPrefix":"https://www.evernote.com/shard/s1/"};
     
        //initializing notestore...
        var noteStoreURL = querystring.edam_noteStoreUrl;
        var noteStoreTransport = new Thrift.BinaryHttpTransport(noteStoreURL);
        var noteStoreProtocol = new Thrift.BinaryProtocol(noteStoreTransport);
        var noteStore = new NoteStoreClient(noteStoreProtocol);

        //save notestore
        this.noteStore = noteStore;

         //normally, use localstorage to get auth token
        // var authToken = "S=s204:U=17be0a2:E=1575623d70f:C=14ffe72a778:P=185:A=ssktanaka-8134:V=2:H=91a259db75b7ac92374a0509bc755a14";
        var authToken = $localstorage.get('authTokenEvernote');
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
            self.getNoteMetaData(guidsArray, function(error, noteMetaDataArray){
                //get all note GUIDS
                var noteGuidsArray = self.getNoteGUIDS(noteMetaDataArray);
                //get all note content in ENML
                self.getNoteContent(noteGuidsArray, function(error, noteContent) {
                    var noteContentAsString = self.getNoteContentAsString(noteContent);
                });
            });
        });
      },

    getAllNoteTitles: function(callback) {

        console.log("Getting all note titles...");
        //save a reference to self
        var self = this;
        var noteTitleArray = [];

        //filter by descending date
        var filter = new NoteFilter;
        //filter by descending date
        filter.ascending = false;

       //filter by last updated (created = 1, updated = 2)
        filter.order = 2;

        //set parameters
        var resultSpec = new NotesMetadataResultSpec;
        resultSpec.includeTitle  = true;
        resultSpec.includeContentLength = true;
        resultSpec.includeCreated = true;
        resultSpec.includeUpdated = true;
        resultSpec.includeNotebookGuid = true;
          
        //filter to first 100 notes
        self.noteStore.findNotesMetadata(self.authToken, filter, 0, 100, resultSpec, function (noteMetadata, error) {
            if (error) {
                console.log("we have an error");
                callback(error);
            }
            else {
            //log the number of notes found in the default notebook
                console.log("successful note gathering");
                callback(null, noteMetadata.notes);
            }
        });  

      },

      getNote: function(guid, callback) {
        //save a reference to self
        var self = this;
        var noteTitleArray = [];

        //set parameters
        var resultSpec = new NotesMetadataResultSpec;
        resultSpec.includeContentLength = true;
        resultSpec.includeResourcesData = true;
          
        //filter to first 50 notes
        self.noteStore.findNotesMetadata(self.authToken, guid, resultSpec, function (noteMetadata, error) {
            if (error) {
                callback(error);
            }
            else {
            //log the number of notes found in the default notebook
                callback(null, noteMetadata);
            }
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

      getNoteGUIDS: function(noteMetaDataArray) {
        var noteGUIDarray = [];

        noteMetaDataArray.forEach(function(currentValue, index, array){
            for (i=0; i<currentValue.notes.length; i++){
                noteGUIDarray.push(currentValue.notes[i].guid);
            };
        });

      
        return noteGUIDarray;
      },

       getSingleNoteContent: function(noteGUID, callback) {
            var self = this;
            //get note content and convert it to a string
            self.noteStore.getNoteContent(self.authToken, noteGUID, function (noteContent) {
                callback(self.getNoteContentAsString(noteContent));                  
            },
            function onerror(error) {
                if (error.errorCode == Errors.EDAMErrorCode.RATE_LIMIT_REACHED) {
                    console.log("Rate limit reached");
                    console.log("Retry your request in" + e.rateLimitDuration);
                };
                console.log('Error- ' + JSON.stringify(error));
                callback(error);
            });        
             
          },


      getNoteContentAsString: function(noteContent){
            var text = noteContent;
            text = text.replace(/(<\/(div|ui|li)>)/ig,"\n");
            text = text.replace(/(<(li)>)/ig," - ");
            text = text.replace(/(<([^>]+)>)/ig,"");
            text = text.replace(/(\r\n|\n|\r)/gm," ");
            text = text.replace(/(\s+)/gm," ");
            return text;
      },


      exportNote: function(highlightedWordsArray, projectTitle, cb){
        var self = this;

        var stringArray = [];
        for (i=0; i<highlightedWordsArray.length; i++){
          stringArray.push("<h4>");
          stringArray.push(highlightedWordsArray[i].source);
          stringArray.push("</h4><p>");
          stringArray.push(highlightedWordsArray[i].text);
          stringArray.push("</p>");
        }
        stringArray = stringArray.join(" ");
        self.makeNote(projectTitle, stringArray, cb);
      },

      makeNote: function(noteTitle, noteBody, callback) {
 
        var self = this;

        var nBody = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>";
        nBody += "<!DOCTYPE en-note SYSTEM \"http://xml.evernote.com/pub/enml2.dtd\">";
        nBody += "<en-note>" + noteBody + "</en-note>";
       
        // Create note object
        var ourNote = new Note();
        ourNote.title = noteTitle;
        ourNote.content = nBody;
       
        // Attempt to create note in Evernote account
        self.noteStore.createNote(self.authToken, ourNote, function(result) {
          if (result && result.guid) {
              callback(null, result);
          } else {
            callback(result);
          }
        });
       
      },

      checkLogin: function() {
        var authToken = $localstorage.get('authTokenEvernote');

         //normally, use localstorage to get auth token
        // var authToken = "S=s1:U=90553:E=155a48b6862:C=14e4cda3a18:P=185:A=ssktanaka-8134:V=2:H=5764ef25dfbf6f3ee15636e48512c685";
        
        //NEW TESTING AUTH TOKEN
        // var authToken = "S=s204:U=17be0a2:E=1575623d70f:C=14ffe72a778:P=185:A=ssktanaka-8134:V=2:H=91a259db75b7ac92374a0509bc755a14";
        // $localstorage.set("authTokenEvernote", authToken);

        // //delete! for testing purposes.
        // var authToken = "";
        // this.authToken = authToken;

        if (authToken) {
            return true;
        } else {
            return false;
        }

      },

      // getAuthTokenTESTING: function() {
      //   // var authToken = "S=s1:U=90553:E=155a48b6862:C=14e4cda3a18:P=185:A=ssktanaka-8134:V=2:H=5764ef25dfbf6f3ee15636e48512c685";
      //   return authToken; 
      // },

  	  loginWithEvernote: function() {
  	    options = {
  	        consumerKey: "ssktanaka-8134",
  	        consumerSecret: "ccd528cbed56377d",
  	        callbackUrl : "http://localhost:8100/#/app/oauth", // this filename doesn't matter in this example. eventually redirect to correct part in app
  	        signatureMethod : "HMAC-SHA1",
  	    };
  	    oauth = OAuth(options);
  	    
  	    // OAuth Step 1: Get temporaryrequest token
  	    // oauth.request({'method': 'GET', 'url': 'https://sandbox.evernote.com' + '/oauth', 'success': success, 'failure': failure});
        oauth.request({'method': 'GET', 'url': 'https://www.evernote.com' + '/oauth', 'success': success, 'failure': failure});
      
  	  },

      logoutWithEvernote: function() {
        var clearAuth = "";
        $localstorage.set("authTokenEvernote", clearAuth);
        console.log("You're logged out!");

      }

    };
});

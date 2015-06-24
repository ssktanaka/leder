var ledermodule = angular.module('leder.services', [])

ledermodule.factory('Notes', function() {
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

ledermodule.factory('Quotes', function() {
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

   };

});



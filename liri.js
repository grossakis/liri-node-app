require("dotenv").config();
var Spotify = require('node-spotify-api')
var tumblr = require('tumblr');
var keys = require('./keys.js');
var request = require('request');
var fs = require('fs');

var spotify = new Spotify(keys.spotify);
var blog = new tumblr.Blog('potcakebubs.tumblr.com', keys.oauth);

var nodeArgs = process.argv;
var userCommand = process.argv[2];
var userInput = "";
var userInputForLog = ""
for (var i = 3; i < nodeArgs.length; i++) {

    if (i > 3 && i < nodeArgs.length) {
        userInput = userInput + "+" + nodeArgs[i];
        userInputForLog += " " + nodeArgs[i]
    }
    else {
        userInput += nodeArgs[i];
        userInputForLog += nodeArgs[i]
    }
}

console.log("\n=-=-==-=-=")
console.log("|| LIRI ||")
console.log("=-=-==-=-=\n")

fs.appendFile('log.txt', "User Request: " + userCommand + " " + userInputForLog + "\n", (err) => {
    if (err) throw err;
  });

var musicSearch = function(musicQuery){
    spotify
    .search({ type: 'track', query: musicQuery , limit: 1 })
    .then(function(response) {
        var spotifyOutput = "\nSpotify Track Search Results: \nTrack Name: " + response.tracks.items[0].name+"\nArtist: " + response.tracks.items[0].album.artists[0].name + "\nAlbum: " + response.tracks.items[0].album.name + "\nPreview URL: " + response.tracks.items[0].preview_url + '\n\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n'

        console.log(spotifyOutput)

        fs.appendFile('log.txt', spotifyOutput + "\n", (err) => {
            if (err) throw err;
          });
    })
    .catch(function(err) {
        console.log(err);
    });
}

var movieSearch = function(movieQuery){
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=trilogy";

    request(queryUrl, function(error, response, body) {
        // If the request is successful
        if (!error && response.statusCode === 200) {
            var movieOutput = "\nOMDB Movie Search Results: \n\nMovie Title: " + JSON.parse(body).Title + "\nRelease Year: " + JSON.parse(body).Year + "\nStarring: " + JSON.parse(body).Actors + "\nIMDB Rating: " + JSON.parse(body).imdbRating + "\nRotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value + "\nPlot: " + JSON.parse(body).Plot + "\nCountry Produced in: " + JSON.parse(body).Country + "\nLaguage: " + JSON.parse(body).Language + '\n\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n'
            console.log(movieOutput)
            fs.appendFile('log.txt', movieOutput + "\n", (err) => {
                if (err) throw err;
              });
        }
    });
}



if(userCommand === 'my-tumblr'){
 
    blog.posts({limit: 20}, function(error, response) {
        if (error) {
            throw new Error(error);
        }
        var postOutput = ""
        for(var i = 0 ; i < response.posts.length; i++){
            postOutput += 'Post Title: ' + response.posts[i].summary + "\nPost Content: " + response.posts[i].body + '\nDate of Post: ' + response.posts[i].date + "\n\n";
        }
        var tumblrOutput = "\nRecent Tumblr Posts: \n\n" + postOutput + "=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n"
        console.log(tumblrOutput)
        fs.appendFile('log.txt', tumblrOutput + "\n", (err) => {
            if (err) throw err;
          });
    });
    

}else if(userCommand === 'spotify-this-song'){
    
    if(userInput === ""){
        musicSearch('the sign ace of base')
    }else{
        musicSearch(userInput)
    }
    
    
}else if(userCommand === 'movie-this'){
    
    if(userInput === ""){
        movieSearch('Mr. Nobody')
    }else{
        movieSearch(userInput)
    }
    
}else if(userCommand === 'do-what-it-says'){

    fs.readFile("random.txt", "utf8", function(err, data) {
    if (err) {
        return console.log(err);
    }
    
    // Break the string down by comma separation and store the contents into the output array.
    var output = data.split(",");
    
    // Loop Through the newly created output array
    if(output[0] === 'spotify-this-song'){
        musicSearch(output[1]);
    }else if(output[0] === 'movie-this'){
        movieSearch(output[1])
    }
    });
}
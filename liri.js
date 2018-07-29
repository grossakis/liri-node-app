console.log("=-=-==-=-=")
console.log("|| LIRI ||")
console.log("=-=-==-=-=\n")

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
for (var i = 3; i < nodeArgs.length; i++) {

if (i > 3 && i < nodeArgs.length) {
    userInput = userInput + "+" + nodeArgs[i];
}
else {
    userInput += nodeArgs[i];
}
}


var musicSearch = function(musicQuery){
    spotify
    .search({ type: 'track', query: musicQuery , limit: 1 })
    .then(function(response) {
        console.log("\nSpotify Track Search Results: \n")
        console.log("Track Name: " + response.tracks.items[0].name)
        console.log("Artist: " + response.tracks.items[0].album.artists[0].name)
        console.log("Album: " + response.tracks.items[0].album.name)
        console.log("Preview URL: " + response.tracks.items[0].preview_url)
        console.log('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n')
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
            console.log("\nOMDB Movie Search Results: \n")
            console.log("Movie Title: " + JSON.parse(body).Title);
            console.log("Release Year: " + JSON.parse(body).Year);
            console.log("Starring: " + JSON.parse(body).Actors);
            console.log("IMDB Rating: " + JSON.parse(body).imdbRating);
            console.log("Rotten Tomatoes Rating: " + JSON.parse(body).Ratings[1].Value);
            console.log("Plot: " + JSON.parse(body).Plot);
            console.log("Country Produced in: " + JSON.parse(body).Country);
            console.log("Laguage: " + JSON.parse(body).Language);
            console.log('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n')
        }
    });
}



if(userCommand === 'my-tumblr'){
 
    blog.posts({limit: 20}, function(error, response) {
    if (error) {
        throw new Error(error);
    }
    console.log("\nRecent Tumblr Posts: \n")
    for(var i = 0 ; i < response.posts.length; i++){
        console.log('Post Title: ' + response.posts[i].summary);
        console.log('Post Content: ' + response.posts[i].body);
        console.log('Date of Post: ' + response.posts[i].date);
        console.log('\n=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=\n')
    }
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
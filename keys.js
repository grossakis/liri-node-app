// console.log('this is loaded');

// exports.tumblr = {
//   consumer_key: 
//   consumer_secret:
//   access_token_key: 
//   access_token_secret: 
// };
exports.oauth = {
    consumer_key: process.env.TUMBLR_CONSUMER_KEY,
    consumer_secret: process.env.TUMBLR_CONSUMER_SECRET,
    token: process.env.TUMBLR_ACCESS_TOKEN_KEY,
    token_secret: process.env.TUMBLR_ACCESS_TOKEN_SECRET
  };
exports.spotify = {
  id: process.env.SPOTIFY_ID,
  secret: process.env.SPOTIFY_SECRET
};
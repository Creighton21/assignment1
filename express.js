var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var PORT = process.env.PORT || 3000;

app.use(express.static(__dirname));
app.use(bodyParser.json());

var fs = require("fs");

//global variable for tweet data
var tweetinfo = [];
//global variable for recently searched tweets
var searchedTweet = [];

//load the input file
fs.readFile("favs.json", "utf8", function readFileCallback(err, data) {
  if (err) {
    req.log.info("cannot load a file:" + fileFolder + "/" + _file_name);
    throw err;
  } else {
    //Store loaded data into a global variable for tweet data
    tweetinfo = JSON.parse(data);
  }
});

//Get functions
/*
Upon request retrieve all users IDS, Screen Names, and Names and respond
with that information back to the frontend.
*/
app.get("/tweets", function (req, res) {
  //users will be loaded with all the user information and returned to the front end
  let users = [];

  //loop through the tweets and push each user objects into users
  tweetinfo.forEach((person) => {
    users.push({
      id: person.user.id,
      screen_name: person.user.screen_name,
      name: person.user.name,
    });
  });

  //Respond with users
  res.send(users);
});

/*
Upon request retrieve all tweet IDS, Text, and Created_at times and respond
with that information back to the frontend.
*/
app.get("/tweetinfo", function (req, res) {
  /*
tweets will be loaded with and array of tweet objects, each of which will have
an id, text, and a creation time
*/
  let tweets = [];

  //Loop through each tweet and push the information onto tweets.
  tweetinfo.forEach((person) => {
    tweets.push({
      id: person.id,
      text: person.text,
      date: person.created_at,
    });
  });
  //Respond with tweets
  res.send(tweets);
});

/*
Upon request retrieve all the recently searched tweet IDS, Text, and Created_at times 
and respond with that information back to the frontend.
*/
app.get("/searchinfo", function (req, res) {
  /*
tweets will be loaded with and array of tweet objects, each of which will have
an id, text, and a creation time
*/
  let tweets = [];

  //Loop through each recently searched tweet and push the information onto tweets.
  searchedTweet.forEach((person) => {
    tweets.push({
      id: person.id,
      text: person.text,
      date: person.date,
    });
  });
  //Respond with tweets
  res.send(tweets);
});

//Post functions

/*
Upon request created a tweet with the following information: IDS, Text, and Created_at time.
*/
app.post("/tweetinfo", function (req, res) {
  //Retrieve the tweet ID and Text from the request
  var tweetId = Number(req.body.tweetId);
  var tweetText = req.body.text;
  //Create a created at date
  var curr = new Date();
  var tweetDate = curr.toUTCString();

  //Push this new tweet into the global tweetinfo
  tweetinfo.push({
    created_at: tweetDate,
    id: Number(tweetId),
    text: tweetText,
  });
  //Respond with a message
  res.send("Successfully Added!");
});

/*
Upon request search for a tweet via its tweet ID and add it to the 
recently seached global var searchedTweet
*/
app.post("/searchinfo", function (req, res) {
  //Retrieve the tweet ID from the request
  let tweetIds = Number(req.body.tweetId);

  //Find the tweet from tweetinfo and store it in tweet
  var tweet = tweetinfo.find((item) => item.id === tweetIds);

  /*
  If it is found then create a var resTweet with the ID, Text, and Created_at time
  from tweet to be sent back
  */
  if (tweet != undefined) {
    var resTweet = {
      id: tweet.id,
      text: tweet.text,
      date: tweet.created_at,
    };

    //Push this tweet into the recently searched tweets searchedTweet variable
    searchedTweet.push({
      id: tweet.id,
      text: tweet.text,
      date: tweet.created_at,
    });
    //Resppond with the resTweets information
    res.send(resTweet);
  } else {
    //If it is not found send a status of not found.
    res.sendStatus(404);
  }
});

/*
Upon request search for a user via the Name and replace the existing  
Screen name with the new Screen name.
*/
app.put("/tweets/:nm", function (req, res) {
  //Retrieve the users Name and the new Screen name from the request
  var name = req.body.name;
  var newName = req.body.newName;

  //Search for the user via the users Name and store the index in tweetIdx
  var tweetIdx = tweetinfo.findIndex((item) => item.user.name == name);

  //If the user was found then update the Screen Name to the new Screen Name.
  if (tweetIdx >= 0) {
    tweetinfo[tweetIdx].user.screen_name = newName;
    res.send("Succesfully Updated!");
  } else {
    //If the user was not found send a status of not found.
    res.sendStatus(404);
  }
});

/*
Upon request search for a tweet via the tweet ID and remove it
from the tweetinfo global var.
*/
app.delete("/tweetinfo/:tweetid", function (req, res) {
  //Retrieve the tweet ID from the request.
  var toDelete = Number(req.body.id);

  //Search for the tweet and store the index in tweetIdx.
  var tweetIdx = tweetinfo.findIndex((item) => item.id === toDelete);

  //If it is found splice the tweet from the global var tweetinfo
  if (tweetIdx >= 0) {
    tweetinfo.splice(tweetIdx, 1);
    res.send("Successfully Deleted!");
  } else {
    //If it is not found send a status of not found.
    res.sendStatus(404);
  }
});

app.listen(PORT, function () {
  console.log("Server listening on " + PORT);
});

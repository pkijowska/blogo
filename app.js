//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const posts = [];
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://pkijowska:test123@cluster0-iukbs.mongodb.net/blogpostDB", {useNewUrlParser: true});

const postsSchema = {
  title: String,
  content: String
}

const Post = mongoose.model(
  "Post",
  postsSchema
)

const post1 = new Post({
  title: "Want Free Coding Lessons? Twitch Makes It Happen in Real Time",
  content: "While the platform might be known for videogame livestreams, more people are flocking there to share their work—or learn to be better programmers. https://www.wired.com/story/want-free-coding-lessons-twitch-real-time/"
});

const post2 = new Post({
  title: "How To Build A Simple Cryptocurrency Blockchain In Node.js",
  content: "https://www.smashingmagazine.com/2020/02/cryptocurrency-blockchain-node-js/"
});

const defaultItems = [post1, post2];



app.get("/", function(req, res){
  Post.find({}, function(err, foundItems) {
    if (foundItems.length === 0) {
      Post.insertMany(defaultItems, function(err){
      if (err) {
      console.log(err);
      } else {
      console.log("Successfully saved the content");
      }
    });
  } else {
    res.render("home", {content: homeStartingContent, posts: foundItems});
   }
  });
});

app.get("/about", function(req, res){
  res.render("about", {content: aboutContent});
});

app.get("/contact", function(req, res){
  res.render("contact", {content: contactContent});
});

app.get("/compose", function(req, res){
  res.render("compose");
});

app.post("/compose", function(req, res){
  const post = new Post ({
  title: req.body.title,
  content: req.body.postBody
});
  // post.save();
  res.redirect("/");

  Post.insertMany(post, function(err){
    if (err) {
      console.log(err);
    } else {
    console.log("Successfully saved default items");
    }
  });
});


app.get("/posts/:postId", function(req, res){

const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});

//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const _ = require("lodash");

const homeStartingContent = "Welcome to the blog! Please feel free to post any thing you want!";
const aboutContent = "This is a small blog made by Jinglin in the process of learning web backend development.";
const contactContent = "jinglintan@yahoo.com";

// const posts = [];

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin-jing:test123@cluster0-dpi4y.mongodb.net/blogDB", {useNewUrlParser: true});

const postSchema = {
  title: String,
  content: String
}

const Post = mongoose.model("Post", postSchema);

app.get("/", function(req, res) {
  Post.find({}, function(err, foundList) {
    if(!err) {
      res.render("home", {homeStartingContent: homeStartingContent, posts: foundList});
    }
  });
});

app.get("/about", function(req, res) {
  res.render("about", {aboutContent: aboutContent});
});

app.get("/contact", function(req, res) {
  res.render("contact", {contactContent: contactContent});
});

app.get("/compose", function(req, res) {
  res.render("compose");
});

app.post("/compose", function(req, res) {
  const post = new Post({
    title: req.body.postTitle,
    content: req.body.postBody
  });
  post.save();
  res.redirect("/");
});

app.get("/posts/:postId", function(req, res) {
  let postId = req.params.postId;
  Post.findOne({_id: postId}, function(err, foundDoc) {
    if(!err) {
      res.render("post", {post: foundDoc});
    }
  });
});

let port = process.env.PORT;
if(port == null || port == "") {
  port = 3000;
}
app.listen(port, function() {
  console.log("Server started successfully");
});

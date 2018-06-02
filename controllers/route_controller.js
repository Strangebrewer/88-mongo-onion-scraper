var db = require("../models");
var request = require("request");
var cheerio = require("cheerio");

var exports = module.exports = {}

exports.home = function (req, res) {
  db.Article.find({})
    .then(function (data) {

      var renderObject = {
        peels: data
      }

      res.render("index", renderObject);
    });
}

exports.peel = function (req, res) {

  var originalArticles;

  db.Article.find({ saved: false })
    .then(function (dbArticle) {
      originalArticles = dbArticle.length;

      console.log(originalArticles);
    });

  request("https://www.theonion.com/", function (error, response, html) {

    var articles = [];

    var $ = cheerio.load(html);

    $(".postlist__item").each(function (i, element) {

      var article = {};

      article.title = $(element).find(".headline").text();
      article.link = $(element).find("a.js_entry-link").attr("href");
      article.date = $(element).find(".js_publish_time").attr("title");
      article.summary = $(element).find(".entry-summary p").text();

      if (article.title !== "") {
        articles.push(article);
      }

    });

    db.Article.create(articles, function(err, newArticles) {
      if (err) console.log(err);
      else console.log(newArticles);
      db.Article.find({}).then(function (data) {
        var articleObj = {
          new: data.length - originalArticles,
          peels: data
        }

        res.json(articleObj);
      })
    });

  });

  // setTimeout(function () {
  //   res.json(results)
  // }, 1000);
}

exports.stick = function (req, res) {

  //  Save an article

}

exports.seeComments = function (req, res) {

  //  See comments

}

exports.addComment = function (req, res) {

  //  Add a comment
  //  comments are attached to saved articles

}

exports.clearDb = function (req, res) {
  db.Article.remove({}).then(function (results) {
    console.log(results);
  });

  db.Note.remove({}).then(function (result) {
    console.log(result);
  });
}

exports.discard = function (req, res) {

  //  Remove article from Saved collection

}
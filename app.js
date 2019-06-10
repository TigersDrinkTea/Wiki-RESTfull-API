//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/WikiDB", {
    useNewUrlParser: true
});

const articleSchema = {
    title: String,
    content: String
};

const Article = mongoose.model('Article', articleSchema);

///////////////////////////////////////////// Requests Targeting ALL Articles


app.route('/articles')

    .get(function (req, res) {
        Article.find(function (err, foundArticles) {
            if (!err) {
                res.send(foundArticles)
            } else {
                res.send(err);
            }
        });
    })

    .post(function (req, res) {

        const newArticle = new Article({
            title: req.body.title,
            content: req.body.content
        });
        newArticle.save(function (err) {
            if (!err) {
                res.send('succcessfully added')
            } else {
                res.send(err);
            }
        });
    })


    .delete(function (req, res) {
        Article.deleteMany(function (err) {
            if (!err) {
                res.send('succesfully deleted all articles');
            } else {
                res.send(err);
            }
        });
    });

///////////////////////////////////////////// Requests Targeting SPECIFIC Articles

app.route('/articles/:articleTitle')

    .get(function (req, res) {
        Article.findOne({
            title: req.params.articleTitle}, function (err, foundArticle){
                if (foundArticle){
                    res.send(foundArticle);
                }else{
                    res.send('No matching article titles found');
                }
            });
    })

    .put(function(req,res){
        Article.findOneAndUpdate({
            title: req.params.articleTitle}, //just searching through articles untill you get a match with the one the user searched.
            {$set: {title: req.body.title, content:req.body.content}}, // these are the actual updates to title and content
    {new :true},
    function(err,replacedArticle){
        if(!err){
            res.send(replacedArticle)
        }else{
            res.send(err)
        }
    }

    );
})

.patch(function(req,res){
    Article.updateOne({
        title: req.params.articleTitle}, //just searching through articles untill you get a match with the one the user searched.
        {$set: req.body}, // these are the actual updates to title and content
function(err){
    if(!err){
        res.send('Article Patched successfully')
    }else{
        res.send(err)
    }
}

);
})

.delete(function(req,res){
    Article.deleteOne(
        {title: req.params.articleTitle},
        function(err){
            if(!err){
                res.send('successfully deleted article')
        }else{
            res.send(err)
        }
    }
    );
});
    

app.listen(3000, function () {
    console.log("Server started ");
});
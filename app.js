//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");

const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

//BD connect with mongoose
mongoose.connect("mongodb+srv://admin:4rg4m4ss4@cluster0.x7bqk.mongodb.net/todolistDB?retryWrites=true&w=majority",{useNewUrlParser:true});

//Schema
const itemsSchema = {
  name: {
    type: String,
    required: true
  }
};


//new model
const Item = mongoose.model("Item",itemsSchema);

//function save
function saveItem(item){
  const data = new Item ({
    name: item
  });
  data.save(function(err){
    if(err){
      console.log(err);
    }else{

    }


  });
}

const workItems = [];





app.get("/", function(req, res) {
  const day = date.getDate();
  Item.find({},function(err, foundItems){

    res.render("list", {listTitle: day, newListItems: foundItems});
  });


});

//submit button action
app.post("/", function(req, res){

  const item = req.body.newItem;

  if (req.body.list === "Work") {
    saveItem(item);
    res.redirect("/work");
  } else {
    saveItem(item);
    res.redirect("/");
  }
});

//delete button
app.post("/delete",function(req,res){
  const checkedId = req.body.checkbox;
  Item.remove({_id:checkedId},function(err){
    if(err){
      console.log(err);
    }
  });


  res.redirect("/");
});

app.get("/work", function(req,res){
  res.render("list", {listTitle: "Work List", newListItems: workItems});
});

app.get("/about", function(req, res){
  res.render("about");
});

//listen pra heroku
let port = process.env.PORT;
if(port == null || port == ""){
  port =3000;
}

app.listen(port, function() {
  console.log("Server started");
});

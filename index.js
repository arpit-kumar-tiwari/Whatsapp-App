const express = require("express");
const app = express();
const mongoose = require('mongoose');
const path = require("path");
const Chat = require("./models/chat.js");
const methodOverride = require("method-override");
const ExpressError = require("./ExpressError");

main()
  .then(() => {
    console.log("connection successful");
   })
  .catch(err => console.log(err));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

// Index Route
app.get("/chats", asyncWrap(async (req, res, next) => {
    let chats = await Chat.find();
    // console.log(chats);
    res.render("index.ejs", { chats });
  }
));

// New Route
app.get("/chats/new", (req, res) => {
  // throw new ExpressError(404, "Page not found");
  res.render("new.ejs");
});

// Create Route
app.post("/chats", asyncWrap(async(req, res, next) => {
    let {from, msg, to} = req.body;
    let newChat = new Chat ({
      from: from,
      to: to,
      msg: msg,
      created_at: new Date(),
      updated_at: new Date(),
    })
     await newChat.save();//.then((res) => {
    //   console.log("chat was saved");
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
    res.redirect("/chats");
  }
));

// Edit Route
app.get("/chats/:id/edit", asyncWrap(async (req, res) => {
    let {id} = await req.params;
    let chat = await Chat.findById(id);
    res.render("edit.ejs", { chat });
  }
));

// Update Route
app.put("/chats/:id", asyncWrap(async (req, res) => {
  let {id} = await req.params;
  let {msg: newMsg} = req.body;
  let updatedChat = await Chat.findByIdAndUpdate(id, {msg : newMsg}, {runValidators: true, new: true});
  let updatedTime = await Chat.findByIdAndUpdate(id, {updated_at : new Date()}, {runValidators: true, new: true});
  console.log(updatedChat);
  console.log(updatedTime);
  res.redirect("/chats");
}));

// Destroy Route
app.delete("/chats/:id", asyncWrap(async (req, res, next) => {
    let {id} = await req.params;
    let deletedChat = await Chat.findByIdAndDelete(id);
    console.log(deletedChat);
    res.redirect("/chats");
  } 
));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
}

const handleValidationErr = (err) => {
  console.log("This was Validation Error. Please follow the rules.");
  console.dir(err.message);
  return err;
};

app.use((err, req, res, next) => {
  console.log(err.name);
  if(err.name == "ValidationError") {
    err = handleValidationErr(err);
  }
  next(err);
});

// Error Handling Middleware
app.use((err, req, res, next) => {
  let { status = 400, message = "Some Error Occurred"} = err;
  res.status(status).send(message);
});

function asyncWrap(fn) {
  return function (req, res, next) {
    fn(req, res, next).catch(err => next(err));
  }
}

// NEW - Show Route
app.get("/chats/:id", asyncWrap(async (req, res, next) => {
    let { id } = req.params;
    let chat = await Chat.findById(id);
    if (!chat) {
      return next(new ExpressError(500, "Chat not found"));
    }
    res.render("edit.ejs", { chat });
  }
));

app.get("/", (req, res) => {
    res.send("root is working");
})

app.listen(8080, () => {
    console.log("server is listening on port 8080");
});

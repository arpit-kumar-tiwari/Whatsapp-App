const mongoose = require('mongoose');
const Chat = require("./models/chat.js");

main()
  .then(() => {
    console.log("connection successful");
   })
  .catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/whatsapp');
}

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/fakewhatsapp');
  }

let allChats = [
    {
        from: "abhay",
        to: "uday",
        msg: "send me notes for the exam",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        from: "rohit",
        to: "mohit",
        msg: "teach me JS callback",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        from: "arpit",
        to: "rajarshi",
        msg: "all the best!",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        from: "ayush",
        to: "ramesh",
        msg: "bring me some fruits",
        created_at: new Date(),
        updated_at: new Date(),
    },
    {
        from: "amit",
        to: "sumit",
        msg: "love you 3000",
        created_at: new Date(),
        updated_at: new Date(),
    },
];

Chat.insertMany(allChats);

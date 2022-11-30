require("dotenv").config();
const express = require("express");
const app = express();
const logger = require("morgan");
const ejs = require("ejs");
const path = require("path");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const session = require("express-session");
const mongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const mongoose = require("mongoose");
const cron = require("node-cron");
const { Message } = require("./models/message");
const { mongoURI, globalVariables } = require("./config/configurations");
require("./config/passport")(passport);

app.use(logger("dev"));

// connecting to DB
mongoose
  .connect(mongoURI)
  .then(() => {
    console.log(`DB Connected successfully @ ${mongoURI}`);
  })
  .catch((err) => {
    console.log(err);
  });


// set up view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// path init for static file
app.use(express.static(path.join(__dirname, "public")));

// cookie parser init
app.use(cookieParser());

// bodyParser init
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//configure Express session
app.use(
  session({
    cookie: {
      maxAge: 180 * 60 * 1000,
    },
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: mongoStore.create({ mongoUrl: process.env.mongoURI }),
  })
);

// flash init
app.use(flash());

// globalvariables Init
app.use(globalVariables);

//passport middleware config
app.use(passport.initialize());
app.use(passport.session());

//passport config
// require("./config/passport")(passport);

// ===================================

  cron.schedule("* * * * *", async function checkDateAndSendMessage() {
    // get the current day of the month
    let now = new Date().split("T");
    console.log({ now });

    // get all messaged on queue
    let nowMessage = await Message.find({ isActive: true });
    // console.log(nowMessage);

    // get all the messages that has a send time of now
    nowMessage.map((message) => {
      // console.log(message);
      message.send_time.forEach(async (time) => {
        console.log(time);
        if (time !== now) return console.log("NOT IT");
        console.log({ message });

        // get all users phone numbers
        let allUsers = await User.find(
          {},
          {
            _id: 0,
            user_name: 0,
            house_address: 0,
            createdAt: 0,
            updatedAt: 0,
            __v: 0,
          }
        );

        // curate all recievers as an array of phone numbers
        let recievers = allUsers.map((item) => {
          return item.phone_number;
        });

        // curate message to send
        let smsMessage = `${message.subject.toUpperCase()} 
          ${message.message_body}`;

        // set receivers and smsMessage as option for AT message
        const options = {
          to: recievers,
          message: smsMessage,
          // shortcode: // Set your shortCode or senderId
        };

        // send the sms
        return await sms
          .send(options)
          .then(req.flash("success_msg", "Reminders sent successfully"))
          .catch((err) => console.log(err));
      });
    });
  });




// ==============================`

// Routes Grouping
const defaultRoutes = require("./routes/users");
const adminRoutes = require("./routes/admin");

// routes
app.use("/", defaultRoutes);
app.use("/admin", adminRoutes);

const PORT = process.env.PORT || 4444;

app.listen(PORT, (req, res) => {
  console.log(`server running on port ${PORT}`);
});

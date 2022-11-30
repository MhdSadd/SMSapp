const cron = require("node-cron");
const { Message } = require("../models/message");

// Cron Job Handler
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

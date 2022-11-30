const passport = require("passport");
const { Admin } = require("../models/admin");
const { User } = require("../models/user");
const credentials = require("../config/configurations").bulkSMSKey;
const axios = require("axios");

module.exports = {
  loginGet: (req, res) => {
    let pageTitle = "Login";
    res.render("admin/login", { pageTitle });
  },

  loginPost: (req, res, next) => {
    // console.log(req.body)
    passport.authenticate("local", {
      successRedirect: "/admin/dashboard",
      failureRedirect: "/admin/login",
      failureFlash: true,
    })(req, res, next);
  },

  dashboard: async (req, res) => {
    let pageTitle = "Dashboard";
    let name = req.user.full_name;
    let email = req.user.email;
    res.render("admin/dashboard", { pageTitle, name, email });
  },

  users_table: async (req, res) => {
    let pageTitle = "Users";
    const users = await User.find();
    const user_count = await User.countDocuments();
    let name = req.user.full_name;
    let email = req.user.email;
    res.render("admin/users", { pageTitle, name, email, users, user_count });
  },

  reminder_page: async (req, res) => {
    let pageTitle = "Reminder";
    let name = req.user.full_name;
    let email = req.user.email;
    res.render("admin/message", { pageTitle, name, email });
  },

  // Send Reminder Immediately
  reminder_post: async (req, res) => {
    const { message, phones, sender_id } = req.body;
    if (!message || !phones || !sender_id) {
      console.log("something went wrong");
      return req.flash("error_msg", "Please enter a subject and a message");
    }

    async function sendMessage() {
      let recievers = phones;
      await axios
        .get(
          `https://www.bulksmsnigeria.com/api/v1/sms/create?api_token=${credentials}&from=${sender_id}&to=${recievers}&body=${message}&dnd=2`
        )
        .then(function (response) {
          console.log({ response });
        })
        .catch(function (error) {
          console.log({ error });
        });
    }
    sendMessage();
    res.redirect("/admin/message");
  },

  // LOGOUT HANDLER
  logout: (req, res) => {
    req.logOut();
    req.flash("success_msg", "You are logged out");
    res.redirect("/");
  },
};

const express = require("express");
const mongoose = require("mongoose");
const { User } = require("../models/user");

module.exports = {
  indexGet: (req, res) => {
    let pageTitle = "Home";
    res.render("default/index", { pageTitle });
  },

  aboutGet: (req, res) => {
    let pageTitle = "About";
    res.render("default/about", { pageTitle });
  },

  contactGet: (req, res) => {
    let pageTitle = "Contact";
    res.render("default/contact", { pageTitle });
  },

  registerGet: (req, res) => {
    let pageTitle = "Register";
    let user_name = req.body.user_name;
    let house_address = req.body.house_address;
    let phone_number = req.body.phone_number;
    res.render("default/register", {
      pageTitle,
      phone_number,
      user_name,
      house_address,
    });
  },

  registerPost: async (req, res) => {
    let { user_name, house_address, phone_number } = req.body;
    let errors = [];
    
    // Checking Required Field
    if (!user_name || !phone_number) {
      errors.push({ msg: "username and phone number are required" });
      // let pageTitle = "Register";
      // let user_name = req.body.user_name;
      // let house_address = req.body.house_address;
      // let phone_number = req.body.phone_number;
    }

    if (!phone_number.match(/^\d+$/) && phone_number.length != 11) {
      errors.push({ msg: "invalid phone Number Try Again" });
      // let pageTitle = "Register";
      // let user_name = req.body.user_name;
      // let house_address = req.body.house_address;
      // let phone_number;+++
    }

    if (errors.length > 0) {
      let pageTitle = "Register";
      res.render("default/register", {
        pageTitle,
        user_name,
        house_address,
        phone_number,
        errors,
      });
    } else {
      phone_number = `+234${phone_number.replace(/^0+/, "")}`
      User.findOne({ phone_number }).then((user) => {
        if (user) {
          console.log(user);
          errors.push({ msg: "this number is already registered" });
          let pageTitle = "Register";
          let user_name = req.body.user_name;
          let house_address = req.body.house_address;
          let phone_number = req.body.phone_number;
          res.render("default/register", {
            pageTitle,
            user_name,
            house_address,
            phone_number,
            errors,
          });
        } else {
          const newUser = new User({
            user_name,
            phone_number,
            house_address,
          });
          newUser.save();
          req.flash(
            "success_msg",
            "You are now registered and will be receiving monthly reminder"
          );
          res.redirect("/");
        }
      });
    }
  },
};

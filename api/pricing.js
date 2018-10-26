////-----------------CONTACT-----------------

var http = require('http');
var mysql = require('mysql');
var randomString = require('random-string');
//var stripe = require("stripe")("sk_test_GWo9JO8BeSsKJoE3XKNHy0I7");
var moment = require("moment");
var verifycode = randomString();
var now = moment();
var db = mysql.createPool({
  database: 'saleinsg',
  user: 'root',
  password: '10gXWOqeaf',
  host: 'db.80startups.com',
});


var nodemailer = require('nodemailer');
var mandrillTransport = require('nodemailer-mandrill-transport');
var smtpTransport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey : 'F9E0Hvx-FBXauFHYHeulyg'
  }
}));


exports.contactus = function (req, res) {
    console.log("Pricing table form");
    var CompanyName = req.body.copany_name;
    var email = req.body.email;
    var phoneNumber = req.body.phone;
    
      var recipientEmail = 'narodashakuntala94@gmail.com';
     
     
      var subject = "[Fountaintechies.com] Contact Us enquiry";
      var mailbody = '<table>\
                          <tr>\
                          <td><img src="https://ambitiontours.80startups.com/assets/img/logo.jpg"></td><br>\
                        </tr>\
                        <tr>\
                          <td><h1>Dear Amol C,</td>\
                        </tr>\
                        <tr>\
                        </tr>\
                        <tr>\
                          <td>You have one enquiry from the following client:</td>\
                        </tr>\
                        <tr>\
                          <td>The details are as follow :<br>\
                          <br><strong> Company Name:   ' + CompanyName + '</strong><br>\
                          <br><strong> Email:   ' + email + '</strong><br>\
                          <br><strong> Contact Number:   ' + phoneNumber + '</strong><br>\
                        </tr>\
                        <tr>\
                          <td>Best wishes,</td>\
                        </tr>\
                        <tr>\
                          <td><h2>Fountaintechies.com</h2></td>\
                        </tr>\
                        <tr>\
                          <td bgcolor="#000000"><font color ="white">This is a one-time email. Please do not reply to this email.</font></td>\
                        </tr>\
                      </table>';
  
                    
  
        send_mail(recipientEmail, subject, mailbody);
        var successmsg={status:"success"};
        console.log(successmsg);
        res.json(successmsg)
  }
  
  function send_mail(usermail, subject, mailbody) {
  

    let mailOptions={
      from :'narodashakuntala94@gmail.com',
      to : 'narodashakuntala94@gmail.com',
      subject : subject,
      html : mailbody
   };
   
   // Sending email.
   smtpTransport.sendMail(mailOptions, function(error, response){
     if(error) {
        throw new Error("Error in sending email");
     }
     console.log("Message sent: " + JSON.stringify(response));
   });
   
  };
  
  
  








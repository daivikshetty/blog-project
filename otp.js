const nodeMailer = require('nodemailer');

      var num = Math.random()*10000;
      num = Math.floor(num);

function getOtp(mailName){
      
      var msg = 'Your OTP is ' + num.toString() + '.\nPlease do not share your OTP with anyone.\n';
      var transporter = nodeMailer.createTransport({
            service : 'gmail',
            auth : {
                  user : 'dbmsprojectblog@gmail.com',
                  pass : 'pjbogdtkzwvpdebf'
            }
      });
      
      var mailObject = {
            from: 'The JD Blogspot',
            to: mailName,
            subject: 'OTP from Blogspot',
            text: msg
      }

      console.log("Sending OTP...");

      transporter.sendMail(mailObject, (err,info) => {
            if(err){
                  console.log(err);
            }
            else{
                  console.log("Sent OTP successfully!!!!");
            }
      });
}

module.exports = {getOtp, num};
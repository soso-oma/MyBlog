import nodemailer from 'nodemailer';

const sendEmail = async (to, subject, html) => {
  // Configure transporter using Gmail service
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_FROM,     
      pass: process.env.EMAIL_PASSWORD  
    }
  });

  // Send the email using the transporter
  await transporter.sendMail({
    from: `"MyBlog" <${process.env.EMAIL_USER}>`, 
    to,                                           
    subject,                                      
    html,                                       
  });
};

export default sendEmail;

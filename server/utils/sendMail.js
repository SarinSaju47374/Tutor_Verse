import nodemailer from "nodemailer";

export default async function sendMail(mailId,subject,message){
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'dexter.blick74@ethereal.email',
            pass: 'zddwY7VqpzFqW9ESYd'
        }
    });

    try{
        const info = await transporter.sendMail({
            from: '"From TutorVerse " <sarin@gmail.com>', // sender address
            to: mailId,
            subject: subject, // Subject line
            text: message, // plain text body
          });
        
          console.log("Message sent: %s", info.messageId);
          console.log(message);
    }catch(err){
        throw new Error(err)
    }
}
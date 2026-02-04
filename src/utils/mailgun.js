import dotenv from "dotenv";
dotenv.config();
import formData from "form-data";
import Mailgun from "mailgun.js";

const mailgun = new Mailgun(formData);

const mg = mailgun.client({
  username: "api",
  key: process.env.MAILGUN_API_KEY,
});

export const sendMailgunEmail = async ({ to, subject, text, html }) => {
  await mg.messages.create(process.env.MAILGUN_DOMAIN, {
    from: `Verify <mailgun@${process.env.MAILGUN_DOMAIN}>`, // IMPORTANT
    to,
    subject,
    ...(html ? { html } : { text }),
    // "o:tracking": false,
    // "o:tracking-clicks": false,
    // "o:tracking-opens": false,
  });
};

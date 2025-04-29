import { sendEmail } from "../controllers/mail.controller";

sendEmail(
	"kingchi005@gmail.com",
	"This is a test email from the Node.js application.",
	"Test Email"
)
	.then((data) => {
		console.log("Email sent successfully.");
		console.log(data);
	})
	.catch((error) => {
		console.error("Error sending email:", error);
	});

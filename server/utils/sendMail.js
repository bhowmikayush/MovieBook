import dotenv from "dotenv";
dotenv.config();
 import nodemailer from "nodemailer";

//  Create transporter
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

//  Verify SMTP
export const verifySMTP = async () => {
  try {
    console.log(" Checking SMTP...");
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "✔ Loaded" : " Missing");

    await transporter.verify();
    console.log("SMTP Server is Ready");
  } catch (err) {
    console.log("SMTP ERROR FULL:", err);
  }
};

// SEND EMAIL
export const sendBookingEmail = async (userEmail, bookingDetails) => {
  try {
    console.log("📨 sendBookingEmail CALLED");

    if (!userEmail) {
      console.log("No email provided");
      return;
    }

    console.log("TO:", userEmail);
    console.log("BOOKING DATA:", bookingDetails);

    const mailOptions = {
      from: `"🎬 Movie Booking" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: "🎟️ Booking Confirmed",

       html: `
<div style="margin:0; padding:0; background:#f2f2f2; font-family: 'Segoe UI', Arial, sans-serif;">
  
  <div style="max-width:600px; margin:30px auto; background:#ffffff; border-radius:12px; overflow:hidden; box-shadow:0 5px 20px rgba(0,0,0,0.1);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3c72,#2a5298); padding:20px; text-align:center;">
      <h1 style="color:#ffffff; margin:0;">🎬 Movie Booking</h1>
      <p style="color:#dcdcdc; margin:5px 0 0;">Your ticket is confirmed</p>
    </div>

    <!-- Body -->
    <div style="padding:25px;">

      <h2 style="color:#4CAF50; margin-bottom:15px;">✅ Booking Confirmed</h2>

      <p style="color:#555; font-size:14px;">
        Thank you for booking with us. Your movie experience is now reserved 🎉
      </p>

      <!-- Booking Details -->
      <div style="background:#fafafa; padding:15px; border-radius:8px; margin-top:15px; border:1px solid #eee;">
        
        <p><b>🆔 Booking ID:</b> ${bookingDetails.bookingId || "N/A"}</p>
        <p><b>🎬 Movie:</b> ${bookingDetails.movie}</p>
        <p><b>📅 Date:</b> ${bookingDetails.date}</p>
        <p><b>⏰ Time:</b> ${bookingDetails.time}</p>
        <p><b>💺 Seat No:</b> ${bookingDetails.seats.join(", ")}</p>
        <p><b>💳 Payment:</b> ${bookingDetails.payment}</p>

      </div>

      <!-- Highlight -->
      <div style="margin-top:20px; padding:15px; background:#e8f5e9; border-left:5px solid #4CAF50; border-radius:6px;">
        <p style="margin:0; color:#2e7d32;">
          🍿 Please arrive 15 minutes early and carry this confirmation.
        </p>
      </div>

    </div>

    <!-- Footer -->
    <div style="background:#fafafa; padding:15px; text-align:center; border-top:1px solid #eee;">
      <p style="font-size:12px; color:#888; margin:0;">
        This is an automated email. Please do not reply.
      </p>
      <p style="font-size:12px; color:#888; margin:5px 0 0;">
        © ${new Date().getFullYear()} Movie Booking System
      </p>
    </div>

  </div>

</div>
`,
    };

    console.log("🚀 Sending email...");

    const info = await transporter.sendMail(mailOptions);

     

  } catch (err) {
    console.log("❌ EMAIL SEND ERROR FULL:", err);
  }
};
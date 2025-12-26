const functions = require('firebase-functions');
const admin = require('firebase-admin');
const nodemailer = require('nodemailer');
admin.initializeApp();

// Configure your email transporter (use Gmail or any SMTP)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'mariamawitgetachew782@gmail.com',        // ← REPLACE with your Gmail
    pass: 'your-app-password'             // ← Generate at https://myaccount.google.com/apppasswords
  }
});

// Trigger on task create or update
exports.sendTaskEmail = functions.firestore
  .document('tasks/{taskId}')
  .onWrite(async (change, context) => {
    const newData = change.after.exists ? change.after.data() : null;
    const oldData = change.before.exists ? change.before.data() : null;

    if (!newData) return null; // Task deleted

    const action = !oldData ? 'created' : 'updated';
    const title = newData.title || 'Untitled Task';
    const status = newData.status || 'pending';
    const due = newData.due_date ? new Date(newData.due_date).toLocaleDateString() : 'No due date';

    // Get task owner's email
    const ownerUid = newData.user_id;
    const userDoc = await admin.firestore().doc(`users/${ownerUid}`).get();
    const ownerEmail = userDoc.data()?.email || 'no-reply@example.com';

    const mailOptions = {
      from: 'Task Manager <your-email@gmail.com>',
      to: ownerEmail,
      subject: `Task ${action}: ${title}`,
      html: `
        <h2>Your task was ${action}!</h2>
        <p><strong>Title:</strong> ${title}</p>
        <p><strong>Status:</strong> ${status}</p>
        <p><strong>Due Date:</strong> ${due}</p>
        <p><strong>Description:</strong> ${newData.description || 'None'}</p>
        <hr>
        <p>This is an automated message from your Task Management App.</p>
      `
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`Email sent to ${ownerEmail} for task ${action}`);
    } catch (error) {
      console.error('Error sending email:', error);
    }

    return null;
  });
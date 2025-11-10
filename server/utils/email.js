import nodemailer from 'nodemailer';

const sendEmail = async (options) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    // Email options
    const mailOptions = {
      from: process.env.EMAIL_FROM,
      to: options.email,
      subject: options.subject,
      text: options.message,
      html: options.html || options.message,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Email error:', error);
    throw error;
  }
};

export const sendWelcomeEmail = async (user) => {
  const message = `
    <h1>Welcome to Shoppa!</h1>
    <p>Hi ${user.name},</p>
    <p>Thank you for joining Shoppa. We're excited to have you on board!</p>
    <p>Start shopping now and discover amazing products.</p>
    <p>Best regards,<br>The Shoppa Team</p>
  `;

  await sendEmail({
    email: user.email,
    subject: 'Welcome to Shoppa',
    html: message,
  });
};

export const sendContactEmail = async (contactData) => {
  const message = `
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> ${contactData.name}</p>
    <p><strong>Email:</strong> ${contactData.email}</p>
    <p><strong>Subject:</strong> ${contactData.subject}</p>
    <p><strong>Message:</strong></p>
    <p>${contactData.message}</p>
  `;

  await sendEmail({
    email: process.env.EMAIL_USER,
    subject: `Contact Form: ${contactData.subject}`,
    html: message,
  });

  // Send confirmation to user
  const confirmMessage = `
    <h2>Thank you for contacting Shoppa!</h2>
    <p>Hi ${contactData.name},</p>
    <p>We've received your message and will get back to you as soon as possible.</p>
    <p>Best regards,<br>The Shoppa Team</p>
  `;

  await sendEmail({
    email: contactData.email,
    subject: 'We received your message',
    html: confirmMessage,
  });
};

export const sendOrderConfirmation = async (order, user) => {
  const message = `
    <h1>Order Confirmation</h1>
    <p>Hi ${user.name},</p>
    <p>Thank you for your order! Your order #${order._id} has been confirmed.</p>
    <h3>Order Details:</h3>
    <p><strong>Total:</strong> $${order.totalPrice}</p>
    <p><strong>Status:</strong> ${order.status}</p>
    <p>We'll send you another email when your order ships.</p>
    <p>Best regards,<br>The Shoppa Team</p>
  `;

  await sendEmail({
    email: user.email,
    subject: `Order Confirmation #${order._id}`,
    html: message,
  });
};

export default sendEmail;

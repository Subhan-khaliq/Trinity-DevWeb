import nodemailer from 'nodemailer';

// Configure transporter (using Ethereal for testing, or environment variables)
const createTransporter = async () => {
    // For production, use actual SMTP settings
    if (process.env.SMTP_HOST) {
        return nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_SECURE === 'true',
            auth: {
                user: process.env.SMTP_USER,
                pass: process.env.SMTP_PASS,
            },
        });
    }

    // Default to Ethereal for development/demo
    const testAccount = await nodemailer.createTestAccount();
    return nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false,
        auth: {
            user: testAccount.user,
            pass: testAccount.pass,
        },
    });
};

export const sendReceiptEmail = async (user, order) => {
    const transporter = await createTransporter();

    const itemsHtml = order.items.map(item => `
        <tr style="border-bottom: 1px solid #edf2f7;">
            <td style="padding: 12px 0;">
                <div style="font-weight: 600; color: #1a202c;">${item.productId?.name || 'Product'}</div>
                <div style="font-size: 0.875rem; color: #718096;">Qty: ${item.quantity}</div>
            </td>
            <td style="padding: 12px 0; text-align: right; font-weight: 600; color: #1a202c;">
                $${item.subtotal.toFixed(2)}
            </td>
        </tr>
    `).join('');

    const htmlContent = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #2d3748;">
            <div style="background-color: #4c51bf; padding: 40px 20px; text-align: center; border-radius: 8px 8px 0 0;">
                <h1 style="color: white; margin: 0; font-size: 24px; letter-spacing: 1px;">TRINITY STORE</h1>
                <p style="color: #e2e8f0; margin: 10px 0 0;">Thank you for your purchase!</p>
            </div>
            
            <div style="padding: 30px; background-color: white; border: 1px solid #e2e8f0; border-top: none; border-radius: 0 0 8px 8px;">
                <h2 style="font-size: 18px; margin-bottom: 20px; color: #1a202c;">Order Receipt</h2>
                
                <p style="margin-bottom: 5px;"><strong>Order ID:</strong> #${order._id.toString().toUpperCase()}</p>
                <p style="margin-bottom: 20px;"><strong>Date:</strong> ${new Date(order.createdAt).toLocaleString()}</p>
                
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
                    <thead>
                        <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
                            <th style="padding-bottom: 10px; color: #718096; font-size: 12px; text-transform: uppercase;">Description</th>
                            <th style="padding-bottom: 10px; text-align: right; color: #718096; font-size: 12px; text-transform: uppercase;">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${itemsHtml}
                    </tbody>
                </table>
                
                <div style="border-top: 2px dashed #e2e8f0; padding-top: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                        <span style="color: #718096;">Subtotal</span>
                        <span style="font-weight: 600;">$${order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
                        <span style="color: #718096;">Shipping</span>
                        <span style="color: #38a169; font-weight: 600;">FREE</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; font-size: 20px; color: #4c51bf; font-weight: 800;">
                        <span>Total</span>
                        <span>$${order.totalAmount.toFixed(2)}</span>
                    </div>
                </div>
                
                <div style="margin-top: 40px; text-align: center; border-top: 1px solid #e2e8f0; padding-top: 20px;">
                    <p style="font-size: 14px; color: #718096; font-style: italic;">
                        If you have any questions, please contact our support team.
                    </p>
                </div>
            </div>
        </div>
    `;

    const info = await transporter.sendMail({
        from: '"Trinity Store" <receipts@trinitystore.com>',
        to: user.email,
        subject: `Your Receipt for Order #${order._id.toString().slice(-8).toUpperCase()}`,
        html: htmlContent,
    });

    console.log("Message sent: %s", info.messageId);
    // Return preview URL if using Ethereal
    return nodemailer.getTestMessageUrl(info);
};

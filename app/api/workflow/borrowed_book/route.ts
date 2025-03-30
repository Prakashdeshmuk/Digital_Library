import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type InitialData = {
  email: string;
  fullName: string;
  title: string;
  borrowDate: string;
  dueDate: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName, title, borrowDate, dueDate } =
    context.requestPayload;

  // Welcome Email
  await context.run("book-request-sent", async () => {
    await sendEmail({
      email,
      subject: "Book request sent",
      message: `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BookWise Borrow Confirmation</title>
      <!-- Inline CSS for email clients -->
      <style type="text/css">
        /* Reset styles */
        body { margin: 0; padding: 0; min-width: 100%!important; }
        .wrapper { width: 100%; max-width: 600px; margin: 0 auto; }
        
        /* Main styles */
        .email-content { 
          background: #171923; 
          color: #ffffff; 
          padding: 24px;
          font-family: Arial, sans-serif;
        }
        
        .header { 
          border-bottom: 1px solid #2D3748; 
          padding-bottom: 16px;
          margin-bottom: 24px;
        }
        
        .header-title { 
          font-size: 20px; 
          font-weight: bold;
          color: #ffffff;
          margin: 0;
        }
        
        .highlight { 
          font-weight: bold; 
          color: #F6E05E;
        }
        
        .button {
          background: #F6E05E;
          color: #171923 !important;
          padding: 8px 16px;
          text-decoration: none;
          border-radius: 4px;
          display: inline-block;
          font-weight: 500;
        }
      </style>
    </head>
    <body>
      <center class="wrapper">
        <div class="email-content">
          <!-- Header -->
          <div class="header">
            <!-- Use PNG instead of SVG -->
            <span class="header-title">BookWise</span>
          </div>

          <!-- Content -->
          <p>Hi ${fullName},</p>
          <p>You've successfully borrowed <strong>${title}</strong>. Here are the details:</p>
          
          <ul style="margin:16px 0; padding-left:24px;">
            <li>Borrowed On: <span class="highlight">${borrowDate}</span></li>
            <li>Due Date: <span class="highlight">${dueDate}</span></li>
          </ul>

          <p>Enjoy your reading, and don't forget to return the book on time!</p>
          
          <!-- Bulletproof button -->
          <div style="margin:24px 0;">
            <a href="#" class="button">View Borrowed Books</a>
          </div>

          <!-- Footer -->
          <div style="border-top:1px solid #2D3748; padding-top:16px;">
            <p>Happy reading,</p>
            <p>The BookWise Team</p>
          </div>
        </div>
      </center>
    </body>
    </html>`,
    });
  });
});

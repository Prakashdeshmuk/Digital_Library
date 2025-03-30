import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type InitialData = {
  email: string;
  fullName: string;
  title: string;
  borrowDate: string;
  returnDate: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName, title, borrowDate, returnDate } =
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
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>BookWise Email Template</title>
        <style>
          /* Email Template Styles */
          body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f7fafc;
            display: flex;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
            padding: 16px;
          }

          .email-container {
            max-width: 600px;
            width: 100%;
            margin: 0 auto;
            overflow: hidden;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .email-content {
            background-color: #171923;
            color: white;
            padding: 24px;
          }

          .email-header {
            display: flex;
            align-items: center;
            gap: 8px;
            padding-bottom: 16px;
            border-bottom: 1px solid #2D3748;
            margin-bottom: 24px;
          }

          .email-icon {
            height: 24px;
            width: 24px;
            color: white;
          }

          .header-title {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
          }

          .email-body {
            display: flex;
            flex-direction: column;
            gap: 24px;
          }

          .email-subject {
            font-size: 1.25rem;
            font-weight: 700;
            margin: 0;
          }

          .details-list {
            list-style-type: disc;
            margin-left: 24px;
          }

          .details-list li {
            margin-bottom: 4px;
          }

          .highlight {
            font-weight: 600;
          }

          .button-container {
            padding-top: 8px;
          }

          .view-button {
            background-color: #F6E05E;
            color: #171923;
            font-weight: 500;
            padding: 8px 16px;
            border: none;
            border-radius: 4px;
            cursor: pointer;
            transition: background-color 0.2s;
          }

          .view-button:hover {
            background-color: #ECC94B;
          }

          .email-footer {
            padding-top: 16px;
          }

          .email-footer p {
            margin: 4px 0;
          }

          /* SVG Icon */
          .book-icon {
            width: 24px;
            height: 24px;
            fill: none;
            stroke: currentColor;
            stroke-width: 2;
            stroke-linecap: round;
            stroke-linejoin: round;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="email-content">
            <!-- Header with Logo -->
            <div class="email-header">
              <svg xmlns="http://www.w3.org/2000/svg" class="book-icon" viewBox="0 0 24 24">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
              </svg>
              <h1 class="header-title">BookWise</h1>
            </div>

            <!-- Main Content -->
            <div class="email-body">
              <h2 class="email-subject">You've Borrowed a Book!</h2>
              
              <p>Hi ${fullName},</p>
              
              <p>You've successfully borrowed ${title}. Here are the details:</p>
              
              <ul class="details-list">
                <li>Borrowed On: <span class="highlight">${borrowDate}</span></li>
                <li>Due Date: <span class="highlight">${returnDate}</span></li>
              </ul>
              
              <p>Enjoy your reading, and don't forget to return the book on time!</p>
              
              <div class="button-container">
                <button class="view-button">View Borrowed Books</button>
              </div>
              
              <div class="email-footer">
                <p>Happy reading,</p>
                <p>The BookWise Team</p>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>`,
    });
  });
});

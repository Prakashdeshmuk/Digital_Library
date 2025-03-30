import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type InitialData = {
  email: string;
  fullName: string;
  title: string;
  coverImage: string;
  author: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName, title, coverImage, author } = context.requestPayload;

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
        <title>Book Request</title>
        <style>
          body {
            font-family: 'Arial', sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
          }
          .email-container {
            border: 1px solid #e0e0e0;
            border-radius: 8px;
            overflow: hidden;
          }
          .header {
            background-color: #6E59A5;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .content {
            padding: 30px;
            background-color: #ffffff;
          }
          .book-details {
            display: flex;
            margin-bottom: 25px;
            background-color: #f8f8f8;
            border-radius: 6px;
            overflow: hidden;
          }
          .book-image {
            width: 130px;
            height: 200px;
            object-fit: cover;
          }
          .book-info {
            padding: 15px;
            flex: 1;
          }
          .book-title {
            font-size: 18px;
            font-weight: bold;
            color: #6E59A5;
            margin-bottom: 5px;
          }
          .book-author {
            font-style: italic;
            color: #666;
            margin-bottom: 15px;
          }
          .request-info {
            background-color: #f3f0fb;
            padding: 15px;
            border-radius: 6px;
            margin-bottom: 20px;
            border-left: 4px solid #6E59A5;
          }
          .user-name {
            font-weight: bold;
            font-size: 16px;
          }
          .request-id {
            font-family: monospace;
            background-color: #f1f1f1;
            padding: 3px 6px;
            border-radius: 3px;
            font-size: 12px;
          }
          .footer {
            background-color: #f3f0fb;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          .button {
            display: inline-block;
            background-color: #6E59A5;
            color: white;
            text-decoration: none;
            padding: 10px 20px;
            border-radius: 4px;
            font-weight: bold;
          }
        </style>
      </head>
      <body>
        <div class="email-container">
          <div class="header">
            <h1>📚 Book Request</h1>
          </div>
          
          <div class="content">
            <p>A new book request has been submitted:</p>
            
            <div class="book-details">
              <img src="${coverImage}" alt="${title}" class="book-image">
              <div class="book-info">
                <div class="book-title">${title}</div>
                <div class="book-author">${author}</div>
              </div>
            </div>
            
            <div class="request-info">
              <p><span class="user-name">${fullName}</span> has requested to borrow this book.</p>
              <p>Team Bookwise reach out as early as Possible</p>
            </div>
            
          </div>
          
          <div class="footer">
            <p>This is an automated notification from the Library Management System.</p>
            <p>&copy; 2023 Bookish Requests. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>`,
    });
  });
});

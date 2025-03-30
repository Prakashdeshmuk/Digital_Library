import { serve } from "@upstash/workflow/nextjs";
import { sendEmail } from "@/lib/workflow";

type InitialData = {
  email: string;
  fullName: string;
  title: string;
};

export const { POST } = serve<InitialData>(async (context) => {
  const { email, fullName, title } = context.requestPayload;

  // Welcome Email
  await context.run("book-request-sent", async () => {
    await sendEmail({
      email,
      subject: "Book request sent",
      message: `Hey ${fullName} your ${title} request send to admin`,
    });
  });
});

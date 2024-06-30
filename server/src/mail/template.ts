export const reset_password = (token: string, mails: string[]) => {
  return {
    from: 'Nest Service <ooaungmyat1123@gmail.com>',
    to: mails,
    subject: 'Reset Password',
    html: `<div>
      <p>Your code is: https://loopfeed.vercel.app/reset-password/${token}.</p>
       <p>Use it to reset your password in Loopfeed.</p>
       <p>If you didn't request this, simply ignore this message.</p>
       <p>Yours, The Loopfeed Team</p>
    </div>`,
  };
};

export const verify_email = (code: string, mails: string[]) => {
  return {
    from: 'Nest Service <ooaungmyat1123@gmail.com>',
    to: mails,
    subject: 'Verify registration',
    html: `
      <div>
      <p>Your code is: ${code}.</p>
       <p>Use it to verify your email verification in Loopfeed.</p>
       <p>If you didn't request this, simply ignore this message.</p>
       <p>Yours, The Loopfeed Team</p>
    </div>
    `,
  };
};

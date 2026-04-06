export const otpGenerate = () => {
  const otp = Math.floor(Math.random() * 10000 + 1);
  return otp;
};

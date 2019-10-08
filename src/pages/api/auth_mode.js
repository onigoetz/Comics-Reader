/* global process */
export default (req, res) => {
  res.json({ mode: process.env.AUTH_MODE });
};

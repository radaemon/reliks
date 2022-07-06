import { oauth2Client } from './loginyt'

// TODO: Decode with another function
export default async function handler(req, res) {
  // exchange code for tokens
  const code = req.query.code

  const { tokens } = await oauth2Client.getToken(code)

  res.redirect(`http://localhost:3000?tokens=${JSON.stringify(tokens)}`)
}

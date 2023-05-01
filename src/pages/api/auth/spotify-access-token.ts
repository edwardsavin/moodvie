import type { NextApiRequest, NextApiResponse } from "next";

// Get user's Spotify access token from Clerk API
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const userId = req.query.userId as string;

  try {
    const response = await fetch(
      `https://api.clerk.com/v1/users/${userId}/oauth_access_tokens/oauth_spotify`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.CLERK_SECRET_KEY as string}`,
        },
      }
    );

    const data = (await response.json()) as Array<{ token: string }>;
    const token = data?.[0]?.token as string;

    if (token) {
      res.status(200).json({ token });
    } else {
      res.status(404).json({ message: "Token not found" });
    }
  } catch (error: unknown) {
    res.status(500).json({ message: (error as Error).message });
  }
}

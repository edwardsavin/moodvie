import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

type Data = {
  data: {
    id: string;
    first_name: string;
    last_name: string;
    image_url: string;
  };
};

// Clerk's webhook calls this endpoint when a user is created
// Add the new user to the database
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = req.body as Data;

  await prisma.user.create({
    data: {
      name: `${data.first_name} ${data.last_name}`,
      userId: data.id,
      profilePicture: data.image_url,
      role: "USER",
    },
  });

  res.status(200).json({ message: "User added to the database" });
}

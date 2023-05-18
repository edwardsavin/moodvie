import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "~/server/db";

type Data = {
  data: {
    id: string;
    first_name: string;
    last_name: string;
  };
};

// Clerk's webhook calls this endpoint when a user is created
// Add the new user to the database
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { data } = req.body as Data;

  try {
    await prisma.user.create({
      data: {
        name: data.last_name
          ? `${data.first_name} ${data.last_name}`
          : data.first_name,
        userId: data.id,
        role: "USER",
      },
    });
  } catch (error) {
    return res.status(500).json(error);
  }

  res.status(200).json({ message: "User added to the database" });
}

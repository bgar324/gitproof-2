import type { Prisma } from "@prisma/client";
import { db } from "@/lib/db";
import { syncUserData } from "@/lib/sync";
import { getGitProofData } from "@/lib/github";
import { sanitizeForPostgres } from "@/lib/sanitize";

export async function syncAndCacheUserData(
  username: string,
  email: string,
  image: string,
) {
  await syncUserData(username, email, image);

  const freshData = await getGitProofData();

  if (!freshData) {
    return null;
  }

  const sanitizedData = sanitizeForPostgres(freshData);

  await db.user.update({
    where: { email },
    data: {
      profileData: sanitizedData as unknown as Prisma.InputJsonValue,
      lastSyncedAt: new Date(),
    },
  });

  return freshData;
}

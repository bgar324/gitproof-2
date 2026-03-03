import { db } from "@/lib/db";
import {
  decryptSecret,
  encryptSecret,
  isEncryptedSecret,
} from "@/lib/secrets";

export async function getGitHubAccountByEmail(email: string) {
  const account = await db.account.findFirst({
    where: {
      user: { email },
      provider: "github",
    },
    select: {
      id: true,
      scope: true,
      access_token: true,
      refresh_token: true,
      id_token: true,
    },
  });

  if (!account) {
    return null;
  }

  const accessToken = decryptSecret(account.access_token);
  const refreshToken = decryptSecret(account.refresh_token);
  const idToken = decryptSecret(account.id_token);

  const updates: {
    access_token?: string | null;
    refresh_token?: string | null;
    id_token?: string | null;
  } = {};

  if (account.access_token && accessToken && !isEncryptedSecret(account.access_token)) {
    updates.access_token = encryptSecret(accessToken);
  }
  if (
    account.refresh_token &&
    refreshToken &&
    !isEncryptedSecret(account.refresh_token)
  ) {
    updates.refresh_token = encryptSecret(refreshToken);
  }
  if (account.id_token && idToken && !isEncryptedSecret(account.id_token)) {
    updates.id_token = encryptSecret(idToken);
  }

  if (Object.keys(updates).length > 0) {
    await db.account.update({
      where: { id: account.id },
      data: updates,
    });
  }

  return {
    id: account.id,
    scope: account.scope,
    accessToken,
    refreshToken,
    idToken,
  };
}

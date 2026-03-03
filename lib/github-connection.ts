import { getGitHubAccountByEmail } from "@/lib/github-account";
import { hasPrivateRepoScope } from "@/lib/github-permissions";

export async function getGitHubConnectionStatus(email: string) {
  const account = await getGitHubAccountByEmail(email);

  return {
    hasGitHubAccount: !!account,
    requiresReconnect: !account || hasPrivateRepoScope(account.scope),
  };
}

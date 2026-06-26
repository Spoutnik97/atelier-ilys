import type { APIRoute } from "astro";

// GitHub OAuth initiation — redirects to GitHub authorization page.
// Decap CMS opens this in a popup via base_url + auth_endpoint in config.yml.
export const GET: APIRoute = async ({ redirect, request }) => {
  const clientId = import.meta.env.GITHUB_CLIENT_ID;

  if (!clientId) {
    return new Response("GITHUB_CLIENT_ID not set", { status: 500 });
  }

  const origin = new URL(request.url).origin;
  const params = new URLSearchParams({
    client_id: clientId,
    scope: "repo,user",
    redirect_uri: `${origin}/api/callback`,
  });

  return redirect(`https://github.com/login/oauth/authorize?${params}`);
};

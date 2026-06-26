import type { APIRoute } from 'astro';

// GitHub OAuth callback — exchanges the code for a token and posts it back
// to the Decap CMS popup via window.opener.postMessage.
export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return html(errorPage(error ?? 'No authorization code received'));
  }

  let token: string;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({
        client_id: import.meta.env.GITHUB_CLIENT_ID,
        client_secret: import.meta.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string };
    if (!data.access_token) throw new Error(data.error ?? 'No token in response');
    token = data.access_token;
  } catch (err) {
    return html(errorPage(err instanceof Error ? err.message : 'Token exchange failed'));
  }

  return html(successPage(token));
};

function html(body: string) {
  return new Response(body, { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
}

function successPage(token: string): string {
  // Decap CMS expects: 'authorization:github:success:{"token":"...","provider":"github"}'
  const payload = JSON.stringify({ token, provider: 'github' });
  const message = JSON.stringify(`authorization:github:success:${payload}`);
  return `<!DOCTYPE html><html><body><script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(${message}, e.origin);
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;
}

function errorPage(message: string): string {
  const safe = message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html><html><body><script>
(function () {
  function receiveMessage(e) {
    window.opener.postMessage(
      ${JSON.stringify(`authorization:github:error:${safe}`)},
      e.origin
    );
  }
  window.addEventListener("message", receiveMessage, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script></body></html>`;
}

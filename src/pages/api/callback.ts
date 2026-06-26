import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ request }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  if (error || !code) {
    return html(errorPage(error ?? 'No authorization code received'));
  }

  const clientId = import.meta.env.GITHUB_CLIENT_ID;
  const clientSecret = import.meta.env.GITHUB_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    return html(errorPage('GITHUB_CLIENT_ID or GITHUB_CLIENT_SECRET is not set in Vercel environment variables.'));
  }

  let token: string;
  try {
    const res = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code }),
    });
    const data = (await res.json()) as { access_token?: string; error?: string; error_description?: string };
    if (!data.access_token) {
      throw new Error(data.error_description ?? data.error ?? 'No access_token in GitHub response');
    }
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
  const payload = JSON.stringify({ token, provider: 'github' });
  // jsPayload / jsToken are JS string literals (with surrounding quotes + escaping)
  const jsPayload = JSON.stringify(payload);
  const jsToken = JSON.stringify(token);

  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Connexion…</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0}
.box{text-align:center;padding:2rem;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1)}</style>
</head>
<body><div id="msg" class="box"><p>Connexion réussie…</p></div>
<script>
(function () {
  var msg = 'authorization:github:success:' + ${jsPayload};

  // Primary path: BroadcastChannel — works even when window.opener is null because
  // GitHub sets Cross-Origin-Opener-Policy: same-origin on their OAuth pages.
  try {
    var bc = new BroadcastChannel('decap-cms-auth');
    bc.postMessage({ type: 'success', token: ${jsToken}, provider: 'github' });
    bc.close();
  } catch (_) {}

  // Secondary path: standard window.opener handshake (kept for compatibility)
  if (window.opener) {
    window.addEventListener('message', function (e) {
      try { (e.source || window.opener).postMessage(msg, e.origin); } catch (_) {}
    });
    try { window.opener.postMessage('authorizing:github', '*'); } catch (_) {}
    setTimeout(function () {
      try { window.opener.postMessage(msg, '*'); } catch (_) {}
    }, 300);
  } else {
    document.getElementById('msg').textContent =
      'Authentifié — retournez dans l\\'onglet principal.';
  }
})();
</script>
</body></html>`;
}

function errorPage(message: string): string {
  const safe = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<!DOCTYPE html>
<html lang="fr">
<head><meta charset="utf-8"><title>Erreur d'authentification</title>
<style>body{font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;background:#fff0f0}
.box{text-align:center;padding:2rem;background:#fff;border-radius:8px;box-shadow:0 2px 8px rgba(0,0,0,.1);max-width:420px}
code{display:block;margin-top:.75rem;padding:.5rem;background:#f5f5f5;border-radius:4px;font-size:.85em;word-break:break-all}</style>
</head>
<body><div class="box">
  <p><strong>Erreur d'authentification</strong></p>
  <code>${safe}</code>
  <p style="font-size:.85em;color:#666;margin-top:1rem">Fermez cette fenêtre et réessayez.</p>
</div>
<script>
(function () {
  try {
    var bc = new BroadcastChannel('decap-cms-auth');
    bc.postMessage({ type: 'error', message: ${JSON.stringify(message)} });
    bc.close();
  } catch (_) {}
  if (window.opener) {
    try { window.opener.postMessage(${JSON.stringify('authorization:github:error:' + message)}, '*'); } catch (_) {}
  }
})();
</script>
</body></html>`;
}

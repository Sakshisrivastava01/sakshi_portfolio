const http = require('http');

function request(opts) {
  return new Promise((resolve, reject) => {
    const req = http.request(opts, (res) => {
      let body = '';
      res.on('data', c => body += c);
      res.on('end', () => resolve({ status: res.statusCode, headers: res.headers, body }));
    });
    req.on('error', reject);
    req.setTimeout(5000, () => { req.destroy(); reject(new Error('timeout')); });
    if (opts.body) req.write(opts.body);
    req.end();
  });
}

async function main() {
  // 1. Test all routes without auth (should redirect)
  console.log('=== ROUTE VERIFICATION (unauthenticated) ===');
  const routes = [
    '/admin', '/admin/login', '/admin/hero', '/admin/about', '/admin/skills',
    '/admin/projects', '/admin/certifications', '/admin/experience', '/admin/education',
    '/admin/achievements', '/admin/contact', '/admin/resume', '/admin/social',
    '/admin/audio', '/admin/media', '/admin/seo', '/admin/analytics', '/admin/backup'
  ];

  for (const path of routes) {
    try {
      const r = await request({ hostname: 'localhost', port: 3000, path, method: 'GET' });
      const loc = r.headers.location || '';
      if (r.status >= 300 && r.status < 400) {
        console.log(`${path} -> ${r.status} REDIRECT to ${loc}`);
      } else {
        console.log(`${path} -> ${r.status} OK (${r.body.length} bytes)`);
      }
    } catch (e) {
      console.log(`${path} -> FAIL: ${e.message}`);
    }
  }

  // 2. Test login with wrong password
  console.log('\n=== AUTH: wrong password ===');
  try {
    const bad = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: 'wrongpass' })
    });
    console.log(`Status: ${bad.status} Body: ${bad.body}`);
  } catch (e) {
    console.log(`FAIL: ${e.message}`);
  }

  // 3. Test login with correct password (read from env or use test)
  console.log('\n=== AUTH: correct password ===');
  const pw = process.env.ADMIN_PASSWORD || 'no-env-set';
  console.log(`Using ADMIN_PASSWORD from env: ${pw === 'no-env-set' ? 'NOT SET' : '***' + pw.slice(-3)}`);
  try {
    const good = await request({
      hostname: 'localhost', port: 3000, path: '/api/auth/login', method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: pw })
    });
    console.log(`Status: ${good.status} Body: ${good.body}`);
    const setCookie = good.headers['set-cookie'];
    if (setCookie) {
      console.log(`Cookie received: ${setCookie[0].substring(0, 80)}...`);
      const cookie = setCookie[0].split(';')[0];

      // 4. Test protected route WITH cookie
      console.log('\n=== PROTECTED ROUTE WITH VALID SESSION ===');
      const authed = await request({
        hostname: 'localhost', port: 3000, path: '/admin/hero', method: 'GET',
        headers: { 'Cookie': cookie }
      });
      console.log(`/admin/hero -> ${authed.status} (${authed.body.length} bytes)`);
      if (authed.status === 200) {
        console.log('SUCCESS: Authenticated access to /admin/hero works!');
      } else {
        console.log(`UNEXPECTED: Got status ${authed.status} instead of 200`);
      }

      // 5. Test logout
      console.log('\n=== LOGOUT ===');
      const logout = await request({
        hostname: 'localhost', port: 3000, path: '/api/auth/logout', method: 'POST',
        headers: { 'Cookie': cookie }
      });
      console.log(`Logout status: ${logout.status} Body: ${logout.body}`);

      // 6. Test route AFTER logout (should redirect again)
      console.log('\n=== POST-LOGOUT ACCESS ===');
      const postLogout = await request({
        hostname: 'localhost', port: 3000, path: '/admin/hero', method: 'GET'
      });
      console.log(`/admin/hero after logout -> ${postLogout.status} ${postLogout.headers.location || ''}`);

    } else {
      console.log('NO COOKIE RECEIVED - login may have failed');
    }
  } catch (e) {
    console.log(`FAIL: ${e.message}`);
  }

  // 7. Environment variable check
  console.log('\n=== ENVIRONMENT VARIABLES ===');
  console.log(`ADMIN_PASSWORD: ${process.env.ADMIN_PASSWORD ? 'SET' : 'NOT SET'}`);
  console.log(`JWT_SECRET: ${process.env.JWT_SECRET ? 'SET' : 'NOT SET'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_URL: ${process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET'}`);
  console.log(`NEXT_PUBLIC_SUPABASE_ANON_KEY: ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? 'SET' : 'NOT SET'}`);
}

main().catch(console.error);

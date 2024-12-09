export default {
    async fetch(request) {
  
      const allowedOrigins = [
        'https://jackstoller.com',
        'https://portfolio-2024-44m.pages.dev',
        'http://localhost:3000',
      ];
      const origin = request.headers.get('Origin');
      const allowOrigin = allowedOrigins.includes(origin) ? origin : 'null';
    
  
      if (request.method === 'OPTIONS') {
        return new Response('OK', {
          headers: {
            'content-type': 'text/plain',
            'Access-Control-Allow-Origin': allowOrigin,
          }
        });
      }
  
      const { searchParams } = new URL(request.url);
      let email = searchParams.get('email');
      let content = searchParams.get('content');
  
      if (!email || !content) {
        return new Response('Invalid', {
          status: 400,
          headers: {
            'content-type': 'text/plain',
            'Access-Control-Allow-Origin': allowOrigin,
          },
        })
      }
  
      let send_request = await fetch(new Request('https://api.mailchannels.net/tx/v1/send', {
        method: 'POST',
        headers: {
          'content-type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [
            {
              to: [{ email: 'REDACTED', name: 'Jack Stoller' }],
            },
          ],
          from: {
            email: 'sender@jackstoller.com',
            name: 'Portal Message',
          },
          subject: 'Email Received',
          content: [
            {
              type: 'text/html',
              value: `
                <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
                <html>
                <head>
                  <meta http-equiv="Content-Type" content="text/html charset=UTF-8" />
                  
                  <style type="text/css">
                  table {border-collapse:separate;}
                  a, a:link, a:visited {text-decoration: none; color: #00788a;}
                  a:hover {text-decoration: underline;}
                  h2,h2 a,h2 a:visited,h3,h3 a,h3 a:visited,h4,h5,h6,.t_cht {color:#000 !important;}
                  .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td {line-height: 100%;}
                  .ExternalClass {width: 100%;}
                  </style>
                </head>
                
                <body>
                  <h1>Email Received</h1>
                  <table cellpadding="0" cellspacing="0" border="0">
                  <tr>
                      <td>From: ${escapeHtml(email)}</td>
                  </tr>
                  </table>
                  <pre style="background-color: lightgray; padding: 32px;">${escapeHtml(content)}</pre>
                </body>
                </html>
              `,
            },
          ],
        }),
      }));
  
      let res = await send_request.text();
  
      return new Response('OK', {
          headers: {
            'content-type': 'text/plain',
            'Access-Control-Allow-Origin': allowOrigin,
          },
      })
    },
  }
  
  function escapeHtml(unsafe) {
    return unsafe
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
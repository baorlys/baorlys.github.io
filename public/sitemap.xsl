<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:s="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml"
  exclude-result-prefixes="s xhtml">
  <xsl:output method="html" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="robots" content="noindex" />
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <title>Sitemap - baorlys.dev</title>
        <style>
          html { background: #0c0d0c; color: #e8eae5; color-scheme: dark; }
          body { margin: 0; padding: 3rem 1.5rem; font-family: ui-sans-serif, system-ui, sans-serif; }
          main { max-width: 56rem; margin: 0 auto; }
          h1 { font-size: 2rem; letter-spacing: -0.03em; margin: 0; }
          p { color: #9aa097; margin: 0.75rem 0 2rem; }
          table { width: 100%; border-collapse: collapse; font-size: 0.9rem; }
          th { text-align: left; padding: 0.6rem 0.75rem 0.6rem 0; border-bottom: 1px solid #262a26; color: #9aa097; font: 500 0.72rem ui-monospace, monospace; text-transform: uppercase; letter-spacing: 0.12em; }
          td { padding: 0.7rem 0.75rem 0.7rem 0; border-bottom: 1px solid #1b1e1b; vertical-align: top; }
          a { color: #b8f36a; text-decoration: none; }
          a:hover { text-decoration: underline; }
          .alt { font-family: ui-monospace, monospace; font-size: 0.78rem; color: #9aa097; }
          .alt a { color: #e8eae5; }
        </style>
      </head>
      <body>
        <main>
          <h1>Sitemap</h1>
          <p><xsl:value-of select="count(s:urlset/s:url)" /> URLs on baorlys.dev. Search engines read the raw XML; this view is for people.</p>
          <table>
            <thead>
              <tr><th>Page</th><th>Languages</th><th>Updated</th></tr>
            </thead>
            <tbody>
              <xsl:for-each select="s:urlset/s:url">
                <tr>
                  <td><a href="{s:loc}"><xsl:value-of select="s:loc" /></a></td>
                  <td class="alt">
                    <xsl:for-each select="xhtml:link">
                      <a href="{@href}"><xsl:value-of select="@hreflang" /></a>
                      <xsl:if test="position() != last()"> / </xsl:if>
                    </xsl:for-each>
                  </td>
                  <td class="alt"><xsl:value-of select="s:lastmod" /></td>
                </tr>
              </xsl:for-each>
            </tbody>
          </table>
        </main>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>

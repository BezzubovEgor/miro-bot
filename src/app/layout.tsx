import Script from 'next/script';
import React, { PropsWithChildren } from 'react';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
        <Script
          src="https://miro.com/app/static/sdk/v2/miro.js"
          strategy="beforeInteractive"
        />
        <div id="root">
          {children}
        </div>
      </body>
    </html>
  );
}

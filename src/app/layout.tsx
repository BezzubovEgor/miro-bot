import React, { PropsWithChildren } from 'react';
import Script from 'next/script';

import { App } from '../components/App';

export default function RootLayout({ children }: PropsWithChildren) {
  return (
    <html>
      <body>
        <Script
          src="https://miro.com/app/static/sdk/v2/miro.js"
          strategy="beforeInteractive"
        />
        <div id="root">
          <App />
          {children}
        </div>
      </body>
    </html>
  );
}

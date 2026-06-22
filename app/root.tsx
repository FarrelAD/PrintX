import { Links, Meta, Outlet, Scripts, ScrollRestoration } from 'react-router';
import { useEffect } from 'react';
import { PWAProvider } from '@/context/PWAContext';
import ErrorBoundary from '@/components/ErrorBoundary';
import '@/lib/i18n';
import '@/index.css';

export const links = () => [
  { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
  {
    rel: 'preconnect',
    href: 'https://fonts.gstatic.com',
    crossOrigin: 'anonymous',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Bebas+Neue&family=Playfair+Display:ital,wght@0,400;0,700;1,400&family=Source+Code+Pro:wght@400;600&display=swap',
  },
  {
    rel: 'stylesheet',
    href: 'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap',
  },
  { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
];

export default function App() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      import('virtual:pwa-register').then(({ registerSW }) => {
        registerSW({ immediate: true });
      });
    }
  }, []);

  return (
    <html lang="id">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <meta name="author" content="Farrel AD" />
        <Meta />
        <Links />
        {/* Structured Data (JSON-LD) for SEO Rich Snippets */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'SoftwareApplication',
              name: 'PrintX',
              operatingSystem: 'All',
              applicationCategory: 'BusinessApplication',
              description:
                'PrintX adalah aplikasi web PWA lokal untuk mencetak dokumen massal seperti kartu ID, sertifikat, dan label secara otomatis dari spreadsheet. 100% aman dan berjalan offline.',
              offers: {
                '@type': 'Offer',
                price: '0.00',
                priceCurrency: 'USD',
              },
              author: {
                '@type': 'Person',
                name: 'Farrel AD',
                url: 'https://github.com/FarrelAD/',
              },
            }),
          }}
        />
      </head>
      <body>
        <ErrorBoundary>
          <PWAProvider>
            <Outlet />
          </PWAProvider>
        </ErrorBoundary>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

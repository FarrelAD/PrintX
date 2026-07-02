import type { MetaFunction } from 'react-router';
import LandingPage from '@/pages/LandingPage';

export const meta: MetaFunction = () => {
  return [
    { title: 'PrintX | Solusi Cetak Dokumen Massal Otomatis' },
    {
      name: 'description',
      content:
        'Cetak kartu ID, sertifikat, dan label otomatis dari excel/spreadsheet secara offline dan 100% aman.',
    },
    { property: 'og:title', content: 'PrintX | Solusi Cetak Dokumen Massal Otomatis' },
    {
      property: 'og:description',
      content:
        'Cetak kartu ID, sertifikat, dan label otomatis dari excel/spreadsheet secara offline dan 100% aman.',
    },
    { property: 'og:image', content: '/og-image.png' },
    { property: 'og:type', content: 'website' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'PrintX | Solusi Cetak Dokumen Massal Otomatis' },
    {
      name: 'twitter:description',
      content:
        'Cetak kartu ID, sertifikat, dan label otomatis dari excel/spreadsheet secara offline dan 100% aman.',
    },
    { name: 'twitter:image', content: '/og-image.png' },
  ];
};

export default function HomeRoute() {
  return <LandingPage />;
}

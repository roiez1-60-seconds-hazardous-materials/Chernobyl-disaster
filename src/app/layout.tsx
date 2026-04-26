import './globals.css';
import { Analytics } from '@vercel/analytics/react';

export const metadata = {
  title: '60 שניות חומ״ס — אסון צ׳רנוביל: כור RBMK והקטסטרופה הגרעינית',
  description: 'רועי צוקרמן — מומחה לחומ״ס וטב״ק | תיק מודיעין: אסון צ׳רנוביל 1986, כור RBMK-1000, ליקווידטורים, פיזור קרינה',
  openGraph: {
    title: '60 Seconds HazMat — Chernobyl Disaster',
    description: 'Intelligence Dossier: Chernobyl 1986, RBMK Reactor, Liquidators | Roie Zukerman',
    siteName: '60 Seconds HazMat',
    type: 'website',
  },
  twitter: { card: 'summary_large_image', title: '60 Seconds HazMat — Chernobyl Disaster', description: 'Intelligence Dossier: Chernobyl 1986' },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="he">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com"/>
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous"/>
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Heebo:wght@300;400;500;700;800;900&family=JetBrains+Mono:wght@400;700&family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet"/>
        <link href="https://api.mapbox.com/mapbox-gl-js/v3.3.0/mapbox-gl.css" rel="stylesheet"/>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5"/>
      </head>
      <body>{children}<Analytics/></body>
    </html>
  );
}

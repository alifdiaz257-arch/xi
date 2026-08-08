import './globals.css'
import { Plus_Jakarta_Sans, Space_Grotesk } from 'next/font/google'
import Script from 'next/script'

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-head',
  display: 'swap',
})

export const metadata = {
  title: 'Scrape Website',
  description: 'Download seluruh konten website dalam satu file ZIP. Cepat, gratis, dan tanpa batasan.',
  keywords: 'scrape, website, download, zip, scraper, webscraper',
  authors: [{ name: 'lifxprg' }],
  openGraph: {
    title: 'Scrape Website',
    description: 'Download seluruh konten website dalam satu file ZIP',
    url: 'https://scrape-website.vercel.app',
    siteName: 'Scrape Website',
    locale: 'id_ID',
    type: 'website',
  },
  icons: {
    icon: '/favicon.ico',
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id" className={`${plusJakarta.variable} ${spaceGrotesk.variable}`}>
      <head>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/jszip/3.10.1/jszip.min.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/FileSaver.js/2.0.5/FileSaver.min.js" strategy="beforeInteractive" />
      </head>
      <body>{children}</body>
    </html>
  )
}
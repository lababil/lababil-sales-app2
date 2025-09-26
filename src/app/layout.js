import './globals.css'
import { Inter } from 'next/font/google'
import { applyTheme } from '../lib/constants'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Lababil Solution - Sistem Penjualan',
  description: 'Aplikasi penjualan digital untuk Lababil Solution',
  keywords: 'penjualan, lababil, solution, digital, website development',
  authors: [{ name: 'Lababil Solution' }],
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                ${applyTheme.toString()}
                applyTheme();
              })();
            `,
          }}
        />
      </head>
      <body className={inter.className}>
        {children}
      </body>
    </html>
  )
}


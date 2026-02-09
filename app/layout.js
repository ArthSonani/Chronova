import '@styles/globals.css'
import Provider from '@components/Provider'
import Nav from '@components/Nav'

export const metadata = {
  title: 'Chronova',
  description: 'Smart Time Management & Scheduling System',
  icons: {
    other: [
      {
        rel: "icon",
        url: "/tab_logo.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        rel: "icon",
        url: "/logo.png",
        media: "(prefers-color-scheme: dark)",
      },
    ],
  },
}


const RootLayout = ({children}) => {
  return (
    <html lang='en'>
        <body>
          <Provider>
            <Nav />
            <main className='app'>
                {children}
            </main>
          </Provider>
        </body>
    </html>
  )
}

export default RootLayout
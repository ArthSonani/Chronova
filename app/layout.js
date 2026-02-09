import '@styles/globals.css'
import Provider from '@components/Provider'
import Nav from '@components/Nav'

export const metadata = {
  title: 'Chronova',
  description: 'Smart Time Management & Scheduling System',
  icons: {
    icon: '/tab_logo.png',
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
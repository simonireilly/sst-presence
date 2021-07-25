import Head from 'next/head'
import { useEffect, useState } from 'react'
import styles from '../styles/Home.module.css'

const roomURl = String(process.env.NEXT_PUBLIC_WEBSOCKET_URL)

export default function Home() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    // Websocket stuff
    let socket: undefined | WebSocket = undefined

    if(WebSocket) {
      socket = new WebSocket(`${roomURl}?roomId=example`)

      socket.onopen = function(event: Event) {
        console.info('Socket opened')
        this.send(JSON.stringify({"action":"sendmessage", "data":"Hello World"}));
      }

      socket.onmessage = function(event: MessageEvent) {
        console.info('Message from server ', event.data);
        setMessage(event.data)
      }
    }

    // Close socket when un-mounting
    return () => {
      socket && socket.close();
    }
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          Local socket connector
        </h1>
        <pre>
          {JSON.stringify(message, null, 2)}
        </pre>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          <span className={styles.logo}>

          </span>
        </a>
      </footer>
    </div>
  )
}

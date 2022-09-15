import React, { useEffect, useState } from 'react'
import Header from './components/Header'
import Button from './components/Button'

function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)

  useEffect(() => {
    if (isConnected) {
      window?.aptos.account().then((data: any) => {
        setAddress(data.address)
      })
    } else {
      setAddress(null)
    }
  }, [isConnected])

  const checkIsConnected = async () => {
    const x = await window.aptos.isConnected()
    setIsConnected(x)
  }

  const handleConnect = async () => {
    try {
      console.log(await window.aptos.connect())
      checkIsConnected()
    } catch (e) {
      console.log(e)
    }
  }

  const handleDisconnect = async () => {
    await window.aptos.disconnect()
    checkIsConnected()
  }

  return (
    <>
      <Header/>
      <div className={'p-4'}>
        <pre>address: {address}</pre>
        <pre>isConnected: {`${isConnected}`}</pre>

        <Button onClick={handleConnect}>connect</Button>
        <Button onClick={handleDisconnect}>disconnect</Button>
      </div>
    </>
  )
}

export default App

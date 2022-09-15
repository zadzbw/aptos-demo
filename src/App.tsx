import React, { useEffect, useState } from 'react'
import { Types, AptosClient } from 'aptos';
import Header from './components/Header'
import Button from './components/Button'

// Create an AptosClient to interact with devnet.
const client = new AptosClient('https://fullnode.devnet.aptoslabs.com/v1');

function App() {
  const [address, setAddress] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState<boolean>(false)
  const [account, setAccount] = React.useState<Types.AccountData | null>(null);
  const [modules, setModules] = React.useState<Types.MoveModuleBytecode[]>([]);
  const [resources, setResources] = React.useState<Types.MoveResource[]>([]);

  const ref = React.createRef<HTMLTextAreaElement>();
  const [isSaving, setIsSaving] = React.useState(false);

  const resourceType = `${address}::message::MessageHolder`;
  const resource = resources.find((r) => r.type === resourceType);
  const data = resource?.data as { message: string } | undefined;
  const message = data?.message;

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!ref.current) return;

    const message = ref.current.value;
    const transaction = {
      type: "entry_function_payload",
      function: `${address}::message::set_message`,
      arguments: [message],
      type_arguments: [],
    };

    console.log('transaction', transaction)

    try {
      setIsSaving(true);
      await window.aptos.signAndSubmitTransaction(transaction);
    } finally {
      setIsSaving(false);
    }
  };

  React.useEffect(() => {
    if (!address) return;
    client.getAccount(address).then(setAccount);
  }, [address]);

  React.useEffect(() => {
    if (!address) return;
    client.getAccountModules(address).then((m) => {
      console.log('m', m)
      setModules(m)
    });
  }, [address]);

  React.useEffect(() => {
    if (!address) return;
    client.getAccountResources(address).then(setResources);
  }, [address]);

  const hasModule = modules.some((m) => m.abi?.name === 'message');

  const publishInstructions = (
    <pre>
      Run this command to publish the module:
      <br/>
      aptos move publish --package-dir /path/to/hello_blockchain/
      --named-addresses HelloBlockchain={address}
    </pre>
  );

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
      const connectStatus = await window.aptos.connect()
      console.log('connectStatus', connectStatus)
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
        <pre>account: {JSON.stringify(account)}</pre>
        {hasModule ? (
          <form onSubmit={handleSubmit}>
            <textarea ref={ref} defaultValue={message}/>
            <input disabled={isSaving} type="submit"/>
          </form>
        ) : publishInstructions}

        <Button onClick={handleConnect}>connect</Button>
        <Button onClick={handleDisconnect}>disconnect</Button>
      </div>
    </>
  )
}

export default App

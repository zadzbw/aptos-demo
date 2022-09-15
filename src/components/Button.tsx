import React from 'react'

const btnClass = `m-2 p-2 border rounded text-red-500 font-bold`

export default function Button(props: React.HTMLAttributes<HTMLButtonElement>) {
  const { className } = props

  return <button className={`${btnClass} ${className}`} {...props} />
}

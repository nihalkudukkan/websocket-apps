import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div className='flex flex-col items-center justify-start h-screen'>
        <div className='border-2 p-2 mb-4'>
          <h2>Broadcast apps</h2>
          <div className='flex flex-col gap-2'>
            <Link className='cursor-pointer bg-slate-600 text-white p-2 rounded-sm' to={"/broadcast/author"}>Broadcast message author</Link>
            <Link className='cursor-pointer bg-slate-600 text-white p-2 rounded-sm' to={"/broadcast/subscriber"}>Broadcast message subscriber</Link>
          </div>
        </div>
        <div className='m-2'>
          <Link className='cursor-pointer bg-slate-600 text-white p-2 rounded-sm' to={"/chathome"}>Chat app</Link>
        </div>
    </div>
  )
}

import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
        <div>
            <Link to={"/broadcast/author"}>Broadcast message author</Link>
            <Link to={"/broadcast/subscriber"}>Broadcast message subscriber</Link>
        </div>
        <div className='m-2'>
          <Link className='cursor-pointer bg-slate-600 text-white p-2 rounded-sm' to={"/chathome"}>Chat app</Link>
        </div>
    </div>
  )
}

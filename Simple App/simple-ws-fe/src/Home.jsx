import React from 'react'
import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <div>
        <div>
            <Link to={"/broadcast/author"}>Broadcast message author</Link>
            <Link to={"/broadcast/subscriber"}>Broadcast message subscriber</Link>
        </div>
        <div>
          <Link to={"/chathome"}>Chat app</Link>
        </div>
    </div>
  )
}

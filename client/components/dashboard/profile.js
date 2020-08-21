import React from 'react'
import { Link, useParams } from 'react-router-dom'

export default () => {
  const { user: userIdFromRequest } = useParams()

  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <div id="title" className="text-xl">
            Profile
          </div>
          <div id="username" className="my-2 p-2 border rounded">
            {userIdFromRequest}
          </div>
          <ul>
            <li>
              <Link className="underline" to="/dashboard">
                Go To Root
              </Link>
            </li>
            <li>
              <Link className="underline" to="/dashboard/main">
                Go To Main
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </div>
  )
}

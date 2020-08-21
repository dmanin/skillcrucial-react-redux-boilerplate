import React from 'react'
import { Link } from 'react-router-dom'
import { USER_ID } from '../../constants'

export default () => {
  return (
    <div>
      <div className="flex items-center justify-center">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <div id="title" className="text-xl">
            Dashboard
          </div>
          <ul>
            <li>
              <Link className="underline" to={`/dashboard/profile/${USER_ID}`}>
                Go To Profile
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

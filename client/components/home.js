import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Header from './header'
import Root from './dashboard/root'
import Main from './dashboard/main'
import Profile from './dashboard/profile'

const Home = () => {
  return (
    <div>
      <Header />
      <div className="flex items-center justify-center h-screen">
        <div className="bg-indigo-800 text-white font-bold rounded-lg border shadow-lg p-10">
          <Switch>
            <Route exact path="/dashboard/main" component={Main} />
            <Route exact path="/dashboard/profile/:user" component={Profile} />
            <Route path="/dashboard" component={Root} />
          </Switch>
        </div>
      </div>
    </div>
  )
}

Home.propTypes = {}

export default React.memo(Home)

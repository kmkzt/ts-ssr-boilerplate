import React from 'react'
import { Switch, Link, Route } from 'react-router-dom'

export default function App() {
  return (
    <>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        <li>
          <Link to="/about">About</Link>
        </li>
        <li>
          <Link to="/dashboard">Dashboard</Link>
        </li>
      </ul>
      <Switch>
        <Route exact path="/">
          <h1>HOME</h1>
        </Route>
        <Route path="/about">
          <h1>ABOUT</h1>
        </Route>
        <Route path="/dashboard">
          <h1>dashboard</h1>
        </Route>
      </Switch>
    </>
  )
}

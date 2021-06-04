import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

import Home from './pages/Home/Home'
import NextPage from './pages/NextPage/NextPage'


function Routes() {
    return (
        <BrowserRouter>
            <Switch>
                <Route path="/" exact component={ Home } />
                <Route path="/next-page" exact component={ NextPage } />
            </Switch>
        </BrowserRouter>
    )
}

export default Routes

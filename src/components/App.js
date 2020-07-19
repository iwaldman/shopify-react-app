import React from 'react'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import { Provider as StyletronProvider, DebugEngine } from 'styletron-react'
import { Client as Styletron } from 'styletron-engine-atomic'

import HomePage from '../pages/HomePage'
import ProductPage from '../pages/ProductPage'
import Navbar from './Navbar'
import Cart from './Cart'
import ShopProvider from '../context/ShopContext'

const debug = process.env.NODE_ENV === 'production' ? void 0 : new DebugEngine()
const engine = new Styletron()

const App = () => {
  return (
    <ShopProvider>
      <StyletronProvider value={engine} debug={debug} debugAfterHydration>
        <Router>
          <Navbar />
          <Cart />
          <Switch>
            <Route path="/product/:id">
              <ProductPage />
            </Route>
            <Route path="/">
              <HomePage />
            </Route>
          </Switch>
        </Router>
      </StyletronProvider>
    </ShopProvider>
  )
}

export default App

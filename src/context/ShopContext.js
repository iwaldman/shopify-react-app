import React, { Component } from 'react'
import Client from 'shopify-buy'

const ShopContext = React.createContext()

// Initializing a client to return content in the store's primary language
const client = Client.buildClient({
  storefrontAccessToken: 'dd4d4dc146542ba7763305d71d1b3d38',
  domain: 'graphql.myshopify.com',
})

class ShopProvider extends Component {
  state = {
    products: [],
    product: {},
    checkout: {},
    isCartOpen: false,
  }

  componentDidMount() {
    // Check if localStorage has a checkout_id saved
    if (localStorage.checkout) {
      this.fetchCheckout(localStorage.checkout)
    } else {
      this.createCheckout()
    }
  }

  // Create an empty checkout
  createCheckout = async () => {
    try {
      const checkout = await client.checkout.create()
      localStorage.setItem('checkout', checkout.id)
      this.setState({ checkout })
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch the previous checkout
  fetchCheckout = async (checkoutId) => {
    try {
      const checkout = await client.checkout.fetch(checkoutId)
      this.setState({ checkout })
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch all products in your shop
  fetchAllProducts = async () => {
    try {
      const products = await client.product.fetchAll()
      this.setState({ products })
    } catch (error) {
      console.error(error)
    }
  }

  // Fetch a single product by ID
  fetchProductWithId = async (id) => {
    try {
      const product = await client.product.fetch(id)
      this.setState({ product })

      console.log(JSON.stringify(product))

      return product
    } catch (error) {
      console.error(error)
    }
  }

  // Add an item to the checkout
  addItemToCheckout = async (variantId, quantity) => {
    const lineItemsToAdd = [
      {
        variantId,
        quantity: parseInt(quantity, 10),
      },
    ]

    const checkout = await client.checkout.addLineItems(
      this.state.checkout.id,
      lineItemsToAdd
    )

    this.setState({ checkout })
    console.log(checkout)

    this.openCart()
  }

  closeCart = () => {
    this.setState({ isCartOpen: false })
  }

  openCart = () => {
    this.setState({ isCartOpen: true })
  }

  render() {
    return (
      <ShopContext.Provider
        value={{
          ...this.state,
          fetchAllProducts: this.fetchAllProducts,
          fetchProductWithId: this.fetchProductWithId,
          closeCart: this.closeCart,
          openCart: this.openCart,
          addItemToCheckout: this.addItemToCheckout,
        }}
      >
        {this.props.children}
      </ShopContext.Provider>
    )
  }
}

const ShopConsumer = ShopContext.Consumer

export { ShopConsumer, ShopContext }

export default ShopProvider

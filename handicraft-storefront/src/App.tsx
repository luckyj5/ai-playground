import { Route, Routes } from 'react-router-dom'
import { AuthProvider } from './store/AuthContext'
import { CatalogProvider } from './store/CatalogContext'
import { CartProvider } from './store/CartContext'
import { OrdersProvider } from './store/OrdersContext'
import { PrefsProvider } from './store/PrefsContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderDetail from './pages/OrderDetail'
import Orders from './pages/Orders'
import Sell from './pages/Sell'
import SellNew from './pages/SellNew'
import Profile from './pages/Profile'
import Returns from './pages/Returns'

export default function App() {
  return (
    <PrefsProvider>
    <AuthProvider>
      <CatalogProvider>
        <CartProvider>
          <OrdersProvider>
            <div className="min-h-full flex flex-col bg-ivory">
              <Navbar />
              <main className="flex-1 animate-fade-in">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/shop" element={<Shop />} />
                  <Route path="/product/:id" element={<ProductDetail />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/orders" element={<Orders />} />
                  <Route path="/orders/:id" element={<OrderDetail />} />
                  <Route path="/sell" element={<Sell />} />
                  <Route path="/sell/new" element={<SellNew />} />
                  <Route path="/profile" element={<Profile />} />
                  <Route path="/returns" element={<Returns />} />
                  <Route
                    path="*"
                    element={
                      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
                        <h1 className="text-2xl font-semibold text-bark">
                          Page not found
                        </h1>
                      </div>
                    }
                  />
                </Routes>
              </main>
              <Footer />
            </div>
          </OrdersProvider>
        </CartProvider>
      </CatalogProvider>
    </AuthProvider>
    </PrefsProvider>
  )
}

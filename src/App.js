import React from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row, Col } from "react-bootstrap";
import { Routes, Route } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import AdminDashboard from "./components/AdminDashboard";
import Furnitures from './components/Furnitures';
import Homewares from './components/Homewares';
import Cart from './components/Cart';
import Wishlist from './components/Wishlist';
import Electricalgoods from './components/Electricalgoods';
import { UserAuthContextProvider } from "./context/UserAuthContext";  
import { ProductContextProvider } from "./context/Productcontext";
import { CartContextProvider } from "./context/Cartcontext";
import { WishlistContextProvider } from './context/Wishlistcontext';
import { ReviewProvider } from './context/ReviewContext'; 
import AboutUs from './components/AboutUs';
import ReturnAndRefundPolicy from './components/ReturnRefundPolicy';
import ContactUs from './components/ContactUs';
import Addproducts from './components/Addproducts';
import ProtectedRoute, { AdminRoute, SellerRoute, CustomerRoute } from "./components/ProtectedRoute";
import Checkout from './components/Checkout';
import ManageUsers from './components/ManageUsers';
import SellerDashboard from './components/SellerDashboard';
import ManageProducts from './components/ManageProduct';
import MyListings from './components/MyListing';
import Orders from './components/Orders';
import SellerQueries from './components/SellerQueries';
import BeSeller from './components/BeSeller';
import CustomerHeader from './components/Customerheader';
import CustomerOrders from './components/CustomerOrders'; 
import AllProducts from './components/Allproducts';
import OtherProducts from './components/Otherproducts';


function App() {
  return (
    <UserAuthContextProvider>
      <ProductContextProvider>
        <CartContextProvider>
          <WishlistContextProvider>
            <ReviewProvider>
        
        <Container>
          <Row>
            <Col>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/aboutus" element={<AboutUs />} />
                <Route path="/login" element={<Login />} />
                <Route path="/signup" element={<Signup />} />
                <Route path="/customer" element={<CustomerRoute><Dashboard /></CustomerRoute>} />
                <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
                <Route path="/Furnitures" element={<Furnitures/>} />
                <Route path="/Homewares" element={<Homewares/>} />
                <Route path="/Electricalgoods" element={<Electricalgoods/>} />
                <Route path="/Cart" element={<Cart/>} />
                <Route path="/return-refund-policy" element={<ReturnAndRefundPolicy/>} />
                <Route path="/contactus" element={<ContactUs/>} />
                <Route path="/Allproducts" element={<AllProducts />} />
                <Route path="/Otherproducts" element={<OtherProducts />} />
                <Route path="/addproduct" element={<SellerRoute><Addproducts/></SellerRoute>} />
                <Route path="/Wishlist" element={<Wishlist/>} />
                <Route path="/checkout" element={<Checkout/>} />
                <Route path="/manageusers" element={<AdminRoute><ManageUsers/></AdminRoute>} />
                <Route path="/seller" element={<SellerRoute><SellerDashboard/></SellerRoute>}/>
                <Route path="/manageproduct" element={<AdminRoute><ManageProducts/></AdminRoute>}/>
                <Route path="/mylistings" element={<SellerRoute><MyListings/></SellerRoute>}/>
                <Route path="/orders" element={<SellerRoute><Orders/></SellerRoute>}/>
                <Route path="/sellerqueries" element={<AdminRoute><SellerQueries/></AdminRoute>}/>
                <Route path="/beseller" element={<CustomerRoute><BeSeller/></CustomerRoute>}/>
                <Route path="/customer-orders" element={<CustomerOrders />} /> 

              </Routes>
            </Col>
          </Row>
        </Container>
        </ReviewProvider>
        </WishlistContextProvider>
        </CartContextProvider>
      </ProductContextProvider>
    </UserAuthContextProvider>
  );
}

export default App;

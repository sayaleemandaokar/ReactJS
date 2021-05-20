import React, { useState } from 'react';
import logo from './logo.svg';
import "bootstrap/dist/css/bootstrap.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import {Container, Row, Col} from "reactstrap";
import {ToastContainer, toast} from 'react-toastify';
import BuyPage from './Components/BuyPage';
import Cart from "./Components/Cart";

function App() {
  
  const [cartItem, setCartItem] = useState([]);

  const addInCart = item => {
    const isAlreadyAdded = cartItem.findIndex(function(array){
      return array.id === item.id;
    })

    if(isAlreadyAdded !== -1){
      toast("Already added in Cart",{
        type: "error"
      });
      return;
    };
    
    setCartItem([...cartItem, item]); // hear video  10-2
    //if item not in the cart, then add the element into the cart by using above line
  }


  const buyNow = () =>{
    setCartItem([])

    toast("Purchase Complete", {
      type: "success"
    });
  };


  const removeItem = item => {
    setCartItem(cartItem.filter(singleItem => singleItem.id !== item.id))

    // toast("Item removed or deleted", {
    //   type: "error"
    // });
  };

  return(
    <Container fluid>
      <ToastContainer />
      <Row>
        <Col md = "8">
          <BuyPage addInCart={addInCart} />
        </Col>
        <Col md ="4">
          <Cart cartItem={cartItem} removeItem={removeItem} buyNow={buyNow} />
        </Col>
      </Row>
    </Container>
  )
}

export default App
import React, {useState, useEffect} from "react";
import Axios from "axios";
import {random, commerce} from "faker";
import {Container, Col, Row} from "reactstrap"
import CartItem from "./CartItem"

const apikey = "563492ad6f91700001000001cd24b312fef54316b0e73018d98a6c05" //pexels api key
// jsonware = https://jsonware.com/json/7f26bf2c0233a09ad8426b4e6ad9ccbd.json

const url = "https://api.pexels.com/v1/search?query=laptop&per_page=6&page=1";

//const localurl = "https://jsonware.com/json/7f26bf2c0233a09ad8426b4e6ad9ccbd.json";

const BuyPage = ({addInCart}) =>{
    
    const [product, setProduct] = useState([]);

        // const fetchPhotos = async() =>{
    //     const {data} = await Axios.get(localurl)
    // }

    const fetchPhotos = async() =>{
        const {data} = await Axios.get(url, {
            headers: {
                Authorization: apikey
            }
        })

        const {photos} = data;

        const allProduct = photos.map(photo => ({
            smallImage: photo.src.medium,
            tinyImage: photo.src.tiny,
            productName: random.word(),
            productPrice: commerce.price(),
            id: random.uuid()
        }))

        setProduct(allProduct);
    }

    useEffect(() => {
        fetchPhotos()
    }, [])


    return(
        <Container fluid>
            <h1 className = "text-success text-center">Buy Page</h1>
            <Row>
                {product.map(product => (
                    <Col md={4} key={product.id}>
                        <CartItem product={product} addInCart={addInCart} />
                    </Col>
                ))}
            </Row>
        </Container>
    )
}

export default BuyPage;


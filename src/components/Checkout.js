import React, { useState, useEffect } from "react";
import { Alert, Button, Form, InputGroup, Modal } from "react-bootstrap";
import Footer from "./Footer";
import '../css/Checkout.css';
import CheckoutService from "../context/CheckoutServices";
import HeaderSwitcher from "./HeaderSwitcher";
import { useNavigate } from "react-router-dom";
import { useLocation } from 'react-router-dom';
import { getAuth } from "firebase/auth"; //This will import the authentication from firebase

function Checkout() {
    const [discountCode, setDiscountCode] = useState([]);
    const [appliedDiscount, setAppliedDiscount] = useState(null);
    const [cardNumber, setCardNumber] = useState("");
    const [address, setAddress] = useState("");
    const [city, setCity] = useState("");
    const [region, setRegion] = useState("");
    const [zipCode, setZipCode] = useState("");
    const [message, setMessage] = useState({ error: false, msg: "" });
    const [country, setCountry] = useState("");
    const [subTotal, setSubTotal] = useState(0.00);
    const [discount, setDiscount] = useState(0.00);
    const [serverFee, setServerFee] = useState(0.00);
    const [totalCost, setTotalCost] = useState(0.00);
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [missingFields, setMissingFields] = useState([]);
    
    // Inside the Checkout function
    const location = useLocation();
    const selectedProducts = location.state?.selectedProducts || [];

    const navigate = useNavigate();

    useEffect(() => {
        // Calculate SubTotal when selectedProducts change
        let subtotal = selectedProducts.reduce((acc, item) => acc + item.productPrice, 0);
        setSubTotal(subtotal);
      
        // Calculate Server Fee
        const serverPercentage = 0.15; // 15% server fee
        const serverValue = subtotal * serverPercentage;
        setServerFee(serverValue);
      
        // Calculate Total Cost without discount
        const totalCost = subtotal + serverValue;
        setTotalCost(totalCost);
      }, [selectedProducts]);
      
    
    const discountCodes = {
        "DISCOUNT50": 0.50, // 50% discount
        "DISCOUNT20": 0.20, // 20% discount
        "DISCOUNT15": 0.15, // 15% discount
        "DISCOUNT10": 0.10  // 10% discount
    };

    const handleApplyDiscount = () => {
        const discountPercentage = discountCodes[discountCode.toUpperCase()] || 0;
        
        if (discountPercentage > 0) {
            const discountValue = subTotal * discountPercentage;
            const newTotalCost = subTotal - discountValue + serverFee;

            setDiscount(discountValue);
            setTotalCost(newTotalCost);
            setDiscountCode('');
            setMessage({ error: false, msg: "Discount applied successfully!" });
        } else {
            setMessage({ error: true, msg: "Invalid discount code!" });
        }
    }; 

    const handleRemoveDiscount = () => {
        const newTotalCost = subTotal + serverFee; // Remove the discount from total cost
        setDiscount(0);
        setTotalCost(newTotalCost);
        setAppliedDiscount(null); // Clear applied discount
        setMessage({ error: false, msg: "Discount removed successfully!" });
    };
    
    const handleCardNumberChange = (e) => {
        const { value } = e.target; // Safely access value from event target
        let formattedValue = value.replace(/\D/g, ''); // Remove all non-digit characters
        formattedValue = formattedValue.replace(/(\d{4})(?=\d)/g, '$1 '); // Add space after every 4 digits
        setCardNumber(formattedValue); // Update state with formatted value
    };
    
    //This will create an encryption for the card number
    function simpleEncrypt(cardNumber) {
        return cardNumber.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 3)).join('');
    }
    
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Fetch the logged-in user's ID
        const auth = getAuth();
        const user = auth.currentUser;
        const userId = user ? user.uid : null;

        if (!userId) {
            setMessage({ error: true, msg: "User not logged in!" });
            return;
        }

        setMessage("");
        setMissingFields([]);  // Reset missing fields

        // Track missing fields
        let missingFields = [];

        if (address === "") missingFields.push("Street Address");
        if (city === "") missingFields.push("City");
        if (region === "") missingFields.push("State/Province/Region");
        if (zipCode === "") missingFields.push("Zip/Postal Code");
        if (country === "") missingFields.push("Country");
        if (cardNumber === "") missingFields.push("Card Number");

        if (missingFields.length > 0) {
            setMissingFields(missingFields);  // Set the missing fields to the state
            setShowErrorModal(true);  // Show the error modal
            return;
        }

        const encryptedCardNumber = simpleEncrypt(cardNumber);// This will store the encrypted card number

        const checkoutData = {
            paymentId: "", // Provide a default empty string or some fallback value
            userId: userId,  // Set the user ID here
            cardNumber: encryptedCardNumber || "",
            address: address || "",
            city: city || "",
            region: region || "",
            zipCode: zipCode || "",
            country: country || "",
            serverFee: serverFee.toFixed(2),
            totalCost: totalCost.toFixed(2),
            items: selectedProducts.map(item => ({
                productName: item.productName || "Unknown Product",
                productDescription: item.productDescription || "",
                productPrice: item.productPrice || 0,
                imageUrls: item.imageUrls || "", // Use a placeholder URL or empty string if missing
                sellerId: item.sellerId || "Unknown Seller", // Ensure sellerId is provided
            }))
        };
        
        try {
            await CheckoutService.addCheckout(checkoutData, userId);
            setMessage({ error: false, msg: "Payment successful!" });
            setShowModal(true); // Show the modal when payment is successful
        } catch (err) {
            setMessage({ error: true, msg: err.message });
        }

        setAddress("");
        setCity("");
        setCountry("");
        setRegion("");
        setZipCode("");
        setCardNumber("");
    };

    return (
        <>
            <div className="p-4 box">
                <div className="wrapper">
                    <HeaderSwitcher/>
                    <div className="main-content">
                        {message?.msg && (
                            <Alert
                                variant={message?.error ? "danger" : "success"}
                                dismissible
                                onClose={() => setMessage("")}
                            >
                                {message?.msg}
                            </Alert>
                        )}
                        <h2 className="text-center mb-4">Checkout</h2>
                        <div className="products-history">
                        <h4>Products History</h4>
                        </div>
                        <br/>
                        {selectedProducts.length > 0 ? (
                        <div className="row justify-content-center">
                            {selectedProducts.map((item, index) => (
                            <div className="col-md-4" key={index}>
                                <div className="card text-center">
                                <div className="card-body">
                                    {item.imageUrls && (
                                    <>
                                        <img 
                                        src={item.imageUrls[0]} 
                                        alt={item.productName} 
                                        className="card-img-top"
                                        />
                                    </>
                                    )}
                                    <h5 className="card-title">{item.productName}</h5>
                                    <p className="card-text">{item.productDescription}</p>
                                    <p className="card-text"><strong>Price: ${item.productPrice}</strong></p>
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                        ) : (
                        <p>Your cart is empty.</p>
                        )}
                        <br/>
                        <Form onSubmit={handleSubmit}>
                            <div className="form-container">
                                <div className="form-box">
                                    <div className="flex-container">
                                        <InputGroup className="input-width">
                                            <Form.Control
                                                type="text"
                                                placeholder="Discount Code"
                                                maxLength={10}
                                                value={discountCode}
                                                onChange={(e) => setDiscountCode(e.target.value)} 
                                            />
                                        </InputGroup>
                                        <Button
                                            variant="success" 
                                            size="md" 
                                            className="apply-button"
                                            onClick={handleApplyDiscount}
                                        >
                                            Apply    
                                        </Button>
                                        <Button
                                            variant="danger"
                                            size="md"
                                            className="remove-button"
                                            onClick={handleRemoveDiscount}
                                        >
                                            Remove
                                        </Button>
                                    </div> 
                                    <Form.Group className="mb-3" controlId="formCardNumber">
                                        <InputGroup>
                                            <InputGroup.Text id="formCardNumber">Card Number </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="xxxx xxxx xxxx xxxx"
                                                maxLength={19}
                                                value={cardNumber}
                                                onChange={(e) => handleCardNumberChange(e)}
                                                style={{ width: "100%" }}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <p>Billing Address</p>
                                    <hr/>
                                    <Form.Group className="mb-3" controlId="formStreetAddress">
                                        <InputGroup>
                                            <InputGroup.Text id="formStreetAddress">Street Address </InputGroup.Text>
                                            <Form.Control
                                                type="text"
                                                placeholder="Street Address"
                                                value={address}
                                                onChange={(e) => setAddress(e.target.value)}
                                                style={{ width: "100%" }}
                                            />
                                        </InputGroup>
                                    </Form.Group>
                                    <div className="d-flex justify-content-between">
                                        <Form.Group className="mb-3 flex-grow-1 me-3" controlId="formCity">
                                            <InputGroup>
                                                <InputGroup.Text id="formCity">City </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="City"
                                                    value={city}
                                                    onChange={(e) => setCity(e.target.value)}
                                                    style={{ width: "100%" }}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3 flex-grow-1" controlId="formRegion">
                                            <InputGroup>
                                                <InputGroup.Text id="formRegion">State/Province/Region </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="State/Province/Region"
                                                    value={region}
                                                    onChange={(e) => setRegion(e.target.value)}
                                                    style={{ width: "100%" }}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <Form.Group className="mb-3 flex-grow-1 me-3" controlId="formZipCode">
                                            <InputGroup>
                                                <InputGroup.Text id="formZipCode">Zip/Postal Code </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Zip/Postal Code"
                                                    value={zipCode}
                                                    onChange={(e) => setZipCode(e.target.value)}
                                                    style={{ width: "100%" }}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                        <Form.Group className="mb-3 flex-grow-1" controlId="formCountry">
                                            <InputGroup>
                                                <InputGroup.Text id="formCountry">Country </InputGroup.Text>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Country"
                                                    value={country}
                                                    onChange={(e) => setCountry(e.target.value)}
                                                    style={{ width: "100%" }}
                                                />
                                            </InputGroup>
                                        </Form.Group>
                                    </div> 
                                    <div className="form-box">
                                        <h5 style={{textAlign:'center'}}>Payment Summary</h5>
                                        <br/>
                                        <div className="mb-3">
                                            <div className="align-items">
                                                <span className="label">Sub Total:</span> 
                                                <span className="value">${subTotal.toFixed(2)}</span>
                                            </div>
                                            <div className="align-items">
                                                <span className="label">Discount:</span> 
                                                <span className="value">$-{discount.toFixed(2)}</span>
                                            </div>
                                            <div className="align-items">
                                                <span className="label">Server Fee (15%):</span> 
                                                <span className="value">${serverFee.toFixed(2)}</span>
                                            </div>
                                            <br/>
                                            <div className="align-items">
                                                <span className="label">Total Cost:</span> 
                                                <span className="value">${totalCost.toFixed(2)}</span>
                                            </div>
                                        </div>
                                        <br/>
                                    </div>        
                                    <div className="text-center mt-3">
                                        <Button
                                            variant="success" 
                                            size="lg" 
                                            className="paynow-button"
                                            onClick={handleSubmit}
                                            type="submit"
                                        >
                                            Pay Now    
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </Form>
                    </div>
                </div> 
            </div>
            {/* Success Modal */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
                <Modal.Title>Payment Successful</Modal.Title>
            </Modal.Header>
            <Modal.Body>Your payment was processed successfully!</Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={() => {
                    setShowModal(false);
                    navigate('/Cart');
                }}>
                    Close
                </Button>
            </Modal.Footer>
            </Modal>
            {/* Error Modal */}
            <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Missing Information</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Please fill in the following mandatory fields: 
                    <ul>
                        {missingFields.map((field, index) => (
                            <li key={index}>{field}</li>
                        ))}
                    </ul>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => setShowErrorModal(false)}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </> 
    );
}

export default Checkout;

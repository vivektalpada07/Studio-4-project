import Footer from './Footer';
import '../css/ReturnRefundPolicy.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container, Row } from 'react-bootstrap';
import HeaderSwitcher from './HeaderSwitcher';
import { useEffect, useState } from 'react';
import { getDownloadURL, getStorage, ref } from 'firebase/storage';

function ReturnAndRefundPolicy() {
  const [policyImage, setPolicyImage] = useState("");

  
  const storage = getStorage();

  useEffect(() => {
    // Fetch image URL from Firebase Storage
    const fetchImage = async () => {
      try {

        const imageRef = ref(storage, "images/r&rpolicy.png"); 


        const url = await getDownloadURL(imageRef);

        // Set the image URL to state
        setPolicyImage(url);
      } catch (error) {
        console.error("Error fetching image:", error);
      }
    };

    fetchImage();
  }, []);

  return (
    <div className='wrapper'>
      <HeaderSwitcher/>
        <div className='main-content'>
          <Container className='RRPolicy'>
            <Row className='Title'>
              <h3>Return & Refund Policy</h3>
            </Row>

            <Row>
              <p>
                Thankyou for shopping at Eco Shop. In any case if you are not satisfied with your
                <br></br>
                purchase you can follow the return and refund process as mentioned below.
              </p>
            </Row>
            <br></br>
            <Row className='Return'>
              <h5>Returns</h5>
            </Row>
      
            <Row className='Description'>
              <p>
                You have only 30 days to return a product from the date you received it. To be
                eligible for a return, your product must be unused and it needs to have the proof 
                of purchase.
              </p>
            </Row>

            <Row className='Refund'>
              <h5>Refunds</h5>
            </Row>
      
            <Row className='Description'>
              <p>
                Once we receive your product, we will let you know that we have received your product.
                If your product is approved, we will do a refund to any payment method of your choice.
              </p>
            </Row>
            {/* Display the fetched image */}
            {policyImage ? (
              <img src={policyImage} alt="R&RPolicy" className="policy-image" />
            ): (
              <p>Loading Image...</p>
            )}
          </Container>
        </div>
      <Footer />
    </div>
  );
}

export default ReturnAndRefundPolicy;

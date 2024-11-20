import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { ReviewContext } from '../context/ReviewContext';
import { useUserAuth } from '../context/UserAuthContext';

const Reviews = () => {
  const { reviews, fetchAllReviews } = useContext(ReviewContext); // Access all reviews from context
  const { user } = useUserAuth(); // Access authenticated user (admin)
  const [showReviews, setShowReviews] = useState(false); //show all review

  // Fetch all reviews when the component is mounted
  useEffect(() => {
    if (user && user.role === 'admin') {
      fetchAllReviews();
    }
  }, [user, fetchAllReviews]);

  return (
    <div>
      <h2>All Product Reviews (Admin)</h2>

      {/* Button to show review */}
      <Button size='md' onClick={() => setShowReviews(!showReviews)}>
        {showReviews ? 'Hide Reviews' : 'Show All Reviews'}
      </Button>

      {/* Display relevant reviews fields in table format */}
      {showReviews && reviews.length > 0 ? (
        <Table striped bordered hover className="mt-4">
          <thead>
            <tr>
              <th>Product Name</th>
              <th>Review Content</th>
              <th>Customer Name</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {reviews.map((review) => (
              <tr key={review.id}>
                <td>{review.productName || "Unknown"}</td> 
                <td>{review.content || "No content"}</td> 
                <td>{review.customerName || "Anonymous"}</td> 
                <td>{review.createdAt && review.createdAt.seconds 
                      ? new Date(review.createdAt.seconds * 1000).toLocaleDateString() 
                      : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      ) : (
        <p>{showReviews ? 'No reviews available.' : ''}</p>
      )}
    </div>
  );
};

export default Reviews;

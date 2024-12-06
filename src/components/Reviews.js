import React, { useContext, useEffect, useState } from 'react';
import { Table, Button } from 'react-bootstrap';
import { ReviewContext } from '../context/ReviewContext';
import { useUserAuth } from '../context/UserAuthContext';
import LoadingPage from './Loadingpage';

const Reviews = () => {
  const { reviews, fetchAllReviews } = useContext(ReviewContext); // Access all reviews from context
  const { user } = useUserAuth(); // Access authenticated user (admin)
  const [showReviews, setShowReviews] = useState(false); // Show/hide reviews
  const [loading, setLoading] = useState(true); // Loading state for fetching reviews

  useEffect(() => {    
    const fetchReviews = async () => {
      if (user && user.role === 'admin') {
        try {
          await fetchAllReviews(); // Fetch reviews from context
        } catch (error) {
          console.error('Error fetching reviews:', error);
        } finally {
          setLoading(false); // Stop loading once fetch is complete
        }
      } else {
        setLoading(false); // Stop loading if user is not admin
      }
    };

    fetchReviews();
  }, [user, fetchAllReviews]);

  // Show loading page while reviews are being fetched
  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="container mt-4">
      <h2>All Product Reviews (Admin)</h2>

      {/* Button to toggle reviews display */}
      <Button size="md" onClick={() => setShowReviews(!showReviews)} className="mb-3">
        {showReviews ? 'Hide Reviews' : 'Show All Reviews'}
      </Button>

      {/* Display reviews in a table format */}
      {showReviews && reviews.length > 0 ? (
        <Table striped bordered hover>
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
                <td>{review.productName || 'Unknown'}</td>
                <td>{review.content || 'No content'}</td>
                <td>{review.customerName || 'Anonymous'}</td>
                <td>
                  {review.createdAt && review.createdAt.seconds
                    ? new Date(review.createdAt.seconds * 1000).toLocaleDateString()
                    : 'N/A'}
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

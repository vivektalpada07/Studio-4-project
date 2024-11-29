import React, { useEffect, useState } from 'react';
import AdminHeader from './Adminheader';
import Footer from './Footer';
import UserProfile from './UserProfile';
import '../css/AdminDashboard.css';
import LoadingPage from './Loadingpage';
import CheckoutService from '../context/CheckoutServices'; // Service for fetching checkout data from Firestore
import FBDataService from '../context/FBService'; // Service for fetching user data from Firestore
import { useUserAuth } from '../context/UserAuthContext'; // Hook for getting the currently logged-in user
import Reviews from './Reviews'; // Reviews component for displaying user feedback or ratings

function AdminDashboard() {
    const [totalServerFees, setTotalServerFees] = useState(0); // State to store the total server fees
    const [totalProductsSold, setTotalProductsSold] = useState(0); // State to store the total number of products sold
    const { user } = useUserAuth(); // Access the current authenticated user using the custom hook
    const [userName, setUserName] = useState(''); 
    const [loading, setLoading] = useState(true); // New state
// State to store the current user's name

    useEffect(() => {
        // Function to fetch checkout data and calculate total server fees and products sold
        const fetchCheckoutData = async () => {
            try {
                const querySnapshot = await CheckoutService.getAllCheckouts(); // Get all checkout documents from Firestore
                
                let totalFees = 0;
                let totalProducts = 0;

                // Iterate over each checkout document to calculate total fees and count products sold
                querySnapshot.docs.forEach(doc => {
                    const checkoutData = doc.data();
                    
                    // Add server fees, ensuring to handle missing or undefined data
                    const serverFee = parseFloat(checkoutData.serverFee || 0); 
                    totalFees += serverFee;

                    // Count the number of products in each checkout
                    const itemsSold = checkoutData.items ? checkoutData.items.length : 0;
                    totalProducts += itemsSold;
                });

                // Update state with the calculated totals
                setTotalServerFees(totalFees.toFixed(2)); // Set total server fees, formatted to 2 decimal places
                setTotalProductsSold(totalProducts); // Set total number of products sold
            } catch (error) {
                console.error("Error fetching checkout data: ", error); // Log any errors
            }
        };

        // Function to fetch the name of the currently logged-in user
        const fetchUserName = async () => {
            try {
                if (user) {
                    const userDoc = await FBDataService.getData(user.uid); // Fetch user document from Firestore using UID
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.name); // Set the user's name in state
                    } else {
                        console.log("No such user!"); // Log if no user is found with the given UID
                    }
                }
            } catch (error) {
                console.error('Error fetching user data: ', error); // Log any errors during user data fetching
            }
        };

        // Fetch checkout data and user name when the component mounts
        fetchCheckoutData();
        fetchUserName();
    }, [user]); // Re-run when the user state changes (e.g., when the user logs in/out)
// Show loading page while data is being fetched
if (loading) {
  return <LoadingPage />;
}
    return (
      <div className='main-content' style={{marginTop: -40}}>
        <AdminHeader /> {/* Renders the admin dashboard header */}
        <h2 className='welcome-message'>Welcome to the Admin Dashboard, {userName}!</h2> {/* Display a personalized welcome message */}
        <div className="content">
          <div className="user-profile"><UserProfile /></div> {/* Displays the user profile */}
          <div className="dashboard-summary">
            <h3 className='summary-box'>
              <p className="text">Total Server Fees </p>${totalServerFees} {/* Displays the total server fees */}
            </h3>
            <h3 className='summary-box'>
              <p className="text">Total Products Sold </p>{totalProductsSold} {/* Displays the total number of products sold */}
            </h3>
          </div>
        </div>
        <Reviews /> {/* Displays reviews or feedback in the admin dashboard */}
      </div>
    );
}
  
export default AdminDashboard;

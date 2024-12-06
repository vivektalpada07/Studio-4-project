import React, { useEffect, useState } from 'react';
import AdminHeader from './Adminheader'; // Admin dashboard header component
import Footer from './Footer'; // Footer component
import UserProfile from './UserProfile'; // Component to display the admin's profile
import '../css/AdminDashboard.css'; // Styles specific to the admin dashboard
import LoadingPage from './Loadingpage'; // Component to display a loading screen
import CheckoutService from '../context/CheckoutServices'; // Service for managing checkout data in Firestore
import FBDataService from '../context/FBService'; // Service for managing user-related Firestore data
import { useUserAuth } from '../context/UserAuthContext'; // Hook for managing user authentication context
import Reviews from './Reviews'; // Component to display reviews or feedback from users

function AdminDashboard() {
    // State variables
    const [totalServerFees, setTotalServerFees] = useState(0); // Stores total server fees earned
    const [totalProductsSold, setTotalProductsSold] = useState(0); // Stores total number of products sold
    const { user } = useUserAuth(); // Gets the current authenticated user
    const [userName, setUserName] = useState(''); // Stores the name of the logged-in admin
    const [loading, setLoading] = useState(true); // Manages loading state during data fetching

    // UseEffect to fetch data when the component is mounted or `user` changes
    useEffect(() => {
        // Function to fetch checkout data and calculate fees/products sold
        const fetchCheckoutData = async () => {
            try {
                const querySnapshot = await CheckoutService.getAllCheckouts(); // Retrieve checkout records
                
                let totalFees = 0; // Initialize total fees counter
                let totalProducts = 0; // Initialize total products counter

                // Loop through all checkout records
                querySnapshot.docs.forEach(doc => {
                    const checkoutData = doc.data(); // Get checkout document data
                    
                    // Calculate server fees, ensuring undefined values are handled as 0
                    const serverFee = parseFloat(checkoutData.serverFee || 0);
                    totalFees += serverFee;

                    // Calculate the number of items sold in the checkout
                    const itemsSold = checkoutData.items ? checkoutData.items.length : 0;
                    totalProducts += itemsSold;
                });

                // Update state with the calculated totals
                setTotalServerFees(totalFees.toFixed(2)); // Round fees to 2 decimal places
                setTotalProductsSold(totalProducts); // Set total items sold
            } catch (error) {
                console.error("Error fetching checkout data: ", error); // Log any errors
            }
        };

        // Function to fetch admin's name using their user ID
        const fetchUserName = async () => {
            try {
                if (user) {
                    const userDoc = await FBDataService.getData(user.uid); // Fetch user's Firestore data
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.name); // Set the user's name in state
                    } else {
                        console.log("No such user found in Firestore!");
                    }
                }
            } catch (error) {
                console.error('Error fetching user data: ', error); // Log errors
            }
        };

        // Call both fetch functions and set loading to false after data is fetched
        Promise.all([fetchCheckoutData(), fetchUserName()]).finally(() => setLoading(false));
    }, [user]); // Dependencies array: triggers effect when `user` changes

    // Show a loading page while data is being fetched
    if (loading) {
        return <LoadingPage />;
    }

    return (
        <div className='main-content' style={{ marginTop: -40 }}>
            <AdminHeader /> {/* Renders the header of the admin dashboard */}
            <h2 className='welcome-message'>
                Welcome to the Admin Dashboard, {userName}!
            </h2> {/* Display a personalized welcome message */}
            
            <div className="content">
                <div className="user-profile">
                    <UserProfile /> {/* Displays admin profile information */}
                </div>
                
                <div className="dashboard-summary">
                    <h3 className='summary-box'>
                        <p className="text">Total Server Fees</p>${totalServerFees} {/* Display server fees */}
                    </h3>
                    <h3 className='summary-box'>
                        <p className="text">Total Products Sold</p>{totalProductsSold} {/* Display total products sold */}
                    </h3>
                </div>
            </div>
            
            <Reviews /> {/* Displays reviews or feedback */}
        </div>
    );
}

export default AdminDashboard;

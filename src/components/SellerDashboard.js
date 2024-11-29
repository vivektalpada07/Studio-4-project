import React, { useEffect, useState } from 'react';
import SellerHeader from './SellerHeader';
import UserProfile from './UserProfile';
import { useUserAuth } from '../context/UserAuthContext';
import FBDataService from '../context/FBService';
import CheckoutService from '../context/CheckoutServices'; 
import '../css/SellerDashboard.css';
import LoadingPage from './Loadingpage';
function SellerDashboard() {
    const { user } = useUserAuth(); 
    const [username, setUsername] = useState('');
    const [totalEarnings, setTotalEarnings] = useState(0); // State to store total earnings
    const [loading, setLoading] = useState(true); // New state


    useEffect(() => {
        if (user && user.uid) {
            const fetchUserData = async () => {
                try {
                    const userDoc = await FBDataService.getData(user.uid); // Fetch user data
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUsername(userData.name); // Set username from user data
                    }
                } catch (error) {
                    console.error('Error fetching user data: ', error);
                }
            };

            const fetchEarningsData = async () => {
                try {
                    const querySnapshot = await CheckoutService.getAllCheckouts(); 
                    let total = 0;
                    
                    querySnapshot.docs.forEach(doc => {
                        const checkoutData = doc.data();
                        if (checkoutData.items) {
                            checkoutData.items.forEach(item => {
                                if (item.sellerId === user.uid) {
                                    const price = parseFloat(item.productPrice || 0);
                                    // const serverFee = parseFloat(checkoutData.serverFee || 0);
                                    total += (price*0.85); // Deduct service fee
                                }
                            });
                        }
                    });

                    setTotalEarnings(total.toFixed(2)); // Set total earnings
                } catch (error) {
                    console.error('Error fetching earnings data: ', error);
                }
            };

            fetchUserData();
            fetchEarningsData(); 
        }
    }, [user]);
// Show loading page while data is being fetched
if (loading) {
    return <LoadingPage />;
  }
    return (
        <div className="main-content">
            <SellerHeader />
            <h2 className="welcome-message">Welcome to the Seller Dashboard, {username}!</h2>
            <div className="content">
                <div className="user-profile"><UserProfile /></div>
                <div className="dashboard-summary">
                    <h3 className='summary-box'>
                        <p className="text">Total Earnings </p>${totalEarnings}
                    </h3>
                </div>
            </div>
        </div>
    );
}

export default SellerDashboard;

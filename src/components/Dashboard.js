import React, { useEffect, useState } from 'react';
import Footer from './Footer'; // Import the Footer component
import UserProfile from './UserProfile'; // Import the UserProfile component
import CustomerHeader from './Customerheader'; // Import the CustomerHeader component
import { useUserAuth } from '../context/UserAuthContext'; // Import user authentication context
import FBDataService from '../context/FBService'; // Import service for fetching data from Firestore
import '../css/Dashboard.css'; // Import CSS for dashboard styling

function Dashboard() {
    const { user } = useUserAuth(); // Access the currently authenticated user from context
    const [userName, setUserName] = useState(''); // State to hold the user's name

    // Fetch the user's name when the component mounts
    useEffect(() => {
        const fetchUserName = async () => {
            if (user) {
                try {
                    // Get user data from Firestore using the user's UID
                    const userDoc = await FBDataService.getData(user.uid);
                    if (userDoc.exists()) {
                        const userData = userDoc.data();
                        setUserName(userData.name); // Update state with the user's name
                    } else {
                        console.log("No such user!"); // Log if no user document is found
                    }
                } catch (error) {
                    console.error('Error fetching user data: ', error); // Log any errors that occur during fetch
                }
            }
        };

        fetchUserName(); // Call the function to fetch the user's name
    }, [user]); // Re-run this effect if the user changes

    return (
        <div className='main-content'>
            <CustomerHeader /> {/* Render the header for the customer */}
            {/* Display a personalized welcome message with the user's name */}
            <h2 className='welcome-message'>Welcome to the Dashboard, {userName}!</h2>
            <div className='user-profile'>
                <UserProfile /> {/* Render the user's profile component */}
            </div>
        </div>
    );
}

export default Dashboard;

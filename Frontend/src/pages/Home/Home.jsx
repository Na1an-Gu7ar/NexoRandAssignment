import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');

  // Fetch all users (friends) from backend
  const fetchFriends = async () => {
    try {
      const response = await fetch("https://nexo-rand-backend.vercel.app/api/user/v1/get-users", {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass token if required for protected routes
        },
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      const sortedFriends = data.data.sort((a, b) => b.Points - a.Points);

      setFriends(sortedFriends); // Set the fetched users as friends
    } catch (err) {
      setError('Error fetching friends.');
      // console.error('Error fetching friends:', err);
      toast.error('Error fetching friends.');
    }
  };

  useEffect(() => {
    fetchFriends();
  }, []);

  // Function to claim points for a friend
  const claimPoints = async (username, firstName) => {
    try {
      // Make PATCH request to increment points
      const response = await fetch("https://nexo-rand-backend.vercel.app/api/user/v1/claim-points", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Pass token if required
        },
        body: JSON.stringify({ username }), // Adjust points increment as needed
      });

      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      await fetchFriends();
      toast.success('Points claimed successfully for ' + firstName);
    } catch (error) {
      // console.error('Error claiming points:', error);
      setError('Error claiming points.');
      toast.error('Error claiming points.');
    }
  };

  return (
    <div className='flex justify-center flex-col items-center p-10'>
      {/* {error && <p className="error-message">{error}</p>} */}
      <ToastContainer />
      <div className='bg-blue-500 w-[50vw] h-[10vh] flex justify-between items-center'>
        <h1 className='text-white'>Total Friends: {friends.length}<br/>Total Points: {friends.reduce((acc, friend) => acc + friend.Points, 0)}</h1>
        <button className='text-black'>Leaderboard</button>
      </div>
      <ul className='w-[50vw]'>
        {friends.map((friend, index) => (
          <li
            key={friend._id}
            onClick={() => claimPoints(friend.username, friend.firstName)}
            style={{ cursor: 'pointer' }}
            className='flex justify-between mt-3 p-4 h-[10vh] items-center hover:bg-slate-200 rounded'
          >
            <div className='flex flex-row'>
                {friend.firstName}<br/>
                Rank: {index + 1}
            </div>
            <div>
                Prize: $89
            </div>
            <div className='text-green-500'>
                {friend.Points}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Home;

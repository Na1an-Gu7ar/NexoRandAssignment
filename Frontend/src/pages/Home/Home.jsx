import React, { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import user from '../../assets/user.png';

const Home = () => {
  const [friends, setFriends] = useState([]);
  const [error, setError] = useState('');
  const [leaderboard, setLeaderBoard] = useState(false)

  // Fetch all users (friends) from backend
  const fetchFriends = async () => {
    try {
      const response = await fetch("http://localhost:7000/api/user/v1/get-users", {
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
    // fetchFriends();
  }, []);

  // Function to claim points for a friend
  const claimPoints = async (username, firstName) => {
    try {
      // Make PATCH request to increment points
      const response = await fetch("http://localhost:7000/api/user/v1/claim-points", {
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

  // Function to fetch today's data
  // const fetchTodayData = async () => {
  //   try {
  //     const response = await fetch("http://localhost:7000/api/user/v1/your-daily-history", {
  //       method: 'GET',
  //       headers: {
  //         'Authorization': `Bearer ${localStorage.getItem('token')}`,
  //       },
  //     });

  //     const data = await response.json();

  //     if (!data.success) {
  //       setError(data.message);
  //       return;
  //     }

  //     // Process and use the data as needed
  //     console.log("Today's data:", data.data);
  //     // You might want to set this data to a state variable
  //     setFriends(data.data);

  //   } catch (error) {
  //     setError('Error fetching today\'s data.');
  //     toast.error('Error fetching today\'s data.');
  //   }
  // };

  // useEffect(() => {
  //   fetchTodayData();
  // }, []);

  return (
    <>

      <div className='flex justify-center flex-col items-center p-10'>
        {/* {error && <p className="error-message">{error}</p>} */}
        <ToastContainer />

        <div className={leaderboard ? "opacity-[0.1] relative" : 'bg-blue-500 w-[50vw] h-[10vh] flex justify-between items-center p-4 relative'}>
          <h1 className='text-white'>Total Friends: {friends.length}<br />Total Points: {friends.reduce((acc, friend) => acc + friend.Points, 0)}</h1>
          <button onClick={() => setLeaderBoard(true)} className='text-black w-[10vw] h-[5vh] flex flex-row items-center justify-between p-2'>Leaderboard <img src={user} alt="user" className='w-[1vw] h-[2vh] mr-1' /></button>
        </div>

        {leaderboard && <div className='absolute bg-slate-300 top-[10vh] w-[45vw] h-[80vh] flex flex-col items-center justify-center left-[25vw]'>
          <h2 className='text-2xl font-bold'>Leaderboard</h2>
          <ul>
            {friends.map((friend, index) => (
              <li key={index} className='text-lg'>
                {friend.firstName} - {friend.Points} points
              </li>
            ))}
          </ul>
          <button onClick={() => setLeaderBoard(false)}>Back</button>
        </div>}

        <div className={leaderboard ? "opacity-[0.1]" : "flex flex-row justify-between items-center mt-5"}>
          <button className='bg-slate-200 hover:bg-orange-500 hover:text-white text-black w-[6vw] h-[6vh] rounded-3xl m-1'>Daily</button>
          <button className='bg-slate-200 hover:bg-orange-500 hover:text-white text-black w-[6vw] h-[6vh] rounded-3xl m-1'>Weekly</button>
          <button className='bg-slate-200 hover:bg-orange-500 hover:text-white text-black w-[6vw] h-[6vh] rounded-3xl m-1'>Monthly</button>
        </div>

        <ul className='w-[50vw]'>
          {friends.map((friend, index) => (
            <li
              key={friend._id}
              onClick={() => claimPoints(friend.username, friend.firstName)}
              style={{ cursor: 'pointer' }}
              className={leaderboard ? "opacity-[0.1]" : "flex justify-between p-3 mt-3 h-[10vh] items-center hover:bg-slate-200 rounded"}
            >
              <div className='flex flex-row items-center'>
                <img src={user} alt="user" className='w-[1vw] h-[2.3vh] mr-4' />
                {friend.firstName}<br />
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
    </>
  );
};

export default Home;

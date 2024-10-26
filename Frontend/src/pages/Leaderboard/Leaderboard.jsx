import React, { useState, useEffect } from 'react';

const Leaderboard = () => {
  const [leader, setLeader] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try { 
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/v1/get-users`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use token if API is protected
          },
        });
        const data = await response.json();

        if (!data.success) {
          setError(data.message);
          return;
        }

        // Sort users by points in descending order and store them in state
        const sortedLeaders = data.data.sort((a, b) => b.points - a.points);
        setLeader(sortedLeaders);
      } catch (error) {
        console.error('Error fetching leaderboard:', error);
        setError('Failed to load leaderboard.');
      }
    };

    fetchLeaderboard();
  }, []);

  const showHistory = async (userId) => {
    setSelectedFriend(userId);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/v1/your-history`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`, // Use token if API is protected
        },
        body: JSON.stringify({ userId }),
      });
      const data = await response.json();

      if (!data.success) {
        setError(data.message);
        return;
      }

      // Set the user history data in the state
      setHistory(data.data);
    } catch (error) {
      console.error('Error fetching history:', error);
      setError('Failed to load user history.');
    }
  };

  return (
    <div>
      <h1>Leaderboard</h1>
      {error && <p className="error-message">{error}</p>}
      <ul>
        {leader.map(user => (
          <li
            key={user._id} // Use _id if MongoDB generated IDs
            onClick={() => showHistory(user._id)}
            style={{ cursor: 'pointer' }}
          >
            {user.name} - {user.points} points
          </li>
        ))}
      </ul>

      {selectedFriend && (
        <div>
          <h2>History for User ID: {selectedFriend}</h2>
          <ul>
            {history.map((entry, index) => (
              <li key={index}>
                {new Date(entry.date).toLocaleDateString()}: {entry.points} points
              </li>
            ))}
          </ul>
          <button onClick={() => setSelectedFriend(null)}>Back</button>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;

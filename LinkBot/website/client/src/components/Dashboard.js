import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const [summary, setSummary] = useState(null);
  const [withdrawals, setWithdrawals] = useState([]);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankAccount, setBankAccount] = useState({});
  const [accountHolderName, setAccountHolderName] = useState('');
  const [bankName, setBankName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [routingNumber, setRoutingNumber] = useState('');
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    address: '',
    profilePicture: '',
    password: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');
      try {
        const res = await axios.get('http://localhost:5000/api/users', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data[0]); // Assuming first user for simplicity
      } catch (error) {
        console.error(error.response.data);
        navigate('/login');
      }
    };

    const fetchProfile = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setProfile({
          firstName: res.data.profile?.firstName || '',
          lastName: res.data.profile?.lastName || '',
          phone: res.data.profile?.phone || '',
          address: res.data.profile?.address || '',
          profilePicture: res.data.profile?.profilePicture || '',
          password: '',
        });
      } catch (error) {
        console.error(error.response.data);
      }
    };

    const fetchSummary = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/withdrawals/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    const fetchWithdrawals = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/withdrawals', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWithdrawals(res.data);
      } catch (error) {
        console.error(error.response.data);
      }
    };

    const fetchBankAccount = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('http://localhost:5000/api/bank-accounts', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBankAccount(res.data);
        setAccountHolderName(res.data.accountHolderName || '');
        setBankName(res.data.bankName || '');
        setAccountNumber(res.data.accountNumber || '');
        setRoutingNumber(res.data.routingNumber || '');
      } catch (error) {
        console.error(error.response.data);
      }
    };

    fetchUser();
    fetchProfile();
    if (user?.role === 'super_admin') {
      fetchSummary();
      fetchWithdrawals();
      fetchBankAccount();
    }
  }, [navigate, user?.role]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.put(
        'http://localhost:5000/api/users/profile',
        profile,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Profile updated successfully');
    } catch (error) {
      console.error(error.response.data);
      alert('Error updating profile');
    }
  };

  const handleBankAccountSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      const res = await axios.post(
        'http://localhost:5000/api/bank-accounts',
        { accountHolderName, bankName, accountNumber, routingNumber },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setBankAccount(res.data);
      alert('Bank account details saved successfully');
    } catch (error) {
      console.error(error.response.data);
      alert('Error saving bank account details');
    }
  };

  const handleWithdrawal = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    try {
      await axios.post(
        'http://localhost:5000/api/withdrawals',
        { amount: parseFloat(withdrawalAmount) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Withdrawal request submitted and approved');
      setWithdrawalAmount('');
      // Refresh summary and withdrawals
      const summaryRes = await axios.get('http://localhost:5000/api/withdrawals/summary', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(summaryRes.data);
      const withdrawalsRes = await axios.get('http://localhost:5000/api/withdrawals', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWithdrawals(withdrawalsRes.data);
    } catch (error) {
      console.error(error.response.data);
      alert(error.response.data.message || 'Error submitting withdrawal request');
    }
  };

  if (!user) return <div>Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <p>Welcome, {user.email}!</p>
      <p>Role: {user.role}</p>

      <h3 className="text-xl font-semibold mt-6">Profile Management</h3>
      <form onSubmit={handleProfileSubmit} className="mt-4">
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Last Name</label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Phone</label>
          <input
            type="text"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <input
            type="text"
            value={profile.address}
            onChange={(e) => setProfile({ ...profile, address: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Profile Picture URL</label>
          <input
            type="text"
            value={profile.profilePicture}
            onChange={(e) => setProfile({ ...profile, profilePicture: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Password (leave blank to keep current)</label>
          <input
            type="password"
            value={profile.password}
            onChange={(e) => setProfile({ ...profile, password: e.target.value })}
            className="w-full p-2 border rounded"
          />
        </div>
        <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
          Update Profile
        </button>
      </form>

      {user.role === 'super_admin' && (
        <div>
          <h3 className="text-xl font-semibold mt-4">Super Admin Controls</h3>
          <button className="mt-2 bg-blue-500 text-white p-2 rounded">Manage Users</button>

          <h3 className="text-xl font-semibold mt-6">Payment Withdrawal Section</h3>
          {summary ? (
            <div className="mt-4">
              <p>Total Revenue: ${summary.totalRevenue.toFixed(2)}</p>
              <p>Total Withdrawn: ${summary.totalWithdrawn.toFixed(2)}</p>
              <p>Pending Withdrawals: ${summary.pendingWithdrawals.toFixed(2)}</p>
              <p>Available for Withdrawal: ${summary.availableForWithdrawal.toFixed(2)}</p>

              <h4 className="text-lg font-semibold mt-6">Bank Account Details</h4>
              <form onSubmit={handleBankAccountSubmit} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Account Holder Name</label>
                  <input
                    type="text"
                    value={accountHolderName}
                    onChange={(e) => setAccountHolderName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Bank Name</label>
                  <input
                    type="text"
                    value={bankName}
                    onChange={(e) => setBankName(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Account Number</label>
                  <input
                    type="text"
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-gray-700">Routing Number</label>
                  <input
                    type="text"
                    value={routingNumber}
                    onChange={(e) => setRoutingNumber(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                  />
                </div>
                <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">
                  Save Bank Account Details
                </button>
              </form>

              <h4 className="text-lg font-semibold mt-6">Request Withdrawal</h4>
              <form onSubmit={handleWithdrawal} className="mt-4">
                <div className="mb-4">
                  <label className="block text-gray-700">Withdrawal Amount</label>
                  <input
                    type="number"
                    value={withdrawalAmount}
                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>
                <button type="submit" className="w-full bg-green-500 text-white p-2 rounded">
                  Request Withdrawal
                </button>
              </form>

              <h4 className="text-lg font-semibold mt-6">Withdrawal History</h4>
              {withdrawals.length > 0 ? (
                <table className="w-full mt-2 border-collapse">
                  <thead>
                    <tr>
                      <th className="border p-2">Amount</th>
                      <th className="border p-2">Status</th>
                      <th className="border p-2">Requested At</th>
                      <th className="border p-2">Processed At</th>
                    </tr>
                  </thead>
                  <tbody>
                    {withdrawals.map((withdrawal) => (
                      <tr key={withdrawal._id}>
                        <td className="border p-2">${withdrawal.amount.toFixed(2)}</td>
                        <td className="border p-2">{withdrawal.status}</td>
                        <td className="border p-2">
                          {new Date(withdrawal.createdAt).toLocaleDateString()}
                        </td>
                        <td className="border p-2">
                          {withdrawal.processedAt
                            ? new Date(withdrawal.processedAt).toLocaleDateString()
                            : 'N/A'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No withdrawal history available.</p>
              )}
            </div>
          ) : (
            <p>Loading summary...</p>
          )}
        </div>
      )}

      {user.role === 'agency' && (
        <div>
          <h3 className="text-xl font-semibold mt-4">Agency Controls</h3>
          <button
            onClick={() => navigate('/editor')}
            className="mt-2 bg-blue-500 text-white p-2 rounded"
          >
            Create Template
          </button>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
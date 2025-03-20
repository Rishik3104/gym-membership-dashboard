// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  useEffect(() => {
    fetchMembers();
  }, [searchTerm, filterStatus]);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/members', {
        params: { search: searchTerm, status: filterStatus },
      });
      setMembers(response.data);
    } catch (error) {
      console.error('Error fetching members:', error);
    }
  };

  const today = new Date();
  const sevenDaysLater = new Date(today.setDate(today.getDate() + 7));

  const filteredMembers = members.filter(member => {
    const expiryDate = new Date(member.membershipExpiryDate);
    if (filterStatus === 'active') return expiryDate >= today;
    if (filterStatus === 'expiring-soon') return expiryDate >= today && expiryDate <= sevenDaysLater;
    if (filterStatus === 'expired') return expiryDate < today;
    return true; // No filter applied
  }).filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.contactNumber.includes(searchTerm)
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-md p-4">
        <h2 className="text-xl font-bold mb-4">Gym Admin Panel</h2>
        <ul>
          <li>
            <a href="#" className="block py-2 text-blue-500 hover:text-blue-700">
              Dashboard
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 text-blue-500 hover:text-blue-700">
              Add Member
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 text-blue-500 hover:text-blue-700">
              Edit/Delete Member
            </a>
          </li>
          <li>
            <a href="#" className="block py-2 text-blue-500 hover:text-blue-700">
              Search/Filter Members
            </a>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>

        {/* Search Input */}
        <div className="mb-4 flex items-center space-x-4">
          <input
            type="text"
            placeholder="Search by name or contact number"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded-md w-full"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border p-2 rounded-md"
          >
            <option value="">All Members</option>
            <option value="active">Active Members</option>
            <option value="expiring-soon">Expiring Soon</option>
            <option value="expired">Expired Members</option>
          </select>
        </div>

        {/* Member Table */}
        <div className="bg-white shadow-md rounded-lg p-4">
          <table className="w-full">
            <thead>
              <tr>
                <th className="py-2">Name</th>
                <th className="py-2">Contact</th>
                <th className="py-2">Expiry Date</th>
                <th className="py-2">Status</th>
                <th className="py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map(member => (
                <tr key={member._id}>
                  <td>{member.fullName}</td>
                  <td>{member.contactNumber}</td>
                  <td>{new Date(member.membershipExpiryDate).toLocaleDateString()}</td>
                  <td>
                    {new Date(member.membershipExpiryDate) < today ? (
                      <span className="text-red-500">Expired</span>
                    ) : (
                      'Active'
                    )}
                  </td>
                  <td>
                    <button className="text-blue-500 hover:text-blue-700">Edit</button>
                    <button className="text-red-500 hover:text-red-700 ml-2">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default App;

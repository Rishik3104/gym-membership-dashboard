// src/App.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddMember from './components/AddMember';
import EditMember from './components/EditMember';
import './index.css';

function App() {
  const [members, setMembers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [showEditMember, setShowEditMember] = useState<string | null>(null);

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
  const sevenDaysLater = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);

  const filteredMembers = members.filter(member => {
    const expiryDate = new Date(member.membershipExpiryDate);
    if (filterStatus === 'active') return expiryDate >= today;
    if (filterStatus === 'expiring-soon') return expiryDate >= today && expiryDate <= sevenDaysLater;
    if (filterStatus === 'expired') return expiryDate < today;
    return true;
  }).filter(member =>
    member.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.contactNumber.includes(searchTerm)
  );

  const handleEditMember = (memberId: string) => {
    setShowEditMember(memberId);
  };

  const handleCloseEditMember = () => {
    setShowEditMember(null);
  };

  const handleDeleteMember = async (memberId: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await axios.delete(`http://localhost:5000/api/members/${memberId}`);
        alert('Member deleted successfully!');
        fetchMembers();
      } catch (error) {
        console.error('Error deleting member:', error);
        alert('Failed to delete member.');
      }
    }
  };

  return (
    <div className="app-container">
      <div className="overlay"></div>
      <div className="dashboard-wrapper">
        <aside className="sidebar">
          <h2>Gym Admin Panel</h2>
          <button onClick={() => setShowAddMember(true)} className="add-btn">
            Add Member
          </button>
        </aside>

        <main className="main-content">
          <h1 className="dashboard-title">Dashboard</h1>

          {showAddMember && (
            <AddMember onClose={() => setShowAddMember(false)} />
          )}

          {showEditMember && (
            <EditMember memberId={showEditMember} onClose={handleCloseEditMember} />
          )}

          <div className="search-filter">
            <input
              type="text"
              placeholder="Search by name or contact number"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">All Members</option>
              <option value="active">Active Members</option>
              <option value="expiring-soon">Expiring Soon</option>
              <option value="expired">Expired Members</option>
            </select>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Contact</th>
                  <th>Expiry Date</th>
                  <th>Status</th>
                  <th>Actions</th>
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
                        <span className="expired">Expired</span>
                      ) : (
                        <span className="active">Active</span>
                      )}
                    </td>
                    <td className="actions">
                      <button className="edit" onClick={() => handleEditMember(member._id)}>Edit</button>
                      <button className="delete" onClick={() => handleDeleteMember(member._id)}>Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;

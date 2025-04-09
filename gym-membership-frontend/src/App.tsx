import React, { useEffect, useState } from 'react';
import axios from 'axios';
import AddMember from './components/AddMember';
import EditMember from './components/EditMember';

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

  const handleEditMember = (memberId: string) => {
    setShowEditMember(memberId);
  };

  const handleCloseEditMember = () => {
    setShowEditMember(null);
  };

  return (
    <div className="container">
      <div className="flex">
        {/* Sidebar */}
        <aside className="sidebar">
          <h2>Gym Admin Panel</h2>
          <ul>
            <li>
              <button className="block" onClick={() => setShowAddMember(true)}>
                Add Member
              </button>
            </li>
            <li>
              <button className="block" onClick={() => setShowEditMember('')}>
                Edit/Delete Member
              </button>
            </li>
            <li>
              <button className="block">
                Search/Filter Members
              </button>
            </li>
          </ul>
        </aside>

        {/* Main Content */}
        <main className="main-content">
          <h1>Dashboard</h1>

          {/* Add Member Form */}
          {showAddMember && (
            <AddMember onClose={() => setShowAddMember(false)} />
          )}

          {/* Edit Member Form */}
          {showEditMember && (
            <EditMember memberId={showEditMember} onClose={handleCloseEditMember} />
          )}

          {/* Search Input */}
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

          {/* Member Table */}
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
                      <button className="delete">Delete</button>
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

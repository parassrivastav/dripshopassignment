import React, { useState } from 'react';

function UserTable() {
  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:3001/getUsers');
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.log('Error fetching users:', error);
    }
  };

  return (
    <div>
      <button onClick={fetchUsers}>Get Users</button>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>ID</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>{user.id}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}



export default UserTable;

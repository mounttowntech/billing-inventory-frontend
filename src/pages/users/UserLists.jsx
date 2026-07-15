import "./UserLists.css";
import { getUsers } from '../../features/auth/authSlice';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function UserLists() {
  const dispatch = useDispatch();
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
const [search, setSearch] = useState("");
  const { users: authUsers } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getUsers());
    console.log(authUsers);
    if (authUsers?.data) {
      setUsers(authUsers.data);
    }
  }, [dispatch, authUsers]);

  const filteredUsers = users.filter((user) =>
  `${user.firstName} ${user.lastName} ${user.email} ${user.employeeCode}`
    .toLowerCase()
    .includes(search.toLowerCase())
);

const indexOfLastUser = currentPage * rowsPerPage;
const indexOfFirstUser = indexOfLastUser - rowsPerPage;

const currentUsers = filteredUsers.slice(
  indexOfFirstUser,
  indexOfLastUser
);

const totalPages = Math.ceil(filteredUsers.length / rowsPerPage);


console.log(users);
  return (
    <div className="page-container">

      <div className="page-header">
        <h2>User Lists</h2>

        <button className="btn-primary">
          + Add User
        </button>
      </div>

      <div className="table-card">

        <div className="table-toolbar">

          <div className="entries">
            <select value={rowsPerPage} onChange={(e) => {setRowsPerPage(Number(e.target.value)); setCurrentPage(1);}}>
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>

            <span>Entries</span>
          </div>

          <input
            className="search-box"
            placeholder="Search users..."
            value={search}
            onChange={(e) => {setSearch(e.target.value);setCurrentPage(1)}}
          />

        </div>

        <table className="custom-table">

          <thead>

            <tr>
              <th>#</th>
              <th>Employee ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Role</th>
              <th>Status</th>
              <th>Action</th>
            </tr>

          </thead>

          <tbody>
          {currentUsers?.map((user, index) => (
            <tr key={user?._id ?? index}>
              <td>{ indexOfFirstUser + index + 1}</td>

              <td>{user?.employeeCode}</td>

              <td>{user?.firstName} {user?.lastName}</td>

              <td>{user?.email}</td>

              <td>{user?.phone}</td>

              <td>{user?.role?.roleName}</td>

              <td>
                <span className="status active">
                  {user?.status}
                </span>
              </td>

              <td>
  <div className="action-column">
    <button className="btn-edit">Edit</button>
    <button className="btn-delete">Delete</button>
  </div>
</td>

            </tr>
          ))}
          </tbody>

        </table>

        <div className="pagination">

          <p>
            Showing {filteredUsers.length === 0 ? 0 : indexOfFirstUser + 1}
            to {Math.min(indexOfLastUser, filteredUsers.length)}
            of {filteredUsers.length} entries
          </p>

          <div className="page-buttons">
  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(1)}
  >
    &laquo;
  </button>

  <button
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(currentPage - 1)}
  >
    &lsaquo;
  </button>

  {Array.from({ length: totalPages }, (_, i) => (
    <button
      key={i}
      className={currentPage === i + 1 ? "active-page" : ""}
      onClick={() => setCurrentPage(i + 1)}
    >
      {i + 1}
    </button>
  ))}

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(currentPage + 1)}
  >
    &rsaquo;
  </button>

  <button
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(totalPages)}
  >
    &raquo;
  </button>
</div>

        </div>

      </div>

    </div>
  );
}
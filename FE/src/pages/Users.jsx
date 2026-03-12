import { useState, useEffect } from "react";
import { Container, Table, Badge, Alert, Spinner, Card } from "react-bootstrap";
import { userAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";

function Users() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  useEffect(() => {
    if (!isAdmin()) {
      setError("Access denied. Admin only.");
      setLoading(false);
      return;
    }
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await userAPI.getAllUsers();
      setUsers(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin()) {
    return (
      <Container className="mt-4">
        <Alert variant="danger">
          Access denied. This page is for administrators only.
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2 className="mb-4">User Management</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      {loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <Card>
          <Card.Body>
            <Table striped bordered hover responsive>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Username</th>
                  <th>Role</th>
                  <th>Created At</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center text-muted">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user, index) => (
                    <tr key={user._id}>
                      <td>{index + 1}</td>
                      <td>{user.username}</td>
                      <td>
                        {user.admin ? (
                          <Badge bg="warning" text="dark">
                            Admin
                          </Badge>
                        ) : (
                          <Badge bg="secondary">User</Badge>
                        )}
                      </td>
                      <td>
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              },
                            )
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
            <p className="text-muted mt-3">
              Total users: <strong>{users.length}</strong>
            </p>
          </Card.Body>
        </Card>
      )}
    </Container>
  );
}

export default Users;

import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

function Home() {
  const { user, isAdmin } = useAuth();

  return (
    <Container className="mt-4">
      <h1>Welcome to Quiz App</h1>
      <p className="lead">Hello, {user?.username}!</p>

      <Row className="mt-4">
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Questions</Card.Title>
              <Card.Text>
                Create, view, and manage questions for your quizzes.
              </Card.Text>
              <Button as={Link} to="/questions" variant="primary">
                Manage Questions
              </Button>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="mb-3">
            <Card.Body>
              <Card.Title>Quizzes</Card.Title>
              <Card.Text>
                View and take quizzes.{" "}
                {isAdmin() && "Create new quizzes (Admin only)."}
              </Card.Text>
              <Button as={Link} to="/quizzes" variant="success">
                View Quizzes
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;

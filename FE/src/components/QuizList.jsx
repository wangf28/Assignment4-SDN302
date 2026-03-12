import { Card, Button, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function QuizList({ quizzes, onView, onEdit, onDelete }) {
  const { isAdmin } = useAuth();

  if (quizzes.length === 0) {
    return (
      <p className="text-center text-muted">
        No quizzes found. {isAdmin() && "Create one to get started!"}
      </p>
    );
  }

  return (
    <div>
      {quizzes.map((quiz) => (
        <Card key={quiz._id} className="mb-3">
          <Card.Body>
            <Card.Title>{quiz.title}</Card.Title>
            {quiz.description && (
              <Card.Text className="text-muted">{quiz.description}</Card.Text>
            )}

            <div className="mb-2">
              <Badge bg="secondary">
                {quiz.questions?.length || 0} Questions
              </Badge>
            </div>

            <div className="mt-3">
              <Button
                variant="primary"
                size="sm"
                className="me-2"
                onClick={() => onView(quiz)}
              >
                View Details
              </Button>

              {isAdmin() && (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="me-2"
                    onClick={() => onEdit(quiz)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => onDelete(quiz._id)}
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default QuizList;

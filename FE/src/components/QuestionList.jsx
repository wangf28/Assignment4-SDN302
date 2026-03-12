import { Card, Button, Badge } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";

function QuestionList({ questions, onEdit, onDelete }) {
  const { user } = useAuth();

  if (questions.length === 0) {
    return (
      <p className="text-center text-muted">
        No questions found. Create one to get started!
      </p>
    );
  }

  const isAuthor = (question) => {
    return question.author?._id === user?.id || question.author === user?.id;
  };

  return (
    <div>
      {questions.map((question) => (
        <Card key={question._id} className="mb-3">
          <Card.Body>
            <Card.Title>{question.text}</Card.Title>
            <Card.Subtitle className="mb-2 text-muted">
              by {question.author?.username || "Unknown"}
            </Card.Subtitle>

            <div className="mb-2">
              <strong>Options:</strong>
              <ol>
                {question.options?.map((option, index) => (
                  <li key={index}>
                    {option}{" "}
                    {index === question.correctAnswerIndex && (
                      <Badge bg="success">Correct</Badge>
                    )}
                  </li>
                ))}
              </ol>
            </div>

            {question.keywords && question.keywords.length > 0 && (
              <div className="mb-2">
                <strong>Keywords:</strong>{" "}
                {question.keywords.map((keyword, index) => (
                  <Badge key={index} bg="info" className="me-1">
                    {keyword}
                  </Badge>
                ))}
              </div>
            )}

            {isAuthor(question) && (
              <div className="mt-3">
                <Button
                  variant="secondary"
                  size="sm"
                  className="me-2"
                  onClick={() => onEdit(question)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => onDelete(question._id)}
                >
                  Delete
                </Button>
              </div>
            )}
          </Card.Body>
        </Card>
      ))}
    </div>
  );
}

export default QuestionList;

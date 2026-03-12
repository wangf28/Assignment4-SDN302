import { useState } from "react";
import { Card, Button, Badge, Alert, Form } from "react-bootstrap";
import { useAuth } from "../contexts/AuthContext";
import axios from "../utils/axios";

function QuizDetail({ quiz, onBack, onRefresh }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [questionId]: answerIndex,
    });
  };

  const handleSubmit = () => {
    let correctCount = 0;
    quiz.questions.forEach((question) => {
      if (selectedAnswers[question._id] === question.correctAnswerIndex) {
        correctCount++;
      }
    });
    setScore(correctCount);
    setShowResults(true);
  };

  const handleReset = () => {
    setSelectedAnswers({});
    setShowResults(false);
    setScore(0);
  };

  const handleAddQuestion = async (questionId) => {
    try {
      await axios.post(`/quizzes/${quiz._id}/questions`, { questionId });
      alert("Question added successfully!");
      onRefresh();
    } catch (err) {
      setError(err.response?.data?.error || "Failed to add question");
    }
  };

  return (
    <div>
      <Card className="mb-4">
        <Card.Body>
          <h3>{quiz.title}</h3>
          {quiz.description && <p className="text-muted">{quiz.description}</p>}
          <Badge bg="secondary">{quiz.questions?.length || 0} Questions</Badge>
        </Card.Body>
      </Card>

      {error && <Alert variant="danger">{error}</Alert>}

      {showResults && (
        <Alert variant={score === quiz.questions?.length ? "success" : "info"}>
          Your score: {score} / {quiz.questions?.length || 0}(
          {Math.round((score / (quiz.questions?.length || 1)) * 100)}%)
          <Button size="sm" variant="link" onClick={handleReset}>
            Try Again
          </Button>
        </Alert>
      )}

      {quiz.questions && quiz.questions.length > 0 ? (
        <>
          {quiz.questions.map((question, qIndex) => (
            <Card key={question._id} className="mb-3">
              <Card.Body>
                <h5>Question {qIndex + 1}</h5>
                <p>{question.text}</p>

                {question.keywords && question.keywords.length > 0 && (
                  <div className="mb-2">
                    {question.keywords.map((keyword, i) => (
                      <Badge key={i} bg="info" className="me-1">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}

                <Form>
                  {question.options?.map((option, optIndex) => (
                    <Form.Check
                      key={optIndex}
                      type="radio"
                      id={`q-${question._id}-opt-${optIndex}`}
                      name={`question-${question._id}`}
                      label={option}
                      checked={selectedAnswers[question._id] === optIndex}
                      onChange={() =>
                        handleAnswerSelect(question._id, optIndex)
                      }
                      disabled={showResults}
                      className={
                        showResults
                          ? optIndex === question.correctAnswerIndex
                            ? "text-success fw-bold"
                            : selectedAnswers[question._id] === optIndex
                              ? "text-danger"
                              : ""
                          : ""
                      }
                    />
                  ))}
                </Form>

                {showResults && (
                  <div className="mt-2">
                    {selectedAnswers[question._id] ===
                    question.correctAnswerIndex ? (
                      <Badge bg="success">Correct!</Badge>
                    ) : (
                      <Badge bg="danger">
                        Wrong! Correct answer:{" "}
                        {question.options[question.correctAnswerIndex]}
                      </Badge>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}

          {!showResults && (
            <div className="text-center mb-4">
              <Button
                variant="primary"
                onClick={handleSubmit}
                disabled={
                  Object.keys(selectedAnswers).length !== quiz.questions.length
                }
              >
                Submit Quiz
              </Button>
            </div>
          )}
        </>
      ) : (
        <Alert variant="warning">
          This quiz has no questions yet.{" "}
          {isAdmin() && "Add some questions to get started!"}
        </Alert>
      )}
    </div>
  );
}

export default QuizDetail;

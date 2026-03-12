import { useState, useEffect } from "react";
import { Form, Button, Card, Alert } from "react-bootstrap";
import { questionAPI } from "../services/api";
import axios from "../utils/axios";

function QuizForm({ quiz, onSubmit, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchQuestions();
    if (quiz) {
      setTitle(quiz.title || "");
      setDescription(quiz.description || "");
      setSelectedQuestions(quiz.questions?.map((q) => q._id || q) || []);
    }
  }, [quiz]);

  const fetchQuestions = async () => {
    try {
      const response = await questionAPI.getAllQuestions();
      setAvailableQuestions(response.data.data || response.data);
    } catch (err) {
      setError("Failed to fetch questions");
    }
  };

  const handleQuestionToggle = (questionId) => {
    if (selectedQuestions.includes(questionId)) {
      setSelectedQuestions(selectedQuestions.filter((id) => id !== questionId));
    } else {
      setSelectedQuestions([...selectedQuestions, questionId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      return setError("Title is required");
    }

    setLoading(true);

    try {
      if (quiz) {
        // Update quiz metadata only
        await onSubmit({ title, description });

        // If questions changed, update them separately
        if (
          JSON.stringify(selectedQuestions.sort()) !==
          JSON.stringify((quiz.questions?.map((q) => q._id || q) || []).sort())
        ) {
          // First, get current quiz to see existing questions
          const currentQuestions = quiz.questions?.map((q) => q._id || q) || [];

          // Add new questions
          for (const qId of selectedQuestions) {
            if (!currentQuestions.includes(qId)) {
              await axios.post(`/quizzes/${quiz._id}/questions`, {
                questionId: qId,
              });
            }
          }
        }
      } else {
        // Create new quiz
        await onSubmit({
          title,
          description,
          questions: selectedQuestions,
        });
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.response?.data?.error ||
          "Failed to save quiz",
      );
      setLoading(false);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4>{quiz ? "Edit Quiz" : "Create New Quiz"}</h4>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Title *</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Select Questions</Form.Label>
            {availableQuestions.length === 0 ? (
              <p className="text-muted">
                No questions available. Create some questions first!
              </p>
            ) : (
              <div
                style={{
                  maxHeight: "300px",
                  overflowY: "auto",
                  border: "1px solid #dee2e6",
                  padding: "10px",
                  borderRadius: "4px",
                }}
              >
                {availableQuestions.map((question) => (
                  <Form.Check
                    key={question._id}
                    type="checkbox"
                    id={`question-${question._id}`}
                    label={question.text}
                    checked={selectedQuestions.includes(question._id)}
                    onChange={() => handleQuestionToggle(question._id)}
                    className="mb-2"
                  />
                ))}
              </div>
            )}
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : quiz ? "Update" : "Create"}
            </Button>
            <Button variant="secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </Button>
          </div>
        </Form>
      </Card.Body>
    </Card>
  );
}

export default QuizForm;

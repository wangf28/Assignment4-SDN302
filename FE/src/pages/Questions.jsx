import { useState, useEffect } from "react";
import { Container, Button, Row, Col, Alert, Spinner } from "react-bootstrap";
import { questionAPI } from "../services/api";
import QuestionList from "../components/QuestionList";
import QuestionForm from "../components/QuestionForm";

function Questions() {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await questionAPI.getAllQuestions();
      setQuestions(response.data.data || response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch questions");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, []);

  const handleCreate = () => {
    setEditingQuestion(null);
    setShowForm(true);
  };

  const handleEdit = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this question?")) {
      return;
    }

    try {
      await questionAPI.deleteQuestion(id);
      fetchQuestions();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete question");
    }
  };

  const handleFormSubmit = async (questionData) => {
    try {
      if (editingQuestion) {
        await questionAPI.updateQuestion(editingQuestion._id, questionData);
      } else {
        await questionAPI.createQuestion(questionData);
      }
      setShowForm(false);
      setEditingQuestion(null);
      fetchQuestions();
    } catch (err) {
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuestion(null);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Questions</h2>
        </Col>
        <Col className="text-end">
          {!showForm && (
            <Button onClick={handleCreate} variant="primary">
              Create Question
            </Button>
          )}
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm ? (
        <QuestionForm
          question={editingQuestion}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      ) : loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <QuestionList
          questions={questions}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
}

export default Questions;

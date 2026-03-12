import { useState, useEffect } from "react";
import {
  Container,
  Button,
  Row,
  Col,
  Alert,
  Spinner,
  Tab,
  Tabs,
} from "react-bootstrap";
import { quizAPI } from "../services/api";
import { useAuth } from "../contexts/AuthContext";
import QuizList from "../components/QuizList";
import QuizForm from "../components/QuizForm";
import QuizDetail from "../components/QuizDetail";

function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState(null);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const { isAdmin } = useAuth();

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await quizAPI.getAllQuizzes();
      setQuizzes(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch quizzes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  const handleCreate = () => {
    setEditingQuiz(null);
    setShowForm(true);
    setSelectedQuiz(null);
  };

  const handleEdit = (quiz) => {
    setEditingQuiz(quiz);
    setShowForm(true);
    setSelectedQuiz(null);
  };

  const handleView = (quiz) => {
    setSelectedQuiz(quiz);
    setShowForm(false);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) {
      return;
    }

    try {
      await quizAPI.deleteQuiz(id);
      fetchQuizzes();
      if (selectedQuiz?._id === id) {
        setSelectedQuiz(null);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to delete quiz");
    }
  };

  const handleFormSubmit = async (quizData) => {
    try {
      if (editingQuiz) {
        await quizAPI.updateQuiz(editingQuiz._id, quizData);
      } else {
        await quizAPI.createQuiz(quizData);
      }
      setShowForm(false);
      setEditingQuiz(null);
      fetchQuizzes();
    } catch (err) {
      throw err;
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingQuiz(null);
  };

  const handleBack = () => {
    setSelectedQuiz(null);
  };

  return (
    <Container className="mt-4">
      <Row className="mb-3">
        <Col>
          <h2>Quizzes</h2>
        </Col>
        <Col className="text-end">
          {!showForm && !selectedQuiz && isAdmin() && (
            <Button onClick={handleCreate} variant="primary">
              Create Quiz
            </Button>
          )}
          {selectedQuiz && (
            <Button onClick={handleBack} variant="secondary">
              Back to List
            </Button>
          )}
        </Col>
      </Row>

      {error && <Alert variant="danger">{error}</Alert>}

      {showForm ? (
        <QuizForm
          quiz={editingQuiz}
          onSubmit={handleFormSubmit}
          onCancel={handleCancel}
        />
      ) : selectedQuiz ? (
        <QuizDetail
          quiz={selectedQuiz}
          onBack={handleBack}
          onRefresh={fetchQuizzes}
        />
      ) : loading ? (
        <div className="text-center p-5">
          <Spinner animation="border" />
        </div>
      ) : (
        <QuizList
          quizzes={quizzes}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </Container>
  );
}

export default Quizzes;

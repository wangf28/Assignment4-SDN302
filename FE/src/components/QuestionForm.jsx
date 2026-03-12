import { useState, useEffect } from "react";
import { Form, Button, Card, Alert, Row, Col } from "react-bootstrap";

function QuestionForm({ question, onSubmit, onCancel }) {
  const [text, setText] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswerIndex, setCorrectAnswerIndex] = useState(0);
  const [keywords, setKeywords] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (question) {
      setText(question.text || "");
      setOptions(question.options || ["", "", "", ""]);
      setCorrectAnswerIndex(question.correctAnswerIndex || 0);
      setKeywords(question.keywords?.join(", ") || "");
    }
  }, [question]);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, ""]);
  };

  const removeOption = (index) => {
    if (options.length <= 2) {
      setError("A question must have at least 2 options");
      return;
    }
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
    if (correctAnswerIndex >= newOptions.length) {
      setCorrectAnswerIndex(newOptions.length - 1);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!text.trim()) {
      return setError("Question text is required");
    }

    const filledOptions = options.filter((opt) => opt.trim() !== "");
    if (filledOptions.length < 2) {
      return setError("At least 2 options are required");
    }

    if (correctAnswerIndex >= filledOptions.length) {
      return setError("Please select a valid correct answer");
    }

    setLoading(true);

    try {
      const keywordsArray = keywords
        .split(",")
        .map((k) => k.trim())
        .filter((k) => k !== "");

      await onSubmit({
        text,
        options: filledOptions,
        correctAnswerIndex,
        keywords: keywordsArray,
      });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save question");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <h4>{question ? "Edit Question" : "Create New Question"}</h4>
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Question Text *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={text}
              onChange={(e) => setText(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Options *</Form.Label>
            {options.map((option, index) => (
              <Row key={index} className="mb-2">
                <Col sm={8}>
                  <Form.Control
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                </Col>
                <Col sm={2}>
                  <Form.Check
                    type="radio"
                    label="Correct"
                    name="correctAnswer"
                    checked={correctAnswerIndex === index}
                    onChange={() => setCorrectAnswerIndex(index)}
                  />
                </Col>
                <Col sm={2}>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeOption(index)}
                    disabled={options.length <= 2}
                  >
                    Remove
                  </Button>
                </Col>
              </Row>
            ))}
            <Button variant="secondary" size="sm" onClick={addOption}>
              Add Option
            </Button>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Keywords (comma-separated)</Form.Label>
            <Form.Control
              type="text"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="e.g., javascript, programming, arrays"
            />
          </Form.Group>

          <div className="d-flex gap-2">
            <Button type="submit" variant="primary" disabled={loading}>
              {loading ? "Saving..." : question ? "Update" : "Create"}
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

export default QuestionForm;

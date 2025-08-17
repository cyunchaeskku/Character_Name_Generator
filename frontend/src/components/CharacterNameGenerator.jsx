import { Form, Button, Row, Col, Spinner, Alert, ListGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { Clipboard, ClipboardCheck, ArrowCounterclockwise } from 'react-bootstrap-icons';

function CharacterNameGenerator({ state, setState, onReset }) {
  const { formData, names, loading, error, copiedIndex } = state;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setState(prev => ({ ...prev, formData: { ...prev.formData, [name]: value } }));
  };

  const handleCopy = (name, index) => {
    navigator.clipboard.writeText(name);
    setState(prev => ({ ...prev, copiedIndex: index }));
    setTimeout(() => setState(prev => ({ ...prev, copiedIndex: null })), 2000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, loading: true, error: '', names: [] }));

    try {
      const response = await fetch('http://127.0.0.1:5000/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setState(prev => ({ ...prev, names: data.names.split(',').map(name => name.trim()), loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Failed to generate names.', loading: false }));
    }
  };

  return (
    <div>
      <Button variant="outline-secondary" className="reset-btn" onClick={onReset}>
        <ArrowCounterclockwise className="me-2" />
        초기화
      </Button>

      <div className="text-center mb-5">
        <h1 className="display-4 gradient-text">AI Character Name Generator</h1>
        <p className="lead text-muted mt-3">캐릭터의 독특한 특징을 바탕으로 창의적인 이름을 생성해 보세요.</p>
      </div>

      <Form onSubmit={handleSubmit}>
        <Row className="g-3">
          <Col md={6}><Form.Control type="text" name="year" placeholder="작품 년도" value={formData.year} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control type="text" name="background" placeholder="작품 배경" value={formData.background} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control type="text" name="personality" placeholder="인물 성격" value={formData.personality} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control type="text" name="gender" placeholder="인물 성별" value={formData.gender} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control type="text" name="age" placeholder="나이" value={formData.age} onChange={handleChange} required /></Col>
          <Col md={6}><Form.Control type="text" name="situation" placeholder="처한 상황" value={formData.situation} onChange={handleChange} required /></Col>
        </Row>
        <div className="d-grid mt-4">
          <Button variant="primary" type="submit" disabled={loading} size="lg">
            {loading ? <><Spinner as="span" size="sm" /> 생성 중...</> : '이름 생성하기'}
          </Button>
        </div>
      </Form>

      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}

      {names.length > 0 && (
        <div className="results-card">
          <h2 className="mb-3">생성된 이름:</h2>
          <ListGroup variant="flush">
            {names.map((name, index) => (
              <ListGroup.Item key={index} className="d-flex justify-content-between align-items-center">
                <strong>{name}</strong>
                <OverlayTrigger placement="top" show={copiedIndex === index} overlay={<Tooltip>복사 완료!</Tooltip>}>
                  <Button variant="outline-secondary" size="sm" onClick={() => handleCopy(name, index)}>
                    {copiedIndex === index ? <ClipboardCheck color="green" /> : <Clipboard />}
                  </Button>
                </OverlayTrigger>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
}

export default CharacterNameGenerator;
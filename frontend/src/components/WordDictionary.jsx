import { Form, Button, Spinner, Alert, Card, Badge, OverlayTrigger, Tooltip, Breadcrumb } from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';

function WordDictionary({ state, setState, onReset }) {
  const { searchTerm, searchHistory, loading, error, result } = state;

  const executeSearch = async (wordToSearch) => {
    setState(prev => ({ ...prev, loading: true, error: '', result: null }));
    try {
      const response = await fetch('http://127.0.0.1:5000/api/search-word', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ word: wordToSearch }),
      });
      if (!response.ok) throw new Error('Server error');
      const data = await response.json();
      setState(prev => ({ ...prev, result: data, loading: false }));
    } catch (err) {
      setState(prev => ({ ...prev, error: 'Search failed.', loading: false }));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    setState(prev => ({ ...prev, searchHistory: [...prev.searchHistory, searchTerm] }));
    executeSearch(searchTerm);
  };

  const handleBadgeClick = (word) => {
    setState(prev => ({ ...prev, searchHistory: [...prev.searchHistory, word] }));
    executeSearch(word);
  };

  const handleHistoryClick = (index) => {
    const newHistory = searchHistory.slice(0, index + 1);
    const wordToSearch = newHistory[newHistory.length - 1];
    setState(prev => ({ ...prev, searchHistory: newHistory }));
    executeSearch(wordToSearch);
  };

  return (
    <div>
      <Button variant="outline-secondary" className="reset-btn" onClick={onReset}>
        <ArrowCounterclockwise className="me-2" />
        초기화
      </Button>

      <div className="text-center mb-4">
        <h1 className="display-4 gradient-text">Writers' Word Dictionary</h1>
        <p className="lead text-muted mt-3">단어의 뜻, 유의어, 그리고 관련 단어를 탐색해 보세요.</p>
      </div>

      {searchHistory.length > 0 && (
        <Breadcrumb>
          {searchHistory.map((word, index) => (
            <Breadcrumb.Item key={index} onClick={() => handleHistoryClick(index)} active={index === searchHistory.length - 1}>
              {word}
            </Breadcrumb.Item>
          ))}
        </Breadcrumb>
      )}

      <Form onSubmit={handleFormSubmit} className="mt-3">
        <Form.Group className="mb-3">
          <Form.Control
            type="text"
            placeholder="알고 싶은 단어를 입력하세요..."
            value={searchTerm}
            onChange={(e) => setState(prev => ({ ...prev, searchTerm: e.target.value }))}
            required
          />
        </Form.Group>
        <div className="d-grid">
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? <Spinner size="sm" /> : '검색'}
          </Button>
        </div>
      </Form>

      {error && <Alert variant="danger" className="mt-4">{error}</Alert>}

      {result && (
        <div className="results-card mt-5">
          <Card.Body>
            <h3 className="gradient-text" style={{ color: '#212529' }}>'{searchHistory[searchHistory.length - 1]}'에 대한 검색 결과</h3>
            <div className="mt-4"><h5>정의</h5><p>{result.definition}</p></div>
            {result.synonyms && result.synonyms.length > 0 && (
              <div className="mt-4">
                <h5>유의어</h5>
                <div>
                  {result.synonyms.map((synonym, index) => (
                    <OverlayTrigger key={`syn-${index}`} placement="top" overlay={<Tooltip>클릭하여 검색!</Tooltip>}>
                      <Badge as="button" pill bg="secondary" onClick={() => handleBadgeClick(synonym)} className="me-2 mb-2 p-2 badge-as-button">{synonym}</Badge>
                    </OverlayTrigger>
                  ))}
                </div>
              </div>
            )}
            {result.related_words && result.related_words.length > 0 && (
              <div className="mt-4">
                <h5>관련 단어</h5>
                <div>
                  {result.related_words.map((word, index) => (
                    <OverlayTrigger key={`rel-${index}`} placement="top" overlay={<Tooltip>클릭하여 검색!</Tooltip>}>
                      <Badge as="button" pill bg="dark" onClick={() => handleBadgeClick(word)} className="me-2 mb-2 p-2 badge-as-button">{word}</Badge>
                    </OverlayTrigger>
                  ))}
                </div>
              </div>
            )}
            {result.famous_quote && result.famous_quote.quote && (
              <div className="mt-4">
                <h5>유명 문장</h5>
                <blockquote className="blockquote mb-0">
                  <p>"{result.famous_quote.quote}"</p>
                  {result.famous_quote.author && result.famous_quote.book && (
                    <footer className="blockquote-footer">{result.famous_quote.author} in <cite title="Source Title">{result.famous_quote.book}</cite></footer>
                  )}
                </blockquote>
              </div>
            )}
          </Card.Body>
        </div>
      )}
    </div>
  );
}

export default WordDictionary;

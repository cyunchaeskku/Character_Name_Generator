import { Button } from 'react-bootstrap';
import { ArrowCounterclockwise } from 'react-bootstrap-icons';

function PlotGenerator({ state, setState, onReset }) {
  return (
    <div>
      <Button variant="outline-secondary" className="reset-btn" onClick={onReset}>
        <ArrowCounterclockwise className="me-2" />
        초기화
      </Button>

      <div className="text-center mb-5">
        <h1 className="display-4 gradient-text">Plot Generator</h1>
        <p className="lead text-muted mt-3">Coming soon! Get AI-powered plot ideas for your stories.</p>
      </div>
      {/* Plot generator form and results will be here */}
    </div>
  );
}

export default PlotGenerator;
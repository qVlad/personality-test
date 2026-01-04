import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import HomePage from './pages/HomePage';
import QuestionPage from './pages/QuestionPage';
import ResultPage from './pages/ResultPage';
import './index.css';

function App(): JSX.Element {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <main className="container" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/question" element={<QuestionPage />} />
            <Route path="/question/:questionId" element={<QuestionPage />} />
            <Route path="/result" element={<ResultPage />} />
          </Routes>
        </main>
      </BrowserRouter>
    </ErrorBoundary>
  );
}

export default App;

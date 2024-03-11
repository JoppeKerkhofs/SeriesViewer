import { createRoot } from 'react-dom/client';

// import all the needed components
import Home from './Home';
import Nav from './Nav';

const App = () => {
  return (
    <Nav />
  );
};

const root = createRoot(document.getElementById('root'));
root.render(<App />);

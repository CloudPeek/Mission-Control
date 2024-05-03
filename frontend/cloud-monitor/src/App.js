import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './NavBar'; // Adjust the import path as necessary
import AWSOperations from './awsOperations'; // Adjust the import path as necessary
import AWSOverviewStats from './awsOverview'; // Adjust the import path as necessary
import AWSSecOps from './awsSecOps';
import AWSServiceView from './awsServicesView'; // Adjust the import path as necessary
import './App.css'; // Ensure the CSS path is correct
import { StepProvider } from './StepContext'; // Adjust the import path as necessary

function App() {
  return (
    <Router>
      <StepProvider>
        <div className="App">
          <NavBar />
          <div className="content-area">
            <Routes>
              <Route path='/' element={<AWSOverviewStats />} />
              <Route path="/awsOperations" element={<AWSOperations />} />
              <Route path="/awsSecOps" element={<AWSSecOps />} />
              <Route path='/awsServiceView' element={<AWSServiceView />} />
            </Routes>
          </div>
        </div>
      </StepProvider>
    </Router>
  );
}

export default App; // Ensure this is present

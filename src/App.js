import styled from 'styled-components';
import './App.css';
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import Main from './componetns/Main';
import AddCampaign from './componetns/AddCampaign';
import CampaignDetails from './componetns/CampaignDetails ';
import Annocument from './componetns/Annocument';
import Contact from './componetns/Contact';
function App() {
  return (
    <Container>
   
    <Router>
    <Routes>
      <Route path='/' element={<Main/>} />
      <Route path='/addCampaign' element={<AddCampaign/>} />
      <Route path="/campaign/:id" element={<CampaignDetails />} />
      <Route path="/annocument" element={<Annocument />} />
      <Route path="/Contact" element={<Contact />} />
    </Routes>
  </Router>
  </Container>
  );
}

const Container = styled.div`
margin: 0;
padding: 0;
`;
export default App;

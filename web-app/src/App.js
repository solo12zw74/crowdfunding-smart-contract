import logo from './logo.svg';
import './App.css'
import React from 'react'
import { Routes, Router, useNavigation } from 'react-router-dom'
import Campaign from './components/Campaign'
import { Container, Menu } from 'semantic-ui-react'
import Home from 'components/Home'
import NotFound from 'components/NotFound'

import { useNavigate } from 'react-router-dom';

function App() {
  let navigate = useNavigation()
  return (
    <Container>
      <Menu secondary>
        <Menu.Item name='home' onClick={() => navigate('/')} />
      </Menu>
      <Routes>
        <Route path = '/' element={<Home />}/>
        <Route path = '/campaign/:address' element={<Campaign />}/>
        <Route path = '*' element={<NotFound />}/>
      </Routes>
    </Container>
  );
}

export default App;

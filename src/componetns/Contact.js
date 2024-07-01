import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';

const Contact = () => {
  return (
    <Container>
      <Nav />
      <Content>
        <MainContent>
          <Heading>Contact Us</Heading>
          <Info>
            <Label>Email:</Label>
            <Detail><a href="mailto:dharaneedharanchinnusamy@gmail.com">dharaneedharanchinnusamy@gmail.com</a></Detail>
          </Info>
          <Info>
            <Label>Phone:</Label>
            <Detail>+91-7397475123</Detail>
          </Info>
          <Info>
            <Label>Website:</Label>
            <Detail><a href="https://portfolio-dharaneedharan.onrender.com/" target="_blank" rel="noopener noreferrer">www.MyPortfolio.com</a></Detail>
          </Info>
        </MainContent>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: #121212;
  color: #fff;
`;

const Content = styled.div`
  display: flex;
  flex: 1;
  padding: 20px;
  overflow: auto;

  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 20px;
  background-color: #1c1c1c;
  border-radius: 8px;

  a {
    color: white;
  }

  @media (max-width: 768px) {
    margin-left: 0;
  }

  @media (min-width: 1024px) {
    padding: 40px;
  }
`;

const Heading = styled.h1`
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
  font-size: 1.5rem;
  color: #ffeb3b;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (min-width: 768px) {
    font-size: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
`;

const Info = styled.div`
  margin-bottom: 20px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: center;
  }
`;

const Label = styled.span`
  font-weight: bold;
  margin-bottom: 5px;
  color: #ffff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);

  @media (min-width: 768px) {
    width: 100px;
    margin-right: 10px;
    margin-bottom: 0;
  }
`;

const Detail = styled.span`
  a {
    color: #ffff;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }
`;

export default Contact;

import React from 'react';
import styled from 'styled-components';
import Nav from './Nav';

const Annocument = () => {
  return (
    <Container>
      <Nav />
      <Content>
        <MainContent>
          <Heading>Welcome to Our Crowdfunding Universe</Heading>
          <Paragraph>
            Step into a world where ideas collide, dreams ignite, and possibilities are limitless. Our platform isn't just about raising funds—it's about sparking revolutions, fueling passions, and celebrating creativity in its purest form.
          </Paragraph>
          <Paragraph>
            Whether you're a visionary entrepreneur, a compassionate activist, or an unstoppable artist, this is your stage. Create campaigns that defy convention and inspire change. Connect with a global community ready to rally behind innovation and meaningful causes.
          </Paragraph>
          <Paragraph>
            Embrace the unconventional. Break the mold. Together, let's rewrite the rules of fundraising and amplify voices that deserve to be heard. From the ordinary to the extraordinary, every idea finds its home here.
          </Paragraph>
          <Paragraph>
            Join us on this exhilarating journey where black meets white and crazy becomes genius. Together, we'll paint the canvas of tomorrow's dreams, one pledge at a time.
          </Paragraph>
        </MainContent>
      </Content>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 100vh;
  background-color: black;
  color: white;
  display: flex;
  flex-direction: column;
`;

const Content = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;

  @media (min-width: 768px) {
    flex-direction: row;
    align-items: flex-start;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  border-radius: 8px;
  margin-left: 0;

  @media (min-width: 768px) {
    margin-left: 20px;
  }

  @media (min-width: 1024px) {
    padding: 40px;
  }
`;

const Heading = styled.h2`
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #fff;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);

  @media (min-width: 768px) {
    font-size: 2rem;
  }

  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
`;

const Paragraph = styled.p`
  text-align: justify;
  margin-bottom: 10px;
  color: #fff;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  font-size: 0.875rem;

  @media (min-width: 768px) {
    font-size: 1rem;
  }

  @media (min-width: 1024px) {
    font-size: 1.125rem;
  }
`;

export default Annocument;

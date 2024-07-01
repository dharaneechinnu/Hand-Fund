import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = () => {
  return (
    <LoaderContainer>
      <BlurBackground />
      <LoaderContent>
        <LoaderText>Loading</LoaderText>
        <LoadingSpinner />
        <LoaderSubtext>Please Wait</LoaderSubtext>
      </LoaderContent>
    </LoaderContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;
  height: 100vh; 
  background-color: #121212;
`;

const BlurBackground = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backdrop-filter: blur(10px);
 
  z-index: 1;
`;

const LoaderContent = styled.div`
  position: relative;
  z-index: 2;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoaderText = styled.div`
  font-size: 1.5rem;
  color: white;
  margin-bottom: 10px;
`;

const LoadingSpinner = styled.div`
  border: 8px solid rgba(255, 255, 255, 0.3);
  border-top: 8px solid green;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  position: relative;
  animation: ${spin} 2s linear infinite;

  &:before {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 6px;
    height: 30%;
    background: green;
    transform-origin: bottom center;
    transform: translate(-50%, -50%) rotate(0deg);
  }
`;

const LoaderSubtext = styled.div`
  font-size: 1.2rem;
  color: white;
  margin-top: 10px;
`;

export default Loader;

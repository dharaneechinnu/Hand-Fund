import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import Web3 from 'web3';
import logo from './Assests/Lift.jpg'
const Nav = () => {
  const [account, setAccount] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const sidebarRef = useRef();
 
  const connectWallet = async () => {
    if (window.ethereum) {
      const web3 = new Web3(window.ethereum);
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);
        console.log('Connected account:', accounts[0]);
      } catch (error) {
        console.error('User denied account access', error);
      }
    } else {
      alert('Non-Ethereum browser detected. You do not have Metamask or any Wallet  ');
    }
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <Container>
      <MainContent>
        <NavSection>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'inherit' }}>
            <Logo>
           <h2><span>HAND</span>🤝FUND</h2>
              </Logo>
          </Link>
        </NavSection>
        
        <WalletSection>
          <ConnectWalletButton className="connect-wallet" onClick={connectWallet}>
            {account ? `Connected: ${account.substring(0, 6)}...${account.substring(account.length - 4)}` : 'Connect Wallet'}
          </ConnectWalletButton>
          <ToggleButton onClick={toggleSidebar}>
            {isOpen ? (
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" id="Close--Streamline-Ultimate.svg" height="24" width="24">
                <desc>Close Streamline Icon: https://streamlinehq.com</desc>
                <path d="m0.75 23.249 22.5 -22.5" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
                <path d="M23.25 23.249 0.75 0.749" fill="none" stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"></path>
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" id="Ascending-Sort-1--Streamline-Ultimate.svg" height="24" width="24">
                <desc>Ascending Sort 1 Streamline Icon: https://streamlinehq.com</desc>
                <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M0.75 18.8999h7.3" stroke-width="1.5"></path>
                <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M0.75 12h14.8" stroke-width="1.5"></path>
                <path stroke="#ffffff" stroke-linecap="round" stroke-linejoin="round" stroke-miterlimit="10" d="M0.75 5.1001h22.5" stroke-width="1.5"></path>
              </svg>
            )}
          </ToggleButton>
        </WalletSection>
      </MainContent>
      <Sidebar ref={sidebarRef} isOpen={isOpen}>
        <SidebarContent>
          <SidebarLink to="/">Home</SidebarLink>
          <SidebarLink to="/addCampaign">Create A Campaign</SidebarLink>
          <SidebarLink to="/annocument">Announcement</SidebarLink>
          <SidebarLink to="/contact">Contact</SidebarLink>
        </SidebarContent>
      </Sidebar>
    </Container>
  );
};

const Container = styled.div`
  width: 100vw;
  height: 60px;
  background-color: #121212;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  position: relative; /* Added to handle the sidebar positioning */
`;

const MainContent = styled.main`
  width: 100vw;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex: 1;
`;

const NavSection = styled.nav`
  flex: 1;
  display: flex;
  align-items: center;
  padding: 10px;
`;

const Logo = styled.h1`
  color: white;
  margin: 0;

  h2 {
    font-family: "Montaga", serif;
  }

  span {
    color: green;
  }

  @media screen and (max-width: 768px) {
    /* Adjust styles for screens up to 768px wide */
    font-size: 24px;
  }

  @media screen and (max-width: 480px) {
    /* Adjust styles for screens up to 480px wide */
    font-size: 18px;
  }
`;


const WalletSection = styled.div`
  display: flex;
  align-items: center;
  padding: 10px;
`;

const ConnectWalletButton = styled.button`
  padding: 10px;
  margin-right: 10px;
  border-radius: 10px;
  border: none;
  color: white;
  font-size: 1.0rem;
  background-color: #e91e63;
  cursor: pointer;

  &:hover {
    background-color: #d81e63;
  }
`;

const ToggleButton = styled.button`
  background: none;
  border: none;
  color: white;
  font-size: 1rem;
  cursor: pointer;
  margin-left: 10px;

  &:hover {
    text-decoration: underline;
  }
`;

const Sidebar = styled.div`
  position: fixed;
  top: 60px; /* Adjust based on the height of your nav bar */
  right: 0;
  width: 250px;
  height: calc(100vh - 60px);
  display: flex;
  flex-direction: column;
  background-color: #121212;
  opacity: 0.91;
  transform: ${({ isOpen }) => (isOpen ? 'translateX(0)' : 'translateX(100%)')};
  transition: transform 0.3s ease-in-out;
  box-shadow: -2px 0 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const SidebarContent = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  padding: 20px;
  gap: 40px; /* Add space between items */
`;

const SidebarLink = styled(Link)`
  color: white;
  text-decoration: none;
  padding: 10px 0;
  font-size: 1.2rem;

  &:hover {
    text-decoration: underline;
  }
`;

export default Nav;

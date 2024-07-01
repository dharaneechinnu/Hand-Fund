import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { abi } from '../Abi'; 
import Nav from './Nav';
import styled from 'styled-components';
import { useNavigate, useLocation } from 'react-router-dom';
import Loader from './Loader';

const Main = () => {
    const [campaigns, setCampaigns] = useState([]);
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('query')?.toLowerCase() || '';

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setAccount(accounts[0]);

                    const contractInstance = new web3Instance.eth.Contract(abi, "0x0C7B235Df9582789CEc30F4b37CF2ADE347Aff88");
                    setContract(contractInstance);

                    const campaignsCount = await contractInstance.methods.numberOfItems().call();
                    const campaignsArray = [];
                    for (let i = 0; i < campaignsCount; i++) {
                        const campaign = await contractInstance.methods.getCampaign(i).call();
                        campaignsArray.push({
                            id: i,
                            owner: campaign.owner,
                            title: campaign.title,
                            description: campaign.description,
                            target: Number(web3Instance.utils.fromWei(campaign.target, 'ether')).toFixed(1),
                            deadline: new Date(Number(campaign.deadline) * 1000),
                            amountCollected: Number(web3Instance.utils.fromWei(campaign.amountCollected, 'ether')).toFixed(1),
                            image: campaign.image,
                            donators: campaign.donators,
                            donations: campaign.donations.map(donation => Number(web3Instance.utils.fromWei(donation, 'ether')).toFixed(4))
                        });
                    }
                    setCampaigns(campaignsArray);
                } else {
                    console.error("Web3 provider not detected. Please install MetaMask.");
                }
            } catch (error) {
                console.error("Error initializing web3: ", error);
            } finally {
                setLoading(false); 
            }
        };
        init();
    }, []);

    const filteredCampaigns = campaigns.filter(campaign => {
        const daysLeft = Math.ceil((campaign.deadline - new Date()) / (1000 * 60 * 60 * 24));
        return campaign.title.toLowerCase().includes(query) && daysLeft > 0;
    });

    const navigateToDetails = (campaignId) => {
        navigate(`/campaign/${campaignId}`);
    };

    return (
        <Container>
            <Nav onSearch={(query) => console.log('Search query:', query)} />
            <Content>
                {loading ? (
                    <LoadingIndicator><Loader/></LoadingIndicator>
                ) : (
                    <MainContent>
                        {filteredCampaigns.map(campaign => (
                            <ItemCard key={campaign.id} onClick={() => navigateToDetails(campaign.id)}>
                                <CampaignImage src={campaign.image} alt="Campaign" />
                                <CampaignDetails>
                                    <CampaignTitle>{campaign.title}</CampaignTitle>
                                    <CampaignDescription>{campaign.description}</CampaignDescription>
                                    <CampaignInfo>
                                        <div className="one-line">
                                            <div>
                                                <p>{`${campaign.amountCollected} ETH`}</p>
                                                <h5>{`Raised of ${campaign.target} ETH`}</h5>
                                            </div>
                                            <div style={{ textAlign: 'left' }}>
                                                <p>{`${Math.ceil((campaign.deadline - new Date()) / (1000 * 60 * 60 * 24))}`}</p>
                                                <h5>Days Left</h5>
                                            </div>
                                        </div>
                                        <p className='owner'>{` ${campaign.owner}`}</p>
                                    </CampaignInfo>
                                </CampaignDetails>
                            </ItemCard>
                        ))}
                    </MainContent>
                )}
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
    overflow-x: hidden; 
`;

const Content = styled.div`
    flex: 1;
    display: flex;
    justify-content: center; 
    align-items: center;
`;

const MainContent = styled.main`
    padding: 20px;
    display: grid;
    grid-template-columns: repeat(3, 1fr); 
    grid-gap: 20px;

    @media (max-width: 992px) {
        grid-template-columns: repeat(2, 1fr);
    }

    @media (max-width: 576px) {
        grid-template-columns: 1fr;
    }
`;

const ItemCard = styled.div`
    background: #1c1c1c;
    border-radius: 10px;
    overflow: hidden;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease-in-out;
    color: #fff;
    cursor: pointer;
    display: flex;
    flex-direction: column; 
    height: auto; 
    margin-top: 15px;

    &:hover {
        transform: scale(1.02);
    }
`;

const CampaignImage = styled.img`
    width: 100%;
    height: 200px;
    object-fit: cover; 
    border-bottom: 1px solid #333;
`;

const CampaignDetails = styled.div`
    padding: 15px;
    display: flex;
    flex-direction: column;
    justify-content: space-between; 
    height: 100%; 
`;

const CampaignTitle = styled.h3`
    font-size: 1rem;
    margin-bottom: 10px;
`;

const CampaignDescription = styled.p`
    margin-bottom: 10px;
    font-size: 0.9rem;
    flex-grow: 1;
`;
const CampaignInfo = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 0;

    .one-line {
        display: flex;
        justify-content: space-between;
    }

    p {
        margin: 4px 2px;
        font-size: 1rem;
        font-weight: 600;
    }

    h5 {
        font-size: 0.9rem;
        margin-top: 5px;
    }

    .owner {
        margin: 0;
        padding: 5px;
        border: 1px solid black;
        border-radius: 5px;
        font-size: 0.85rem;
        background-color: black;
    }

    @media screen and (max-width: 768px) {
        p {
            font-size: 1rem; 
        }

        h5 {
            font-size: 0.5rem; 
        }

        .owner {
            padding: 10px;
            font-size: 0.8rem; 
        }
    }

    @media screen and (max-width: 576px) {
        p {
            font-size: 0.9rem; 
        }

        h5 {
            font-size: 0.9rem; 
        }

        .owner {
            display: flex;
            justify-content: center;
            padding: 2px; 
          
        }
    }
`;

const LoadingIndicator = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    font-size: 1.5rem;
    color: #fff;
`;

export default Main;

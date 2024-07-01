import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { abi } from '../Abi';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Nav from './Nav';

const AddCampaign = () => {
    const [web3, setWeb3] = useState(null);
    const [account, setAccount] = useState('');
    const [contract, setContract] = useState(null);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [target, setTarget] = useState('');
    const [deadline, setDeadline] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const initWeb3 = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const accounts = await web3Instance.eth.getAccounts();
                    setAccount(accounts[0]);

                    const contractInstance = new web3Instance.eth.Contract(abi, "0x4cd06B44D049536dBD3c4D5e645055F8bC3c3498");
                    setContract(contractInstance);
                } else {
                    console.error("Web3 provider not detected. Please install MetaMask.");
                }
            } catch (error) {
                console.error("Error initializing Web3: ", error);
            } finally {
                setLoading(false);
            }
        };
        initWeb3();
    }, []);

    const handleAddCampaign = async (event) => {
        event.preventDefault();
        setLoading(true);
        try {
            const targetWei = web3.utils.toWei(target.toString(), 'ether'); // Convert target amount to Wei
            const deadlineUnix = Math.floor(new Date(deadline).getTime() / 1000); // Convert deadline to Unix timestamp
            await contract.methods.createCampaign(title, description, image, targetWei, deadlineUnix).send({ from: account });
            console.log("Campaign created successfully");
            navigate('/');
            alert("Added Campaign Successfully");
        } catch (error) {
            console.error("Error creating campaign: ", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container>
            <Nav />
            <Content>
                {loading ? (
                    <LoadingIndicator>Loading...</LoadingIndicator>
                ) : (
                    <MainContent>
                        <FormContainer>
                            <div className="ti">
                                <h2 className='title'>Start A Campaign 🚀</h2>
                            </div>
                            <form onSubmit={handleAddCampaign}>
                                <FormRow>
                                    <FormColumn>
                                        <label>Title</label>
                                        <input type="text" placeholder='Enter Title' value={title} onChange={(e) => setTitle(e.target.value)} required />
                                    </FormColumn>
                                    <FormColumn>
                                        <label>Target (ETH)</label>
                                        <input type="number" placeholder='Enter Amount in ETH' step="0.01" value={target} onChange={(e) => setTarget(e.target.value)} required />
                                    </FormColumn>
                                </FormRow>
                                <FormColumn>
                                    <label>Description</label>
                                    <textarea value={description} placeholder='Description' onChange={(e) => setDescription(e.target.value)} required />
                                </FormColumn>
                                <FormRow>
                                    <FormColumn>
                                        <label>Deadline</label>
                                        <input type="datetime-local" value={deadline} onChange={(e) => setDeadline(e.target.value)} required />
                                    </FormColumn>
                                    <FormColumn>
                                        <label>Image URL</label>
                                        <input type="url" placeholder='Image URL' value={image} onChange={(e) => setImage(e.target.value)} />
                                    </FormColumn>
                                </FormRow>
                                <ButtonContainer>
                                    <button type="submit">Create Campaign</button>
                                </ButtonContainer>
                            </form>
                        </FormContainer>
                    </MainContent>
                )}
            </Content>
        </Container>
    );
};

const Container = styled.div`
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #121212;
    color: white;
    overflow-y: hidden;
`;

const Content = styled.div`
    display: flex;
    flex: 1;

    @media (max-width: 576px) {
        flex-direction: column;
    }
`;

const MainContent = styled.main`
    flex: 1;
    padding: 20px;

    h2 {
        margin-top: 0;
    }

    @media (max-width: 768px) {
        padding: 10px;
    }
`;

const FormContainer = styled.div`
    padding: 20px;

    .ti {
        display: flex;
        justify-content: center;
        margin-bottom: 20px;
    }

    .title {
        background-color: #1c1c1c;
        border-radius: 10px;
        padding: 10px;
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    label {
        margin-bottom: 5px;
        font-weight: bold;
    }

    input, textarea {
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 4px;
        background: transparent;
        width: 100%;
        max-width: 600px;
        color: white;
    }

    textarea {
        max-width: 100%;
        min-height: 150px;
        resize: vertical;
    }

    @media (max-width: 768px) {
        input, textarea {
            width: 100%;
        }
    }

    input[type="text"]:disabled {
        background-color: #333;
    }
`;

const FormRow = styled.div`
    display: flex;
    justify-content: space-between;

    @media (max-width: 768px) {
        flex-direction: column;
    }
`;

const FormColumn = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-right: 20px;

    &:last-child {
        margin-right: 0;
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: 20px;

    button {
        background-color: #e91e63;
        color: white;
        padding: 10px 20px;
        border: none;
        border-radius: 4px;
        font-size: 1.2rem;
        font-weight: 600;
        cursor: pointer;

        &:hover {
            background-color: #d81b60;
        }
    }
`;

const LoadingIndicator = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100%;
    font-size: 1.5rem;
    color: #fff;
`;

export default AddCampaign;

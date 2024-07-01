import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { abi } from '../Abi';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';
import Nav from './Nav';

const CampaignDetails = () => {
    const { id } = useParams();
    const [campaign, setCampaign] = useState(null);
    const [web3, setWeb3] = useState(null);
    const [contract, setContract] = useState(null);
    const [donationAmount, setDonationAmount] = useState('');
    const [donating, setDonating] = useState(false);

    useEffect(() => {
        const init = async () => {
            try {
                if (window.ethereum) {
                    const web3Instance = new Web3(window.ethereum);
                    await window.ethereum.enable();
                    setWeb3(web3Instance);

                    const contractInstance = new web3Instance.eth.Contract(
                        abi,
                        "0x4cd06B44D049536dBD3c4D5e645055F8bC3c3498"
                    );
                    setContract(contractInstance);

                    const campaignData = await contractInstance.methods
                        .getCampaign(id)
                        .call();
                    if (!campaignData) {
                        throw new Error(`Campaign with id ${id} not found.`);
                    }

                    const formattedCampaign = {
                        id,
                        owner: campaignData.owner,
                        title: campaignData.title,
                        description: campaignData.description,
                        target: Number(
                            web3Instance.utils.fromWei(
                                campaignData.target,
                                'ether'
                            )
                        ).toFixed(1),
                        deadline: new Date(
                            Number(campaignData.deadline) * 1000
                        ),
                        amountCollected: Number(
                            web3Instance.utils.fromWei(
                                campaignData.amountCollected,
                                'ether'
                            )
                        ).toFixed(1),
                        image: campaignData.image,
                        donators: campaignData.donators,
                        donations: campaignData.donations.map((donation) =>
                            Number(
                                web3Instance.utils.fromWei(donation, 'ether')
                            ).toFixed(1)
                        ),
                    };
                    setCampaign(formattedCampaign);
                } else {
                    throw new Error(
                        'Web3 provider not detected. Please install MetaMask.'
                    );
                }
            } catch (error) {
                console.error('Error initializing campaign details:', error);
            }
        };
        init();
    }, [id]);

    const handleDonation = async (event) => {
        event.preventDefault();
        try {
            if (!web3 || !contract || !campaign) {
                throw new Error(
                    'Web3, contract, or campaign data not initialized.'
                );
            }

            setDonating(true);
            const donationAmountWei = web3.utils.toWei(
                donationAmount.toString(),
                'ether'
            );
            const accounts = await web3.eth.getAccounts();
            if (!accounts) {
                alert('Connect Wallet');
            }
            const userAddress = accounts[0];
            await contract.methods.donateToCampaign(id).send({
                from: userAddress,
                value: donationAmountWei,
            });
            console.log(
                `Donated ${donationAmount} ETH to campaign ${id}`
            );
            const updatedCampaign = await contract.methods
                .getCampaign(id)
                .call();
            if (!updatedCampaign) {
                throw new Error(
                    `Updated campaign data not found for id ${id}.`
                );
            }

            const formattedUpdatedCampaign = {
                ...campaign,
                amountCollected: Number(
                    web3.utils.fromWei(
                        updatedCampaign.amountCollected,
                        'ether'
                    )
                ).toFixed(1),
                donations: updatedCampaign.donations.map((donation) =>
                    Number(
                        web3.utils.fromWei(donation, 'ether')
                    ).toFixed(1)
                ),
            };
            setCampaign(formattedUpdatedCampaign);
        } catch (error) {
            console.error('Error donating to campaign: ', error);
            setDonating(false);
        }
    };

    if (!campaign) {
        return <LoadingContainer>Loading...</LoadingContainer>;
    }

    const filteredDonators = campaign.donators.filter(
        (donor, index) => campaign.donations[index] !== '0.0000'
    );

    return (
        <Container>
            <Nav />
            <Content>
                <MainContent>
                    <RightPanel>
                        <ImageContainer>
                            <Image src={campaign.image} alt={campaign.title} />
                        </ImageContainer>

                        {campaign.owner && (
                            <CreatorSection>
                                <CreatorTitle>Owner</CreatorTitle>
                                <CreatorInfo>{campaign.owner}</CreatorInfo>
                            </CreatorSection>
                        )}

                        {campaign.description && (
                            <StorySection>
                                <SectionTitle>STORY</SectionTitle>
                                <Description>
                                    {campaign.description}
                                </Description>
                            </StorySection>
                        )}

                        {filteredDonators.length > 0 && (
                            <DonorsSection>
                                <SectionTitle>DONATORS</SectionTitle>
                                <DonorsList>
                                    {filteredDonators.map(
                                        (donor, index) => (
                                            <Donor key={index}>
                                                {donor} -{' '}
                                                {campaign.donations[index]} ETH
                                            </Donor>
                                        )
                                    )}
                                </DonorsList>
                            </DonorsSection>
                        )}
                    </RightPanel>
                    <LeftPanel>
                        <FundDetails>
                            <FundDetailItem>
                                <h2>
                                    {Math.ceil(
                                        (campaign.deadline -
                                            new Date()) /
                                            (1000 * 60 * 60 * 24)
                                    )}
                                </h2>
                                <p>Days Left</p>
                            </FundDetailItem>
                        </FundDetails>

                        <FundDetails>
                            <FundDetailItem>
                                <h2>{campaign.amountCollected}</h2>
                                <p>ETH Raised of {campaign.target}</p>
                            </FundDetailItem>
                        </FundDetails>

                        <FundDetails>
                            <FundDetailItem>
                                <h2>{campaign.donators.length}</h2>
                                <p>Total Donators</p>
                            </FundDetailItem>
                        </FundDetails>

                        <FundSection>
                            <SectionTitle>FUND</SectionTitle>
                            <DonateForm onSubmit={handleDonation}>
                                <Input
                                    type="number"
                                    step="0.01"
                                    id="donationAmount"
                                    value={donationAmount}
                                    onChange={(e) =>
                                        setDonationAmount(
                                            e.target.value
                                        )
                                    }
                                    required
                                    placeholder="ETH 0.1"
                                />
                                <DonateButton
                                    type="submit"
                                    disabled={donating}
                                >
                                    {donating
                                        ? 'Donating...'
                                        : 'Fund Campaign'}
                                </DonateButton>
                            </DonateForm>
                        </FundSection>
                    </LeftPanel>
                </MainContent>
            </Content>
        </Container>
    );
};const Container = styled.div`
    margin: 0;
    padding: 0;
    width: 100vw;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    background-color: #121212;
    color: #fff;
`;

const LoadingContainer = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-color: #121212;
    color: #fff;
    font-size: 1.2rem;
`;

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
`;

const MainContent = styled.main`
    flex: 1;
    display: flex;
    flex-direction: row;
    padding: 20px;
    gap: 20px;
    width: 100vw;
    box-sizing: border-box;
    overflow-x: hidden;

    @media (max-width: 1200px) {
        padding: 15px;
        gap: 15px;
    }

    @media (max-width: 992px) {
        flex-direction: column;
    }

    @media (max-width: 768px) {
        padding: 10px;
        gap: 10px;
    }

    @media (max-width: 576px) {
        padding: 5px;
        gap: 5px;
    }
`;

const LeftPanel = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 1200px) {
        gap: 15px;
    }

    @media (max-width: 768px) {
        gap: 10px;
    }

    @media (max-width: 576px) {
        gap: 15px;
    }
`;

const RightPanel = styled.div`
    flex: 2;
    display: flex;
    flex-direction: column;
    gap: 20px;

    @media (max-width: 1200px) {
        gap: 15px;
    }

    @media (max-width: 768px) {
        gap: 10px;
    }

    @media (max-width: 576px) {
        gap: 15px;
    }
`;

const ImageContainer = styled.div`
    width: 100%;
    padding-bottom: 56.25%;
    position: relative;
`;

const Image = styled.img`
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    top: 0;
    left: 0;
    border-radius: 10px;
`;

const FundDetails = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    background-color: #1c1c1c;
    padding: 10px;
    border-radius: 10px;

    @media (max-width: 576px) {
        padding: 5px;
        gap: 15px;
    }
`;

const FundDetailItem = styled.div`
    text-align: center;
    font-size: 1rem;

    @media (max-width: 576px) {
        font-size: 0.9rem;
    }
`;

const CreatorSection = styled.div`
    background-color: #1c1c1c;
    padding: 20px;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    border-radius: 10px;
    font-size: 1rem;

    @media (max-width: 768px) {
        padding: 15px;
        font-size: 0.9rem;
    }

    @media (max-width: 576px) {
        padding: 10px;
        font-size: 0.8rem;
    }
`;

const CreatorTitle = styled.h2`
    margin-bottom: 10px;
    font-size: 1.2rem;

    @media (max-width: 576px) {
        font-size: 1rem;
        margin-bottom: 5px;
    }
`;

const CreatorInfo = styled.p`
    font-size: 1rem;

    @media (max-width: 576px) {
        font-size: 0.9rem;
    }
`;

const StorySection = styled.div`
    background-color: #1c1c1c;
    padding: 20px;
    border-radius: 10px;

    @media (max-width: 768px) {
        padding: 15px;
    }

    @media (max-width: 576px) {
        padding: 10px;
    }
`;

const SectionTitle = styled.h2`
    margin-bottom: 10px;
    font-size: 1.2rem;

    @media (max-width: 576px) {
        font-size: 1rem;
        margin-bottom: 5px;
    }
`;

const DonorsSection = styled.div`
    background-color: #1c1c1c;
    padding: 20px;
    border-radius: 10px;

    @media (max-width: 768px) {
        padding: 15px;
    }

    @media (max-width: 576px) {
        padding: 10px;
    }
`;

const DonorsList = styled.ul`
    list-style-type: none;
    padding: 0;
`;

const Donor = styled.li`
    margin-bottom: 10px;
    font-size: 1rem;

    @media (max-width: 576px) {
        margin-bottom: 5px;
        font-size: 0.9rem;
    }
`;

const FundSection = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
    background-color: #1c1c1c;
    padding: 20px;
    border-radius: 10px;

    @media (max-width: 768px) {
        padding: 15px;
        gap: 7px;
    }

    @media (max-width: 576px) {
        padding: 10px;
        gap: 5px;
    }
`;

const DonateForm = styled.form`
    display: flex;
    flex-direction: column;
    gap: 10px;

    @media (max-width: 576px) {
        gap: 5px;
    }
`;

const Input = styled.input`
    padding: 10px;
    border: none;
    border-radius: 4px;

    @media (max-width: 576px) {
        padding: 7px;
    }
`;

const DonateButton = styled.button`
    background-color: #e91e63;
    color: white;
    padding: 10px;
    border: none;
    border-radius: 4px;
    font-size: 1.0rem;
    font-weight: 600;
    cursor: pointer;

    &:hover {
        background-color: #d81b60;
    }

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    @media (max-width: 576px) {
        padding: 7px;
        font-size: 0.9rem;
    }
`;

const Description = styled.p`
    font-size: 1.2rem;
    margin-bottom: 20px;

    @media (max-width: 768px) {
        font-size: 1rem;
    }

    @media (max-width: 576px) {
        font-size: 0.9rem;
    }
`;


export default CampaignDetails;

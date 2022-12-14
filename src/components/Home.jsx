import { ethers } from 'ethers';
import { useEffect, useState } from 'react';
import  NFT from './NFT.sol/NFT.json';

const contractAddress = '0x1F5a9F703394163f87F80cCa53fBC6306D4B5c78';

const provider = new ethers.providers.Web3Provider(window.ethereum);

// get the end user
const signer = provider.getSigner();

// get the smart contract
const contract = new ethers.Contract(contractAddress, NFT.abi, signer);

function Home() {

    const [totalMinted, setTotalMinted] = useState(0);
    useEffect(() => {
      getCount();
    }, []);
  
    const getCount = async () => {
      const count = await contract.count();
      console.log(parseInt(count));
      setTotalMinted(parseInt(count));
    };
  
    return (
      <div>  
          {Array(totalMinted + 1)
          .fill(0)
          .map((_, i) => (
              <div key={i}>
              <NFTImage tokenId={i} getCount={getCount} />
              </div>
          ))}
      </div>
    );
  }

function NFTImage({ tokenId, getCount }) {
    const contentId = 'QmTEfcKmYKf6K36uwigKjcu9jA57ojRtAJuGP6yJYHX9B1';
    const metadataURI = `${contentId}/${tokenId}.json`;
    const imageURI = `https://gateway.pinata.cloud/ipfs/QmNRj6BWc9oQ2bmzsemuLH32oFDd3rgEFBCvAQBBt7WUb2/${tokenId}.png`;
  
    const [isMinted, setIsMinted] = useState(false);
    useEffect(() => {
      getMintedStatus();
    }, [isMinted]);
  
    const getMintedStatus = async () => {
      const result = await contract.isContentOwned(metadataURI);
      console.log(result)
      setIsMinted(result);
    };
  
    const mintToken = async () => {
      const connection = contract.connect(signer);
      const addr = connection.address;
      const result = await contract.payToMint(addr, metadataURI, {
        value: ethers.utils.parseEther('0'),
      });
  
      await result.wait();
      getMintedStatus();
      getCount();
    };
  
    async function getURI() {
      const uri = await contract.tokenURI(tokenId);
      alert(uri);
    }
    return (
      <div>
        <img src={isMinted ? imageURI : 'img/placeholder.png'}></img>
          <h5>ID #{tokenId}</h5>
          {!isMinted ? (
            <button onClick={mintToken}>
              Mint
            </button>
          ) : (
            <button onClick={getURI}>
              Taken! Show URI
            </button>
          )}
      </div>
    );
  }
 
export default Home;
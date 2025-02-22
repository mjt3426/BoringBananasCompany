import {INFURA_ADDRESS, ADDRESS, ABI} from "../../config.js"
import Web3 from "web3";

// import the json containing all metadata. not recommended, try to fetch the database from a middleware if possible, I use MONGODB for example
import traits from "../../database/traitsfinal.json";

const infuraAddress = INFURA_ADDRESS

const skullApi = async(req, res) => {

    // SOME WEB3 STUFF TO CONNECT TO SMART CONTRACT
  const provider = new Web3.providers.HttpProvider(infuraAddress)
  const web3infura = new Web3(provider);
  const skullContract = new web3infura.eth.Contract(ABI, ADDRESS)
  


  // IF YOU ARE USING INSTA REVEAL MODEL, USE THIS TO GET HOW MANY NFTS ARE MINTED
//   const totalSupply = await skullContract.methods.totalSupply().call();
//   console.log(totalSupply)
  


// THE ID YOU ASKED IN THE URL
  const query = req.query.id;


  // IF YOU ARE USING INSTA REVEAL MODEL, UNCOMMENT THIS AND COMMENT THE TWO LINES BELOW
//   if(parseInt(query) < totalSupply) {
  const totalskulls = 2000;
  if(parseInt(query) < totalskulls) {


    // CALL CUSTOM TOKEN NAME IN THE CONTRACT
    const tokenNameCall = await skullContract.methods.skullNames(query).call();
    let tokenName = `#${query}${(tokenNameCall === '') ? "" : ` - ${tokenNameCall}`}`

    // IF YOU ARE NOT USING CUSTOM NAMES, JUST USE THIS
    // let tokenName= `#${query}`

    
    
    const signatures = [2528,2763,3833,5568,5858,6585,6812,7154,8412]
    const trait = traits[parseInt(query)]
    // const trait = traits[ Math.floor(Math.random() * 8888) ] // for testing on rinkeby 

    // CHECK OPENSEA METADATA STANDARD DOCUMENTATION https://docs.opensea.io/docs/metadata-standards
    let metadata = {}
    // IF THE REQUESTED TOKEN IS A SIGNATURE, RETURN THIS METADATA
    if ( signatures.includes( parseInt( query ) ) ) {
    
      metadata = {
        "name": tokenName,
        "description": "BoringBananasCo is a community-centered enterprise focussed on preserving our research about the emerging reports that several banana species have begun exhibiting strange characteristics following the recent worldwide pandemic. Our research team located across the globe has commenced efforts to study and document these unusual phenomena. Concerned about parties trying to suppress our research, the team has opted to store our findings on the blockchain to prevent interference. Although this is a costly endeavour, our mission has never been clearer. The fate of the world's bananas depends on it.",
        "tokenId" : parseInt(query),
        "image": `https://gateway.pinata.cloud/ipfs/${trait["imageIPFS"]}`,
        "external_url":"https://www.boringbananas.co",
        "attributes": [   
          {
            "trait_type": "Signature Series",
            "value": trait["Signature Series"]
          }    
        ]
      }
      // console.log(metadata)
    } else {
    // GENERAL SKULL METADATA
      metadata = {
        "name": tokenName,
        "description": "Do you have the strength to hold? BMF Skulls is a secret society hiding right in front of your eyes. Do you have the patience to wait and see?",
        "tokenId" : parseInt(query),
        "image": `https://gateway.pinata.cloud/ipfs/QmbEs3ww4ijPGGvr5kLMCtyhc56x9j1wZVXmQzM3Q74tdH`,
        "external_url":"https://bmfskulls.art/",
        "attributes": [          
            {
              "trait_type": "Background",
              "value": "No peeking"
            },
            {
              "trait_type": "Skull",
              "value": "No peeking"
            },
            {
              "trait_type": "Suits",
              "value": "No peeking"
            },
            {
              "trait_type": "Eyes",
              "value": "No peeking"
            },
            {
              "trait_type": "Face",
              "value": "No peeking"
            },
            {
              "trait_type": "Hats",
              "value": "No peeking"
            },
    
        ]
      }
      
      // console.log(metadata)

    }
    
    res.statusCode = 200
    res.json(metadata)
  } else {
    res.statuscode = 404
    res.json({error: "The skull you requested is out of range"})

  }


  // this is after the reveal

  
}

export default skullApi

export const DATA_PERIOD = [
  { label: '1 Day', value: '1' },
  { label: '1 Week', value: '7' },
  { label: '1 Month', value: '30' },
  { label: '3 Months', value: '90' },
  { label: '6 Months', value: '180' },
];


export const DATA_PERIOD_GRAPH = [
  {
      label:"1 Day",
      value:"1",
  },
  {
      label:"2 Days",
      value:"2",
  },
  {
      label:"3 Days",
      value:"3",
  },
  {
      label:"1 Week",
      value:"7",
  },
  {
      label:"2 Weeks",
      value:"14",
  },
  {
      label:"3 Weeks",
      value:"21",
  },
  {
      label:"1 Month",
      value:"30",
  },
  {
      label:"2 Months",
      value:"60",
  },
  {
      label:"3 Months",
      value:"90",
  },
  {
      label:"6 Months",
      value:"180",
  },
];

export const ALL_CHAINS = [
  {
    text: 'Arbitrum',
    value: 'arbitrum'
  },
  {
    text: 'Avalanche',
    value: 'avalanche'
  },
  {
    text: 'Base',
    value: 'base'
  },
  {
    text: 'Bsc',
    value: 'bsc'
  },
  {
    text: 'Cetus',
    value: 'cetus'
  },
  {
    text: 'Ethereum',
    value: 'ethereum'
  },
  {
    text: 'Linea',
    value: 'linea'
  },
  {
    text: 'Optimism',
    value: 'optimism'
  },
  {
    text: 'Polygon',
    value: 'polygon'
  },
  {
    text: 'Solana',
    value: 'solana'
  },
  {
    text: 'Sui',
    value: 'sui'
  },
  {
    text: 'ZYSync',
    value: 'zysync'
  },
  ];

export const ALL_PROTOCOL = [
  { text: 'Aerodrome', value: 'aerodrome' },
  { text: 'Camelot', value: 'camelot' },
  { text: 'Orca', value: 'orca' },
  { text: 'Pancakeswap', value: 'pancakeswap' },
  { text: 'Quickswap', value: 'quickswap' },
  { text: 'Ramses', value: 'ramses' },
  { text: 'Raydium', value: 'raydium' },
  { text: 'Trader joe', value: 'trader joe' },
  { text: 'Uniswap', value: 'uniswap' },
  { text: 'Velodrome', value: 'velodrome' },
];

export const MAIN_TABLE_HEADER = [
    {
      title: 'Pool',
      key: 'BaseToken',
    },
    { title: 'Chain', key: 'ChainId' },
    { title: 'Protocol', key: 'DexId' },
    { title: 'Apr est.', key: 'apr' },
    { title: 'Correlation', key: 'corr' },
    { title: 'Liquidity', key: 'Liquidity' },
    { title: 'Volume', key: 'Volume' },
    { title: 'Fees', key: 'fees' },
    { title: 'Vol/TVL', key: 'vol_tvl' },
];

export const DETAIL_TABLE_HEADER = [
    {
    title: 'Date',
    key: 'date',
    },
    { title: 'APR', key: 'apr' },
    // { title: 'Correlation', key: 'corr' },
    { title: 'Liquidity', key: 'liquidity' },
    { title: 'Volume', key: 'volume' },
    { title: 'Fees', key: 'fees' },
    { title: 'Vol/TVL', key: 'vol_tvl' },
];

export const MONTH_NAMES = {
  '01': "Jan",
  '02': "Feb",
  '03': "Mar",
  '04': "Apr",
  '05': "May",
  '06': "Jun",
  '07': "Jul",
  '08': "Aug",
  '09': "Sep",
  '10': "Oct",
  '11': "Nov",
  '12': "Dec"
};


export const ALL_CATEGORIES = [

  {"text":"Layer 1 (L1)","value":"Layer 1 (L1)"},
	{"text":"Smart Contract Platform","value":"Smart Contract Platform"},
	{"text":"Stablecoins","value":"Stablecoins"},
	{"text":"Centralized Exchange (CEX)","value":"Centralized Exchange (CEX)"},
	{"text":"Decentralized Finance (DeFi)","value":"Decentralized Finance (DeFi)"},
	{"text":"Meme","value":"Meme"},
	{"text":"Liquid Staking Tokens","value":"Liquid Staking Tokens"},
	{"text":"NFT","value":"NFT"},
	{"text":"Artificial Intelligence (AI)","value":"Artificial Intelligence (AI)"},
	{"text":"Governance","value":"Governance"},
	{"text":"DePIN","value":"DePIN"},
	{"text":"Layer 2 (L2)","value":"Layer 2 (L2)"},
	{"text":"Gaming (GameFi)","value":"Gaming (GameFi)"},
	{"text":"Storage","value":"Storage"},
	{"text":"Oracle","value":"Oracle"},
	{"text":"Play To Earn","value":"Play To Earn"},
	{"text":"Metaverse","value":"Metaverse"},
	{"text":"Real World Assets (RWA)","value":"Real World Assets (RWA)"},
	{"text":"Gaming Blockchains","value":"Gaming Blockchains"},
	{"text":"Lending/Borrowing","value":"Lending/Borrowing"},
	{"text":"Privacy Coins","value":"Privacy Coins"},
	{"text":"Internet of Things (IOT)","value":"Internet of Things (IOT)"},
	{"text":"SocialFi","value":"SocialFi"},
	{"text":"Gaming Utility Token","value":"Gaming Utility Token"},
	{"text":"Gaming Governance Token","value":"Gaming Governance Token"},
	{"text":"Analytics","value":"Analytics"},
	{"text":"Sports","value":"Sports"},
	{"text":"Asset-backed Tokens","value":"Asset-backed Tokens"},
	{"text":"Cross-chain Communication","value":"Cross-chain Communication"},
	{"text":"Gaming Platform","value":"Gaming Platform"},
	{"text":"Identity","value":"Identity"},
	{"text":"NFT Marketplace","value":"NFT Marketplace"},
	{"text":"Launchpad","value":"Launchpad"},
	{"text":"Decentralized Science (DeSci)","value":"Decentralized Science (DeSci)"},
	{"text":"Move To Earn","value":"Move To Earn"},
	{"text":"Insurance","value":"Insurance"},
	{"text":"Music","value":"Music"},
	{"text":"Gambling","value":"Gambling"},
	{"text":"Cybersecurity","value":"Cybersecurity"},
	{"text":"Tourism","value":"Tourism"}
].sort((a, b) => {
  if (a.text.toLowerCase() < b.text.toLowerCase()) return -1;
  if (a.text.toLowerCase() > b.text.toLowerCase()) return 1;
  return 0;
});

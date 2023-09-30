/* eslint-disable no-undef */
require("dotenv").config({ path: "../.env" });

const ENVIRONMENT = process.env.CHAIN || "arbitrum";
const EDGE_CACHE_TTL = process.env.EDGE_CACHE_TTL || 60;
const BROWSER_CACHE_TTL = process.env.BROWSER_CACHE_TTL || 0;
const PROVIDER_TIMEOUT = parseInt(process.env.PROVIDER_TIMEOUT) || 5000;
const RATE_LIMITED_PROVIDERS = [];
const rpcs = {
  arbitrum: [
    { url: "https://rpc.ankr.com/arbitrum", failedCount: 0 },
    {
      url: "https://arbitrum.blockpi.network/v1/rpc/public",
      failedCount: 0
    },
    { url: "https://arbitrum.meowrpc.com", failedCount: 0 },
    { url: "https://rpc.arb1.arbitrum.gateway.fm", failedCount: 0 },
    { url: "https://1rpc.io/arb", failedCount: 0 },
    { url: "https://arbitrum-one.public.blastapi.io", failedCount: 0 },
    { url: "https://arbitrum.llamarpc.com", failedCount: 0 },
    { url: "https://arb-mainnet-public.unifra.io", failedCount: 0 },
    { url: "https://arbitrum.api.onfinality.io/public", failedCount: 0 },
    { url: "https://arb1.arbitrum.io/rpc", failedCount: 0 },
    { url: "https://arbitrum-one.publicnode.com", failedCount: 0 },
    { url: "https://arbitrum.drpc.org", failedCount: 0 },
    {
      url: "https://endpoints.omniatech.io/v1/arbitrum/one/public",
      failedCount: 0
    }
  ],
  ethereum: [
    { url: "https://eth-rpc.gateway.pokt.network", failedCount: 0 },
    { url: "https://eth-mainnet.public.blastapi.io", failedCount: 0 },
    { url: "https://rpc.ankr.com/eth", failedCount: 0 },
    { url: "https://eth.api.onfinality.io/public", failedCount: 0 },
    { url: "https://1rpc.io/eth", failedCount: 0 },
    { url: "https://virginia.rpc.blxrbdn.com", failedCount: 0 },
    { url: "https://eth.rpc.blxrbdn.com", failedCount: 0 },
    { url: "https://eth.meowrpc.com", failedCount: 0 },
    { url: "https://rpc.builder0x69.io", failedCount: 0 },
    { url: "https://rpc.mevblocker.io", failedCount: 0 },
    { url: "https://eth.llamarpc.com", failedCount: 0 },
    { url: "https://uk.rpc.blxrbdn.com", failedCount: 0 },
    { url: "https://cloudflare-eth.com", failedCount: 0 },
    { url: "https://gateway.tenderly.co/public/mainnet", failedCount: 0 },
    {
      url: "https://ethereum.blockpi.network/v1/rpc/public",
      failedCount: 0
    },
    { url: "https://ethereum.publicnode.com", failedCount: 0 },
    { url: "https://eth.drpc.org", failedCount: 0 },
    { url: "https://eth-mainnet-public.unifra.io", failedCount: 0 },
    { url: "https://rpc.eth.gateway.fm", failedCount: 0 },
    {
      url: "https://openapi.bitstack.com/v1/wNFxbiJyQsSeLrX8RRCHi7NpRxrlErZk/DjShIqLishPCTB9HiMkPHXjUM9CNM9Na/ETH/mainnet",
      failedCount: 0
    },
    { url: "https://rpc.payload.de", failedCount: 0 },
    { url: "https://singapore.rpc.blxrbdn.com", failedCount: 0 },
    { url: "https://rpc.flashbots.net", failedCount: 0 },
    { url: "https://eth-mainnet.diamondswap.org/rpc", failedCount: 0 },
    { url: "https://eth-mainnet.g.alchemy.com/v2/demo", failedCount: 0 },
    { url: "https://api.securerpc.com/v1", failedCount: 0 },
    { url: "https://api.zmok.io/mainnet/oaen6dy8ff6hju9k", failedCount: 0 },
    { url: "https://core.gashawk.io/rpc", failedCount: 0 },
    {
      url: "https://endpoints.omniatech.io/v1/eth/mainnet/public",
      failedCount: 0
    }
  ],
  // Add more environments and their corresponding PROVIDERS arrays here
};
const environmentConfig = process.env.ENVIRONMENT_CONFIG ? JSON.parse(process.env.ENVIRONMENT_CONFIG) : rpcs;

const hostname = process.env.HOSTNAME;
const port = process.env.PORT;

module.exports = {
  ENVIRONMENT,
  environmentConfig,
  EDGE_CACHE_TTL,
  BROWSER_CACHE_TTL,
  PROVIDER_TIMEOUT,
  RATE_LIMITED_PROVIDERS,
  hostname,
  port,
};
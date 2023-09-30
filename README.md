# Web3 Provider Proxy

This is used to make HTTP requests to different providers based on its capabilities, handle failures, and retry requests if necessary. It also utilizes a list of proxy servers to circumvent rate limits imposed by certain providers.

🙋 ⇰ 🌍🌎🌏 ⇰ ⛓

## Why would I need this? 

1. Reliance on a single web3 provider has proven to be a [dangerous single point of failure](https://thedefiant.io/an-infrastructure-outage-temporarily-broke-defi/).

2. Different users frequently read the same data from chain, which is both expensive and inefficient.

3. Leaking your API keys for paid providers isn’t great when they’re hard-coded in your client / DApp

This repo is the nodejs app we use to give us flexible caching functionality and a extremely minimal & non-opinionated fashion.

This is an entry-point! Not all-in solution & we welcome all forking / tweaking / contributing as such tools might meet your use-cases.

## How do I use this?

1. Clone or fork this repo!

2. You have to start the container using docker compose up --build and it will start working on the exposed port (e.g. 3000).

3. Replace the relevant environment variables you'd like to use. The import variables you'll want to pay attention to are

PROVIDERS: an array of web3 providers you'd like to use

ENVIORMENT: chain you'd like to target e.g arbitrum, ethereum etc

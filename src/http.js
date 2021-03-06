"use strict";

const { performance } = require("perf_hooks");
const express = require("express");
const _ = require("lodash");
const timeout = require('connect-timeout');

module.exports = class Http {
  constructor(
    config,
    priceOracle,
    platforms,
    platformsPolygon,
    platformsFantom,
    platformsKcc,
    platformsHarmony,
    platformsCelo,
    platformsMoonriver,
    platformsCronos,
    platformsMoonbeam,
    crossPlatforms,
    balances,
    addressTransactions,
    polygonAddressTransactions,
    fantomAddressTransactions,
    tokenCollector,
    liquidityTokenCollector,
    tokenInfo,
    autoFarm,
    polygonPriceOracle,
    polygonLiquidityTokenCollector,
    polygonTokenCollector,
    polygonBalances,
    polygonTokenInfo,
    polygonAutoFarm,
    fantomPriceOracle,
    fantomLiquidityTokenCollector,
    fantomTokenCollector,
    fantomBalances,
    fantomTokenInfo,
    fantomAutoFarm,
    kccPriceOracle,
    kccLiquidityTokenCollector,
    kccTokenCollector,
    kccBalances,
    kccTokenInfo,
    kccAddressTransactions,
    harmonyPriceOracle,
    harmonyLiquidityTokenCollector,
    harmonyTokenCollector,
    harmonyBalances,
    harmonyTokenInfo,
    harmonyAddressTransactions,
    celoPriceOracle,
    celoLiquidityTokenCollector,
    celoTokenCollector,
    celoBalances,
    celoTokenInfo,
    celoAddressTransactions,
    moonriverPriceOracle,
    moonriverLiquidityTokenCollector,
    moonriverTokenCollector,
    moonriverBalances,
    moonriverTokenInfo,
    moonriverAddressTransactions,
    cronosPriceOracle,
    cronosLiquidityTokenCollector,
    cronosTokenCollector,
    cronosBalances,
    cronosTokenInfo,
    cronosAddressTransactions,
    moonbeamPriceOracle,
    moonbeamLiquidityTokenCollector,
    moonbeamTokenCollector,
    moonbeamBalances,
    moonbeamTokenInfo,
    moonbeamAddressTransactions    
  ) {
    this.config = config;
    this.crossPlatforms = crossPlatforms;

    this.chains = {};

    this.chains.bsc = {
      platforms: platforms,
      priceOracle: priceOracle,
      liquidityTokenCollector: liquidityTokenCollector,
      tokenCollector: tokenCollector,
      balances: balances,
      tokenInfo: tokenInfo,
      addressTransactions: addressTransactions,
      autoFarm: autoFarm,
    }

    this.chains.polygon = {
      platforms: platformsPolygon,
      priceOracle: polygonPriceOracle,
      liquidityTokenCollector: polygonLiquidityTokenCollector,
      tokenCollector: polygonTokenCollector,
      balances: polygonBalances,
      tokenInfo: polygonTokenInfo,
      addressTransactions: polygonAddressTransactions,
      autoFarm: polygonAutoFarm,
    }

    this.chains.fantom = {
      platforms: platformsFantom,
      priceOracle: fantomPriceOracle,
      liquidityTokenCollector: fantomLiquidityTokenCollector,
      tokenCollector: fantomTokenCollector,
      balances: fantomBalances,
      tokenInfo: fantomTokenInfo,
      addressTransactions: fantomAddressTransactions,
      autoFarm: fantomAutoFarm,
    }

    this.chains.kcc = {
      platforms: platformsKcc,
      priceOracle: kccPriceOracle,
      liquidityTokenCollector: kccLiquidityTokenCollector,
      tokenCollector: kccTokenCollector,
      balances: kccBalances,
      tokenInfo: kccTokenInfo,
      addressTransactions: kccAddressTransactions,
      autoFarm: {}, // not supported
    }

    this.chains.harmony = {
      platforms: platformsHarmony,
      priceOracle: harmonyPriceOracle,
      liquidityTokenCollector: harmonyLiquidityTokenCollector,
      tokenCollector: harmonyTokenCollector,
      balances: harmonyBalances,
      tokenInfo: harmonyTokenInfo,
      addressTransactions: harmonyAddressTransactions,
      autoFarm: {}, // not supported
    }

    this.chains.celo = {
      platforms: platformsCelo,
      priceOracle: celoPriceOracle,
      liquidityTokenCollector: celoLiquidityTokenCollector,
      tokenCollector: celoTokenCollector,
      balances: celoBalances,
      tokenInfo: celoTokenInfo,
      addressTransactions: celoAddressTransactions,
      autoFarm: {}, // not supported
    }

    this.chains.moonriver = {
      platforms: platformsMoonriver,
      priceOracle: moonriverPriceOracle,
      liquidityTokenCollector: moonriverLiquidityTokenCollector,
      tokenCollector: moonriverTokenCollector,
      balances: moonriverBalances,
      tokenInfo: moonriverTokenInfo,
      addressTransactions: moonriverAddressTransactions,
      autoFarm: {}, // not supported
    }
    
    this.chains.cronos = {
      platforms: platformsCronos,
      priceOracle: cronosPriceOracle,
      liquidityTokenCollector: cronosLiquidityTokenCollector,
      tokenCollector: cronosTokenCollector,
      balances: cronosBalances,
      tokenInfo: cronosTokenInfo,
      addressTransactions: cronosAddressTransactions,
      autoFarm: {}, // not supported
    }
    
    this.chains.moonbeam = {
      platforms: platformsMoonbeam,
      priceOracle: moonbeamPriceOracle,
      liquidityTokenCollector: moonbeamLiquidityTokenCollector,
      tokenCollector: moonbeamTokenCollector,
      balances: moonbeamBalances,
      tokenInfo: moonbeamTokenInfo,
      addressTransactions: moonbeamAddressTransactions,
      autoFarm: {}, // not supported
    }
    
    this.app = express();
  }

  start() {
    this.app.use(timeout('40s'));

    this.routes();

    let port = 3000;
    if (process.argv[2]) {
      port = process.argv[2]
    } else if(this.config['WEBSERVER_PORT']) {
      port = this.config['WEBSERVER_PORT']
    }

    let hostname = '127.0.0.1';
    if (this.config['WEBSERVER_HOSTNAME']) {
      hostname = this.config['WEBSERVER_HOSTNAME']
    }

    this.app.listen(port, hostname, () => {
      console.log(`Listening at http://${hostname}:${port} @env:(${process.env.NODE_ENV ? process.env.NODE_ENV : 'n/a'})`);
    });
  }

  routes() {
    const { app } = this;

    app.get("/:chain/prices", async (req, res) => {
      const {chain} = req.params;
      const priceOracle = this.chains[chain].priceOracle;
      res.json(priceOracle.getAllPrices());
    });

    app.get("/:chain/autofarm", async (req, res) => {
      let timer = -performance.now();

      if (!req.query.masterchef) {
        res.status(400).json({error: 'missing "masterchef" query parameter'});
        return;
      }

      const {chain} = req.params;

      try {
        res.json(await this.chains[chain].autoFarm.getAutoAddressFarms(req.query.masterchef, req.query.address));
      } catch (e) {
        res.status(400).json({error: e.message});
      }

      timer += performance.now();
      console.log(`${chain}: ${new Date().toISOString()}: autofarm masterchef ${req.query.masterchef} - ${(timer / 1000).toFixed(3)} sec`);
    });

    app.get("/:chain/token/:address", async (req, res) => {
      let timer = -performance.now();
      const {chain, address} = req.params;

      if (!this.chains[chain]) {
        console.error(`${chain}: ${new Date().toISOString()}: token error invalid chain ${address} - ${(timer / 1000).toFixed(3)} sec`);
        res.status(400).json({message: 'invalid chain'});
        return;
      }

      const tokenInfo = this.chains[chain].tokenInfo;

      res.json(await tokenInfo.getTokenInfo(address));
      timer += performance.now();
      console.log(`${chain}: ${new Date().toISOString()}: token ${address} - ${(timer / 1000).toFixed(3)} sec`);
    });

    app.get("/:chain/tokens", async (req, res) => {
      const {chain} = req.params;
      const tokenCollector = this.chains[chain].tokenCollector;
      res.json(tokenCollector.all());
    });

    app.get("/:chain/liquidity-tokens", async (req, res) => {
      const {chain} = req.params;
      const liquidityTokenCollector = this.chains[chain].liquidityTokenCollector;
      res.json(liquidityTokenCollector.all());
    });

    app.get("/:chain/details/:address/:farm_id", async (req, res) => {
      const {address, chain} = req.params;

      try {
        const farmId = req.params.farm_id;

        const [platformName] = farmId.split("_");

        const platformsChain = this.chains[chain].platforms;

        const instance = platformsChain.getPlatformByName(platformName);
        if (!instance) {
          res.status(404).json({message: "not found"});
          return;
        }

        let timer = -performance.now();
        res.json(await instance.getDetails(address, farmId));

        timer += performance.now();
        console.log(`${chain}: ${new Date().toISOString()}: detail ${address} - ${farmId} - ${(timer / 1000).toFixed(3)} sec`);

      } catch (e) {
        console.error(e);
        res.status(500).json({message: e.message});
      }
    });

    app.get("/:chain/transactions/:address", async (req, res) => {
      const {address, chain} = req.params;

      let timer = -performance.now();

      let addressTransactions = this.chains[chain].addressTransactions;

      try {
        res.json(await addressTransactions.getTransactions(address, chain));
      } catch (e) {
        console.error(e);
        res.status(500).json({message: e.message});
      }

      timer += performance.now();
      console.log(`${chain}: ${new Date().toISOString()}: transactions ${address} - ${(timer / 1000).toFixed(3)} sec`);
    });

    app.get("/:chain/farms", async (req, res) => {
      let timer = -performance.now();

      const {chain} = req.params;

      let platformsChain = this.chains[chain].platforms;

      const items = (await Promise.allSettled(
        await platformsChain.getFunctionAwaits("getFarms")
      )).filter(i => i.value).map(i => i.value);

      const result = items.flat().map(f => {
        const item = _.cloneDeep(f);
        delete item.raw;
        return item;
      });

      if (res.headersSent) {
        console.error(`${chain}: farms - ${new Date().toISOString()}: already send / timout`);
        return;
      }

      timer += performance.now();
      console.log(`${chain}: farms - ${new Date().toISOString()}: ${(timer / 1000).toFixed(3)} sec`);

      res.json(result);
    });

    app.get("/farms", async (req, res) => {
      let timer = -performance.now();

      const items = (await Promise.allSettled(
        await this.crossPlatforms.getFunctionAwaits("getFarms")
      )).filter(i => i.value).map(i => i.value);

      const result = items.flat().map(f => {
        const item = _.cloneDeep(f);
        delete item.raw;
        return item;
      });

      if (res.headersSent) {
        console.error(`cross-chains: farms - ${new Date().toISOString()}: already send / timout`);
        return;
      }

      timer += performance.now();
      console.log(`cross-chains: farms - ${new Date().toISOString()}: ${(timer / 1000).toFixed(3)} sec`);

      res.json(result);
    });

    app.get("/:chain/yield/:address", async (req, res) => {
      if (!req.query.p) {
        res.status(400).json({error: 'missing "p" query parameter'});
        return;
      }

      let timer = -performance.now();
      const {address, chain} = req.params;

      let platforms = _.uniq(req.query.p.split(',').filter(e => e.match(/^[\w]+$/g)));
      if (platforms.length === 0) {
        res.json({});
        return;
      }

      let platformsChain = this.chains[chain].platforms;

      let functionAwaitsForPlatforms = platformsChain.getFunctionAwaitsForPlatforms(platforms, 'getYields', [address]);

      const awaits = await Promise.allSettled([...functionAwaitsForPlatforms]);

      const response = {}
      awaits.forEach(v => {
        if (!v.value) {
          console.error(v);
          return;
        }

        v.value.forEach(vault => {
          const item = _.cloneDeep(vault);
          delete item.farm.raw;

          if (!response[vault.farm.provider]) {
            response[vault.farm.provider] = [];
          }

          response[vault.farm.provider].push(item);
        });
      });

      timer += performance.now();
      console.log(`${chain}: ${new Date().toISOString()}: yield ${address} - ${platforms.join(',')}: ${(timer / 1000).toFixed(3)} sec`);

      if (res.headersSent) {
        console.error(`${chain}: ${new Date().toISOString()}: yield ${address} - ${platforms.join(',')}: already send / timout`);
        return;
      }

      res.json(response);
    });

    app.get("/yield/:address", async (req, res) => {
      let timer = -performance.now();
      const {address} = req.params;

      let platforms = [];
      if (req.query.p) {
        platforms = _.uniq(req.query.p.split(',').filter(e => e.match(/^[\w]+$/g)));

        if (platforms.length === 0) {
          res.json({});
          return;
        }
      }

      // filtered or cross-chain
      const functionAwaitsForPlatforms = platforms.length > 0
        ? this.crossPlatforms.getFunctionAwaitsForPlatforms(platforms, 'getYields', [address])
        : this.crossPlatforms.getFunctionAwaits('getYields', [address]);

      const awaits = await Promise.allSettled([...functionAwaitsForPlatforms]);

      const response = {}
      awaits.forEach(v => {
        if (!v.value) {
          console.error(v);
          return;
        }

        v.value.forEach(vault => {
          const item = _.cloneDeep(vault);
          delete item.farm.raw;

          if (!response[vault.farm.provider]) {
            response[vault.farm.provider] = [];
          }

          response[vault.farm.provider].push(item);
        });
      });

      timer += performance.now();
      console.log(`cross-chains (${platforms.length === 0 ? 'all' : platforms.length}): ${new Date().toISOString()}: yield ${address} - ${platforms.join(',')}: ${(timer / 1000).toFixed(3)} sec`);

      if (res.headersSent) {
        console.error(`cross-chains (${platforms.length === 0 ? 'all' : platforms.length}): ${new Date().toISOString()}: yield ${address} - ${platforms.join(',')}: already send / timout`);
        return;
      }

      res.json(response);
    });

    app.get("/wallet/:address", async (req, res) => {
      let timer = -performance.now();
      const {address, chain} = req.params;

      const promises = [];
      for (const chain of Object.keys(this.chains)) {
        let chainBalances = this.chains[chain].balances;

        promises.push(async() => {
          const [tokens, liquidityPools] = await Promise.allSettled([
            chainBalances.getAllTokenBalances(address),
            chainBalances.getAllLpTokenBalances(address)
          ]);

          return [...(tokens.value || []), ...(liquidityPools.value || [])].map(i => {
            i.chain = chain;
            return i;
          });
        })
      }

      const result = (await Promise.all(promises.map(fn => fn()))).flat(1)

      timer += performance.now();
      console.log(`cross-chains: ${new Date().toISOString()}: wallet ${address} - ${(timer / 1000).toFixed(3)} sec`);

      if (res.headersSent) {
        console.error(`cross-chains: ${new Date().toISOString()}: wallet ${address} - already send / timout`);
        return;
      }

      res.json(result);
    });

    app.get("/:chain/wallet/:address", async (req, res) => {
      let timer = -performance.now();
      const {address, chain} = req.params;

      let chainBalances = this.chains[chain].balances;

      const [tokens, liquidityPools] = await Promise.allSettled([
        chainBalances.getAllTokenBalances(address),
        chainBalances.getAllLpTokenBalances(address)
      ]);

      timer += performance.now();
      console.log(`${chain}: ${new Date().toISOString()}: wallet ${address} - ${(timer / 1000).toFixed(3)} sec`);

      if (res.headersSent) {
        console.error(`${chain}: ${new Date().toISOString()}: wallet ${address} - already send / timout`);
        return;
      }

      res.json({
        tokens: tokens.value ? tokens.value : [],
        liquidityPools: liquidityPools.value ? liquidityPools.value : [],
      });
    });

    app.get("/:chain/nft/:address", async (req, res) => {
      let timer = -performance.now();
      const {address, chain} = req.params;

      let chainBalances = this.chains[chain].balances;

      const [platforms] = await Promise.allSettled([
        chainBalances.getNfts(address),
      ]);

      timer += performance.now();
      console.log(`${chain}: ${new Date().toISOString()}: nft ${address} - ${(timer / 1000).toFixed(3)} sec`);

      if (res.headersSent) {
        console.error(`${chain}: ${new Date().toISOString()}: nft ${address} - already send / timout`);
        return;
      }

      res.json({
        collections: platforms.value ? platforms.value : [],
      });
    });

    app.get("/:chain/all/yield/:address", async (req, res) => {
      const {address, chain} = req.params;

      let timer = -performance.now();

      let chainBalances = this.chains[chain].balances;
      let platformsChain = this.chains[chain].platforms;

      const platformResults = await Promise.allSettled([
        chainBalances.getAllTokenBalances(address),
        chainBalances.getAllLpTokenBalances(address),
        ...platformsChain.getFunctionAwaits("getYields", [address])
      ]);

      const response = {};

      if (platformResults[0].status === "fulfilled") {
        response.wallet = platformResults[0].value;
        response.balances = await chainBalances.getBalancesFormFetched(response.wallet);
      }

      if (platformResults[1].status === "fulfilled") {
        response.liquidityPools = platformResults[1].value;
      }

      const platformsResult = {};
      platformResults.slice(2).forEach(v => {
        if (v.value) {
          v.value.forEach(vault => {
            if (!platformsResult[vault.farm.provider]) {
              platformsResult[vault.farm.provider] = [];
            }

            const item = _.cloneDeep(vault);
            delete item.farm.raw;

            platformsResult[vault.farm.provider].push(item);
          });
        } else {
          console.error(v);
        }
      });

      response.platforms = platformsResult;

      timer += performance.now();
      console.log(`${chain}: ${new Date().toISOString()}: yield ${address}: ${(timer / 1000).toFixed(3)} sec`);

      if (res.headersSent) {
        console.error(`${chain}: ${new Date().toISOString()}: yield ${address}: already send / timout`);
        return;
      }

      res.json(response);
    });
  }
};

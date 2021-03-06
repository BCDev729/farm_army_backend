Error.stackTraceLimit = 30;

"use strict";

const services = require("./services");

async function farmUpdater(forceUpdate = true) {
  (await Promise.allSettled([
    Promise.all(services.getPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getPolygonPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getFantomPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getKccPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getHarmonyPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getCeloPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getMoonriverPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getCronosPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
    Promise.all(services.getMoonbeamPlatforms().getFunctionAwaits('getFarms', [forceUpdate])),
  ])).forEach((p, index) => {
    if (p.status !== 'fulfilled') {
      console.error('farmUpdater error', index, p.reason)
    }
  });
}

async function priceUpdater() {
  (await Promise.allSettled([
    services.getCronjobs().cronInterval(),
    services.getCronjobs().polygonCronInterval(),
    services.getCronjobs().fantomCronInterval(),
    services.getCronjobs().kccCronInterval(),
    services.getCronjobs().harmonyCronInterval(),
    services.getCronjobs().celoCronInterval(),
    services.getCronjobs().moonriverCronInterval(),
    services.getCronjobs().cronosCronInterval(),
    services.getCronjobs().moonbeamCronInterval(),
  ])).forEach((p, index) => {
    if (p.status !== 'fulfilled') {
      console.error('priceUpdater error', index, p.reason)
    }
  });
}

/**
 * Collecting farm data to have historically data
 *
 * @returns {Promise<void>}
 */
async function collectHistoricalData() {
  (await Promise.allSettled([
    services.getDb().updateFarmPrices(),
    services.getDb().updateAddressMaps(),
    services.getDb().updateLpInfoMaps(),

    services.getPolygonDb().updateFarmPrices(),
    services.getPolygonDb().updateAddressMaps(),
    services.getPolygonDb().updateLpInfoMaps(),

    services.getFantomDb().updateFarmPrices(),
    services.getFantomDb().updateAddressMaps(),
    services.getFantomDb().updateLpInfoMaps(),

    services.getKccDb().updateFarmPrices(),
    services.getKccDb().updateAddressMaps(),
    services.getKccDb().updateLpInfoMaps(),

    services.getHarmonyDb().updateFarmPrices(),
    services.getHarmonyDb().updateAddressMaps(),
    services.getHarmonyDb().updateLpInfoMaps(),

    services.getCeloDb().updateFarmPrices(),
    services.getCeloDb().updateAddressMaps(),
    services.getCeloDb().updateLpInfoMaps(),

    services.getMoonriverDb().updateFarmPrices(),
    services.getMoonriverDb().updateAddressMaps(),
    services.getMoonriverDb().updateLpInfoMaps(),

    services.getCronosDb().updateFarmPrices(),
    services.getCronosDb().updateAddressMaps(),
    services.getCronosDb().updateLpInfoMaps(),

    services.getMoonbeamDb().updateFarmPrices(),
    services.getMoonbeamDb().updateAddressMaps(),
    services.getMoonbeamDb().updateLpInfoMaps(),
  ])).forEach((p, index) => {
    if (p.status !== 'fulfilled') {
      console.error('farm update interval error', index, p.reason)
    }
  });
}

// warmup
setTimeout(async () => {
  console.log('application init started')
  await priceUpdater();
  await services.getStableCollector().updateStableTokenMap();

  console.log("\x1b[32m" + "price init done" + "\x1b[0m");

  await farmUpdater(false);
  console.log("\x1b[32m" + "farms init done" + "\x1b[0m");

  services.getHttp().start()
}, 1);

// farm update interval
setInterval(async () => {
  await priceUpdater();
  await farmUpdater();
  await collectHistoricalData();

  await services.getCronjobs().cronPlatforms();
}, 1000 * 60 * 10);

// internal jobs
setTimeout(async () => {
  await services.getPelevenLeverage().cachePositions(true)
}, 1070 * 60);

setInterval(async () => {
  await services.getPelevenLeverage().cachePositions(true)
}, 1050 * 60 * 16);

setInterval(async () => {
  await services.getStableCollector().updateStableTokenMap();
}, 1150 * 60 * 60);
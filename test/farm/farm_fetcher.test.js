const assert = require('assert');
const fs = require('fs');

const FarmFetcher = require('../../src/farm/farm_fetcher');

describe('#test farm fetcher for masterchef', function () {
  it('test extraction for pancake abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/pancake-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      multiplierFunctionName: 'getMultiplier',
      poolInfoFunctionName: "poolInfo",
      poolLengthFunctionName: "poolLength",
      rewardTokenFunctionName: "cake",
      tokenPerBlockFunctionName: "cakePerBlock",
      totalAllocPointFunctionName: "totalAllocPoint",
      tokenPerSecondFunctionName: undefined,
      pendingRewardsFunctionName: "pendingCake"
    });
  });

  it('test extraction for cheese abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/cheese-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      multiplierFunctionName: 'getMultiplier',
      poolInfoFunctionName: "poolInfo",
      poolLengthFunctionName: "poolLength",
      rewardTokenFunctionName: "ccake",
      tokenPerBlockFunctionName: "ccakePerBlock",
      totalAllocPointFunctionName: "totalAllocPoint",
      tokenPerSecondFunctionName: undefined,
      pendingRewardsFunctionName: "pendingCcake"
    });
  });

  it('test extraction for mdex abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/mdex-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      multiplierFunctionName: undefined,
      poolInfoFunctionName: "poolInfo",
      poolLengthFunctionName: "poolLength",
      rewardTokenFunctionName: undefined,
      tokenPerBlockFunctionName: "mdxPerBlock",
      totalAllocPointFunctionName: "totalAllocPoint",
      tokenPerSecondFunctionName: undefined,
      pendingRewardsFunctionName: "pending"
    });
  });

  it('test extraction for polar abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/polar-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      multiplierFunctionName: 'getMultiplier',
      poolInfoFunctionName: "poolInfo",
      poolLengthFunctionName: "poolLength",
      rewardTokenFunctionName: 'polar',
      tokenPerBlockFunctionName: "polarPerBlock",
      totalAllocPointFunctionName: "totalAllocPoint",
      tokenPerSecondFunctionName: undefined,
      pendingRewardsFunctionName: "pendingPolar"
    });
  });

  it('test extraction for kebab abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/kebab-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      multiplierFunctionName: 'getMultiplier',
      poolInfoFunctionName: "poolInfo",
      poolLengthFunctionName: "poolLength",
      rewardTokenFunctionName: 'cake',
      tokenPerBlockFunctionName: "cakePerBlock",
      totalAllocPointFunctionName: "totalAllocPoint",
      tokenPerSecondFunctionName: undefined,
      pendingRewardsFunctionName: "pendingCake"
    });
  });

  it('test extraction for blizzard abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/blizzard-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      multiplierFunctionName: 'getMultiplier',
      poolInfoFunctionName: "poolInfo",
      poolLengthFunctionName: "poolLength",
      rewardTokenFunctionName: 'xBLZD',
      tokenPerBlockFunctionName: "xBLZDPerBlock",
      totalAllocPointFunctionName: "totalAllocPoint",
      tokenPerSecondFunctionName: undefined,
      pendingRewardsFunctionName: "pendingxBLZD"
    });
  });

  it('test extraction for kyber abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/kyber-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      poolInfoFunctionName: "getPoolInfo",
      rewardTokenFunctionName: undefined,
      poolLengthFunctionName: "poolLength",
      pendingRewardsFunctionName: "pendingRewards",
      totalAllocPointFunctionName: undefined,
      tokenPerSecondFunctionName: undefined,
      tokenPerBlockFunctionName: undefined,
      multiplierFunctionName: undefined,
    });
  });

  it('test extraction for viper abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/viper-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      poolInfoFunctionName: "poolInfo",
      rewardTokenFunctionName: "govToken",
      multiplierFunctionName: "getMultiplier",
      tokenPerBlockFunctionName: "REWARD_PER_BLOCK",
      tokenPerSecondFunctionName: undefined,
      totalAllocPointFunctionName: "totalAllocPoint",
      poolLengthFunctionName: "poolLength",
      pendingRewardsFunctionName: "pendingReward"
    });
  });

  it('test extraction for thor abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/thor-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    assert.deepStrictEqual(farmFetcher.extractFunctionsFromAbi(abi), {
      poolInfoFunctionName: "poolInfo",
      rewardTokenFunctionName: "thorus",
      multiplierFunctionName: "getMultiplier",
      tokenPerBlockFunctionName: undefined,
      tokenPerSecondFunctionName: 'thorusPerSecond',
      totalAllocPointFunctionName: "totalAllocPoint",
      poolLengthFunctionName: "poolLength",
      pendingRewardsFunctionName: "pendingThorus"
    });
  });

  it('test extraction for flare abi fixtures', () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/flare-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    const actual1 = farmFetcher.extractFunctionsFromAbi(abi);
    assert.deepStrictEqual(actual1, {
      poolInfoFunctionName: "poolInfo",
      tokenPerSecondFunctionName: "flarePerSec",
      totalAllocPointFunctionName: "totalAllocPoint",
      poolLengthFunctionName: "poolLength",
      pendingRewardsFunctionName: "pendingTokens",
      rewardTokenFunctionName: 'flare',
      multiplierFunctionName: undefined,
      tokenPerBlockFunctionName: undefined,
    });
  });

  it('test extraction for actions viper-abi', async () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/viper-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    const actual = await farmFetcher.extractActionsFromAbi(abi);
    assert.deepStrictEqual(actual, [
      {
        inputs: ['%pid%'],
        arguments: ['pid'],
        method: 'claimReward',
        type: 'claim',
      },
      {
        method: 'emergencyWithdraw',
        arguments: ['pid'],
        inputs: ['%pid%'],
        type: 'emergency_withdraw',
      }
    ]);
  });

  it('test extraction for actions pwault-abi.json', async () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/pwault-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    const actual = await farmFetcher.extractActionsFromAbi(abi);
    assert.deepStrictEqual(actual, [
      {
        inputs: ['%pid%'],
        arguments: ['pid'],
        method: 'claim',
        type: 'claim'
      },
      {
        method: 'emergencyWithdraw',
        inputs: ['%pid%'],
        arguments: ['pid'],
        type: 'emergency_withdraw'
      }
    ]);
  });

  it('test extraction for actions pancake-abi.json', async () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/pancake-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    const actual = await farmFetcher.extractActionsFromAbi(abi, {
      pendingRewardsFunctionName: 'pendingCake',
    });

    assert.deepStrictEqual(actual, [
      {
        inputs: ["%pid%", 0],
        arguments: ['pid', 'amount'],
        method: 'deposit',
        type: 'claim_fake'
      },
      {
        method: 'emergencyWithdraw',
        inputs: ['%pid%'],
        arguments: ['pid'],
        type: 'emergency_withdraw'
      }
    ]);
  });

  it('test extraction for actions kyber-abi.json', async () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/kyber-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    const actual = await farmFetcher.extractActionsFromAbi(abi, {
      pendingRewardsFunctionName: 'pendingCake',
    });

    assert.deepStrictEqual(actual, [
      {
        inputs: ['%pid%', 0, true],
        method: 'deposit',
        type: 'claim_fake',
        arguments: ['pid', 'amount', 'shouldHarvest'],
      },
      {
        inputs: ['%pid%'],
        arguments: ['pid'],
        method: 'withdrawAll',
        type: 'withdraw_all'
      },
      {
        method: 'emergencyWithdraw',
        arguments: ['pid'],
        inputs: ['%pid%'],
        type: 'emergency_withdraw'
      }
    ]);
  });

  it('test extraction for actions mmf-abi.json', async () => {
    const abi = JSON.parse(fs.readFileSync(`${__dirname}/fixtures/mmf-abi.json`, 'utf8'));

    const farmFetcher = new FarmFetcher({});

    const actual = await farmFetcher.extractActionsFromAbi(abi, {
      pendingRewardsFunctionName: 'pendingCake',
    });

    assert.deepStrictEqual(actual, [
      {
        inputs: ['%pid%', 0, '%referrer%'],
        arguments: ['pid', 'amount', 'referrer'],
        method: 'deposit',
        type: 'claim_fake',
      },
      {
        method: 'emergencyWithdraw',
        arguments: ['pid'],
        inputs: ['%pid%'],
        type: 'emergency_withdraw'
      }
    ]);
  });
});
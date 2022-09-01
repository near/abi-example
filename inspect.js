#!/usr/bin/env node
import util from 'util';
import path from 'path';
import * as fzstd from 'fzstd';
import * as nearApi from 'near-api-js';

const networks = {
  mainnet: 'https://rpc.mainnet.near.org',
  testnet: 'https://rpc.testnet.near.org',
  betanet: 'https://rpc.betanet.near.org',
  local: 'http://localhost:3030',
};

async function inspectContract(network, contractId, args) {
  let {toJson, compactJson, raw} = args;

  let near = await nearApi.connect({
    nodeUrl: new URL(network in networks ? networks[network] : network),
  });

  let account = await near.account(contractId);
  let response = await account.viewFunction({contractId, methodName: '__contract_abi', args: {}, parse: v => v});

  if (raw) return process.stdout.write(response);

  let decompressed_abi = fzstd.decompress(response);
  let abi = JSON.parse(Buffer.from(decompressed_abi).toString());
  if (toJson)
    if (compactJson) console.log(JSON.stringify(abi));
    else console.log(JSON.stringify(abi, null, 2));
  else console.log(util.formatWithOptions({colors: true, depth: Infinity}, abi));
}

async function main(i) {
  let args = process.argv.slice(2);
  let network,
    toJson = !process.stdout.isTTY,
    compactJson,
    raw;
  if (~(i = args.indexOf('--network')) && !(network = args.splice(i, 2)[1])) throw new Error('`--network` requires an argument');
  if ((raw = !!~(i = args.indexOf('--raw')))) args.splice(i, 1);
  if ((toJson = !!~(i = args.indexOf('--json')))) args.splice(i, 1);
  if ((compactJson = !!~(i = args.indexOf('--compact')))) args.splice(i, 1);
  if (args.length !== 1 || ['-h', '--help'].some(arg => args.includes(arg))) {
    let cmd = process.argv[1].endsWith('.js') ? 'node ' + path.basename(process.argv[1]) : path.basename(process.argv[1]);
    console.error('contract-inspector');
    console.error('------------------');
    console.error(`Usage: ${cmd} <contractName> [--network <NETWORK>] [[--json] --compact] [--raw]`);
    console.error();
    console.error('Options:');
    console.error('  --network <NETWORK>  Network name or URL to connect to [default: testnet]');
    console.error('  --json               Output the ABI in JSON format');
    console.error('  --compact            Output compact JSON');
    console.error('  --raw                Output raw bytes');
    console.error();
    console.error('Examples:');
    console.error(`  ${cmd} my-contract.testnet`);
    console.error('    Outputs the contract ABI');
    console.error();
    console.error(`  ${cmd} my-contract.testnet --json`);
    console.error('    Outputs the contract ABI in JSON');
    console.error();
    console.error(`  ${cmd} my-contract.testnet --json --compact | jq`);
    console.error('    Outputs the contract ABI in minified JSON');
    console.error();
    console.error(`  ${cmd} my-contract.testnet --raw | unzstd`);
    console.error('    Outputs the contract ABI in raw bytes, allowing you to manually decompress it');
    process.exit(1);
  }
  if (!network)
    if (!(network = process.env.NEAR_ENV)) network = 'testnet';
    else console.error(`\x1b[K\x1b[38;5;242m> detected env NEAR_ENV=${process.env.NEAR_ENV}\x1b[0m`);
  if (toJson && raw) throw new Error('`--json` and `--raw` are mutually exclusive');
  if (compactJson && !toJson) throw new Error('`--compact` requires `--json`');
  await inspectContract(network, args[0], {toJson, compactJson, raw});
}

async function _start() {
  try {
    await main();
  } catch (err) {
    console.error('An error occurred:\n ', err.stack);
  }
}

_start();

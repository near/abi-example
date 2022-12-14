<!-- markdownlint-disable MD014 -->

# NEAR ABI Example

Build a NEAR smart contract with ABI embedded, and inspect it on-chain.

## Requirements

- [`cargo-near`](https://github.com/near/cargo-near) for building the smart contract.

  ```console
  $ cargo install cargo-near
  ```

- [`near-cli`](https://github.com/near/near-cli) for deploying the smart contract.

  ```console
  $ npm install -g near-cli
  ```

## Usage

- Clone and download the dependencies.

  ```console
  $ git clone https://github.com/near/abi-example
  $ cd abi-example
  $ npm install
  ```

- Next, we need to build and deploy a contract with ABI embedded.

  - Build the contract

    `$ cargo near build --release --embed-abi --doc --out-dir ./res`

    <img width="461" alt="demo" src="https://github.com/near/abi-example/raw/master/demo.png">

    This would export the compiled contract to the `res` directory, with its ABI embedded within.

  - Deploy the contract.

    ```console
    $ NEAR_ENV=testnet near dev-deploy ./res/adder.wasm
    Starting deployment. Account id: dev-1661966288541-80307357536154, node: https://rpc.testnet.near.org, file: ./res/adder.wasm
    Transaction Id FqZPhkJ2YzFkrUXFpUetwmwtzgm9P7QMLyMtGZQhRx5u
    To see the transaction in the transaction explorer, please open this url in your browser
    https://explorer.testnet.near.org/transactions/FqZPhkJ2YzFkrUXFpUetwmwtzgm9P7QMLyMtGZQhRx5u
    Done deploying to dev-1661966288541-80307357536154
    ```

- Next, inspect the ABI for the on-chain contract. (the returns JSON adhering to [this schema](https://github.com/near/near-abi-js/blob/d468185a012c77428cf07757292104fdd3e1ea0c/lib/index.d.ts))

  - Quick inspection

    ```console
    $ NEAR_ENV=testnet node inspect.js dev-1661966288541-80307357536154
    {
      schema_version: '0.3.0',
      metadata: {
        name: 'adder',
        version: '0.1.0',
        authors: [ 'Near Inc <hello@nearprotocol.com>' ],
        build: { compiler: 'rustc 1.64.0', builder: 'cargo-near 0.3.0' }
      },
      body: {
        functions: [
          ...
    ```

  - Export the ABI as compact JSON (see [res/adder_abi.json](https://github.com/near/abi-example/blob/master/res/adder_abi.json) for a full output)

    ```console
    $ NEAR_ENV=testnet node inspect.js dev-1661966288541-80307357536154 --json --compact
    {"schema_version":"0.3.0","metadata":{"name":"adder","version":"0.1.0","authors":["Near Inc <hello@nearprotocol.com>"],"build":{"compiler":"rustc 1.64.0","builder":"cargo-near 0.3.0"}},"body":{"functions":[{ ...
    ```

  - Export the raw, compressed ABI (should be the same as the file in `./res/adder_abi.zst`), you can test this with:

    ```console
    $ NEAR_ENV=testnet node inspect.js dev-1661966288541-80307357536154 --raw > contract_abi.zst
    $ diff -s contract_abi.zst ./res/adder_abi.zst
    Files contract_abi.zst and res/adder_abi.zst are identical
    ```

  See `node inspect.js --help` for a complete list of options.

- You can also install it globally if you find it useful.

  ```console
  $ npm link
  ```

  Afterwards, you can use the `near-inspect` command anywhere instead of `node inspect.js`.

## Contribution

Unless you explicitly state otherwise, any contribution intentionally submitted
for inclusion in the work by you, as defined in the Apache-2.0 license, shall be
dual licensed as below, without any additional terms or conditions.

## License

Licensed under either of

- Apache License, Version 2.0
   ([LICENSE-APACHE](LICENSE-APACHE) or <http://www.apache.org/licenses/LICENSE-2.0>)
- MIT license
   ([LICENSE-MIT](LICENSE-MIT) or <http://opensource.org/licenses/MIT>)

at your option.

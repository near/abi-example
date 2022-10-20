<!-- markdownlint-disable MD014 -->

# NEAR ABI Example

Extract embedded ABI from a NEAR smart contract

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

    ```console
    $ cargo near build --release --embed-abi --doc --out-dir ./res
    • Checking the host environment...done
    • Collecting cargo project metadata...done
    • Generating ABI
    │    Compiling near-abi v0.1.0
    │    Compiling near-sdk v4.1.0-pre.3
    │    Compiling adder v0.1.0 (/abi-example)
    │     Finished dev [unoptimized] target(s) in 3.06s
    • Extracting ABI...done
    • Compressing ABI to be embedded..done
    • Building contract
    │    Compiling near-abi v0.1.0
    │    Compiling near-sdk v4.1.0-pre.3
    │    Compiling adder v0.1.0 (/abi-example)
    │     Finished release [optimized] target(s) in 3.51s
    ✓ Contract successfully built!
        -       Binary: /abi-example/res/adder.wasm
        -          ABI: /abi-example/res/adder_abi.json
        - Embedded ABI: /abi-example/res/adder_abi.zst
    ```

    This would export the compiled contract to the `res` directory, with its ABI embedded within.

  - Deploy the contract.

    ```console
    $ NEAR_ENV=testnet near dev-deploy ./res/adder.wasm
    Starting deployment. Account id: dev-1661966288541-80307357536154, node: https://rpc.testnet.near.org, file: ./res/adder.wasm
    Transaction Id HQwvkt78LKsopXz2CNXLgf4iJQhCJ5dv8L8zgtjpMQyE
    To see the transaction in the transaction explorer, please open this url in your browser
    https://explorer.testnet.near.org/transactions/HQwvkt78LKsopXz2CNXLgf4iJQhCJ5dv8L8zgtjpMQyE
    Done deploying to dev-1661966288541-80307357536154
    ```

- Next, inspect the ABI for the on-chain contract. (the returns JSON adhering to [this schema](https://github.com/near/near-abi-js/blob/7ec3900d273716e3270f9573c928f9bd68d933c5/src/index.ts))

  - Quick inspection

    ```console
    $ NEAR_ENV=testnet node inspect.js dev-1661966288541-80307357536154
    {
      schema_version: '0.1.0',
      metadata: {
        name: 'adder',
        version: '0.1.0',
        authors: [ 'Near Inc <hello@nearprotocol.com>' ]
      },
      body: {
        functions: [
          ...
    }
    ```

  - Export the ABI as compact JSON (see [res/adder_abi.json](https://github.com/near/abi-example/blob/master/res/adder_abi.json) for a full output)

    ```console
    $ NEAR_ENV=testnet node inspect.js dev-1661966288541-80307357536154 --json --compact
    {"schema_version":"0.1.0","metadata":{"name":"adder","version":"0.1.0","authors":["Near Inc <hello@nearprotocol.com>"]},"body":{"functions":[ ...
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

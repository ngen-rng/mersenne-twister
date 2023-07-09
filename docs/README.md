# Mersenne Twister

[![Actions Status: CI](https://github.com/ngen-rng/mersenne-twister/workflows/CI/badge.svg)](https://github.com/ngen-rng/mersenne-twister/actions?query=workflow%3A"CI")
[![Actions Status: CodeQL](https://github.com/ngen-rng/mersenne-twister/workflows/CodeQL/badge.svg)](https://github.com/ngen-rng/mersenne-twister/actions?query=workflow%3A"CodeQL")
[![Actions Status: Dependency Review](https://github.com/ngen-rng/mersenne-twister/workflows/Dependency%20Review/badge.svg)](https://github.com/ngen-rng/mersenne-twister/actions?query=workflow%3A"Dependency+Review")

[English](./README.md) | [日本語](./README.ja.md)

JavaScript implementation of Mersenne Twister for Pokémon RNG.

## Note

> **Note**
> This library is designed and implemented for **Pokémon RNG**, not for general use.
> For simulation and other applications, **please use another library.**

## Features

From the original Mersenne Twister, we have devised a way to reduce the amount of table calculations for instance creation and internal state updates.

## Installation

Add the following line to the .npmrc file

```npmrc
@ngen-rng:registry="https://npm.pkg.github.com"
```

npm

```sh
npm install @ngen-rng/mersenne-twister
```

yarn

```sh
yarn add @ngen-rng/mersenne-twister
```

## Usage

```js
import { MersenneTwister } from '@ngen-rng/mersenne-twister';

// The amount of table calculations during MT initialization is 624 times.
const mt1 = new MersenneTwister(0xadfa2178);

// Get a random number value with the 'getRandom' function.
mt1.getRandom(); // 4204083817

// Get the current random number table reference index.
mt1.getIndex(); // 2

// Get an array of random values with the 'slice' function.
// The 'slice' function specifies the start and end.
// Also, the 'slice' function does not update the state.
const slice1 = mt1.slice(2, 3)[0]; // 2076987897
mt1.getRandom(); // 2076987897

// The amount of calculations for table updates is also 624 times.
mt1.tableUpdate();

// Reduce the amount of table calculations during MT initialization to 402 times.
const mt2 = new MersenneTwister(0xadfa2178, 402);

// Get a random number value. (same value as mt1)
mt2.getRandom(); // 4204083817

// The amount of calculations for table updates is also 402 times.
mt2.tableUpdate();

// If the table calculation is reduced to 402/624, the range to obtain the same value is 0 to 5.
mt1.slice(0, 6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]
mt2.slice(0, 6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]

// Discards a specified number of random values.
mt1.discard(6);
mt2.discard(6);

// Because of the different table computations, the values of mt1 and mt2 will not necessarily be the same.
mt1.getRandom() >>> 27; // 29
mt2.getRandom() >>> 27; // 15
```

## Author

- Author: ngen-rng
- E-mail: <ngen.rng@gmail.com>

## License

- @ngen-rng/mersenne-twister: [MIT LICENSE](./LICENSE)
- The original Mersenne Twister: [MIT LICENSE](./LICENSE_MT)
  - Reference: [The original Mersenne Twister algorithm](http://www.math.sci.hiroshima-u.ac.jp/m-mat/MT/emt.html 'Mersenne Twister Home Page')

[English](./README.md) | [日本語](./README.ja.md)

# Mersenne Twister

JavaScript implementation of Mersenne Twister for Pokémon RNG.

# Note

:::note warn
Warning.
This library is designed and implemented for **Pokémon RNG**, not for general use.
For simulation and other applications, **please use another library.**
:::

# Features

From the original Mersenne Twister, we have devised a device that can reduce the amount of table computation when updating internal state and replicating instances.

# Installation

```bash
$ npm i @ngen-rng/mersenne-twister
```

# Usage

```js
import { MersenneTwister } from '@ngen-rng/mersenne-twister';

// The amount of table calculations during MT initialization is 624 times.
const mt1 = new MersenneTwister(0xadfa2178);

// Get a random number value with the 'getRandom' function.
mt1.getRandom(); // 4204083817

// Get a random number value with the 'slice' function.
// The 'slice' function returns an array of the specified length.
// Also, the 'slice' function does not update the state.
mt1.slice(1)[0]; // 2076987897
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
mt1.slice(6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]
mt2.slice(6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]

// Discards a specified number of random values.
mt1.discard(6);
mt2.discard(6);

mt1.getRandom() >>> 27; // 29
mt2.getRandom() >>> 27; // 15
```

# Author

- Author: ngen-rng
- E-mail: ngen.rng@gmail.com

# License

- @ngen-rng/mersenne-twister: [MIT LICENSE](./LICENSE)
- The original Mersenne Twister: [MIT LICENSE](./LICENSE_MT)
  - Reference: [The original Mersenne Twister algorithm](http://www.math.sci.hiroshima-u.ac.jp/m-mat/MT/emt.html 'Mersenne Twister Home Page')

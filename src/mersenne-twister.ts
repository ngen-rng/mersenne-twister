/**
Copyright (C) 1997 - 2002, Makoto Matsumoto and Takuji Nishimura,
All rights reserved.

Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions
are met:

  1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.

  2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.

  3. The names of its contributors may not be used to endorse or promote
    products derived from this software without specific prior written
    permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
"AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
A PARTICULAR PURPOSE ARE DISCLAIMED.  IN NO EVENT SHALL THE COPYRIGHT OWNER OR
CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL,
EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO,
PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR
PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS
SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

/** Rank */
const N = 624;

const M = 397;

/**
 * 32-bit precision MersenneTwister
 */
export class MersenneTwister {
  private count = 1;
  private table = Array<number>(N).fill(0);
  private tableCalcCount: number;

  /**
   * Constructor
   * @param seed Seed
   * @param tableCalcCount Count of table calculations
   */
  constructor(seed: number, tableCalcCount = N - 1) {
    if (tableCalcCount < 0) {
      throw new Error('The argument must be greater than or equal to 0.');
    }

    if (tableCalcCount >= N) {
      throw new Error(`The tableCalcCount must be ${N - 1} or less.`);
    }

    this.table[0] = seed & 0xffffffff;
    this.tableCalcCount = tableCalcCount;

    for (let n = 1, t = this.table, len = this.tableCalcCount; n <= len; n++) {
      const result = (t[n - 1] >>> 30) ^ t[n - 1];
      const value = Number(
        BigInt.asUintN(32, BigInt(result) * 0x6c078965n + BigInt(n))
      );
      t[n] = value;
    }
  }

  /**
   * Get the current count.
   * @returns Current count
   */
  public getCount = (): number => this.count;

  /**
   * Get the count of table calculations.
   * @returns Table calculations count
   */
  public getTableCalcCount = (): number => this.tableCalcCount;

  /**
   * Clone MersenneTwister
   * @returns MersenneTwister
   */
  public clone = (): MersenneTwister => {
    const cmt = new MersenneTwister(0x0, 0);
    cmt.table = [...this.table];
    cmt.count = this.count;
    cmt.tableCalcCount = this.tableCalcCount;
    return cmt;
  };

  /**
   * Update state variable tables.
   * @param count Count after table update
   * @param table Update table
   */
  public tableUpdate = (count = 0, table: number[] = this.table): void => {
    const t = table;
    this.count = count;
    for (let n = 0, len = this.tableCalcCount; n <= len; n++) {
      if (n <= 226) {
        t[n] = this.update(n, n + 1, n + M);
      } else if (n <= 622) {
        t[n] = this.update(n, n + 1, n - 227);
      } else {
        t[n] = this.update(n, 0, M - 1);
      }
    }
  };

  private update = (
    A: number,
    B: number,
    C: number,
    table: number[] = this.table
  ) => {
    const t = table;
    const k = Array<bigint>(2);
    k[0] = (BigInt(t[A]) & 0x80000000n) | (BigInt(t[B]) & 0x7fffffffn);
    k[1] = (k[0] >> 1n) ^ BigInt(t[C]);

    if (k[0] & 1n) {
      t[A] = Number(BigInt.asUintN(32, k[1] ^ 0x9908b0dfn));
    } else {
      t[A] = Number(BigInt.asUintN(32, k[1]));
    }

    return t[A];
  };

  private tempering = (value: number): number => {
    let y = BigInt(value);
    y ^= y >> 11n;
    y ^= (y << 7n) & 0x9d2c5680n;
    y ^= (y << 15n) & 0xefc60000n;
    y ^= y >> 18n;
    return Number(BigInt.asUintN(32, y));
  };

  /**
   * Get 32-bit precision random number value.
   * @returns Random number
   */
  public getRandom = (): number => {
    const y = this.table[this.count];
    this.discard(1);

    return this.tempering(y);
  };

  /**
   * Discards the specified number of random numbers.
   * @param size Number of pieces to discard
   */
  public discard = (size: number): void => {
    this.count += size;

    if (this.count >= N) {
      for (let i = 0, len = (this.count / N) | 0; i < len; i++) {
        this.tableUpdate();
      }

      this.count %= N;
    }
  };

  /**
   * Get random number values in an array of the specified length.
   * @param length Array length
   * @returns Array of random number
   */
  public slice = (length: number): number[] => {
    const sliceTable: number[] = [];

    if (length <= 0) {
      throw new Error('The arguments must be greater than 0.');
    }

    if (length > this.tableCalcCount - this.count) {
      throw new Error(
        `The argument must be less than or equal to tableCalcCount:${
          this.tableCalcCount
        } - count:${this.count} = ${this.tableCalcCount - this.count}.`
      );
    }

    for (const it of this.table.slice(this.count, this.count + length)) {
      sliceTable.push(this.tempering(it));
    }

    return sliceTable;
  };
}

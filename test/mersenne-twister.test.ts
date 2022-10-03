import { MersenneTwister } from '../src/mersenne-twister';

describe('MersenneTwister', () => {
  test('constructor tableCalcCount:0', () => {
    expect(() => new MersenneTwister(0x0, 0)).not.toThrow();
  });

  test('constructor tableCalcCount:-1 throw error', () => {
    expect(() => new MersenneTwister(0x0, -1)).toThrow();
  });

  test('constructor tableCalcCount:624 throw error', () => {
    expect(() => new MersenneTwister(0x0, 624)).toThrow();
  });

  test('getTableCalcCount:default=623', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    expect(mt.getTableCalcCount()).toEqual(623);
  });

  test('getIndex', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    mt.getRandom();
    expect(mt.getIndex()).toEqual(2);
  });

  test('getTableCalcCount:402', () => {
    const mt = new MersenneTwister(Date.now().valueOf(), 402);
    expect(mt.getTableCalcCount()).toEqual(402);
  });

  test('getRandom', () => {
    const mt = new MersenneTwister(0x0);
    expect(mt.getRandom()).toEqual(4194449);
  });

  test('tableUpdate', () => {
    const mt = new MersenneTwister(0x0);
    expect(mt.getRandom()).toEqual(4194449);
    mt.tableUpdate();
    expect(mt.getRandom()).toEqual(2357136044);
  });

  test('tableUpdate and slice, getRandom', () => {
    const mt = new MersenneTwister(0x0, 402);
    mt.tableUpdate();
    const slice = mt.slice(0, 6);
    const rand: number[] = [];
    for (let i = 0; i < 6; i++) {
      rand.push(mt.getRandom());
    }
    expect(slice).toEqual(rand);
  });

  test('discard', () => {
    const mt = new MersenneTwister(0x0);
    mt.discard(624);
    expect(mt.getRandom()).toEqual(2357136044);
  });

  test('clone', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    const cmt = mt.clone();
    expect(mt.getRandom()).toEqual(cmt.getRandom());
  });

  test('slice:-1,1', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    expect(() => mt.slice(-1, 1)).toThrow();
  });

  test('slice:0,0', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    expect(() => mt.slice(0, 0)).toThrow();
  });

  test('slice:1,2', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    const slice = mt.slice(1, 2)[0];
    const get = mt.getRandom();
    expect(slice).toEqual(get);
  });

  {
    const N = 402;
    test(`tableCalcCount:${N.toString()} and slice:0,${N.toString()}`, () => {
      const mt = new MersenneTwister(Date.now().valueOf(), N);
      const index = mt.getIndex();
      expect(mt.slice(0, N - index).length).toEqual(N - index);
    });
  }

  {
    const N = 624;
    test(`slice throw error:${N.toString()}`, () => {
      const mt = new MersenneTwister(Date.now().valueOf());
      expect(() => mt.slice(0, N)).toThrow();
    });
  }

  test('usage', () => {
    // MT初期化時のテーブル計算量は624回となる。
    const mt1 = new MersenneTwister(0xadfa2178);

    // getRandom関数で乱数値を取得する。
    expect(mt1.getRandom()).toEqual(4204083817);

    // 現在の乱数テーブル参照インデックスを取得する。
    expect(mt1.getIndex()).toEqual(2);

    // slice関数で乱数値の配列を取得する。
    // slice関数は配列と同じように開始と終了を指定する。
    // また、slice関数は状態を更新しない。
    const slice1 = mt1.slice(2, 3)[0];
    expect(slice1).toEqual(2076987897);
    expect(slice1).toEqual(mt1.getRandom());

    // テーブル更新時の計算量も624回となる。
    mt1.tableUpdate();

    // MT初期化時のテーブル計算量を402回に軽減する。
    const mt2 = new MersenneTwister(0xadfa2178, 402);

    // 乱数値を取得する。(mt1と同じ値)
    expect(mt2.getRandom()).toEqual(4204083817);

    // テーブ更新時の計算量も402回となる。
    mt2.tableUpdate();

    // 402/624に軽減した場合、元のMTと同様の値を得られる範囲は0～5となる。
    const ivs1 = mt1.slice(0, 6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]
    const ivs2 = mt2.slice(0, 6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]

    expect(ivs1).toEqual([31, 31, 31, 31, 31, 31]);
    expect(ivs1).toEqual(ivs2);

    // 乱数値を指定した数だけ破棄する。
    mt1.discard(6);
    mt2.discard(6);

    // テーブル計算量が異なるため、mt1とmt2の値が同じとは限らなくなる。
    expect(mt1.getRandom() >>> 27).toEqual(29);
    expect(mt2.getRandom() >>> 27).toEqual(15);
  });
});

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

  test('getCount', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    mt.getRandom();
    expect(mt.getCount()).toEqual(2);
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
    const part = mt.slice(6);
    const rand: number[] = [];
    for (let i = 0; i < 6; i++) {
      rand.push(mt.getRandom());
    }
    expect(part).toEqual(rand);
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

  test('slice:0', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    expect(() => mt.slice(0)).toThrow();
  });

  test('slice:1', () => {
    const mt = new MersenneTwister(Date.now().valueOf());
    const part = mt.slice(1)[0];
    const get = mt.getRandom();
    expect(part).toEqual(get);
  });

  {
    const N = 402;
    test(`slice:${N.toString()}`, () => {
      const mt = new MersenneTwister(Date.now().valueOf(), N);
      const count = mt.getCount();
      expect(mt.slice(N - count).length).toEqual(N - count);
    });
  }

  {
    const N = 403;
    test(`slice throw error:${N.toString()}`, () => {
      const mt = new MersenneTwister(Date.now().valueOf(), N);
      expect(() => mt.slice(N)).toThrow();
    });
  }

  {
    const N = 622;
    test(`slice:${N.toString()}`, () => {
      const mt = new MersenneTwister(Date.now().valueOf());
      const part = mt.slice(N)[N - 1];
      mt.discard(N - 1);
      const get = mt.getRandom();
      expect(part).toEqual(get);
    });
  }

  {
    const N = 623;
    test(`slice:${N.toString()}, tableUpdate`, () => {
      const mt = new MersenneTwister(Date.now().valueOf());
      mt.tableUpdate();
      const part = mt.slice(N)[N - 1];
      mt.discard(N - 1);
      const get = mt.getRandom();
      expect(part).toEqual(get);
    });
  }

  {
    const N = 623;
    test(`slice throw error:${N.toString()}`, () => {
      const mt = new MersenneTwister(Date.now().valueOf());
      expect(() => mt.slice(N)).toThrow();
    });
  }

  {
    const N = 624;
    test(`slice throw error:${N.toString()}`, () => {
      const mt = new MersenneTwister(Date.now().valueOf());
      expect(() => mt.slice(N)).toThrow();
    });
  }

  test('usage', () => {
    // MT初期化時のテーブル計算量は624回
    const mt1 = new MersenneTwister(0xadfa2178);

    // getRandom関数で乱数値を得る
    expect(mt1.getRandom()).toEqual(4204083817);

    // slice関数で乱数値を得る
    // slice関数は指定した長さの配列を返す
    // また、slice関数は状態を更新しない
    const slice1 = mt1.slice(1)[0];
    expect(slice1).toEqual(2076987897);
    expect(slice1).toEqual(mt1.getRandom());

    // テーブル更新時の計算量も624回
    mt1.tableUpdate();

    // MT初期化時のテーブル計算量を402回に軽減する
    const mt2 = new MersenneTwister(0xadfa2178, 402);

    // 乱数値を得る(mt1と同じ値)
    expect(mt2.getRandom()).toEqual(4204083817);

    // テーブ更新時の計算量も402回
    mt2.tableUpdate();

    // 402/624に軽減した場合、元のMTと同様の値を得られる範囲は0～5となる
    const ivs1 = mt1.slice(6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]
    const ivs2 = mt2.slice(6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]

    expect(ivs1).toEqual([31, 31, 31, 31, 31, 31]);
    expect(ivs1).toEqual(ivs2);

    // 乱数値を指定した数だけ破棄する
    mt1.discard(6);
    mt2.discard(6);

    expect(mt1.getRandom() >>> 27).toEqual(29);
    expect(mt2.getRandom() >>> 27).toEqual(15);
  });
});

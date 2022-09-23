[English](./README.md) | [日本語](./README.ja.md)

# Mersenne Twister

ポケモン乱数調整用の Mersenne Twister の JavaScript 実装です。

## ノート

:::note warn
警告
このライブラリは一般的な使用向けではなく、**ポケモン乱数調整**向けに設計及び実装されています。
シミュレーション等の用途には**別のライブラリを使用してください。**
:::

## 特徴

元々の Mersenne Twister から、内部状態の更新とインスタンス複製時のテーブル計算量を軽減できる工夫をしています。

## インストール

```bash
$ npm i @ngen-rng/mersenne-twister
```

## 使い方

```js
import { MersenneTwister } from '@ngen-rng/mersenne-twister';

// MT初期化時のテーブル計算量は624回
const mt1 = new MersenneTwister(0xadfa2178);

// getRandom関数で乱数値を得る
mt1.getRandom(); // 4204083817

// slice関数で乱数値を得る
// slice関数は指定した長さの配列を返す
// また、slice関数は状態を更新しない
mt1.slice(1)[0]; // 2076987897
mt1.getRandom(); // 2076987897

// テーブル更新時の計算量は624回
mt1.tableUpdate();

// MT初期化時のテーブル計算量を402回に軽減する
const mt2 = new MersenneTwister(0xadfa2178, 402);

// 乱数値を得る(mt1と同じ値)
expect(mt2.getRandom()).toEqual(4204083817);

// テーブ更新時の計算量は402回
mt2.tableUpdate();

// テーブル計算量を402/624に軽減した場合、同じ値を得られる範囲は0～5となる
mt1.slice(6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]
mt2.slice(6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]

// 乱数値を指定した数だけ破棄する
mt1.discard(6);
mt2.discard(6);

mt1.getRandom() >>> 27; // 29
mt2.getRandom() >>> 27; // 15
```

## 作成者

- 作成者: ngen-rng
- E-mail: ngen.rng@gmail.com

## ライセンス

- @ngen-rng/mersenne-twister: [MIT LICENSE](./LICENSE)
- オリジナルの Mersenne Twister: [MIT LICENSE](./LICENSE_MT)
  - 参考: [オリジナルの Mersenne Twister アルゴリズム](http://www.math.sci.hiroshima-u.ac.jp/m-mat/MT/mt.html 'Mersenne Twister Home Page')

# Mersenne Twister

[![Actions Status: CI](https://github.com/ngen-rng/mersenne-twister/workflows/CI/badge.svg)](https://github.com/ngen-rng/mersenne-twister/actions?query=workflow%3A"CI")
[![Actions Status: CodeQL](https://github.com/ngen-rng/mersenne-twister/workflows/CodeQL/badge.svg)](https://github.com/ngen-rng/mersenne-twister/actions?query=workflow%3A"CodeQL")
[![Actions Status: Dependency Review](https://github.com/ngen-rng/mersenne-twister/workflows/Dependency%20Review/badge.svg)](https://github.com/ngen-rng/mersenne-twister/actions?query=workflow%3A"Dependency+Review")

[English](./README.md) | [日本語](./README.ja.md)

ポケモン乱数調整用の Mersenne Twister の JavaScript 実装です。

## ノート

> **Note**
> このライブラリは一般的な使用向けではなく、**ポケモン乱数調整**向けに設計及び実装されています。
> シミュレーション等の用途には**別のライブラリを使用してください。**

## 特徴

元々の Mersenne Twister から、インスタンス作成時と内部状態の更新のテーブル計算量を軽減できる工夫をしています。

## インストール

```bash
$ npm install @ngen-rng/mersenne-twister
# or
$ yarn add @ngen-rng/mersenne-twister
```

## 使い方

```js
import { MersenneTwister } from '@ngen-rng/mersenne-twister';

// MT初期化時のテーブル計算量は624回となる。
const mt1 = new MersenneTwister(0xadfa2178);

// getRandom関数で乱数値を取得する。
mt1.getRandom(); // 4204083817

// 現在の乱数テーブル参照インデックスを取得する。
mt1.getIndex(); // 2

// slice関数で乱数値の配列を取得する。
// slice関数は開始と終了を指定する。
// また、slice関数は状態を更新しない。
const slice1 = mt1.slice(2, 3)[0]; // 2076987897
mt1.getRandom(); // 2076987897

// テーブル更新時の計算量も624回となる。
mt1.tableUpdate();

// MT初期化時のテーブル計算量を402回に軽減する。
const mt2 = new MersenneTwister(0xadfa2178, 402);

// 乱数値を取得する。(mt1と同じ値)
mt2.getRandom(); // 4204083817

// テーブ更新時の計算量も402回となる。
mt2.tableUpdate();

// 402/624に軽減した場合、元のMTと同様の値を得られる範囲は0～5となる。
mt1.slice(0, 6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]
mt2.slice(0, 6).map((p) => p >>> 27); // [31, 31, 31, 31, 31, 31]

// 乱数値を指定した数だけ破棄する。
mt1.discard(6);
mt2.discard(6);

// テーブル計算量が異なるため、mt1とmt2の値が同じとは限らなくなる。
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

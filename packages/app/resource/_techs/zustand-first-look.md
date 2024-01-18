---
title: 'zustand 初探'
excerpt: '今天上班摸鱼发现了 #zustand ，稍微研究一下，看看能不能用上。'
coverImage: ''
date: '2022-06-16T15:42:22.712Z'
type: tech
tag: ['Zustand']
author:
  name: Alfxjx
  picture: '/assets/authors/alfxjx.jpg'
---

## Zustand 初探

最近读了复杂应用的状态管理[^1] [^2]，分成上下两篇，介绍了一个渐进式的 React 状态管理库 zustand[^3]。

## 数据治理

数据流状态管理应该关注什么呢？总的来说很多种不同的解决方案，可以是很简单的一个全局 store，也可以应用各种 slice 的模式去进行数据划分治理[^4]。

这篇文章[^9]介绍了作者认为的状态管理核心问题，

zustand 在对复杂状态的管理能力和易用性上做到了兼容，使用渐进增强的方式治理不同层级的状态数据，也许你只是需要管理一个简单的全局开闭状态，或者说，你在做的一个复杂的报表系统，需要很多不同的领域模型，从目前的调研来看，使用 zustand 都可以胜任。

## 渐进增强的 Zustand

并且 zustand 有很好的兼容性，可以和 #SWR 这样的请求库结合使用[^5]，也可以单独使用（指不在 react 环境下[^6]）。可以参考这个 repo，在 angular 环境下使用[^7]。

## 深入

建议读一下 #源码 [^8]

## angular x zustand

那么在 #angular 的项目中可以使用 zustand 吗？虽然可能有的人会说 angular 项目不需要状态管理[^10]，但是 zustand 提供 standalone 模式，应该是可以应用到 angular 中的，不过可能需要结合 #rxjs 进行一层包装。

<https://github.com/Alfxjx/ngx-zustand>

[^1]: [谈谈复杂应用的状态管理（上）：为什么是 Zustand](https://zhuanlan.zhihu.com/p/591981209)
[^2]: [谈谈复杂应用的状态管理（下）：基于 Zustand 的渐进式状态管理实践](https://zhuanlan.zhihu.com/p/592383756)
[^3]: [zustand doc](https://docs.pmnd.rs/zustand/guides/updating-state)
[^4]: [数据流 2022](https://mp.weixin.qq.com/s?__biz=MjM5NDgyODI4MQ==&mid=2247485468&idx=1&sn=b0b7935c12feff14488e6961f285f167&scene=21#wechat_redirect)
[^5]: [zustand & swr demo](https://codesandbox.io/s/react-suspense-swr-zustand-uyj1ub)
[^6]: [Using zustand without React](https://www.npmjs.com/package/zustand)
[^7]: [Github: zustand-angular-movie-search](https://github.com/ThomasBurleson/zustand-angular-movie-search)
[^8]: [精读《zustand 源码》](https://zhuanlan.zhihu.com/p/461152248)
[^9]: [理解了状态管理，就理解了前端开发的核心 ​](https://mp.weixin.qq.com/s/xbCXiVMaqVTKCQhSdaZbsQ)
[^10]: [Angular 真的需要状态管理么？](https://zhuanlan.zhihu.com/p/45121775)

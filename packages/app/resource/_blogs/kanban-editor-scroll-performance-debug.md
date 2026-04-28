---
title: '看板编辑器滚动卡顿：一次从"冤枉 CodeMirror"到"576 个 div"的排查之旅'
excerpt: ''
date: '2026-04-28T10:35:00.000Z'
coverImage: '/assets/blog/20260428-103623.png'
type: tech
tag: ['debug']
author:
  name: Alfxjx
  picture: '/assets/authors/alfxjx.jpg'
---

> 有时候，性能问题的真相比你想象的更"底层"——字面意义上的底层。

## 事情是怎么开始的

某天在调试看板编辑器时，同事突然丢过来一句话："属性面板滚动的时候有点卡。"

卡顿？前端性能问题，老本行了。我下意识觉得，肯定是右侧属性面板里的东西太复杂了——那里面有一堆表单输入、下拉框，还有好几个 CodeMirror 代码编辑器。CodeMirror 这种 contenteditable 的富文本编辑器，向来是性能排查的常客。

于是第一轮排查，顺理成章地开始了。

---

## 第一轮：CodeMirror 成了"背锅侠"

打开代码一看，属性面板里确实藏着好几个 CodeMirror 实例：

- 原始 JSON 折叠面板里的代码编辑器
- 数字指标卡的 Value / Description 字段
- 图表卡的数据转换脚本

CodeMirror 6 虽然比旧版轻量，但毕竟不是白给的。每个实例都有一整套事件监听、虚拟滚动和语法高亮引擎。如果这几个编辑器同时在 DOM 里苟着，滚动时确实可能拖累性能。

我兴冲冲地改了代码——给原始 JSON 面板加了 `*ngIf="rawJsonActive"`，折叠时直接销毁 CodeMirror 实例；又给 `JSON.stringify` 加了引用缓存，避免重复序列化。

改完自信满满地让同事试。

**同事："似乎卡顿和 CodeMirror 没关系。"**

好吧，打脸来得很快。

---

## 第二轮：DevTools 给出了关键线索

既然不是 JS 层的锅，那就只能往下挖了。同事甩过来一段 DevTools 观察：

> "滚动的时候，DevTools 里触发了很多的 scroll 事件，然后线程池里的 GPU 也会有占用，还有 rasterize paint。"

这段话信息量很大：

- **`scroll` 事件** —— 正常，浏览器滚动本来就会触发
- **GPU 占用** —— 说明内容在 GPU 合成层里
- **`rasterize paint`** —— 这才是重点

这里要科普一下浏览器渲染管线的常识：理想情况下，一个已经栅格化好的合成层（layer）在滚动时，浏览器只需要**移动（composite）**这个纹理就行，不需要重新绘制。但如果 DevTools 里看到频繁的 `rasterize paint`，意味着浏览器在滚动过程中**不断把内容重新画成纹理**。

为什么会被迫重画？要么是这个 layer 太大，包含了太多需要重绘的内容；要么是左右两边本不该在一起的东西被放到了同一个 paint 区域里。

我的直觉告诉我：问题不在属性面板**内部**，而在属性面板和它的邻居——左侧画布——之间的关系上。

---

## 第三轮：打开画布，我愣住了

把视线从右侧属性面板移开，看向左侧的画布组件。画布上有一个 24×24 的网格背景，用来辅助对齐卡片。

我想当然地以为这网格是用 CSS `background-image` 或者 `linear-gradient` 实现的——毕竟只是几条网格线嘛，有什么好大惊小怪的。

直到我看到这段模板代码：

```html
<div class="grid-background">
  <div
    *ngFor="let row of [].constructor(GRID_SIZE); let r = index"
    class="grid-row"
  >
    <div
      *ngFor="let col of [].constructor(GRID_SIZE); let c = index"
      class="grid-cell"
    ></div>
  </div>
</div>
```

`GRID_SIZE = 24`。

24 行 × 24 列 = **576 个 `.grid-cell` DOM 节点**。

每个节点长这样：

```css
.grid-cell {
  border: 1px solid rgba(255, 255, 255, 0.05); /* POC */
  /* 或 */
  border: 1px dashed var(--kanban-grid-line); /* 正式版 */
}
```

也就是说，为了画一张看起来毫不起眼的网格背景，我们在 DOM 里硬生生塞了 576 个带边框的 div。

但这还不是最致命的。真正致命的是布局结构：

```
.main-content (flex 容器)
  ├── .left-panel
  ├── .canvas-area          ← 左侧画布（藏着 576 个 div + N 张卡片）
  └── .right-panel
       └── .panel-content   ← 右侧属性面板（滚动容器）
```

`.canvas-area` 和 `.right-panel` 是 flex 兄弟。如果浏览器没有智能地把它们拆成独立的 GPU 合成层，那么右侧属性面板滚动时，整个 `.main-content` 都可能被卷入重绘风暴——包括左侧画布的 576 个网格单元格，以及所有卡片的渐变背景、圆角、阴影。

这就好比你在家里的书房翻一本书，结果因为书房和客厅之间没有隔墙，每次翻页都得把客厅重新装修一遍。

---

## 修复：两步走

### 第一步：干掉 576 个 div，换成两行 CSS

既然视觉上只是一张网格线背景，那就用真正的背景图来做：

```css
.grid-background {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  background-image:
    linear-gradient(to right, var(--kanban-grid-line) 1px, transparent 1px),
    linear-gradient(to bottom, var(--kanban-grid-line) 1px, transparent 1px);
  background-size: calc(100% / 24) calc(100% / 24);
}
```

HTML 模板也从一大堆 `*ngFor` 简化成了一行：

```html
<!-- 修改前：576 个 div -->
<div class="grid-background">
  <div *ngFor="let row of [].constructor(GRID_SIZE)" class="grid-row">
    <div *ngFor="let col of [].constructor(GRID_SIZE)" class="grid-cell"></div>
  </div>
</div>

<!-- 修改后：1 个 div -->
<div class="grid-background"></div>
```

DOM 节点直接少了 576 个，paint 成本从 O(n) 降到 O(1)。

### 第二步：给左右两侧砌一道"GPU 隔墙"

接下来要做的是确保右侧滚动时，左侧画布不被连累。方法简单粗暴但有效：给两边都加上 `transform: translateZ(0)`，强制浏览器把它们提升到独立的 GPU 合成层。

```css
/* 左侧画布 */
.canvas-area {
  flex: 1;
  position: relative;
  overflow: hidden;
  transform: translateZ(0); /* 强制独立 GPU layer */
}

/* 右侧属性面板 */
.right-panel {
  background: var(--kanban-panel-bg);
  border-left: 1px solid var(--kanban-border);
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
  transform: translateZ(0); /* 强制独立 GPU layer */
}
```

这样一来，右侧属性面板滚动时只需要 composite 自己的纹理，左侧画布区域完全不受干扰。

---

## 踩过的坑

### 坑一：想当然的性能归因

看到属性面板卡，第一反应是"里面的组件太重了"，于是去折腾 CodeMirror。实际上 CodeMirror 确实不轻，但这次它真的是被冤枉的。如果一开始就用 DevTools 的 Performance + Layers 面板扫一眼，而不是凭经验猜测，能省下不少时间。

### 坑二：POC 和正式版的问题一模一样

这次的问题同时存在于 POC 版本和正式版本——两个版本的画布组件用了完全相同的网格实现。修复时如果不细心，很容易只改一边。我把两边的文件都列了个清单，逐一对照修改：

| 版本   | HTML 文件                          | LESS 文件                          | 布局文件                           |
| ------ | ---------------------------------- | ---------------------------------- | ---------------------------------- |
| POC    | `editor-canvas-poc.component.html` | `editor-canvas-poc.component.less` | `kanban-editor-poc.component.less` |
| 正式版 | `editor-canvas.component.html`     | `editor-canvas.component.less`     | `kanban-editor.component.less`     |

### 坑三：DevTools 不会说谎，但需要你学会读

同事提供的那三句话——scroll 事件、GPU 占用、rasterize paint——每一个都是精准的诊断线索。`rasterize paint` 尤其关键，它明确指向了"纹理在滚动时被反复重建"，而不是"JS 执行慢"或"内存泄漏"。

---

## 最后的改动清单

总共改了 6 个文件：

1. `poc/editor-canvas-poc.component.html` —— 移除 576 个 div 的 ngFor
2. `poc/editor-canvas-poc.component.less` —— 网格背景改 CSS background-image
3. `poc/kanban-editor-poc.component.less` —— `.canvas-area` + `.panel-content` 加 GPU 层隔离
4. `editor-canvas/editor-canvas.component.html` —— 移除 576 个 div 的 ngFor
5. `editor-canvas/editor-canvas.component.less` —— 网格背景改 CSS background-image
6. `kanban-editor.component.less` —— `.canvas-area` + `.right-panel` 加 GPU 层隔离

---

## Takeaway

1. **性能排查，DevTools 优先，经验次之。** 这次如果一开始就看 Layers 面板，可能十分钟就能定位。
2. **DOM 节点数不是免费的。** 576 个 div 在视觉上和两行 CSS 完全等价，但浏览器要维护 576 个盒模型的布局、绘制、事件分发——这些都要真金白银的算力。
3. **CSS `background-image` 是网格/点阵/条纹背景的最优解。** 不要再用 div 拼网格了，除非你需要每个格子都有独立交互。
4. **左右分栏布局要警惕 paint 连带。** 如果一侧复杂、一侧可滚动，给两边都加一道 `transform: translateZ(0)` 的"GPU 围墙"，往往是最便宜的保险。
5. **POC 是试验田，但别忘了把经验同步回正式版。** 好消息是问题一样，修复也能照搬；坏消息是问题一样，说明之前两边都没注意到这个隐患。

---

_下次再遇到滚动卡顿，先打开 DevTools 看看有没有 rasterize paint——它可能会带你找到一些意想不到的 DOM。_

/*
这段代码其实是一个“翻译官”。它并没有直接操作终端的底层字符，而是搭建了一座桥梁，让你能用写网页的方式（React）来写终端界面，
然后由底层的 Ink 引擎负责把网页组件翻译成终端能看懂的颜色和排版。
具体来说，它是通过以下三个步骤在终端里“画”出界面的：

🎨 统一“画笔”：自动包裹主题
终端里的文字颜色、加粗、背景色等样式，通常是通过 ANSI 转义码（比如 \x1b[31m 代表红色）来控制的。
代码体现：withTheme(node) 函数。
作用：它把所有你要画的界面元素（node），都自动包了一层 ThemeProvider。
原理：这意味着你在写界面时，不需要每次都手动指定“这个字是红色的”，而是可以直接用 <Text color="red"> 这样的高级指令。
ThemeProvider 会在后台把这些高级指令翻译成终端能听懂的 ANSI 颜色代码。

🧱 使用“积木”搭建：React 组件化
代码导出了大量的组件，如 Box（盒子/容器）、Text（文字）、Button（按钮）、Spacer（占位符）。
代码体现：export { default as Box }...
作用：这就像搭乐高积木一样。
你想画一个框，就用 <Box>。
想写字，就用 <Text>。
想做按钮，就用 <Button>。
原理：这些组件本质上还是 React 组件，但它们被专门设计过，知道自己是运行在终端里的。
比如 <Box> 不会渲染成 HTML 的 <div>，而是会被计算为一段特定宽度和高度的空白区域或边框字符。

🖥️ 核心渲染：Ink 引擎接管
这是最关键的一步。代码引入了 ./ink/root.js 中的 inkRender 和 createRoot。
代码体现：inkRender(withTheme(node), options)
作用：这是真正的“画家”。
原理：
虚拟 DOM：当你调用 render 时，Ink 会先在内存中构建一棵“虚拟终端树”。它会计算你的 <Box> 有多宽，你的 <Text> 会不会换行。
差分更新：如果你只改动了一个字，Ink 不会重绘整个屏幕，而是计算出差异，只移动光标到那个位置进行修改（利用 ANSI 光标控制码）。
输出流：最后，它把计算好的最终结果（包含 ANSI 控制码的字符串）写入到 process.stdout（标准输出），终端接收到这些字符后，就会显示出你画好的界面。

📌 总结
这就好比装修房子：
React (Box, Text)：是你设计的装修图纸，告诉系统哪里放沙发，哪里刷红墙。
ThemeProvider：是油漆工，负责把你图纸上的“红色”变成真正的红油漆（ANSI 码）。
Ink Engine：是施工队队长，它拿着图纸，指挥终端（墙面）在哪里贴砖、哪里上色，最终呈现出你想要的样子。
*/
import { createElement, type ReactNode } from 'react'
import { ThemeProvider } from './components/design-system/ThemeProvider.js'
import inkRender, {
  type Instance,
  createRoot as inkCreateRoot,
  type RenderOptions,
  type Root,
} from './ink/root.js'

export type { RenderOptions, Instance, Root }

// Wrap all CC render calls with ThemeProvider so ThemedBox/ThemedText work
// without every call site having to mount it. Ink itself is theme-agnostic.
function withTheme(node: ReactNode): ReactNode {
  return createElement(ThemeProvider, null, node)
}

export async function render(
  node: ReactNode,
  options?: NodeJS.WriteStream | RenderOptions,
): Promise<Instance> {
  return inkRender(withTheme(node), options)
}

export async function createRoot(options?: RenderOptions): Promise<Root> {
  const root = await inkCreateRoot(options)
  return {
    ...root,
    render: node => root.render(withTheme(node)),
  }
}

export { color } from './components/design-system/color.js'
export type { Props as BoxProps } from './components/design-system/ThemedBox.js'
export { default as Box } from './components/design-system/ThemedBox.js'
export type { Props as TextProps } from './components/design-system/ThemedText.js'
export { default as Text } from './components/design-system/ThemedText.js'
export {
  ThemeProvider,
  usePreviewTheme,
  useTheme,
  useThemeSetting,
} from './components/design-system/ThemeProvider.js'
export { Ansi } from './ink/Ansi.js'
export type { Props as AppProps } from './ink/components/AppContext.js'
export type { Props as BaseBoxProps } from './ink/components/Box.js'
export { default as BaseBox } from './ink/components/Box.js'
export type {
  ButtonState,
  Props as ButtonProps,
} from './ink/components/Button.js'
export { default as Button } from './ink/components/Button.js'
export type { Props as LinkProps } from './ink/components/Link.js'
export { default as Link } from './ink/components/Link.js'
export type { Props as NewlineProps } from './ink/components/Newline.js'
export { default as Newline } from './ink/components/Newline.js'
export { NoSelect } from './ink/components/NoSelect.js'
export { RawAnsi } from './ink/components/RawAnsi.js'
export { default as Spacer } from './ink/components/Spacer.js'
export type { Props as StdinProps } from './ink/components/StdinContext.js'
export type { Props as BaseTextProps } from './ink/components/Text.js'
export { default as BaseText } from './ink/components/Text.js'
export type { DOMElement } from './ink/dom.js'
export { ClickEvent } from './ink/events/click-event.js'
export { EventEmitter } from './ink/events/emitter.js'
export { Event } from './ink/events/event.js'
export type { Key } from './ink/events/input-event.js'
export { InputEvent } from './ink/events/input-event.js'
export type { TerminalFocusEventType } from './ink/events/terminal-focus-event.js'
export { TerminalFocusEvent } from './ink/events/terminal-focus-event.js'
export { FocusManager } from './ink/focus.js'
export type { FlickerReason } from './ink/frame.js'
export { useAnimationFrame } from './ink/hooks/use-animation-frame.js'
export { default as useApp } from './ink/hooks/use-app.js'
export { default as useInput } from './ink/hooks/use-input.js'
export { useAnimationTimer, useInterval } from './ink/hooks/use-interval.js'
export { useSelection } from './ink/hooks/use-selection.js'
export { default as useStdin } from './ink/hooks/use-stdin.js'
export { useTabStatus } from './ink/hooks/use-tab-status.js'
export { useTerminalFocus } from './ink/hooks/use-terminal-focus.js'
export { useTerminalTitle } from './ink/hooks/use-terminal-title.js'
export { useTerminalViewport } from './ink/hooks/use-terminal-viewport.js'
export { default as measureElement } from './ink/measure-element.js'
export { supportsTabStatus } from './ink/termio/osc.js'
export { default as wrapText } from './ink/wrap-text.js'

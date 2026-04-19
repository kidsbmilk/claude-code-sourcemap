import React from 'react';
import type { StatsStore } from './context/stats.js';
import type { Root } from './ink.js';
import type { Props as REPLProps } from './screens/REPL.js';
import type { AppState } from './state/AppStateStore.js';
import type { FpsMetrics } from './utils/fpsTracker.js';
type AppWrapperProps = {
  getFpsMetrics: () => FpsMetrics | undefined;
  stats?: StatsStore;
  initialState: AppState;
};
// Ink REPL 主循环
export async function launchRepl(root: Root, appProps: AppWrapperProps, replProps: REPLProps, renderAndRun: (root: Root, element: React.ReactNode) => Promise<void>): Promise<void> {
  // 这两行代码使用了动态导入（await import(...)）。
  // 这意味着它不会在程序启动时立刻加载 App 和 REPL 组件，而是等到 launchRepl 函数被调用时才去加载。
  // 这样做的好处是可以加快初始启动速度，因为一些大的组件文件是按需加载的。
  const {
    App
  } = await import('./components/App.js');
  const {
    REPL
  } = await import('./screens/REPL.js');
  // 这里使用了 JSX 语法来构建一个 React 组件树。
  // 它将 REPL 组件作为 App 组件的子元素，并使用展开运算符（{...props}）将外部传入的属性（appProps 和 replProps）传递给对应的组件。
  // 这就像搭积木一样，把整个应用的界面结构定义好了。

  // 它调用了 renderAndRun 这个回调函数，并把上一步组装好的 React 组件树传给它。
  // renderAndRun 在 interactiveHelpers.tsx 中定义，它的作用是将这个虚拟的 React 组件树“画”到真实的终端窗口（root）中，并开始处理用户的交互。
  // 简单来说，就是让写好的界面真正显示出来并能响应用户的操作。
  await renderAndRun(root, <App {...appProps}>
      <REPL {...replProps} />
    </App>);
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJuYW1lcyI6WyJSZWFjdCIsIlN0YXRzU3RvcmUiLCJSb290IiwiUHJvcHMiLCJSRVBMUHJvcHMiLCJBcHBTdGF0ZSIsIkZwc01ldHJpY3MiLCJBcHBXcmFwcGVyUHJvcHMiLCJnZXRGcHNNZXRyaWNzIiwic3RhdHMiLCJpbml0aWFsU3RhdGUiLCJsYXVuY2hSZXBsIiwicm9vdCIsImFwcFByb3BzIiwicmVwbFByb3BzIiwicmVuZGVyQW5kUnVuIiwiZWxlbWVudCIsIlJlYWN0Tm9kZSIsIlByb21pc2UiLCJBcHAiLCJSRVBMIl0sInNvdXJjZXMiOlsicmVwbExhdW5jaGVyLnRzeCJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgUmVhY3QgZnJvbSAncmVhY3QnXG5pbXBvcnQgdHlwZSB7IFN0YXRzU3RvcmUgfSBmcm9tICcuL2NvbnRleHQvc3RhdHMuanMnXG5pbXBvcnQgdHlwZSB7IFJvb3QgfSBmcm9tICcuL2luay5qcydcbmltcG9ydCB0eXBlIHsgUHJvcHMgYXMgUkVQTFByb3BzIH0gZnJvbSAnLi9zY3JlZW5zL1JFUEwuanMnXG5pbXBvcnQgdHlwZSB7IEFwcFN0YXRlIH0gZnJvbSAnLi9zdGF0ZS9BcHBTdGF0ZVN0b3JlLmpzJ1xuaW1wb3J0IHR5cGUgeyBGcHNNZXRyaWNzIH0gZnJvbSAnLi91dGlscy9mcHNUcmFja2VyLmpzJ1xuXG50eXBlIEFwcFdyYXBwZXJQcm9wcyA9IHtcbiAgZ2V0RnBzTWV0cmljczogKCkgPT4gRnBzTWV0cmljcyB8IHVuZGVmaW5lZFxuICBzdGF0cz86IFN0YXRzU3RvcmVcbiAgaW5pdGlhbFN0YXRlOiBBcHBTdGF0ZVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gbGF1bmNoUmVwbChcbiAgcm9vdDogUm9vdCxcbiAgYXBwUHJvcHM6IEFwcFdyYXBwZXJQcm9wcyxcbiAgcmVwbFByb3BzOiBSRVBMUHJvcHMsXG4gIHJlbmRlckFuZFJ1bjogKHJvb3Q6IFJvb3QsIGVsZW1lbnQ6IFJlYWN0LlJlYWN0Tm9kZSkgPT4gUHJvbWlzZTx2b2lkPixcbik6IFByb21pc2U8dm9pZD4ge1xuICBjb25zdCB7IEFwcCB9ID0gYXdhaXQgaW1wb3J0KCcuL2NvbXBvbmVudHMvQXBwLmpzJylcbiAgY29uc3QgeyBSRVBMIH0gPSBhd2FpdCBpbXBvcnQoJy4vc2NyZWVucy9SRVBMLmpzJylcbiAgYXdhaXQgcmVuZGVyQW5kUnVuKFxuICAgIHJvb3QsXG4gICAgPEFwcCB7Li4uYXBwUHJvcHN9PlxuICAgICAgPFJFUEwgey4uLnJlcGxQcm9wc30gLz5cbiAgICA8L0FwcD4sXG4gIClcbn1cbiJdLCJtYXBwaW5ncyI6IkFBQUEsT0FBT0EsS0FBSyxNQUFNLE9BQU87QUFDekIsY0FBY0MsVUFBVSxRQUFRLG9CQUFvQjtBQUNwRCxjQUFjQyxJQUFJLFFBQVEsVUFBVTtBQUNwQyxjQUFjQyxLQUFLLElBQUlDLFNBQVMsUUFBUSxtQkFBbUI7QUFDM0QsY0FBY0MsUUFBUSxRQUFRLDBCQUEwQjtBQUN4RCxjQUFjQyxVQUFVLFFBQVEsdUJBQXVCO0FBRXZELEtBQUtDLGVBQWUsR0FBRztFQUNyQkMsYUFBYSxFQUFFLEdBQUcsR0FBR0YsVUFBVSxHQUFHLFNBQVM7RUFDM0NHLEtBQUssQ0FBQyxFQUFFUixVQUFVO0VBQ2xCUyxZQUFZLEVBQUVMLFFBQVE7QUFDeEIsQ0FBQztBQUVELE9BQU8sZUFBZU0sVUFBVUEsQ0FDOUJDLElBQUksRUFBRVYsSUFBSSxFQUNWVyxRQUFRLEVBQUVOLGVBQWUsRUFDekJPLFNBQVMsRUFBRVYsU0FBUyxFQUNwQlcsWUFBWSxFQUFFLENBQUNILElBQUksRUFBRVYsSUFBSSxFQUFFYyxPQUFPLEVBQUVoQixLQUFLLENBQUNpQixTQUFTLEVBQUUsR0FBR0MsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUN0RSxFQUFFQSxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7RUFDZixNQUFNO0lBQUVDO0VBQUksQ0FBQyxHQUFHLE1BQU0sTUFBTSxDQUFDLHFCQUFxQixDQUFDO0VBQ25ELE1BQU07SUFBRUM7RUFBSyxDQUFDLEdBQUcsTUFBTSxNQUFNLENBQUMsbUJBQW1CLENBQUM7RUFDbEQsTUFBTUwsWUFBWSxDQUNoQkgsSUFBSSxFQUNKLENBQUMsR0FBRyxDQUFDLElBQUlDLFFBQVEsQ0FBQztBQUN0QixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUlDLFNBQVMsQ0FBQztBQUMxQixJQUFJLEVBQUUsR0FBRyxDQUNQLENBQUM7QUFDSCIsImlnbm9yZUxpc3QiOltdfQ==
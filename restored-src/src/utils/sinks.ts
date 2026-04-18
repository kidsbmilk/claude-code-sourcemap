import { initializeAnalyticsSink } from '../services/analytics/sink.js'
import { initializeErrorLogSink } from './errorLogSink.js'

/**
 * Attach error log and analytics sinks, draining any events queued before
 * attachment. Both inits are idempotent. Called from setup() for the default
 * command; other entrypoints (subcommands, daemon, bridge) call this directly
 * since they bypass setup().
 *
 * Leaf module — kept out of setup.ts to avoid the setup → commands → bridge
 * → setup import cycle.
 */
// 作为一个独立的工具包，专门负责给程序安装“黑匣子”（记录错误和分析数据）。
// 因为它被设计成“叶子节点”（不依赖其他核心模块），所以能被那些不走常规启动流程的子命令或后台进程直接调用，从而避免了代码循环引用的死结。
export function initSinks(): void {
  initializeErrorLogSink()
  initializeAnalyticsSink()
}

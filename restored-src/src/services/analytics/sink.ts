/**
 * Analytics sink implementation
 *
 * This module contains the actual analytics routing logic and should be
 * initialized during app startup. It routes events to Datadog and 1P event
 * logging.
 *
 * Usage: Call initializeAnalyticsSink() during app startup to attach the sink.
 */

import { trackDatadogEvent } from './datadog.js'
import { logEventTo1P, shouldSampleEvent } from './firstPartyEventLogger.js'
import { checkStatsigFeatureGate_CACHED_MAY_BE_STALE } from './growthbook.js'
import { attachAnalyticsSink, stripProtoFields } from './index.js'
import { isSinkKilled } from './sinkKillswitch.js'

// Local type matching the logEvent metadata signature
type LogEventMetadata = { [key: string]: boolean | number | undefined }

const DATADOG_GATE_NAME = 'tengu_log_datadog_events'

// Module-level gate state - starts undefined, initialized during startup
let isDatadogGateEnabled: boolean | undefined = undefined

/**
 * Check if Datadog tracking is enabled.
 * Falls back to cached value from previous session if not yet initialized.
 */
function shouldTrackDatadog(): boolean {
  if (isSinkKilled('datadog')) {
    return false
  }
  if (isDatadogGateEnabled !== undefined) {
    return isDatadogGateEnabled
  }

  // Fallback to cached value from previous session
  try {
    return checkStatsigFeatureGate_CACHED_MAY_BE_STALE(DATADOG_GATE_NAME)
  } catch {
    return false
  }
}

/**
 * Log an event (synchronous implementation)
 */
function logEventImpl(eventName: string, metadata: LogEventMetadata): void {
  // Check if this event should be sampled
  const sampleResult = shouldSampleEvent(eventName)

  // If sample result is 0, the event was not selected for logging
  if (sampleResult === 0) {
    return
  }

  // If sample result is a positive number, add it to metadata
  const metadataWithSampleRate =
    sampleResult !== null
      ? { ...metadata, sample_rate: sampleResult }
      : metadata

  if (shouldTrackDatadog()) {
    // Datadog is a general-access backend — strip _PROTO_* keys
    // (unredacted PII-tagged values meant only for the 1P privileged column).
    void trackDatadogEvent(eventName, stripProtoFields(metadataWithSampleRate))
  }

  // 1P receives the full payload including _PROTO_* — the exporter
  // destructures and routes those keys to proto fields itself.
  logEventTo1P(eventName, metadataWithSampleRate)
}

/**
 * Log an event (asynchronous implementation)
 *
 * With Segment removed the two remaining sinks are fire-and-forget, so this
 * just wraps the sync impl — kept to preserve the sink interface contract.
 */
function logEventAsyncImpl(
  eventName: string,
  metadata: LogEventMetadata,
): Promise<void> {
  logEventImpl(eventName, metadata)
  return Promise.resolve()
}

/**
 * Initialize analytics gates during startup.
 *
 * Updates gate values from server. Early events use cached values from previous
 * session to avoid data loss during initialization.
 *
 * Called from main.tsx during setupBackend().
 */
export function initializeAnalyticsGates(): void {
  isDatadogGateEnabled =
    checkStatsigFeatureGate_CACHED_MAY_BE_STALE(DATADOG_GATE_NAME)
}

/**
 * Initialize the analytics sink.
 *
 * Call this during app startup to attach the analytics backend.
 * Any events logged before this is called will be queued and drained.
 *
 * Idempotent: safe to call multiple times (subsequent calls are no-ops).
 */
// 在程序启动时，负责把“数据收集器”（Analytics Backend）接通。如果在这之前程序已经产生了一些行为数据，它们会被先暂存在队列里，
// 等这个模块一启动，就会自动把这些积压的数据补发出去。而且这个操作很安全，就算不小心重复执行也不会出错。
export function initializeAnalyticsSink(): void {
  attachAnalyticsSink({
    logEvent: logEventImpl,
    logEventAsync: logEventAsyncImpl,
  })
}

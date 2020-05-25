import {formatDate} from './util'

// 几个打印日志的方法，本意是便于做一些收集工作
// 可能用sentry就不需要多做额外操作了吧= =
// 或者可以用这里的一些flag，来指明额外需要上报的信息

const basicLog = (type: 'warn' | 'error' | 'log', ...args) => {
  console[type](...args)
}

export const log = (...args) => {
  basicLog('log', ...args)
}

export const logWithTimestamp = (...args) => {
  log(`[${formatDate(undefined, 'yyyy-MM-dd hh:mm:ss.SSS')}] `, ...args)
}

export const warn = (...args) => {
  basicLog('warn', ...args)
  console.trace()
}

export const warnWithTimestamp = (...args) => {
  warn(`[${formatDate(undefined, 'yyyy-MM-dd hh:mm:ss.SSS')}] `, ...args)
}

export const error = (...args) => {
  basicLog('error', ...args)
  console.trace()
}

export const errorWithTimestamp = (...args) => {
  error(`[${formatDate(undefined, 'yyyy-MM-dd hh:mm:ss.SSS')}] `, ...args)
}

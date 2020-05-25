let scrollTop = 0

interface TimeValue {
  year: number
  month: number
  day: number
  hour: number
  minute: number
  second: number
  millisecond: number
}

/**
 * 获取当前时间或者指定时间的信息
 * @param date
 */
export const getTime = (date: Date = new Date()): TimeValue => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();
  const millisecond = date.getMilliseconds();
  return {
    year,
    month,
    day,
    hour,
    minute,
    second,
    millisecond
  };
};

/**
 * 在字符串的前方补指定数量的0
 * @param val
 * @param count
 */
export const paddingZero = (val: string | number, count: number = 2): string => {
  let v = val.toString();
  while (v.length < count) {
    v = `0${v}`;
  }
  return v;
};

/**
 * 将date转变成formatter的格式
 * @param date
 * @param formatter
 */
export const formatDate = (date: Date = new Date(), formatter: string = 'yyyy-MM-dd hh:mm'): string => {
  const time = getTime(date);
  return formatter
    .replace('yyyy', time.year + '')
    .replace('MM', paddingZero(time.month))
    .replace('dd', paddingZero(time.day))
    .replace('hh', paddingZero(time.hour))
    .replace('mm', paddingZero(time.minute))
    .replace('ss', paddingZero(time.second))
    .replace('SSS', paddingZero(time.millisecond, 3))
};

export const getTimezoneOffset = (date: Date = new Date()) => {
  return date.getTimezoneOffset()
}

export const delay = (time: number = 1000) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve()
    }, time)
  })
}

export function makeMap(arr: Array<{[key: string]: any}>, key: string) {
  const makeObj = {}
  arr.forEach(v => {
    makeObj[v[key]] = v
  })
  return makeObj
}


export function uuid (len = 8, radix = 16): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('')
  const value: string[] = []
  let i = 0
  radix = radix || chars.length

  if (len) {
    for (i = 0; i < len; i++) value[i] = chars[0 | (Math.random() * radix)]
  } else {
    let r

    value[8] = value[13] = value[18] = value[23] = '-'
    value[14] = '4'

    for (i = 0; i < 36; i++) {
      if (!value[i]) {
        r = 0 | (Math.random() * 16)
        value[i] = chars[i === 19 ? (r & 0x3) | 0x8 : r]
      }
    }
  }

  return value.join('')
}

export const objectToString = style => {
  if (style && typeof style === 'object') {
    let styleStr = ''
    Object.keys(style).forEach(key => {
      const lowerCaseKey = key.replace(/([A-Z])/g, '-$1').toLowerCase()
      styleStr += `${lowerCaseKey}:${style[key]};`
    })
    return styleStr
  } else if (style && typeof style === 'string') {
    return style
  }
  return ''
}
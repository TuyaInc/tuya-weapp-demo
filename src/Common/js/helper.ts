import Taro from 'src/Common/js/node_modules/@tarojs/taro'
import { execObject, SelectorQuery } from 'src/Common/js/node_modules/@tarojs/taro/types/index'
import { makeMap } from "src/Common/js/util";
import { warn } from "src/Common/js/logs";

const ENV = Taro.getEnv()

const toString = Object.prototype.toString

export function isPlainObject(val: any): val is Object {
  return toString.call(val) === '[object Object]'
}

export function isArray(val: any): val is Object {
  return toString.call(val) === '[object Array]'
}

function arrayTransform(data: Array<any>, fn): Array<any> {
  return data.map(fn)
}

function objectTransform(data, fn, convertMethod) {
  const convertObj = {}
  const keys = Object.keys(data)
  keys.forEach(key => {
    const value = data[key]
    const convertKey = convertMethod(key)
    convertObj[convertKey] = fn(value)
  })
  return convertObj
}

function convertCamelCaseMethod(key) {
  return key.replace(/([A-Z])/g, '_$1').toLowerCase()
}

function convertUnderScoreCaseMethod(key) {
  return key.replace(/_(.)/g, function (_, str: string) {
    return str.toUpperCase()
  })
}

export function mapCamelCaseToUnderScoreCase(data) {
  if (isPlainObject(data)) {
    return objectTransform(data, mapCamelCaseToUnderScoreCase, convertCamelCaseMethod)
  } else if (isArray(data)) {
    return arrayTransform(data, mapCamelCaseToUnderScoreCase)
  } else {
    return data
  }
}

export function mapUnderScoreCaseToCamelCase(data) {
  if (isPlainObject(data)) {
    return objectTransform(data, mapUnderScoreCaseToCamelCase, convertUnderScoreCaseMethod)
  } else if (isArray(data)) {
    return arrayTransform(data, mapUnderScoreCaseToCamelCase)
  } else {
    return data
  }
}

export function querySelector(
  self,
  selectorStr: string,
): Promise<Array<execObject>> {
  const $scope = ENV === Taro.ENV_TYPE.WEB ? self : self.$scope
  const selector: SelectorQuery = Taro.createSelectorQuery().in($scope)

  return new Promise(resolve => {
    selector
      .select(selectorStr)
      .boundingClientRect()
      .exec((res: Array<execObject>) => {
        resolve(res)
      })
  })
}

export function filterArray(definitionArray, actuallyArray, filterKey = 'code') {
  const map = makeMap(definitionArray, filterKey)
  return actuallyArray.map((str) => {
    const item = map[str]
    if (!item) warn(`类型${str}不在定义的列表中，请检查`)
    return item
  }).filter(_ => _)
}

export function UNSAFE_tryToConvertValueType(value) {
  if (typeof value !== 'string') return value
  if (value === 'true') return true
  if (value === 'false') return false
  if (/^\d+$/.test(value)) return parseInt(value, 10)
  return value
}

export function convertValueTypeBySchema(schema, value) {
  if (typeof value !== 'string') return value
  if (schema.type === 'Boolean') value = value === 'true'
  else if (schema.type === 'Integer') value = parseInt(value, 10)
  return value
}

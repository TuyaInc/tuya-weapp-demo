// pages/deviceDisplay/components/Integer/index.js
import { deviceControl } from '../../../../utils/api/device-api'
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    devid: String,
    dpCode: String,
    values: String,
    dpValue: Number
  },

  /**
   * 组件的初始数据
   */
  data: {
    dpCode: '',
    value: 0,
  },

  lifetimes: {
    attached: function() {
      const { dpCode, dpValue } = this.properties
    
      this.setData({ dpCode, value: dpValue })
    }
  },

  observers: {
    "dpValue": function (dpValue) {
      this.setData({ value: dpValue })
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    sendControl: async function(value) {
      const { devid, dpCode } = this.properties
      const {success, t} = await deviceControl(devid, dpCode, value)
      if(success) this.triggerEvent('sendMessage', { dpCode, value, t })
    },
    decs: function() {
      const { values, value } = this.properties
      const { step, min } = JSON.parse(values)
      if(value-step < min) return;
      this.sendControl(value-step)
    },
    add: function() {
      const { values, value } = this.properties
      const { step, max } = JSON.parse(values)
      if(value+step > max) return;
      this.sendControl(value+step)
    },
  }
})

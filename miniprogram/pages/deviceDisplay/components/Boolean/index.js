import { deviceControl } from '../../../../utils/api/device-api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    dpValue: Boolean,
    devid: String,
    dpCode: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    isChecked: false
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      const { dpValue } = this.properties

      this.setData({ isChecked: dpValue })
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
    onSwitch: async function(event) {
      const { devid, dpCode } = this.properties
      const { detail: { value } } = event

      const {success, t} = await deviceControl(devid, dpCode, value)
      if(success) this.triggerEvent('sendMessage', { dpCode, value, t })
    }
  }
})


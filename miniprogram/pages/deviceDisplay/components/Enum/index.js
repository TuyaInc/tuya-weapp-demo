// pages/deviceDisplay/components/Enum/index.js
import { deviceControl } from '../../../../utils/api/device-api'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    devid: String,
    dpCode: String,
    dpValue: String,
    ranges: String
  },

  /**
   * 组件的初始数据
   */
  data: {
    dpCode: "",
    actions: [],
    value: "",
    actionShow: false
  },

  /**
   * 组件的生命周期
   */
  lifetimes: {
    attached: function() {
      const { dpCode, dpValue, ranges } = this.properties

      const { range } = JSON.parse(ranges)
    
      const actions = range.map((item) => {
        return { 
          type: 'default',
          text: item,
          value: item
        }
      })
      this.setData({ dpCode, value: dpValue, actions })
    },
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
    onActionSheetShow: function() {
      const { actionShow } = this.data
      this.setData({ actionShow: !actionShow })
    },
    onChange: async function(event) {
      const { dpCode, devid  } = this.properties
      const { detail: { value } } = event

      const { success, t } = await deviceControl(devid, dpCode, value)
      if(success) {
        this.onActionSheetShow()
        this.triggerEvent('sendMessage', { dpCode, value, t })
      }
    }
  }
})

// pages/family/familyControl/index.js
import { 
  deleteFamily, 
  getMemberList
} from '../../../utils/api/family-api'

const img = '../../../image/avatar.jpeg'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    homeid: '',
    memberList: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { homeid } = options
    this.setData({ homeid })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: async function () {
    const { homeid } = this.data
    const memberList = await getMemberList(homeid)
    const showMemberList = memberList.map((item)=> {
      let avatar = item.avatar.length !== 0 ? item.avatar : img
      return { ...item, avatar }
    })
    this.setData({ memberList: showMemberList })
  },

  onShareAppMessage: function () {
  },

  gotoMemberInfo: function(event) {
    const { currentTarget: { dataset } } = event
    const { memberinfo } = dataset
    const { homeid } = this.data

    wx.navigateTo({
      url: `/pages/family/memberInfo/index?memberinfo=${JSON.stringify(memberinfo)}&homeid=${homeid}`,
    })
  },

  delateFamily: async function () {
    const { homeid } = this.data
    const { success } = (await deleteFamily(homeid)).result
    if(success) {
      wx.navigateBack({
        delta: 1
      })
    }
  }
})
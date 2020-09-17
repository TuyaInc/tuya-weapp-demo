// miniprogram/pages/family/memberInfo/index.js
import { deleteMember } from '../../../utils/api/family-api'

const avatar = "../../../image/avatar.jpeg"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    memberinfo: {
      avatar,
      name: '获取用户信息失败',
      admin: '获取用户信息失败'
    },
    homeid: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const { memberinfo, homeid } = options
    let parse = JSON.parse(memberinfo)
    const newMemberinfo = { ...parse, avatar }

    this.setData({ memberinfo: newMemberinfo, homeid })
  },

  onDelateMember: async function() {
    const { homeid, memberinfo: { uid } } = this.data

    const { success } = await deleteMember(homeid, uid)
    if(!success) return;
    wx.showToast({
      title: '移除用户成功',
      icon: 'none',
      duration: 3000
    })
    wx.navigateBack({
      delta: 1
    })
  },
})
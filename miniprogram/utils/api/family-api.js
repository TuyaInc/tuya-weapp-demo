import request from '../request'

// 获取用户所有家庭信息
export const getFamilyList = () => {
  return request({
    name: 'ty-service',
    data: {
      action: 'home.memberHomeList',
      params: {}
    }
  })
}

// 获取当前家庭下的设备情况
export const getHomeDeviceList = (home_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'home.devices',
      params: {
        home_id
      }
    }
  });
}

// 修改家庭信息
export const changFamily = (home_id, homeName) => {
  return Taro.cloud.callFunction({
    name: 'ty-service',
    data: {
      action: 'home.edit',
      params: {
        home_id,
        name: homeName
      }
    }
  });
}

// 添加家庭
export const addFamily = (homeName, uid) => {
  return wx.cloud.callFunction({
    name: 'ty-service',
    data: {
      action: 'home.add',
      params: {
        uid,
        home: {
          name: homeName
        }
      }
    }
  })
}

// 删除家庭
export const deleteFamily = (home_id) => {
  return wx.cloud.callFunction({
    name: 'ty-service',
    data: {
      action: 'home.delete',
      params: {
        home_id
      }
    }
  })
}

// 查询家庭成员
export const getMemberList = (home_id) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'home.memberList',
      params: {
        home_id
      }
    }
  })
}

// 删除家庭成员
export const deleteMember = (home_id, uid) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'home.deleteMember',
      params: {
        home_id,
        uid
      }
    }
  })
}

// 生成分享票据
export const getHomeTicket = (home_id, sharer) => {
  return wx.cloud.callFunction({
    name: 'ty-service',
    data: {
      action: "sharing.homeTicket",
      params: {
        app_schema: 'cloud',
        home_id,
        sharer
      }
    }
  })
}

// 确认加入分享
export const homeConfirm = (sharing_id, sharing_ticket, receiver) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'sharing.homeConfirm',
      params: {
        sharing_id,
        sharing_ticket,
        receiver,
        app_schema: 'cloud'
      }
    }
  })
}

// 分享票据校验
export const checkHomeTicket = (sharing_ticket) => {
  return request({
    name: 'ty-service',
    data: {
      action: 'sharing.homeTicketVerification',
      params: {
        sharing_ticket
      }
    }
  })
}


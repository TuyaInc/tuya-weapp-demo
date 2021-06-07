#### 注意：当前仓库将会废弃，新的涂鸦 Github 仓库地址参见： https://github.com/tuya/tuya-weapp-demo.

## 概述

这个一个简易版快速接入[涂鸦的小程序 SDK](https://developer.tuya.com/cn/docs/iot/app-development/mini-programs/overview/applet-ecology?id=K9ptacgp94o5d)，[配网插件](https://developer.tuya.com/cn/docs/iot/app-development/mini-programs/tuya-applet-with-web-plugin/distribution-network-plugin?id=K9lq218xn0wn8) 和 MQTT 的连接的Demo，目前趋于稳定。后续还会有新功能的更新。

## 体验

如果需要在自己的小程序中嵌入小程序配网的功能，可以通过接入小程序 SDK，获取自己的票据信息，然后调用小程序插件，完成配网，配网成功后重新调用获取设备信息的接口即可。

如果需要在自己的小程序中开发设备控制，场景联动、自动化等功能，可以通过小程序 SDK 调用相应的接口即可。

如果需要涂鸦公版小程序来支持您的设备，可以联系我们。公版小程序的您可以扫码下面的二维码体验：

<p align="center">
<img width=200 src="https://images.tuyacn.com/rms-static/9cbc9210-cb1f-11ea-9723-5fcc4b1eeb4e-1595314722225.jpg?tyName=gh_42ad2888c42d_258.jpg" >
</p>

如果在设备列表中显示没有设备，可以点击 “添加设备”，选择“扫码配网”，扫描下面的二维码，即可体验设备。
<p align="center"  >
<img width=200 src="https://airtake-public-data-1254153901.cos.ap-shanghai.myqcloud.com/goat/20200703/9123115b69c049899d14a84b239c13ed.png" >
<p align="center">香薰机</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/8f9a30a0-c805-11ea-a0c6-dbbe4bc4c496-1594973679786.png?tyName=kj.png" >
<p align="center">空气净化器</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/8f9e9d70-c805-11ea-a9da-3362f25bc183-1594973679815.png?tyName=kt.png" >
<p align="center">空调</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/8f9a0990-c805-11ea-a0c6-dbbe4bc4c496-1594973679785.png?tyName=cl.png" >
<p align="center">窗帘电机</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/c1cc0660-c81a-11ea-a0c6-dbbe4bc4c496-1594982783430.png?tyName=dj.png" >
<p align="center">智能灯</p>
</p>

## Demo 目录

```
├── cloudfunctions             // 云函数目录
│   ├── ty-getClientId        // 获取 clientId
│   ├── ty-service            // SDK
├── miniprogram                 // 小程序主目录
│   ├── image                   // 图片库
│   ├── libs                   // 第三方库
│   ├── pages                  // 具体页面的目录
│   ├── app.js                 // 小程序入口
│   ├── app.json               // 配置文件
├── project.config.json        // 项目配置文件
└── README.md            // 说明文件
```

## Demo 说明

- 设备配网：

  直接点击按钮进行配网：目前支持 AP 配网、扫码配网、蓝牙配网、zigbee 配网

- 体验设备功能：

  添加设备完成后，可以点击设备开启开关进行设备 MQTT 消息推送调试，建议先使用 api.js 文件中的 getDeviceSpecifications 函数获取指令集，防止出现 dp 点字段名称可能不一致的情况。正常下发指令后页面上会显示出推送消息的内容

- 完整版Demo
  目前支持设备控制，消息推送，添加设备(配网), 家庭模块

## 技术支持

  <p align="center"  >
    <img src="https://airtake-public-data-1254153901.cos.ap-shanghai.myqcloud.com/goat/20200811/52a6139793854a2ea7d3ce15dd59d40c.png" alt="drawing" width="200"/>
  </p>

  文档看了这么多，还是有很多疑问？需要有技术支持？对我们的小程序有建议？有吐槽？有需求？可以添加上面的微信为好友，随时答疑解惑（验证消息中写明：技术交流，不然没法通过）。

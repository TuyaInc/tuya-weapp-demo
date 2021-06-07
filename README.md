 [中文版](README.zh.md) | [English](README.md)

#### Note: This repository will be deprecated soon, please refer to the new repository in the Tuya Github Organization: https://github.com/tuya/tuya-weapp-demo. 

## Overview

This Demo is for quick connection to [Tuya Cloud Function](https://developer.tuya.com/cn/docs/iot/app-development/mini-programs/overview/applet-ecology?id=K9ptacgp94o5d), [Pairing Plugin](https://developer.tuya.com/cn/docs/iot/app-development/mini-programs/tuya-applet-with-web-plugin/distribution-network-plugin?id=K9lq218xn0wn8) and, MQTT. New features will be updated in the future.

## Get Started

If you need to embed the pairing function in your applet, you can get your ticket information by connecting to the cloud function and call the applet plugin to complete paring. Call the API for getting device information after pairing is completed

If you need to develop device control, scene linkage and automation, you can call the corresponding APIs through the cloud function.

Contact us if you need a Tuya all-in-one applet. Scan the QR code below to experience the all-in-one applet.

<p align="center">
<img width=200 src="https://images.tuyacn.com/rms-static/9cbc9210-cb1f-11ea-9723-5fcc4b1eeb4e-1595314722225.jpg?tyName=gh_42ad2888c42d_258.jpg" >
</p>

If no device is indicated in the device list, you can tap **Adding device** and select **Scan the QR code to pair**. You can experience the device by scanning the QR code below.
<p align="center"  >
<img width="200" src="https://airtake-public-data-1254153901.cos.ap-shanghai.myqcloud.com/goat/20200703/9123115b69c049899d14a84b239c13ed.png">
<p align="center">Diffuser</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/8f9a30a0-c805-11ea-a0c6-dbbe4bc4c496-1594973679786.png?tyName=kj.png" >
<p align="center">Air purifier</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/8f9e9d70-c805-11ea-a9da-3362f25bc183-1594973679815.png?tyName=kt.png" >
<p align="center">air conditioner</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/8f9a0990-c805-11ea-a0c6-dbbe4bc4c496-1594973679785.png?tyName=cl.png" >
<p align="center">The curtain motor</p>
</p>

<p align="center"  >
<img width=200 src="https://images.tuyacn.com/rms-static/c1cc0660-c81a-11ea-a0c6-dbbe4bc4c496-1594982783430.png?tyName=dj.png" >
<p align="center">Intelligent lamp</p>
</p>

## Demo directory 

```
├── cloudfunctions             //  Cloud function directory
│   ├── ty-service             // SDK
├── miniprogram                // Applet home directory
│   ├── image                  // The gallery
│   ├── libs                   // Third-party libraries
│   ├── pages                  // The directory of a specific page
│   ├── app.js                 // Applet entry
│   ├── app.json               // Configuration file
├── project.config.json        // Project configuration file
└── README.md                  // Description file
```

## Demo description

- #### Device pairing

   Click the button to pair. You can select from AP pairing, QR code pairing, Bluetooth pairing, and Zigbee pairing.

- #### Experience device function

   After adding a device, you can click the device on the switch to debug the MQTT push notification. It is recommended to use the getDeviceSpecifications function in the api.js file to get the instruction set to prevent possible inconsistencies in the DP field names. The content of the push notification will be displayed on the page after the command is sent.

- #### Supported device functions
  The current full version Demo supports device control, push notification, adding devices (pairing), and home module.

## Technical support

Contact us if you have any queries.


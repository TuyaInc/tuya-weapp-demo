import Mqtt from "src/Common/js/node_modules/mqtt/dist/mqtt";
import request from "../../Utils/Request";
import dva from "../../Utils/Dva";

class ClientMqtt {
    private _mqttClient: Mqtt.MqttClient;

    async connectMqtt() {
        try {
            if (this._mqttClient) {
                this.destroy()
                // console.log("已经存在mqtt实例,重新连接");
                // return this.reconnectMqtt();
            }

            const data = {
                action: "device.openIotHubConfig",
                params: {
                    unique_id: Math.random()
                        .toString(10)
                        .substring(2, 11),
                    type: "websocket"
                }
            };

            let {
                client_id,
                password,
                source_topic,
                url,
                username
            } = await request({
                name: "ty-service",
                data
            });

            if (url) {
                url = `wxs://${url.split("//")[1]}`;
                const mqttClient = Mqtt.connect(url, {
                    clientId: client_id,
                    username,
                    password,
                    keepalive: 60
                });

                this._mqttClient = mqttClient;

                mqttClient.on("connect", function () {
                    mqttClient.subscribe(source_topic, function (err) {
                        console.log("err", err);
                    });
                });

                mqttClient.on("message", async (topic, message) => {
                    const dispatch = dva.getDispatch();

                    const receivedJSON = JSON.parse(message.toString());
                    const params = {
                        action: "device.mqttDecrypt",
                        params: { ...receivedJSON }
                    };
                    const { devId, status } = await request({
                        name: "ty-service",
                        data: params
                    });

                    dispatch({
                        type: "Mqtt/deviceStatusUpdate",
                        payload: { deviceStatus: { devId, status } }
                    });
                });
                // 关闭
                mqttClient.on("close", e => {
                    console.log("mqtt close event", e);
                });

                // 离线
                mqttClient.on("offline", e => {
                    console.log("mqtt offline event", e);
                    setTimeout(() => {
                        this.reconnectMqtt();
                    }, 1000);
                });

                // 连接失败
                mqttClient.on("error", e => {
                    console.log("mqtt error event", e);
                    setTimeout(() => {
                        this.reconnectMqtt();
                    }, 1000);
                });

                // 连接中断
                mqttClient.on("disconnect", e => {
                    console.log("mqtt disconnect event", e);
                    setTimeout(() => {
                        this.reconnectMqtt();
                    }, 1000);
                });
            }

            return this._mqttClient;
        } catch (error) {
            console.error(error);
        }
    }

    get mqttClient() {
        return this._mqttClient;
    }

    reconnectMqtt() {
        // if (this._mqttClient.connected) return;
        if (this._mqttClient) this._mqttClient.reconnect();
        if (!this._mqttClient) this.connectMqtt();
    }

    destroy() {
        if (this._mqttClient) {
            this._mqttClient.end(true);
            this._mqttClient.disconnecting = false;
            this._mqttClient = null;
        }
    }
}

export default new ClientMqtt();

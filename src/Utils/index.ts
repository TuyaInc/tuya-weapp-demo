import request from "./Request";

/**
 * 下发控制
 * @param device_id 设备id
 * @param code 下发 dp 点
 * @param value 下发的值
 */
export function sendControlCommand(
    device_id: string,
    code: string,
    value: any
) {
    return request({
        name: "ty-service",
        data: {
            action: "device.control",
            params: {
                device_id: `${device_id}`,
                commands: [
                    {
                        code: `${code}`,
                        value: value
                    }
                ]
            }
        }
    });
}

import Request from "../../Utils/Request";

/**
 * 获取设备状态和功能点
 * @param device_id 设备id
 */
const getDeviceSpecifications = device_id => {
    const params = {
        name: "ty-service",
        data: {
            action: "device.specifications",
            params: {
                device_id
            }
        }
    };
    return Request(params);
};

/**
 * 获取设备详情
 * @param device_id 设备 id
 */
const getDetails = device_id => {
    const params = {
        name: "ty-service",
        data: {
            action: "device.details",
            params: {
                device_id
            }
        }
    };
    return Request(params);
};

export { getDeviceSpecifications, getDetails };

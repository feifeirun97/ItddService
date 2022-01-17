import request from "@/utils/request";
import { notification } from "antd"
export const commonApi = async (
  key,
  data,
  isNeedGroupId = false,
) => {
  try {
    const { data: res } = await request(
      "service-postInvestment/reports/commonApi",
      {
        data: {
          method: key,
          port: data.port || '5006',
          isNeedGroupId: isNeedGroupId,
          data,
        },
      }
    );
    console.log('res', res)

    if (res.respCode === "0000") {
      return res.data;
    }


    // throw (res);
  } catch (error) {
    console.log(error);
    notification.error({message: error.respMsg})
  }
};

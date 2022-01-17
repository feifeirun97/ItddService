import { Cascader } from "antd";
import { useState, useEffect } from "react";

const opt = {
  2020: "2020",
  "2020-Q1": "2020Q1",
  "2020-Q2": "2020Q2",
  2021: "2021",
  "2021-Q1": "2021Q1",
};

const opt2 = {
  all: "all",
  "province": "province",
  "province-广东省": "province-广东省",
  "province-other": "province-other",
  "province-福建省": "province-福建省",
  "province-浙江省": "province-浙江省",
  "province-上海市": "province-上海市",
  "province-江苏省": "province-江苏省",
  "province-河南省": "province-河南省",
  "province-湖北省": "province-湖北省",
  "province-山东省": "province-山东省",
  "province-四川省": "province-四川省",
  "province-美国": "province-美国",
  "city": "city",
  "city-广东省深圳市": "city-广东省深圳市",
  "city-other": "city-other",
  "city-浙江省杭州市": "city-浙江省杭州市",
  "city-广东省广州市": "city-广东省广州市",
  "city-上海市浦东新区": "city-上海市浦东新区",
  "city-福建省厦门市思明区": "city-福建省厦门市思明区",
  "city-江苏省苏州市": "city-江苏省苏州市",
  "city-广东省东莞市": "city-广东省东莞市",
  "city-四川省成都市": "city-四川省成都市",
  "city-河南省郑州市": "city-河南省郑州市",
  "city-河南省南阳市": "city-河南省南阳市",
  "plat": "plat",
  "plat-自营": "plat-自营",
  "shop": "shop",
  "shop-自营": "shop-自营",
};

function App({ dataSource, onChange }) {
  const [oprions, setOption] = useState([]);

  useEffect(() => {
    if (!dataSource) return;
    let flag = true; //标记数据是否为日期
    const pattern = /^(21|20|19)[0-9]{2}$/

    const baseOpt = Object.entries(opt2).map(([label, value]) => ({
      label,
      value,
    }));
    flag = pattern.test(baseOpt[0].label)
    console.log('flag', flag)
    const arr = baseOpt
      .filter(({ label }) => !label.includes("-"))
      .map((item) => {
        item.children = baseOpt
          .filter(({ label }) => {
            let bool = label.includes(item.label);
            if (flag || label === 'all') return bool;
            return bool && label !== item.label;
          })
          .map((f) => ({
            ...f,
          }));
        return item;
      });
    console.log("arr", arr);
    setOption(arr);
  }, [dataSource]);
  return (
    <Cascader
      expandTrigger="hover"
      options={oprions}
      onChange={(val) => {
        if (onChange instanceof Function) onChange(val);
        console.log('val');
      }}
    />
  );
}

export default App;

import { useState, useEffect } from "react"
import { Menu, Button } from "antd";

import {
    AppstoreOutlined,
    LeftOutlined,
    FileTextOutlined,
    FolderOutlined,
    FileSearchOutlined,
    PayCircleOutlined,
    DownOutlined,
    UpOutlined,
} from "@ant-design/icons";
import classnames from "classnames";
import styles from '../style.less';


function SideMenu(props) {
    const { menuList, onChange,fraud } = props
    const [activeItem, setActiveItem] = useState([0,0])
    const [expand, setExpand] = useState([])

    //expand初始值动态生成[true,false,false,false...]
    //点击后根据索引来改变expand里的值
    const handleExpand = (index) => {
        let temp = [...expand]
        temp[index] = !temp[index]
        setExpand(temp)
    }

    useEffect(() => {
        
        if (menuList) {
            const temp = []
            menuList.map((item, index) => {
                if (fraud) {
                    temp.push(true)
                    return
                }
                if (index == 0) temp.push(true)
                else temp.push(false)
            })
            setExpand(temp)
        }
    }, [menuList])

    useEffect(() => {
        if (menuList) {
            console.log(activeItem)
        }
    }, [activeItem])

    //activeItem初始为[0,0], 第一个0代表一级菜单的第一个，第二个0代表二级菜单的第0个
    //每次点击会更新两个index
    const handleItemClick = (index, idx, menuItem) => {
        setActiveItem([index, idx]);
        onChange(menuItem.value)
    }

    return (
        <>

            <div className={styles.menu}>
                {
                    menuList.map((item, index) => (
                        <div className={styles.subMenu} key={index}>

                            <div
                                className={classnames(styles.subMenuTitle, activeItem[0] == index ? styles.active : null)}
                                onClick={() => handleExpand(index)}
                            >
                                {item.name}
                                {expand[index]
                                    ? <UpOutlined style={{ marginLeft: '50px',fontSize:12}} />
                                    : <DownOutlined style={{ marginLeft: '50px',fontSize:12}} />
                                }
                            </div>


                            <div style={{ display: expand[index] ? 'block' : 'none' }}>

                                {
                                    item.children.map((menuItem, idx) => (
                                        <div
                                            className={classnames(styles.menuItem, activeItem[0] === index && activeItem[1] == idx ? styles.active : null)}
                                            onClick={() => handleItemClick(index, idx, menuItem)}
                                            key={idx}>
                                            {menuItem.name}
                                        </div>
                                    ))
                                }

                            </div>

                        </div>
                    ))
                }
            </div>
        </>
    )
}
export default SideMenu
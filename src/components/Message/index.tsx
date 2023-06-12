import { FC, useEffect } from "react";
import { useUserInfo } from "../CheckLogin/use-user";

enum SomeoneHelper {
    /** 查看帮助 */
    HELPER,
    /** 查看详情 */
    INFO,
    
}

export const MessageInfo: FC = () => {
    const { user_name, msg_count } = useUserInfo();
    useEffect(() => {
        if (!msg_count) {

        }
    }, []);

    return <footer className="layout-footer">
        <ul className=""></ul>
    </footer>
}
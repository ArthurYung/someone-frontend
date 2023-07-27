import { FC } from "react";

const cls = 'mobile-alert'

export const AlertContent: FC<{ content: string }> = ({ content }) => {
    return <div className={cls}>
        <h3 className={`${cls}--content`}>{content}</h3>
        <div className={`${cls}--footer`}>
            
        </div>
    </div>
}
# Someone Frontend

Someone（[https://someone.ink](https://someone.ink)）是一款免费的Web应用，服务器基于GPT-x api，除了基本的对话功能，还提供了实时金价和黄历查询的联网查询能力。Somone采用复古电脑终端的设计风格，营造沉浸式的人机对话体验。

## 账号登录

使用`Someone`之前，您需要先进行账号登录和身份验证。在同意声明后，可以使用键盘的`“↑”``“↓”`方向键来切换将要进行的登录方式，并按空格键确认进行登录验证。在验证过程中如果想重新选择验证方式，可以同时按下`“Control+D”`键返回登录选择界面。
![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/403b11fd-d1c1-440d-95de-916c97118b25)



## 微信授权码

向`Someone AI`微信公众号发送文字`“授权码”`可以生成当前微信账号的授权码，该授权码会在下次重新生成前永久有效。将公众号返回的整段授权码文字复制到Someone登录页的输入区域内完成永久登录授权。

![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/6111ec47-5a1f-4e5e-ac8f-48f3adc2ce9e)


**PS：手机复制文字到电脑遇到困难？可以试试浏览器跨端传输工具([https://ox.bruceau.com](https://ox.bruceau.com))**

## 公众号验证

选择公众号验证后，`Someone`会在页面中展示6位验证码字符串，我们在公众号输入验证码后即可完成公众号验证。（验证码不区分大小写）

![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/cd50a191-34a4-4eec-a5ac-3cf7303d3be3)

![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/be0c949b-364b-4d92-be24-d12a547d578e)



## 邮箱账号注册/验证

如果您不希望关注公众号接收相关信息，`Someone`提供了邮箱账号的登录方式。首先您需要选择**“注册邮箱账号”**输入您的邮箱号并设置密码，之后会向您的邮箱发送一封验证邮件，点击验证邮件中的链接即可完成注册并自动登录。
![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/de5fd226-1f87-4852-be74-563bc0f1a846)



如果您已经完成过邮箱账号注册，选择“邮箱账号验证”模式，输入您正确的邮箱和密码即可完成登录验证。

## 更多使用技巧

### 安装Web App

可以点击浏览器地址栏中的安装图标，或浏览器菜单中的**“安装Someone”**将someone.ink安装为本地应用，可以更便捷的体验gpt对话服务。
![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/f8f441bf-6d23-462a-84bc-9a26a33df259)

![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/867904c4-e6bc-4dd6-8285-e3867ed629c7)




### 内置指令快速补全

someone的输入栏提供了内置指令来优化使用体验，您可以在输入栏中输入这些指令来实现对应操作：

`"/help"` -- 查看帮助文档

`"/info"` -- 可查看对话资源使用详情

`"/contact"` -- 查看本站作者联系方式

`"/clear"` -- 清空当前对话内容以及本地历史数据

`"/survey"` -- 参与问卷调研，填写后将有机会获得额外体验次数

`"/feedback"` -- 参与提建议或反馈，填写后有机会获得额外体验次数

`"/quit"` -- 退出当前用户登录状态


在我们输入这些指令首字母时，输入栏会出现最接近当前前缀的指令提示，当出现这些提示后，我们只需要按下`“Tab”`键或方向`“→”`键即可快速补全指令字符。
![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/3779b18d-9b7d-40fa-87a9-71a43a600812)


### 快速切换历史输入内容

在对话输入时可以使用方向键`“↑”``“↓”`来快速切换历史输入内容。
![image](https://github.com/ArthurYung/someone-frontend/assets/29910365/1790fc35-0a2c-41c1-b182-675820b5b921)


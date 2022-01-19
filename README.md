# Xmindbillbook

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.0.5.

Nodejs version v12.16.1

npm version 6.13.4

## Run the project

1.Go to project root directory 'your path/xmindbillbook' and run `npm i`.

2.Run `node src/server/server.js` to start backend server.

3.Run `ng serve` to start frontend angular server. 

4.Navigate to `http://localhost:4200/` in browser. 

## 项目思考过程(远程高级前端工程师)

阅读题目，有前端，有后端，决定采用前后端分离，JSON交换数据的流行做法:

后端：存取csv文件，决定用nodejs做后端，暴露三个restful接口，用于读取(GET)bill.csv,categories.csv和新增bill(POST)。

前端：分析需求有两个页面（新增账单，查看账单列表），需要前端路由模块。

   1.新增账单页面，需要必填项、小数点两位数字校验,根据不同类型选项显示不同的分类选项功能，POST提交form表单新增bill。
   
   2.账单列表页面，需要排序，分页，按月、分类、类型三次筛选，按月统计收入支出明细等功能。
   
   决定采用angular及其组件完成以上功能，按月统计部分单独做，问题不大。

# Contact the author

email: wangyanlong0107@gmail.com

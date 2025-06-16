# 后端接口文档

## 1. 文章（Article）相关接口

### 创建文章

- **POST** `/articles`
- 请求体：

  ```json
  {
    "title": "string",
    "content": "string",
    "summary": "string",
    "coverUrl": "string",
    "tagIds": "string"
  }
  ```

- 返回：文章详情

### 获取文章列表

- **GET** `/articles?page=1&pageSize=10`
- 返回：文章列表

### 获取文章详情

- **GET** `/articles/:id`
- 返回：文章详情

### 更新文章

- **PUT** `/articles/:id`
- 请求体：同创建
- 返回：文章详情

### 删除文章

- **DELETE** `/articles/:id`
- 返回：操作结果

---

## 2. 标签（Tag）相关接口

### 创建标签

- **POST** `/tags`
- 请求体：

  ```json
  {
    "name": "string"
  }
  ```

- 返回：操作结果

### 获取所有标签

- **GET** `/tags`
- 返回：标签列表

### 更新标签

- **PUT** `/tags/:id`
- 请求体：

  ```json
  {
    "name": "string"
  }
  ```

- 返回：操作结果

### 删除标签

- **DELETE** `/tags/:id`
- 返回：操作结果

---

## 3. 评论（Comment）相关接口

### 创建评论

- **POST** `/comments`
- 请求体：

  ```json
  {
    "articleId": "number",
    "content": "string"
  }
  ```

- 返回：评论详情

### 获取指定文章的评论

- **GET** `/comments/:id`
- 返回：评论内容数组（`string[]`）

---

## 4. 图片（Image）相关接口

### 上传图片

- **POST** `/images`
- 表单字段：`file`（图片文件）
- 返回：图片URL

### 删除图片

- **DELETE** `/images/:filename`
- 返回：操作结果

### 获取所有图片

- **GET** `/images`
- 返回：图片信息列表

### 获取图片信息

- **GET** `/images/:filename`
- 返回：图片详细信息

---

## 5. OJ（Online Judge）相关接口

### 获取所有题目

- **GET** `/oj/problems`
- 返回：题目列表

### 创建题目

- **POST** `/oj/problems`
- 请求体：题目信息
- 返回：题目详情

### 删除题目

- **DELETE** `/oj/problems/:problem_id`
- 返回：操作结果

### 获取题目详情

- **GET** `/oj/problems/:id`
- 返回：题目详情

### 为题目创建测试用例

- **POST** `/oj/problems/:problem_id/testcases`
- 请求体：测试用例信息
- 返回：测试用例详情

### 获取题目测试用例

- **GET** `/oj/problems/:problem_id/testcases`
- 返回：测试用例列表

### 提交代码

- **POST** `/oj/submit`
- 请求体：

  ```json
  {
    "TID": "number",
    "SourceCode": "string",
    "LanguageID": "number"
  }
  ```

- 返回：

  ```json
  {
    "token": "string"
  }
  ```

### 获取提交状态

- **GET** `/oj/submission/:token`
- 返回：提交状态

### 获取判题结果

- **GET** `/oj/judge?token=xxx`
- 返回：判题结果

package dto

// OJProblemCreateRequest 创建OJ问题请求
type OJProblemCreateRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Difficulty  string `json:"difficulty" binding:"required"`
	TimeLimit   int    `json:"timeLimit"`
	MemoryLimit int    `json:"memoryLimit"`
}

// OJProblemUpdateRequest 更新OJ问题请求
type OJProblemUpdateRequest struct {
	Title       string `json:"title" binding:"required"`
	Description string `json:"description" binding:"required"`
	Difficulty  string `json:"difficulty" binding:"required"`
	TimeLimit   int    `json:"timeLimit"`
	MemoryLimit int    `json:"memoryLimit"`
}

// OJProblemResponse OJ问题响应
type OJProblemResponse struct {
	ID          uint   `json:"id"`
	Title       string `json:"title"`
	Description string `json:"description"`
	Difficulty  string `json:"difficulty"`
	TimeLimit   int    `json:"timeLimit"`
	MemoryLimit int    `json:"memoryLimit"`
	CreatedAt   string `json:"createdAt"`
	UpdatedAt   string `json:"updatedAt"`
}

// OJTestcaseCreateRequest 创建测试用例请求
type OJTestcaseCreateRequest struct {
	ProblemId uint   `json:"problemId" binding:"required"`
	Input     string `json:"input"`
	Output    string `json:"output"`
}

// OJTestcaseBatchCreateRequest 批量创建测试用例请求
type OJTestcaseBatchCreateRequest []struct {
	Input  string `json:"input"`
	Output string `json:"output"`
}

// OJTestcaseResponse 测试用例响应
type OJTestcaseResponse struct {
	ID        uint   `json:"id"`
	ProblemId uint   `json:"problemId"`
	Input     string `json:"input"`
	Output    string `json:"output"`
	CreatedAt string `json:"createdAt"`
}

// SubmissionCreateRequest 提交代码请求
type SubmissionCreateRequest struct {
	ProblemId uint   `json:"problemId" binding:"required"`
	Code      string `json:"code" binding:"required"`
	Language  string `json:"language" binding:"required"`
}

// SubmissionResponse 提交记录响应
type SubmissionResponse struct {
	ID          uint   `json:"id"`
	ProblemId   uint   `json:"problemId"`
	Code        string `json:"code"`
	Language    string `json:"language"`
	Status      string `json:"status"`
	IsCompleted bool   `json:"isCompleted"` // 新增：是否判题完成
	ExecuteTime int    `json:"executeTime"`
	MemoryUsage int    `json:"memoryUsage"`
	SubmitTime  string `json:"submitTime"`
	JudgeToken  string `json:"judgeToken"`
}

// Judge0SubmissionRequest Judge0 API请求
type Judge0SubmissionRequest struct {
	SourceCode     string  `json:"source_code"`
	LanguageId     int     `json:"language_id"`
	Stdin          string  `json:"stdin,omitempty"`
	ExpectedOutput string  `json:"expected_output,omitempty"`
	CpuTimeLimit   float64 `json:"cpu_time_limit,omitempty"`               // CPU时间限制(秒)
	MemoryLimit    int     `json:"memory_limit,omitempty"`                 // 内存限制(KB)
	WallTimeLimit  float64 `json:"wall_time_limit,omitempty"`              // 墙钟时间限制(秒)
	MaxProcesses   int     `json:"max_processes_and_or_threads,omitempty"` // 最大进程数
}

// Judge0SubmissionResponse Judge0 API响应
type Judge0SubmissionResponse struct {
	Token string `json:"token"`
}

// Judge0StatusResponse Judge0状态响应
type Judge0StatusResponse struct {
	Status struct {
		ID          int    `json:"id"`
		Description string `json:"description"`
	} `json:"status"`
	Time   string `json:"time"`
	Memory int    `json:"memory"`
}

// 前端接口需要的额外DTO类型

// SubmitResponse 前端提交代码响应 (对应前端的SubmitResponse)
type SubmitResponse struct {
	Token string `json:"token"` // Judge0返回的token
}

// JudgeResult 前端判题结果响应 (对应前端的JudgeResult)
type JudgeResult struct {
	Status struct {
		ID          int    `json:"id"`
		Description string `json:"description"`
	} `json:"status"`
	Time   string `json:"time"`
	Memory int    `json:"memory"`
	Token  string `json:"token"`
}

// 前端提交代码请求格式 (对应前端的JudgeRequest)
type CodeSubmitRequest struct {
	TID        int    `json:"tid" binding:"required"`        // 题目ID
	SourceCode string `json:"sourceCode" binding:"required"` // 源代码
	LanguageID int    `json:"languageId" binding:"required"` // 语言ID
}

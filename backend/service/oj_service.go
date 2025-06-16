package service

import (
	"backend/config"
	"backend/dto"
	"backend/entity"
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

// GetAllProblems 获取所有OJ问题
func GetAllProblems() ([]dto.OJProblemResponse, error) {
	var problems []entity.OJProblem
	// 预加载测试用例和提交记录
	if err := config.DB.Preload("Testcases").Preload("Submissions").Find(&problems).Error; err != nil {
		return nil, err
	}

	var responses []dto.OJProblemResponse
	for _, problem := range problems {
		responses = append(responses, dto.OJProblemResponse{
			ID:          problem.ID,
			Title:       problem.Title,
			Description: problem.Description,
			Difficulty:  problem.Difficulty,
			TimeLimit:   problem.TimeLimit,
			MemoryLimit: problem.MemoryLimit,
			CreatedAt:   problem.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt:   problem.UpdatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return responses, nil
}

// GetProblemById 根据ID获取OJ问题详情
func GetProblemById(problemId uint) (*dto.OJProblemResponse, error) {
	var problem entity.OJProblem
	if err := config.DB.Preload("Testcases").Preload("Submissions").First(&problem, problemId).Error; err != nil {
		return nil, err
	}

	return &dto.OJProblemResponse{
		ID:          problem.ID,
		Title:       problem.Title,
		Description: problem.Description,
		Difficulty:  problem.Difficulty,
		TimeLimit:   problem.TimeLimit,
		MemoryLimit: problem.MemoryLimit,
		CreatedAt:   problem.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:   problem.UpdatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

// CreateProblem 创建OJ问题
func CreateProblem(req dto.OJProblemCreateRequest) (*dto.OJProblemResponse, error) {
	problem := entity.OJProblem{
		Title:       req.Title,
		Description: req.Description,
		Difficulty:  req.Difficulty,
		TimeLimit:   req.TimeLimit,
		MemoryLimit: req.MemoryLimit,
	}

	// 设置默认值
	if problem.TimeLimit == 0 {
		problem.TimeLimit = 1000
	}
	if problem.MemoryLimit == 0 {
		problem.MemoryLimit = 256
	}

	if err := config.DB.Create(&problem).Error; err != nil {
		return nil, err
	}

	return &dto.OJProblemResponse{
		ID:          problem.ID,
		Title:       problem.Title,
		Description: problem.Description,
		Difficulty:  problem.Difficulty,
		TimeLimit:   problem.TimeLimit,
		MemoryLimit: problem.MemoryLimit,
		CreatedAt:   problem.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:   problem.UpdatedAt.Format("2006-01-02 15:04:05"),	}, nil
}

// UpdateProblem 更新OJ问题
func UpdateProblem(problemId uint, req dto.OJProblemUpdateRequest) (*dto.OJProblemResponse, error) {
	var problem entity.OJProblem
	if err := config.DB.First(&problem, problemId).Error; err != nil {
		return nil, err
	}

	// 更新字段
	problem.Title = req.Title
	problem.Description = req.Description
	problem.Difficulty = req.Difficulty
	problem.TimeLimit = req.TimeLimit
	problem.MemoryLimit = req.MemoryLimit

	// 设置默认值
	if problem.TimeLimit == 0 {
		problem.TimeLimit = 1000
	}
	if problem.MemoryLimit == 0 {
		problem.MemoryLimit = 256
	}

	if err := config.DB.Save(&problem).Error; err != nil {
		return nil, err
	}

	return &dto.OJProblemResponse{
		ID:          problem.ID,
		Title:       problem.Title,
		Description: problem.Description,
		Difficulty:  problem.Difficulty,
		TimeLimit:   problem.TimeLimit,
		MemoryLimit: problem.MemoryLimit,
		CreatedAt:   problem.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt:   problem.UpdatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

// DeleteProblem 删除OJ问题 (使用级联删除)
func DeleteProblem(problemId uint) error {
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var problem entity.OJProblem
	if err := tx.First(&problem, problemId).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 利用GORM的级联删除，删除相关的测试用例和提交记录
	if err := tx.Select("Testcases", "Submissions").Delete(&problem).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// CreateTestcase 为问题创建测试用例
func CreateTestcase(req dto.OJTestcaseCreateRequest) (*dto.OJTestcaseResponse, error) {
	// 验证问题是否存在
	var problem entity.OJProblem
	if err := config.DB.First(&problem, req.ProblemId).Error; err != nil {
		return nil, err
	}

	testcase := entity.OJTestcase{
		ProblemID: req.ProblemId,
		Input:     req.Input,
		Output:    req.Output,
	}

	if err := config.DB.Create(&testcase).Error; err != nil {
		return nil, err
	}

	return &dto.OJTestcaseResponse{
		ID:        testcase.ID,
		ProblemId: testcase.ProblemID,
		Input:     testcase.Input,
		Output:    testcase.Output,
		CreatedAt: testcase.CreatedAt.Format("2006-01-02 15:04:05")}, nil
}

// GetSubmissionStatus 获取提交状态
func GetSubmissionStatus(token string) (*dto.SubmissionResponse, error) {
	var submission entity.Submission
	if err := config.DB.Where("judge_token = ?", token).First(&submission).Error; err != nil {
		return nil, err
	}
	return &dto.SubmissionResponse{
		ID:          submission.ID,
		ProblemId:   submission.ProblemID,
		Code:        submission.Code,
		Language:    submission.Language,
		Status:      submission.Status,
		IsCompleted: isJudgeCompleted(submission.Status),
		ExecuteTime: submission.ExecuteTime,
		MemoryUsage: submission.MemoryUsage,
		SubmitTime:  submission.SubmitTime.Format("2006-01-02 15:04:05"),
		JudgeToken:  submission.JudgeToken}, nil
}

// GetTestcases 获取指定问题的测试用例
func GetTestcases(problemId uint) ([]dto.OJTestcaseResponse, error) {
	// 验证问题是否存在
	var problem entity.OJProblem
	if err := config.DB.First(&problem, problemId).Error; err != nil {
		return nil, err
	}

	var testcases []entity.OJTestcase
	if err := config.DB.Where("problem_id = ?", problemId).Order("created_at asc").Find(&testcases).Error; err != nil {
		return nil, err
	}

	var responses []dto.OJTestcaseResponse
	for _, testcase := range testcases {
		responses = append(responses, dto.OJTestcaseResponse{
			ID:        testcase.ID,
			ProblemId: testcase.ProblemID,
			Input:     testcase.Input,
			Output:    testcase.Output,
			CreatedAt: testcase.CreatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return responses, nil
}

// SubmitCode 提交代码进行评测
func SubmitCode(req dto.SubmissionCreateRequest) (*dto.SubmissionResponse, error) {
	// 验证问题是否存在
	var problem entity.OJProblem
	if err := config.DB.First(&problem, req.ProblemId).Error; err != nil {
		return nil, err
	}

	// 获取问题的测试用例
	var testcases []entity.OJTestcase
	config.DB.Where("problem_id = ?", req.ProblemId).Find(&testcases)

	if len(testcases) == 0 {
		return nil, fmt.Errorf("该题目暂无测试用例")
	}

	// 创建提交记录
	submission := entity.Submission{
		ProblemID:  req.ProblemId,
		Code:       req.Code,
		Language:   req.Language,
		Status:     "等待中",
		SubmitTime: time.Now(),
	}

	if err := config.DB.Create(&submission).Error; err != nil {
		return nil, err
	} // 调用Judge0 API获取token
	testcase := testcases[0]
	languageId := getLanguageId(submission.Language)
	judge0Req := dto.Judge0SubmissionRequest{
		SourceCode:     submission.Code,
		LanguageId:     languageId,
		Stdin:          testcase.Input,
		ExpectedOutput: testcase.Output,
		CpuTimeLimit:   1.0,    // 1秒CPU时间限制，匹配您的测试代码
		MemoryLimit:    240000, // 240MB内存限制，匹配您的测试代码
	}
	jsonData, err := json.Marshal(judge0Req)
	if err != nil {
		return nil, fmt.Errorf("JSON编码失败: %v", err)
	}
	judge0URL := os.Getenv("JUDGE0_URL")
	if judge0URL == "" {
		// 使用配置的默认Judge0服务地址
		judge0URL = "http://47.92.90.228:2358/submissions"
	}
	// 添加调试日志
	fmt.Printf("尝试连接Judge0服务: %s\n", judge0URL)
	fmt.Printf("请求数据: %s\n", string(jsonData))

	resp, err := http.Post(judge0URL, "application/json", bytes.NewBuffer(jsonData))
	if err != nil {
		return nil, fmt.Errorf("Judge0服务调用失败: %v", err)
	}
	defer resp.Body.Close()

	// 检查HTTP状态码
	if resp.StatusCode != http.StatusOK && resp.StatusCode != http.StatusCreated {
		bodyBytes, _ := io.ReadAll(resp.Body)
		return nil, fmt.Errorf("Judge0服务返回错误状态码: %d, 响应: %s", resp.StatusCode, string(bodyBytes))
	}

	// 读取响应体用于调试
	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("读取Judge0响应失败: %v", err)
	}

	fmt.Printf("Judge0响应: %s\n", string(bodyBytes))

	var judge0Resp dto.Judge0SubmissionResponse
	if err := json.Unmarshal(bodyBytes, &judge0Resp); err != nil {
		return nil, fmt.Errorf("Judge0响应解析失败: %v, 响应内容: %s", err, string(bodyBytes))
	}

	if judge0Resp.Token == "" {
		return nil, fmt.Errorf("Judge0未返回token")
	}
	// 更新submission的token
	submission.JudgeToken = judge0Resp.Token
	submission.Status = "IN_QUEUE"
	if err := config.DB.Save(&submission).Error; err != nil {
		return nil, err
	}

	// 异步轮询结果
	go pollJudgeResult(&submission, judge0URL)
	return &dto.SubmissionResponse{
		ID:          submission.ID,
		ProblemId:   submission.ProblemID,
		Code:        submission.Code,
		Language:    submission.Language,
		Status:      submission.Status,
		IsCompleted: isJudgeCompleted(submission.Status),
		ExecuteTime: submission.ExecuteTime,
		MemoryUsage: submission.MemoryUsage,
		SubmitTime:  submission.SubmitTime.Format("2006-01-02 15:04:05"),
		JudgeToken:  submission.JudgeToken,
	}, nil
}

// pollJudgeResult 轮询Judge0结果
func pollJudgeResult(submission *entity.Submission, judge0URL string) {
	for i := 0; i < 30; i++ { // 最多轮询30次
		time.Sleep(1 * time.Second)

		resp, err := http.Get(fmt.Sprintf("%s/%s?base64_encoded=true", judge0URL, submission.JudgeToken))
		if err != nil {
			continue
		}

		var statusResp dto.Judge0StatusResponse
		json.NewDecoder(resp.Body).Decode(&statusResp)
		resp.Body.Close()
		if statusResp.Status.ID == 3 { // Accepted
			submission.Status = "ACCEPTED"
			if statusResp.Time != "" {
				// 解析执行时间和内存使用
				submission.ExecuteTime = int(parseFloat(statusResp.Time) * 1000) // 转换为毫秒
			}
			submission.MemoryUsage = statusResp.Memory
			config.DB.Save(submission)
			return
		} else if statusResp.Status.ID > 3 { // 其他状态表示失败
			submission.Status = "WRONG_ANSWER"
			config.DB.Save(submission)
			return
		}
	}
	// 超时
	submission.Status = "TIMEOUT"
	config.DB.Save(submission)
}

// getLanguageId 获取Judge0语言ID
func getLanguageId(language string) int {
	switch language {
	case "Go":
		return 60
	case "C++":
		return 54
	case "Java":
		return 62
	case "Python":
		return 71
	default:
		return 71 // 默认Python
	}
}

// parseFloat 简单的字符串转浮点数
func parseFloat(s string) float64 {
	var f float64
	fmt.Sscanf(s, "%f", &f)
	return f
}

// isJudgeCompleted 判断判题是否完成
func isJudgeCompleted(status string) bool {
	completedStatuses := []string{
		"ACCEPTED", "WRONG_ANSWER", "TIME_LIMIT_EXCEEDED",
		"COMPILATION_ERROR", "RUNTIME_ERROR", "MEMORY_LIMIT_EXCEEDED",
	}
	for _, s := range completedStatuses {
		if status == s {
			return true
		}
	}
	return false
}

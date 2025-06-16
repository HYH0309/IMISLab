package controller

import (
	"backend/dto"
	"backend/service"
	"backend/utils"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

// GetAllProblems 获取所有OJ问题
func GetAllProblems(c *gin.Context) {
	problems, err := service.GetAllProblems()
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "获取OJ题目失败: "+err.Error())
		return
	}

	utils.Success(c, problems, "")
}

// CreateProblem 创建OJ问题
func CreateProblem(c *gin.Context) {
	var req dto.OJProblemCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的请求参数: "+err.Error())
		return
	}

	problem, err := service.CreateProblem(req)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "创建OJ题目失败: "+err.Error())
		return
	}
	utils.Success(c, problem, "OJ题目创建成功")
}

// UpdateProblem 更新OJ问题
func UpdateProblem(c *gin.Context) {
	idStr := c.Param("id")
	problemId, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的问题ID")
		return
	}

	var req dto.OJProblemUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的请求参数: "+err.Error())
		return
	}

	problem, err := service.UpdateProblem(uint(problemId), req)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "更新OJ题目失败: "+err.Error())
		return
	}

	utils.Success(c, problem, "OJ题目更新成功")
}

// DeleteProblem 删除OJ问题
func DeleteProblem(c *gin.Context) {
	idStr := c.Param("id")
	problemId, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的问题ID")
		return
	}

	err = service.DeleteProblem(uint(problemId))
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "删除OJ题目失败: "+err.Error())
		return
	}

	utils.Success(c, nil, "OJ题目删除成功")
}

// CreateTestcase 为问题批量创建测试用例
func CreateTestcase(c *gin.Context) {
	idStr := c.Param("problem_id")
	problemId, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的问题ID")
		return
	}

	// 接收批量创建请求（数组）
	var batchReq dto.OJTestcaseBatchCreateRequest
	if err := c.ShouldBindJSON(&batchReq); err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的请求参数: "+err.Error())
		return
	}

	// 批量创建测试用例
	var createdTestcases []interface{}
	for _, item := range batchReq {
		req := dto.OJTestcaseCreateRequest{
			ProblemId: uint(problemId),
			Input:     item.Input,
			Output:    item.Output,
		}
		testcase, err := service.CreateTestcase(req)
		if err != nil {
			utils.Fail(c, http.StatusInternalServerError, "创建测试用例失败: "+err.Error())
			return
		}
		createdTestcases = append(createdTestcases, testcase)
	}

	utils.Success(c, createdTestcases, "批量测试用例创建成功")
}

// SubmitCode 提交代码进行评测
func SubmitCode(c *gin.Context) {
	var req dto.CodeSubmitRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的请求参数: "+err.Error())
		return
	}

	// 转换为内部格式
	submission := dto.SubmissionCreateRequest{
		ProblemId: uint(req.TID),
		Code:      req.SourceCode,
		Language:  getLanguageName(req.LanguageID), // 将语言ID转换为语言名称
	}

	result, err := service.SubmitCode(submission)
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "代码提交失败: "+err.Error())
		return
	}

	// 返回前端需要的格式
	utils.Success(c, dto.SubmitResponse{
		Token: result.JudgeToken,
	}, "代码提交成功")
}

// getLanguageName 将语言ID转换为语言名称
func getLanguageName(languageID int) string {
	switch languageID {
	case 50: // C
		return "C"
	case 54: // C++
		return "C++"
	case 62: // Java
		return "Java"
	case 71: // Python
		return "Python"
	case 60: // Go
		return "Go"
	default:
		return "Unknown"
	}
}

// GetSubmissionStatus 获取提交状态
func GetSubmissionStatus(c *gin.Context) {
	token := c.Param("token")
	if token == "" {
		utils.Fail(c, http.StatusBadRequest, "Token参数是必需的")
		return
	}

	submission, err := service.GetSubmissionStatus(token)
	if err != nil {
		utils.Fail(c, http.StatusNotFound, "未找到提交记录")
		return
	}

	utils.Success(c, submission, "")
}

// GetProblemByID 根据ID获取OJ问题
func GetProblemByID(c *gin.Context) {
	idStr := c.Param("id")
	problemId, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的问题ID")
		return
	}

	problem, err := service.GetProblemById(uint(problemId))
	if err != nil {
		utils.Fail(c, http.StatusNotFound, "未找到该OJ题目")
		return
	}

	utils.Success(c, problem, "")
}

// GetTestcases 获取指定问题的测试用例
func GetTestcases(c *gin.Context) {
	idStr := c.Param("problem_id")
	problemId, err := strconv.ParseUint(idStr, 10, 32)
	if err != nil {
		utils.Fail(c, http.StatusBadRequest, "无效的问题ID")
		return
	}

	testcases, err := service.GetTestcases(uint(problemId))
	if err != nil {
		utils.Fail(c, http.StatusInternalServerError, "获取测试用例失败: "+err.Error())
		return
	}

	utils.Success(c, testcases, "")
}

// GetJudgeResult 根据token获取判题结果
func GetJudgeResult(c *gin.Context) {
	token := c.Query("token")
	if token == "" {
		utils.Fail(c, http.StatusBadRequest, "Token参数是必需的")
		return
	}

	submission, err := service.GetSubmissionStatus(token)
	if err != nil {
		utils.Fail(c, http.StatusNotFound, "未找到提交记录")
		return
	}

	utils.Success(c, submission, "获取判题结果成功")
}

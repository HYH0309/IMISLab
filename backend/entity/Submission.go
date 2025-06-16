package entity

import (
	"time"

	"gorm.io/gorm"
)

// Submission 提交记录实体
type Submission struct {
	gorm.Model
	ProblemID   uint      `gorm:"not null" json:"problemId"`                     // 关联的问题ID
	Problem     OJProblem `gorm:"foreignKey:ProblemID" json:"problem,omitempty"` // 反向关联
	Code        string    `gorm:"type:text;not null" json:"code"`
	Language    string    `gorm:"size:20;not null" json:"language"`        // Go/C++/Java/Python
	Status      string    `gorm:"size:20;default:'PENDING'" json:"status"` // PENDING/IN_QUEUE/ACCEPTED/WRONG_ANSWER等
	ExecuteTime int       `gorm:"default:0" json:"executeTime"`            // 执行时间(ms)
	MemoryUsage int       `gorm:"default:0" json:"memoryUsage"`            // 内存使用(KB)
	SubmitTime  time.Time `gorm:"autoCreateTime" json:"submitTime"`
	JudgeToken  string    `gorm:"size:100" json:"judgeToken"` // Judge0返回的评测令牌
}

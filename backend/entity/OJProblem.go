package entity

import "gorm.io/gorm"

// OJProblem OJ问题实体
type OJProblem struct {
	gorm.Model
	Title       string       `gorm:"size:200;not null" json:"title"`
	Description string       `gorm:"type:text;not null" json:"description"`
	Difficulty  string       `gorm:"size:20;not null;default:'中等'" json:"difficulty"` // 简单/中等/困难
	TimeLimit   int          `gorm:"default:1000" json:"timeLimit"`                   // 时间限制(ms)
	MemoryLimit int          `gorm:"default:256" json:"memoryLimit"`                  // 内存限制(MB)
	Testcases   []OJTestcase `gorm:"foreignKey:ProblemID" json:"testcases"`           // 一对多：测试用例
	Submissions []Submission `gorm:"foreignKey:ProblemID" json:"submissions"`         // 一对多：提交记录
}

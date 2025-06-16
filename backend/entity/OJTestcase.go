package entity

import "gorm.io/gorm"

// OJTestcase OJ测试用例实体
type OJTestcase struct {
	gorm.Model
	ProblemID uint      `gorm:"not null" json:"problemId"`                     // 关联的问题ID
	Problem   OJProblem `gorm:"foreignKey:ProblemID" json:"problem,omitempty"` // 反向关联
	Input     string    `gorm:"type:text" json:"input"`
	Output    string    `gorm:"type:text" json:"output"`
}

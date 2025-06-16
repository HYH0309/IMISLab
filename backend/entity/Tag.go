package entity

import "gorm.io/gorm"

// Tag 标签实体
type Tag struct {
	gorm.Model
	Name     string    `gorm:"size:100;not null;unique" json:"name"`              // 标签名称，唯一
	Articles []Article `gorm:"many2many:article_tags;" json:"articles,omitempty"` // 多对多关系(反向)
}

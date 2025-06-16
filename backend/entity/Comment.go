package entity

import "gorm.io/gorm"

// Comment 评论实体
type Comment struct {
	gorm.Model
	ArticleID uint    `gorm:"not null" json:"articleId"`                     // 关联的文章ID
	Article   Article `gorm:"foreignKey:ArticleID" json:"article,omitempty"` // 反向关联
	Content   string  `gorm:"type:text;not null" json:"content"`
	Author    string  `gorm:"size:100;not null" json:"author"`
}

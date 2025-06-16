package entity

import "gorm.io/gorm"

// Article 文章实体
type Article struct {
	gorm.Model
	Title    string    `gorm:"size:200;not null" json:"title"`
	Content  string    `gorm:"type:text;not null" json:"content"`
	Summary  string    `gorm:"size:500" json:"summary"`
	CoverUrl string    `gorm:"size:500" json:"coverUrl"`             // 封面图片URL
	Tags     []Tag     `gorm:"many2many:article_tags;" json:"tags"`  // 多对多关系
	Comments []Comment `gorm:"foreignKey:ArticleID" json:"comments"` // 一对多：评论
}

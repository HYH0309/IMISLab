package service

import (
	"backend/config"
	"backend/dto"
	"backend/entity"
)

// CreateComment 创建评论
func CreateComment(req dto.CommentCreateRequest) (*dto.CommentResponse, error) {
	// 验证文章是否存在
	var article entity.Article
	if err := config.DB.First(&article, req.ArticleId).Error; err != nil {
		return nil, err
	}

	comment := entity.Comment{
		ArticleID: req.ArticleId,
		Content:   req.Content,
		Author:    req.Author,
	}

	if err := config.DB.Create(&comment).Error; err != nil {
		return nil, err
	}

	return &dto.CommentResponse{
		ID:        comment.ID,
		ArticleId: comment.ArticleID,
		Content:   comment.Content,
		Author:    comment.Author,
		CreatedAt: comment.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt: comment.UpdatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

// GetCommentsByArticleID 根据文章ID获取评论
func GetCommentsByArticleID(articleId uint) ([]dto.CommentResponse, error) {
	var comments []entity.Comment
	if err := config.DB.Where("article_id = ?", articleId).Order("created_at desc").Find(&comments).Error; err != nil {
		return nil, err
	}

	var responses []dto.CommentResponse
	for _, comment := range comments {
		responses = append(responses, dto.CommentResponse{
			ID:        comment.ID,
			ArticleId: comment.ArticleID,
			Content:   comment.Content,
			Author:    comment.Author,
			CreatedAt: comment.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt: comment.UpdatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return responses, nil
}

// DeleteComment 删除评论
func DeleteComment(commentId uint) error {
	return config.DB.Delete(&entity.Comment{}, commentId).Error
}

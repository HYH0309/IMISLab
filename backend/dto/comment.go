package dto

// CommentCreateRequest 创建评论请求
type CommentCreateRequest struct {
	ArticleId uint   `json:"articleId" binding:"required"`
	Content   string `json:"content" binding:"required"`
	Author    string `json:"author" binding:"required"`
}

// CommentResponse 评论响应
type CommentResponse struct {
	ID        uint   `json:"id"`
	ArticleId uint   `json:"articleId"`
	Content   string `json:"content"`
	Author    string `json:"author"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

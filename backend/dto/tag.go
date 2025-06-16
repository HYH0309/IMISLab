package dto

// TagCreateRequest 创建标签请求
type TagCreateRequest struct {
	Name string `json:"name" binding:"required"`
}

// TagUpdateRequest 更新标签请求
type TagUpdateRequest struct {
	Name string `json:"name" binding:"required"`
}

// TagResponse 标签响应
type TagResponse struct {
	ID        uint   `json:"id"`
	Name      string `json:"name"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

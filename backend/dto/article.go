package dto

// ArticleCreateRequest 创建文章请求
type ArticleCreateRequest struct {
	Title    string `json:"title" binding:"required"`
	Content  string `json:"content" binding:"required"`
	Summary  string `json:"summary"`
	CoverUrl string `json:"coverUrl"`
	TagIds   []uint `json:"tagIds"`
}

// ArticleUpdateRequest 更新文章请求
type ArticleUpdateRequest struct {
	Title    string `json:"title"`
	Content  string `json:"content"`
	Summary  string `json:"summary"`
	CoverUrl string `json:"coverUrl"`
	TagIds   []uint `json:"tagIds"`
}

// ArticleResponse 文章响应
type ArticleResponse struct {
	ID        uint   `json:"id"`
	Title     string `json:"title"`
	Content   string `json:"content"`
	Summary   string `json:"summary"`
	CoverUrl  string `json:"coverUrl"`
	TagIds    []uint `json:"tagIds"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

// ArticleListResponse 文章列表响应
type ArticleListResponse struct {
	ID        uint   `json:"id"`
	Title     string `json:"title"`
	Summary   string `json:"summary"`
	CoverUrl  string `json:"coverUrl"`
	TagIds    []uint `json:"tagIds"`
	CreatedAt string `json:"createdAt"`
	UpdatedAt string `json:"updatedAt"`
}

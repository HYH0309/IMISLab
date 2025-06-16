package service

import (
	"backend/config"
	"backend/dto"
	"backend/entity"
)

// CreateArticle 创建文章
func CreateArticle(req dto.ArticleCreateRequest) (*dto.ArticleResponse, error) {
	// 1. 创建文章实体
	article := entity.Article{
		Title:    req.Title,
		Content:  req.Content,
		Summary:  req.Summary,
		CoverUrl: req.CoverUrl,
	}

	// 2. 开始数据库事务
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	// 3. 创建文章
	if err := tx.Create(&article).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// 4. 处理标签关联
	if len(req.TagIds) > 0 {
		var tags []entity.Tag
		if err := tx.Where("id IN ?", req.TagIds).Find(&tags).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
		// 关联标签
		if err := tx.Model(&article).Association("Tags").Append(tags); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	// 5. 提交事务
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	// 6. 重新查询完整数据并返回
	return GetArticleByID(article.ID)
}

// GetArticleList 获取文章列表，支持分页
func GetArticleList(page, pageSize int) ([]dto.ArticleListResponse, error) {
	var articles []entity.Article
	offset := (page - 1) * pageSize

	// 预加载标签关系
	if err := config.DB.Preload("Tags").Order("created_at desc").Offset(offset).Limit(pageSize).Find(&articles).Error; err != nil {
		return nil, err
	}

	var list []dto.ArticleListResponse
	for _, a := range articles {
		// 提取标签ID
		var tagIds []uint
		for _, tag := range a.Tags {
			tagIds = append(tagIds, tag.ID)
		}

		list = append(list, dto.ArticleListResponse{
			ID:        a.ID,
			Title:     a.Title,
			Summary:   a.Summary,
			CoverUrl:  a.CoverUrl,
			TagIds:    tagIds,
			CreatedAt: a.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt: a.UpdatedAt.Format("2006-01-02 15:04:05"),
		})
	}
	return list, nil
}

// GetArticleByID 根据 ID 获取文章详情
func GetArticleByID(id uint) (*dto.ArticleResponse, error) {
	var article entity.Article
	if err := config.DB.Preload("Tags").First(&article, id).Error; err != nil {
		return nil, err
	}
	return mapToResponse(article), nil
}

// UpdateArticle 更新文章
func UpdateArticle(id uint, req dto.ArticleUpdateRequest) (*dto.ArticleResponse, error) {
	// 开始事务
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var article entity.Article
	if err := tx.First(&article, id).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// 更新基本字段
	if req.Title != "" {
		article.Title = req.Title
	}
	if req.Content != "" {
		article.Content = req.Content
	}
	if req.Summary != "" {
		article.Summary = req.Summary
	}
	if req.CoverUrl != "" {
		article.CoverUrl = req.CoverUrl
	}

	// 保存基本信息
	if err := tx.Save(&article).Error; err != nil {
		tx.Rollback()
		return nil, err
	}

	// 更新标签关联
	if len(req.TagIds) > 0 {
		var tags []entity.Tag
		if err := tx.Where("id IN ?", req.TagIds).Find(&tags).Error; err != nil {
			tx.Rollback()
			return nil, err
		}
		// 替换所有标签关联
		if err := tx.Model(&article).Association("Tags").Replace(tags); err != nil {
			tx.Rollback()
			return nil, err
		}
	} else {
		// 如果标签ID列表为空，清除所有标签关联
		if err := tx.Model(&article).Association("Tags").Clear(); err != nil {
			tx.Rollback()
			return nil, err
		}
	}

	// 提交事务
	if err := tx.Commit().Error; err != nil {
		return nil, err
	}

	// 重新查询完整数据并返回
	return GetArticleByID(article.ID)
}

// DeleteArticle 删除文章
func DeleteArticle(id uint) error {
	tx := config.DB.Begin()
	defer func() {
		if r := recover(); r != nil {
			tx.Rollback()
		}
	}()

	var article entity.Article
	if err := tx.First(&article, id).Error; err != nil {
		tx.Rollback()
		return err
	}

	// 先清除标签关联
	if err := tx.Model(&article).Association("Tags").Clear(); err != nil {
		tx.Rollback()
		return err
	}

	// 删除文章
	if err := tx.Delete(&article).Error; err != nil {
		tx.Rollback()
		return err
	}

	return tx.Commit().Error
}

// mapToResponse 将实体转换为响应 DTO
func mapToResponse(article entity.Article) *dto.ArticleResponse {
	if article.ID == 0 {
		return nil
	}

	// 提取标签ID
	var tagIds []uint
	for _, tag := range article.Tags {
		tagIds = append(tagIds, tag.ID)
	}

	return &dto.ArticleResponse{
		ID:        article.ID,
		Title:     article.Title,
		Content:   article.Content,
		Summary:   article.Summary,
		CoverUrl:  article.CoverUrl,
		TagIds:    tagIds,
		CreatedAt: article.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt: article.UpdatedAt.Format("2006-01-02 15:04:05"),
	}
}

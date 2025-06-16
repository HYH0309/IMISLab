package service

import (
	"backend/config"
	"backend/dto"
	"backend/entity"
)

// CreateTag 创建标签
func CreateTag(req dto.TagCreateRequest) (*dto.TagResponse, error) {
	tag := entity.Tag{
		Name: req.Name,
	}

	if err := config.DB.Create(&tag).Error; err != nil {
		return nil, err
	}

	return &dto.TagResponse{
		ID:        tag.ID,
		Name:      tag.Name,
		CreatedAt: tag.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt: tag.UpdatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

// GetAllTags 获取所有标签
func GetAllTags() ([]dto.TagResponse, error) {
	var tags []entity.Tag
	if err := config.DB.Find(&tags).Error; err != nil {
		return nil, err
	}

	var responses []dto.TagResponse
	for _, tag := range tags {
		responses = append(responses, dto.TagResponse{
			ID:        tag.ID,
			Name:      tag.Name,
			CreatedAt: tag.CreatedAt.Format("2006-01-02 15:04:05"),
			UpdatedAt: tag.UpdatedAt.Format("2006-01-02 15:04:05"),
		})
	}

	return responses, nil
}

// UpdateTag 更新标签
func UpdateTag(id uint, req dto.TagUpdateRequest) (*dto.TagResponse, error) {
	var tag entity.Tag
	if err := config.DB.First(&tag, id).Error; err != nil {
		return nil, err
	}

	tag.Name = req.Name
	if err := config.DB.Save(&tag).Error; err != nil {
		return nil, err
	}

	return &dto.TagResponse{
		ID:        tag.ID,
		Name:      tag.Name,
		CreatedAt: tag.CreatedAt.Format("2006-01-02 15:04:05"),
		UpdatedAt: tag.UpdatedAt.Format("2006-01-02 15:04:05"),
	}, nil
}

// DeleteTag 删除标签
func DeleteTag(id uint) error {
	return config.DB.Delete(&entity.Tag{}, id).Error
}

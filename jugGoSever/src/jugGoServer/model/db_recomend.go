package model

import (
	"time"
)

type Recomend struct {
	ID           uint      `gorm:"primary_key" gorm:"auto_increment"`
	UserID       uint      `gorm:"index"` //关联这条推荐是谁的
	Chanel       uint      //推荐的渠道
	CreatedAt    time.Time //推荐成功的时间
	RecomendUser uint      //推荐了谁

}

type RecomendModel struct {
	CommonModel
}

func GetRecomendModel() *RecomendModel {
	return &RecomendModel{CommonModel{db: commonDb}}
}

func (u *RecomendModel) Create(recomend *Recomend) error {
	if err := u.db.Model(&Recomend{}).Create(recomend).Error; err != nil {
		return err
	}
	return nil
}

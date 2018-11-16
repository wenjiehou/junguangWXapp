package model

import (
	"time"
)

const (
	Recomend_Chanel_wxappShare uint = 1
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

//查询属于 userId 的推荐记录
func (u *RecomendModel) GetRecomendsByUserId(userId uint) (*[]Recomend, error) {
	var recomends []Recomend

	if err := u.db.Model(&Recomend{}).Where("user_id=?", userId).Find(&recomends).Error; err != nil {
		return nil, err
	}
	return &recomends, nil
}

/**保存或者更新*/
func (u *RecomendModel) Save(recomend *Recomend) error {
	if recomend == nil {
		return nil
	}

	if err := u.db.Model(&Recomend{}).Save(recomend).Error; err != nil {
		return err
	}

	return nil
}

package model

import (
	"time"

	"github.com/jinzhu/gorm"
)

//配置在redis中 rpush signConfig 10 20 30 40 50 60 70 //

//提醒 recomSign6 ...  [openid]list

//

type Sign struct { //玩家签到表
	gorm.Model
	LastTime *time.Time
	UserID   uint `sql:"unique" gorm:"index"` //关联这条推荐是谁的
	Sum      uint //总签到次数
	Continue uint //已经连续签到的次数 0-6 断了的话就变成0了

}

type SignModel struct {
	CommonModel
}

func GetSignModel() *SignModel {
	return &SignModel{CommonModel{db: commonDb}}
}

func (u *SignModel) GetSignByUserId(userID uint) (*Sign, error) {
	var sign Sign
	if err := u.db.Model(&Sign{}).Where("user_id=?", userID).First(&sign).Error; err != nil {
		return nil, err
	}

	return &sign, nil
}

/**保存或者更新*/
func (u *SignModel) Save(sign *Sign) error {
	if sign == nil {
		return nil
	}

	if err := u.db.Model(&Sign{}).Save(sign).Error; err != nil {
		return err
	}

	return nil
}

package model

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Openid     string `gorm:"size:100" gorm:"index"`
	Unionid    string `sql:"unique" gorm:"size:100"` //跨小程序小游戏需要用
	SessionKey string `gorm:"size:100"`
	NickName   string `gorm:"size:100"`
	Sex        uint
	GpsLan     float32    //经度
	GpsLat     float32    //纬度
	City       string     `gorm:"size:30"`
	Country    string     `gorm:"size:30"`
	Credit     uint       //积分
	Recomends  []Recomend `gorm:"ForeignKey:UserID"` //玩家推荐的人
	BeRecomend uint       //玩家被谁推荐的
}

type UserModel struct {
	CommonModel
}

func GetUserModel() *UserModel {
	return &UserModel{CommonModel{db: commonDb}}
}

func (u *UserModel) Create(user *User) error {
	if err := u.db.Model(&User{}).Create(user).Error; err != nil {
		return err
	}
	return nil
}

func (u *UserModel) GetUserById(id int) (*User, error) {
	var user User
	if err := u.db.Model(&User{}).Preload("Recomends").Where("id=?", id).First(&user).Error; err != nil {
		return nil, err
	}

	return &user, nil
}

func (u *UserModel) GetUserByOpenId(openid string) (*User, error) {
	var user User
	if err := u.db.Model(&User{}).Preload("Recomends").Where("openid=?", openid).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *UserModel) GetUserByUnionId(unionid string) (*User, error) {
	var user User
	if err := u.db.Model(&User{}).Preload("Recomends").Where("unionid=?", unionid).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

/**保存或者更新*/
func (u *UserModel) Save(user *User) error {
	if user == nil {
		return nil
	}

	if err := u.db.Model(&User{}).Save(user).Error; err != nil {
		return err
	}

	return nil
}

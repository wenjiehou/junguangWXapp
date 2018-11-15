package model

import (
	"github.com/jinzhu/gorm"
)

type User struct {
	gorm.Model
	Openid     string `gorm:"size:50" gorm:"index"`
	Unionid    string `gorm:"size:50" gorm:"index"` //跨小程序小游戏需要用
	SessionKey string `gorm:"size:50"`
	NickName   string `gorm:"size:50"`
	AvatarUrl  string `gorm:"size:255"`
	Gender     uint
	GpsLan     float32    //经度
	GpsLat     float32    //纬度
	City       string     `gorm:"size:30"`
	Country    string     `gorm:"size:30"`
	Credit     uint       //积分
	Language   string     `gorm:"size:20"`
	Province   string     `gorm:"size:30"`
	Authorize  bool       //用户是否授权过 `gorm:"size:30"`
	Wxkey      string     `gorm:"size:50" gorm:"index"`
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

func (u *UserModel) GetUserById(id uint) (*User, error) {
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

func (u *UserModel) GetUserByWxkey(wxkey string) (*User, error) {
	var user User
	if err := u.db.Model(&User{}).Preload("Recomends").Where("wxkey=?", wxkey).First(&user).Error; err != nil {
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

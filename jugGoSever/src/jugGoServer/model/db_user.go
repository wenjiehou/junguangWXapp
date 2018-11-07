package model

import (
	"time"
)

type User struct {
	ID         int `json:"id" gorm:"primary_key" gorm:"size:10"`
	CreatedAt  time.Time
	UpdatedAt  time.Time
	DeletedAt  *time.Time `sql:"index"`
	OpenID     string     `json:"open_id"`
	UnionID    string     `json:"union_id" sql:"unique"` //跨小程序小游戏需要用
	SessionKey string     `json:"session_key"`
	NickName   string     `json:"nick_name"`
	Sex        int        `json:"sex"`
	GPS_LNG    float32    `json:"gps_lng"` //经度
	GPS_LAT    float32    `json:"gps_lat"` //纬度
	City       string     `json:"city"`
	Country    string     `json:"country"`
	Credit     int        `json:"credit"` //积分
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
	if err := u.db.Model(&User{}).Where("id=?", id).First(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (u *UserModel) GetUserByOpenId(openid string) (*User, error) {
	var user User
	if err := u.db.Model(&User{}).Where("open_id=?", openid).First(&user).Error; err != nil {
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

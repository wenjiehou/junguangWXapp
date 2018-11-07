package model

import (
	"github.com/jinzhu/gorm"
)

type CommonModel struct {
	db *gorm.DB
}

var commonDb = &gorm.DB{}

func InitCommonDb(db *gorm.DB) {
	commonDb = db
}

func BeginCommit() *gorm.DB {
	return commonDb.Begin()
}

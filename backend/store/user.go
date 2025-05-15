package store

import (
	"errors"

	"github.com/polinanime/sna25/model"
	"gorm.io/gorm"
)

type UserStore struct {
	db *gorm.DB
}

func NewUserStore(db *gorm.DB) *UserStore {
	return &UserStore{
		db: db,
	}
}

func (us *UserStore) GetByID(id uint) (*model.User, error) {
	var m model.User
	if err := us.db.First(&m, id).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (us *UserStore) GetByEmail(e string) (*model.User, error) {
	var m model.User
	if err := us.db.Where(&model.User{Email: e}).First(&m).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (us *UserStore) GetByUsername(username string) (*model.User, error) {
	var m model.User
	if err := us.db.Where(&model.User{Username: username}).Preload("Followers").First(&m).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return nil, nil
		}
		return nil, err
	}
	return &m, nil
}

func (us *UserStore) Create(u *model.User) (err error) {
	return us.db.Create(u).Error
}

func (us *UserStore) Update(u *model.User) error {
	return us.db.Model(u).Updates(u).Error
}

func (us *UserStore) AddFollower(u *model.User, followerID uint) error {
	return us.db.Model(u).Association("Followers").Append(&model.Follow{FollowerID: followerID, FollowingID: u.ID})
}

// For sqlite driver  this function has error: row value misused
//select *  from follows where (`follower_id`,`following_id`) in ((1,2))
//DELETE FROM `follows` WHERE (`follows`.`follower_id`,`follows`.`following_id`) IN ((1,2))
// https://github.com/go-gorm/gorm/issues/3585

func (us *UserStore) RemoveFollower(u *model.User, followerID uint) error {
	//log.Fatal("STOP")
	if "sqlite" == us.db.Config.Dialector.Name() {

		err := us.db.Exec("delete from `follows` where `follower_id`=? and `following_id`=?",
			followerID,
			u.ID).Error

		//newUser := model.User{}
		//us.db.Model(u).Where(u.ID).First(&newUser)
		//u = &newUser
		//log.Fatal(u.Followers)
		if err != nil {
			return err
		}
		return nil
	} else {
		f := model.Follow{
			FollowerID:  followerID,
			FollowingID: u.ID,
		}
		if err := us.db.Model(u).Association("Followers").Find(&f); err != nil {
			return err
		}
		if err := us.db.Delete(f).Error; err != nil {
			return err
		}

		return nil
	}

}

func (us *UserStore) IsFollower(userID, followerID uint) (bool, error) {
	var f model.Follow
	if err := us.db.Where("following_id = ? AND follower_id = ?", userID, followerID).First(&f).Error; err != nil {
		if errors.Is(err, gorm.ErrRecordNotFound) {
			return false, nil
		}
		return false, err
	}
	return true, nil
}

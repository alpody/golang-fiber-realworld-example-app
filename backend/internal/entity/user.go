package entity

type RegisterParamsT struct {
	User RegisterParams `json:"user"`
}

type RegisterParams struct {
	Email    string `json:"email"`
	Username string `json:"username"`
	Password string `json:"password"`
}

type LoginParams struct {
	User struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	} `json:"user"`
}

type User struct {
	Email    string `json:"email"`
	Token    string `json:"token"`
	Username string `json:"username"`
	Bio      string `json:"bio"`
	Image    string `json:"image"`
}

type Profile struct {
	Username  string `json:"username"`
	Bio       string `json:"bio"`
	Image     string `json:"image"`
	Following bool   `json:"following"`
}

type UserUPDReq struct {
	User struct {
		Email    string `json:"email"`
		Username string `json:"username"`
		Password string `json:"password"`
		Image    string `json:"image"`
		Bio      string `json:"bio"`
	} `json:"user"`
}

package entity

type CreateArticleReq struct {
	Article struct {
		Title       string   `json:"title"`
		Description string   `json:"description"`
		Body        string   `json:"body"`
		TagList     []string `json:"tagList"`
	} `json:"article"`
}

type Article struct {
	Slug           string   `json:"slug"`
	Title          string   `json:"title"`
	Description    string   `json:"description"`
	Body           string   `json:"body"`
	TagList        []string `json:"tagList"`
	CreatedAt      string   `json:"createdAt"`
	UpdatedAt      string   `json:"updatedAt"`
	Favorited      bool     `json:"favorited"`
	FavoritesCount int32    `json:"favoritesCount"`
	Author         Profile  `json:"author"`
}

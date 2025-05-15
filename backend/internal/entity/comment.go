package entity

type CreateCommentReq struct {
	Comment struct {
		Body string `json:"body"`
	} `json:"comment"`
}

type CommentResp struct {
	Comment struct {
		ID        int64   `json:"id"`
		CreatedAt string  `json:"createdAt"`
		UpdatedAt string  `json:"updatedAt"`
		Body      string  `json:"body"`
		Author    Profile `json:"author"`
	}
}

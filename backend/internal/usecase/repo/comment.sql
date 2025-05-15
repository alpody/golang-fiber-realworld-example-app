-- comment.sql

-- name: CreateComment :one
WITH inserted_comment AS (
    INSERT INTO comments (article_id, user_id, body, created_at, updated_at)
        VALUES (
                   (SELECT id FROM articles WHERE slug = $1),
                   $2,
                   $3,
                   CURRENT_TIMESTAMP,
                   CURRENT_TIMESTAMP
               )
        RETURNING id, created_at, updated_at, body, user_id
)
SELECT
    ic.id,
    ic.created_at,
    ic.updated_at,
    ic.body,
    u.username,
    u.bio,
    u.image,
    EXISTS (
        SELECT 1
        FROM follows f
        WHERE f.follower_id = ic.user_id AND f.followee_id = u.id
    ) AS following
FROM
    inserted_comment ic
        JOIN
    users u ON ic.user_id = u.id;



-- name: GetSingleComment :one
SELECT
    c.id,
    c.created_at AS createdAt,
    c.updated_at AS updatedAt,
    c.body,
    u.username,
    u.bio,
    u.image,
    FALSE AS following  -- заменить на реальную логику определения, следует ли автору
FROM comments c
         JOIN users u ON c.user_id = u.id
WHERE c.id = (SELECT MAX(id) FROM comments);

-- name: DeleteComment :exec
DELETE FROM comments
WHERE id = $1 AND user_id = $2;

-- name: GetCommentsByArticleSlug :many
SELECT
    c.id,
    TO_CHAR(c.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS created_at,
    TO_CHAR(c.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"') AS updated_at,
    c.body,
    u.username,
    u.bio,
    u.image,
    FALSE AS following
FROM comments c
         JOIN users u ON c.user_id = u.id
WHERE c.article_id = (SELECT id FROM articles WHERE slug = $1);

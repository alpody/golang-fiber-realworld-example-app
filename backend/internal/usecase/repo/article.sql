-- article.sql

-- name: GetArticle :one
SELECT a.slug,
       a.title,
       a.description,
       a.body,
       a.created_at,
       a.updated_at,
       a.favorites_count,
       u.username                                                                                        AS username,
       u.bio                                                                                             AS bio,
       u.image                                                                                           AS image,
       ARRAY_AGG(t.tag)                                                                                  AS tag_list,
       (CASE WHEN EXISTS (SELECT 1 FROM favorites f WHERE f.article_id = a.id) THEN TRUE ELSE FALSE END) AS favorited,
       (CASE
            WHEN EXISTS (SELECT 1 FROM follows f WHERE f.follower_id = sqlc.narg('user_id') AND f.followee_id = u.id)
                THEN TRUE
            ELSE FALSE END)                                                                              AS following
FROM articles a
         JOIN users u ON a.author_id = u.id
         LEFT JOIN article_tags at ON a.id = at.article_id
         LEFT JOIN tags t ON at.tag_id = t.id
WHERE a.slug = $1
GROUP BY a.id, u.id;


-- name: CreateArticle :one
WITH inserted_article AS (
    INSERT INTO articles (slug, title, description, body, author_id)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id, slug, title, description, body, created_at, updated_at, favorites_count, author_id
),
     inserted_tags AS (
         INSERT INTO tags (tag)
             SELECT unnest(@tags::text[])
             ON CONFLICT (tag) DO NOTHING
             RETURNING id, tag
     ),
     all_tags AS (
         SELECT id, tag FROM inserted_tags
         UNION
         SELECT id, tag FROM tags WHERE tag = ANY(@tags)
     ),
     inserted_article_tags AS (
         INSERT INTO article_tags (article_id, tag_id)
             SELECT ia.id, t.id
             FROM inserted_article ia
                      CROSS JOIN all_tags t
             ON CONFLICT (article_id, tag_id) DO NOTHING
     )
SELECT
    ia.slug,
    ia.title,
    ia.description,
    ia.body,
    ia.created_at AS "createdAt",
    ia.updated_at AS "updatedAt",
    ia.favorites_count AS "favoritesCount",
    u.username,
    u.bio,
    u.image,
    array_agg(t.tag) AS tagList
FROM inserted_article ia
         JOIN users u ON ia.author_id = u.id
         LEFT JOIN article_tags at ON ia.id = at.article_id
         LEFT JOIN tags t ON at.tag_id = t.id
GROUP BY ia.id, ia.slug, ia.title, ia.description, ia.body, ia.created_at, ia.updated_at, ia.favorites_count, u.id, u.username, u.bio, u.image;

-- name: UpdateArticle :one
WITH updated_article AS (
    UPDATE articles
        SET slug = CASE WHEN @newslug::text IS NOT NULL AND @slug::text <> '' THEN @slug::text ELSE slug END,
            title = CASE WHEN @title::text IS NOT NULL AND @title::text <> '' THEN @title::text ELSE title END,
            description = CASE
                              WHEN @description::text IS NOT NULL AND @description::text <> '' THEN @description::text
                              ELSE description END,
            body = CASE WHEN @body::text IS NOT NULL AND @body::text <> '' THEN @body::text ELSE body END,
            updated_at = CURRENT_TIMESTAMP
        WHERE slug = $1 and author_id = $2
        RETURNING *)
SELECT ua.slug,
       ua.title,
       ua.description,
       ua.body,
       to_char(ua.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')                                              AS created_at,
       to_char(ua.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ')                                              AS updated_at,
       ua.favorites_count                                                                                 AS favorites_count,
       u.username,
       u.bio,
       u.image,
       (CASE WHEN EXISTS (SELECT 1 FROM favorites f WHERE f.article_id = ua.id) THEN TRUE ELSE FALSE END) AS favorited,
       ARRAY_AGG(t.tag)                                                                                   AS tagList
FROM updated_article ua
         JOIN
     users u ON ua.author_id = u.id
         LEFT JOIN
     article_tags at ON ua.id = at.article_id
         LEFT JOIN
     tags t ON at.tag_id = t.id
GROUP BY ua.id, ua.slug, ua.title, ua.description, ua.body, ua.created_at, ua.updated_at, ua.favorites_count, u.id, u.username, u.bio, u.image;


-- name: DeleteArticle :exec
DELETE
FROM articles
WHERE slug = $1
  and author_id = $2;


-- name: FavoriteArticle :one
-- filename: queries/articles.sql

-- Insert favorite and update article, then return article details along with author information and tags
-- name: FavoriteArticle :one
WITH article_id_cte AS (
    SELECT a.id, a.author_id
    FROM articles a
    WHERE a.slug = $1
),
     insert_favorite AS (
         INSERT INTO favorites (user_id, article_id)
             SELECT $2, a.id
             FROM article_id_cte a
             RETURNING article_id
     ),
     update_article AS (
         UPDATE articles
             SET favorites_count = favorites_count + 1
             WHERE id = (SELECT article_id FROM insert_favorite)
             RETURNING id, slug, title, description, body, created_at, updated_at, favorites_count, author_id
     ),
     taglist_cte AS (
         SELECT at.article_id, array_agg(t.tag) AS taglist
         FROM article_tags at
                  JOIN tags t ON at.tag_id = t.id
         WHERE at.article_id = (SELECT id FROM update_article)
         GROUP BY at.article_id
     )
SELECT
    ua.slug,
    ua.title,
    ua.description,
    ua.body,
    to_char(ua.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_at,
    to_char(ua.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS updated_at,
    ua.favorites_count,
    u.username,
    u.bio,
    u.image,
    TRUE AS favorited,
    EXISTS (
        SELECT 1
        FROM follows f
        WHERE f.follower_id = $2
          AND f.followee_id = ua.author_id
    ) AS following,
    COALESCE(tl.taglist, '{}') AS taglist
FROM update_article ua
         JOIN users u ON ua.author_id = u.id
         LEFT JOIN taglist_cte tl ON ua.id = tl.article_id;

-- name: UnfavoriteArticle :one
WITH article_id_cte AS (SELECT a.id, a.author_id
                        FROM articles a
                        WHERE a.slug = $1),
     delete_favorite AS (
         DELETE FROM favorites
             WHERE user_id = $2 AND article_id = (SELECT id FROM article_id_cte)
             RETURNING article_id),
     update_article AS (
         UPDATE articles
             SET favorites_count = GREATEST(favorites_count - 1, 0)
             WHERE id = (SELECT article_id FROM delete_favorite)
             RETURNING id, slug, title, description, body, created_at, updated_at, favorites_count, author_id),
     taglist_cte AS (SELECT at.article_id, array_agg(t.tag) AS taglist
                     FROM article_tags at
                              JOIN tags t ON at.tag_id = t.id
                     WHERE at.article_id = (SELECT id FROM update_article)
                     GROUP BY at.article_id)
SELECT ua.slug,
       ua.title,
       ua.description,
       ua.body,
       to_char(ua.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_at,
       to_char(ua.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS updated_at,
       ua.favorites_count,
       u.username,
       u.bio,
       u.image,
       EXISTS (SELECT 1
               FROM follows f
               WHERE f.follower_id = $2
                 AND f.followee_id = ua.author_id)           AS following,
       COALESCE(tl.taglist, '{}')                            AS taglist
FROM update_article ua
         JOIN
     users u ON ua.author_id = u.id
         LEFT JOIN
     taglist_cte tl ON ua.id = tl.article_id;

-- name: GetTags :many
SELECT tag
FROM tags;

-- name: ListArticles :many
SELECT a.slug,
       a.title,
       a.description,
       a.body,
       a.created_at                                    AS "createdAt",
       a.updated_at                                    AS "updatedAt",
       COALESCE(f.favorites_count, 0)                  AS "favoritesCount",
       u.username                                      AS "authorUsername",
       u.bio                                           AS "authorBio",
       u.image                                         AS "authorImage",
       COALESCE(fav.user_id IS NOT NULL, FALSE)        AS "favorited",
       ARRAY_AGG(t.tag ORDER BY t.tag)                 AS "tagList",
       COALESCE(follow.follower_id IS NOT NULL, FALSE) AS "following"
FROM articles a
         JOIN users u ON a.author_id = u.id
         LEFT JOIN article_tags at ON a.id = at.article_id
         LEFT JOIN tags t ON at.tag_id = t.id
         LEFT JOIN (SELECT article_id, COUNT(*) AS favorites_count FROM favorites GROUP BY article_id) f ON a.id = f.article_id
         LEFT JOIN favorites fav ON a.id = fav.article_id AND fav.user_id = sqlc.narg('user_id')::BIGINT
         LEFT JOIN follows follow ON u.id = follow.followee_id AND follow.follower_id = sqlc.narg('user_id')::BIGINT
GROUP BY a.id, u.id, f.favorites_count, fav.user_id, follow.follower_id
HAVING (sqlc.narg('tag')::TEXT IS NULL OR sqlc.narg('tag')::TEXT = ANY (ARRAY_AGG(t.tag)::TEXT[]))
   AND (sqlc.narg('author')::TEXT IS NULL OR u.username = sqlc.narg('author')::TEXT)
   AND (sqlc.narg('favorited_by')::TEXT IS NULL OR a.id IN (SELECT article_id
                                                            FROM favorites
                                                            WHERE user_id = (SELECT id
                                                                             FROM users
                                                                             WHERE username = sqlc.narg('favorited_by')::TEXT)))
ORDER BY a.created_at DESC
LIMIT sqlc.arg('limitt')::INT OFFSET sqlc.arg('offsett')::INT;

-- name: FeedArticles :many
WITH filtered_articles AS (SELECT a.*,
                                  u.username                   AS author_username,
                                  u.bio                        AS author_bio,
                                  u.image                      AS author_image,
                                  (CASE
                                       WHEN sqlc.narg(user_id)::int IS NULL THEN FALSE
                                       ELSE EXISTS (SELECT 1
                                                    FROM follows
                                                    WHERE follower_id = sqlc.narg(user_id)::int
                                                      AND followee_id = a.author_id)
                                      END)                     AS following,
                                  (SELECT ARRAY_AGG(t.tag)
                                   FROM tags t
                                            JOIN article_tags at ON t.id = at.tag_id
                                   WHERE at.article_id = a.id) AS tags,
                                  (CASE
                                       WHEN sqlc.narg(user_id)::int IS NULL THEN FALSE
                                       ELSE EXISTS (SELECT 1
                                                    FROM favorites
                                                    WHERE user_id = sqlc.narg(user_id)::int
                                                      AND article_id = a.id)
                                      END)                     AS favorited
                           FROM articles a
                                    LEFT JOIN users u ON a.author_id = u.id
                                    LEFT JOIN article_tags at ON a.id = at.article_id
                                    LEFT JOIN tags t ON at.tag_id = t.id
                                    LEFT JOIN favorites f ON a.id = f.article_id
                           GROUP BY a.id, u.username, u.bio, u.image, a.author_id)
SELECT fa.slug,
       fa.title,
       fa.description,
       fa.body,
       fa.tags                                               AS tag_list,
       to_char(fa.created_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS created_at,
       to_char(fa.updated_at, 'YYYY-MM-DD"T"HH24:MI:SS.MSZ') AS updated_at,
       fa.favorites_count,
       fa.favorited,
       fa.author_username                                    AS username,
       fa.author_bio                                         AS bio,
       fa.author_image                                       AS image,
       fa.following
FROM filtered_articles fa
ORDER BY fa.created_at DESC
LIMIT @limitt::int OFFSET @offsett::int;



-- user.sql

-- name: GetUser :one
SELECT email, bio, image, username
FROM users
WHERE id = $1;

-- name: UpdateUser :one
UPDATE users
SET email    = CASE WHEN @email::text IS NOT NULL AND @email::text <> '' THEN @email::text ELSE email END,
    username = CASE WHEN @username::text IS NOT NULL AND @username::text <> '' THEN @username::text ELSE username END,
    password = CASE WHEN @password::text IS NOT NULL AND @password::text <> '' THEN @password::text ELSE password END,
    image    = CASE WHEN @image::text IS NOT NULL AND @image::text <> '' THEN @image::text ELSE image END,
    bio      = CASE WHEN @bio::text IS NOT NULL AND @bio::text <> '' THEN @bio::text ELSE bio END
WHERE id = $1
RETURNING email, bio, image, username;


-- name: GetUserByEmail :one
SELECT *
FROM users
WHERE email = $1;

-- name: CreateUser :one
INSERT INTO users (email, username, password)
VALUES ($1, $2, $3)
RETURNING *;

-- name: GetUserProfile :one
WITH profile_data AS (
    SELECT
        u.username,
        u.bio,
        u.image,
        CASE
            WHEN f.follower_id IS NOT NULL THEN true
            ELSE false
            END AS following
    FROM users u
             LEFT JOIN follows f ON u.id = f.followee_id AND f.follower_id = sqlc.narg(follower_id)
    WHERE u.username = $1
)
SELECT
    username,
    bio,
    image,
    COALESCE(following, false) AS following
FROM profile_data;

-- name: GetUserProfileById :one
WITH profile_data AS (
    SELECT
        u.username,
        u.bio,
        u.image,
        CASE
            WHEN f.follower_id IS NOT NULL THEN true
            ELSE false
            END AS following
    FROM users u
             LEFT JOIN follows f ON u.id = f.followee_id AND f.follower_id = $2
    WHERE u.id = $1
)
SELECT
    username,
    bio,
    image,
    COALESCE(following, false) AS following
FROM profile_data;

-- name: FollowUser :one
WITH followee AS (
    SELECT id, username, bio, image FROM users WHERE username = $1
),
     insert_follow AS (
         INSERT INTO follows (follower_id, followee_id)
             SELECT $2, id FROM followee
             RETURNING followee_id
     )
SELECT
    f.username,
    f.bio,
    f.image,
    TRUE AS following
FROM followee f
WHERE f.id = (SELECT followee_id FROM insert_follow);

-- name: UnfollowUser :one
WITH followee AS (
    SELECT id, username, bio, image FROM users WHERE username = $1
),
     deleted_follow AS (
         DELETE FROM follows
             WHERE follower_id = $2 AND followee_id = (SELECT id FROM followee)
             RETURNING followee_id
     )
SELECT
    f.username,
    f.bio,
    f.image,
    FALSE AS following
FROM followee f
WHERE f.id = (SELECT followee_id FROM deleted_follow);
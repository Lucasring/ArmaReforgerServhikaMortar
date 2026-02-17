use crate::utils::get_unix_timestamp;

use serde::{Serialize};
use sqlx::{FromRow, PgConnection};

// This represents the User Table
#[derive(Serialize, FromRow, Debug)]
pub struct Users {
    pub id: i32,
    pub username: String,
    pub session_id: i32,
    pub is_active: bool,
    pub last_activity_time: i64,
}

pub async fn create_user(
    username : &str,
    session_id : i32,
    executor : &mut PgConnection
) -> Result<Users, sqlx::Error> {
    sqlx::query_as!(
        Users,
        r#"
            INSERT INTO users (username, is_active, last_activity_time, session_id)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (session_id, username)
            DO UPDATE SET 
                is_active = EXCLUDED.is_active,
                last_activity_time = EXCLUDED.last_activity_time
            RETURNING id, username, session_id, is_active, last_activity_time
        "#,
        username,
        true,
        get_unix_timestamp(),
        session_id,
    ).fetch_one(executor)
    .await
}

pub async fn get_user(
    username : &str,
    session_id : i32,
    executor : &mut PgConnection
) -> Result<Users, sqlx::Error> {
    sqlx::query_as!(
        Users,
        r#"
            SELECT * 
            FROM users
            WHERE username = $1 AND session_id = $2
        "#,
        username,
        session_id,
    ).fetch_one(executor)
    .await
}

pub async fn delete_user(
    user_id : i32,
    executor : &mut PgConnection,
) -> Result<Users, sqlx::Error> {
    sqlx::query_as!(
        Users,
        r#"
            DELETE FROM users
            WHERE id = $1
            RETURNING *
        "#,
        user_id
    ).fetch_one(executor)
    .await
}
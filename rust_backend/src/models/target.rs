use serde::{Serialize};
use sqlx::{FromRow, PgConnection};
use serde::{Deserialize};

#[derive(Serialize, FromRow, Debug)]
pub struct Target {
    pub id: i32,
    pub session_id: i32,
    pub user_id: i32,
    pub x: f32,
    pub y: f32,
}

#[derive(Deserialize)]
pub struct TargetCreateParams {
    pub session_id: i32,
    pub user_id: i32,
    pub x: f32,
    pub y: f32,
}

pub async fn upsert_target(
    user_id : i32,
    session_id : i32,
    target_point : (f32, f32),
    executor : &mut PgConnection
) -> Result<Target, sqlx::Error> {
    sqlx::query_as!(
        Target,
        r#"
            INSERT INTO target (session_id, user_id, x, y)
                VALUES ($1, $2, $3, $4)
            ON CONFLICT (session_id, user_id)
            DO UPDATE SET 
                x = EXCLUDED.x,
                y = EXCLUDED.y
            RETURNING id, session_id, user_id, x, y 
        "#,
        session_id,
        user_id,
        target_point.0,
        target_point.1,
    ).fetch_one(executor)
    .await
}

pub async fn get_all_targets_in_session(
    session_id : i32,
    executor : &mut PgConnection
) -> Result<Vec<Target>, sqlx::Error> {
    sqlx::query_as!(
        Target,
        r#"
            SELECT id, session_id, user_id, x, y
            FROM target
            WHERE session_id = $1
        "#,
        session_id
    ).fetch_all(executor)
    .await
}
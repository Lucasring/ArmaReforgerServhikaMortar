use serde::{Serialize, Deserialize};
use sqlx::{FromRow, PgConnection};


#[derive(Serialize, FromRow, Debug)]
pub struct SquadSession {
    pub id: i32,
    pub session_name: String,
}


#[derive(Deserialize)]
pub struct JoinSessionParams {
    pub session_name: String,
    pub user_name: String,
}

#[derive(Deserialize)]
pub struct LeaveSessionParams{
    pub user_id: i32,
}

pub async fn create_squad_session(
    sesion_name : &str,
    executor : &mut PgConnection
) -> Result<SquadSession, sqlx::Error> {
    sqlx::query_as!(
        SquadSession,
        r#"
            INSERT INTO squadsession (session_name)
                VALUES ($1)
            ON CONFLICT (session_name) DO UPDATE 
                SET session_name = EXCLUDED.session_name
                RETURNING id, session_name
        "#,
        sesion_name
    ).fetch_one(executor)
    .await
}

pub async fn get_squad_session_by_name(
    sesion_name : &str,
    executor : &mut PgConnection,
) -> Result<SquadSession, sqlx::Error> {
    sqlx::query_as!(
        SquadSession,
        r#"
            SELECT *
            FROM squadsession
            WHERE session_name = $1
        "#,
        sesion_name
    ).fetch_one(executor)
    .await
}

pub async fn get_squad_session_by_id(
    session_id : i32,
    executor : &mut PgConnection,
) -> Result<SquadSession, sqlx::Error> {
    sqlx::query_as!(
        SquadSession,
        r#"
            SELECT *
            FROM squadsession
            WHERE id = $1
        "#,
        session_id
    ).fetch_one(executor)
    .await
}
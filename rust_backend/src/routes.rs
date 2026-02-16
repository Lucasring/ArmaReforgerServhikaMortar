use crate::models::session::{SquadSession, JoinSessionParams, create_squad_session};
use crate::models::target::{Target, TargetCreateParams, upsert_target};
use crate::models::user::{Users, create_user};

use axum::extract::{State, Query};
use axum::{http::StatusCode, Json};
use sqlx::{PgPool};


pub async fn route_join_session(
    State(pool) : State<PgPool>,
    Json(params) : Json<JoinSessionParams>,
) -> Result<Json<serde_json::Value>, StatusCode> {

    let mut tx = pool.begin().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let session : SquadSession = create_squad_session(&params.session_name, &mut *tx)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let user : Users = create_user(&params.user_name, session.id, &mut *tx)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    tx.commit().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    // 3. Return both as JSON
    Ok(Json(serde_json::json!({
        "user": user,
        "session": session
    })))
}

pub async fn route_create_or_update_target(
    State(pool) : State<PgPool>,
    Json(params) : Json<TargetCreateParams>
) -> Result<Json<serde_json::Value>, StatusCode> {

    let mut tx = pool.begin().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let target : Target = upsert_target(
        params.user_id, 
        params.session_id, 
        (params.x, params.y), 
        &mut *tx
    ).await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "target": target,
    })))

}
use crate::models::session::{SquadSession, JoinSessionParams, LeaveSessionParams, GetSessionDataParams, create_squad_session};
use crate::models::target::{Target, TargetCreateParams, get_all_targets_in_session, upsert_target};
use crate::models::user::{Users, create_user, delete_user, get_all_users_in_session};

use axum::extract::{Query, State};
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

    Ok(Json(serde_json::json!({
        "user": user,
        "session": session
    })))
}

pub async fn route_leave_session(
    State(pool) : State<PgPool>,
    Json(params) : Json<LeaveSessionParams>,
) -> Result<Json<serde_json::Value>, StatusCode> {

    let mut tx = pool.begin().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let deleted_user : Users = delete_user(params.user_id, &mut *tx)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    tx.commit().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "user": deleted_user
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

    tx.commit().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "target": target,
    })))

}

pub async fn route_get_session_data(
    State(pool) : State<PgPool>,
    Query(params) : Query<GetSessionDataParams>
) -> Result<Json<serde_json::Value>, StatusCode> {
    
    let mut tx = pool.begin().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let targets = get_all_targets_in_session(params.session_id, &mut *tx)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    let users = get_all_users_in_session(params.session_id, &mut *tx)
        .await
        .map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    tx.commit().await.map_err(|_| StatusCode::INTERNAL_SERVER_ERROR)?;

    Ok(Json(serde_json::json!({
        "targets": targets,
        "users": users,
    })))

}

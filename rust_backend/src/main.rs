use rust_backend::routes::{
    route_create_or_update_target, route_get_session_data, route_join_session, route_leave_session
};

use axum::{routing::post, Router};
use sqlx::{PgPool};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    // Load .env file (needs a DATABASE_URL=postgres://...)
    dotenvy::dotenv().ok();
    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Create the DB Pool
    let pool = PgPool::connect(&db_url).await.expect("Failed to connect to DB");

    // Build our application with a single route
    let app = Router::new()
        .route("/api/join-session", post(route_join_session))
        .route("/api/leave-session", post(route_leave_session))
        .route("/api/get-session-data", post(route_get_session_data))
        .route("/api/add-target", post(route_create_or_update_target))
        .with_state(pool);

    // Start the server
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));
    println!("Server listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
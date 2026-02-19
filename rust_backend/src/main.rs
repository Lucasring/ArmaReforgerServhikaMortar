use rust_backend::routes::{
    route_create_or_update_target, route_get_session_data, route_join_session, route_leave_session
};

use tracing_subscriber::{layer::SubscriberExt, util::SubscriberInitExt};
use axum::{routing::post, routing::get, Router};
use sqlx::{PgPool};
use std::net::SocketAddr;

#[tokio::main]
async fn main() {
    // Load .env file (needs a DATABASE_URL=postgres://...)
    dotenvy::dotenv().ok();

    // Set up the logging system
    tracing_subscriber::registry()
        .with(tracing_subscriber::EnvFilter::try_from_default_env()
            .unwrap_or_else(|_| "rust_backend=debug,tower_http=debug".into()))
        .with(tracing_subscriber::fmt::layer())
        .init();

    let db_url = std::env::var("DATABASE_URL").expect("DATABASE_URL must be set");

    // Create the DB Pool
    let pool = PgPool::connect(&db_url).await.expect("Failed to connect to DB");

    // Run Migrations
    tracing::info!("Running database migrations...");
    sqlx::migrate!("./migrations")
        .run(&pool)
        .await
        .expect("Failed to run migrations");
    tracing::info!("Migration successful");

    // Build our application with a single route
    let app = Router::new()
        .route("/api/join-session", post(route_join_session))
        .route("/api/leave-session", post(route_leave_session))
        .route("/api/get-session-data", get(route_get_session_data))
        .route("/api/add-target", post(route_create_or_update_target))
        .layer(tower_http::trace::TraceLayer::new_for_http())
        .with_state(pool);

    // Start the server
    let addr = SocketAddr::from(([0, 0, 0, 0], 8000));
    tracing::info!("Server listening on {}", addr);
    let listener = tokio::net::TcpListener::bind(addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}
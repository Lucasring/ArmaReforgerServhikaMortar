use rust_backend::models::user::{Users, create_user, delete_user};
use rust_backend::models::session::{SquadSession, create_squad_session};
use rust_backend::models::target::{Target, upsert_target};

#[sqlx::test]
async fn test_upsert_target_updates_existing(pool: sqlx::PgPool) {
    let mut conn = pool.acquire().await.unwrap();

    // 1. Create a session first (since Target needs a session_id)
    let session : SquadSession = create_squad_session("test_room", &mut conn).await.unwrap();
    let user : Users = create_user("user", session.id, &mut conn).await.unwrap();

    // 2. Insert first target
    let first_point = (100.0, 200.0);
    let result : Target = upsert_target(user.id, session.id, first_point, &mut conn).await.unwrap();
    assert_eq!(result.x, 100.0);
    assert_eq!(result.y, 200.0);

    // 3. Insert second target for SAME user/session (The Conflict)
    let second_point = (500.0, 600.0);
    let result : Target = upsert_target(user.id, session.id, second_point, &mut conn).await.unwrap();
    assert_eq!(result.x, 500.0);
    assert_eq!(result.y, 600.0);
    
    // Check row count in table to prove it didn't create a second one
    let count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM target WHERE user_id = $1", user.id)
        .fetch_one(&mut *conn)
        .await
        .unwrap()
        .unwrap();
        
    assert_eq!(count, 1);
}

#[sqlx::test]
async fn test_delete_only_user_from_session(pool: sqlx::PgPool) {
    let mut conn = pool.acquire().await.unwrap();

    // 1. Create a session first (since Target needs a session_id)
    let session : SquadSession = create_squad_session("test_room", &mut conn).await.unwrap();
    let user : Users = create_user("user", session.id, &mut conn).await.unwrap();

    // 2. Add a target for the User
    let point = (500.0, 600.0);
    let target : Target = upsert_target(user.id, session.id, point, &mut conn).await.unwrap();

    // 3. Remove the User from the Session
    let removed_user : Users = delete_user(user.id, &mut conn).await.unwrap();
    assert_eq!(user.id, removed_user.id);

    // 4. Check that the target was removed
    let target_count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM target WHERE id = $1", target.id)
        .fetch_one(&mut *conn)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(target_count, 0);

    // 5. Check that the user was removed
    let user_count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM users WHERE id = $1", user.id)
        .fetch_one(&mut *conn)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(user_count, 0);

    // 6. Check that the session was removed
    let session_count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM squadsession WHERE id = $1", session.id)
        .fetch_one(&mut *conn)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(session_count, 0);

}

#[sqlx::test]
async fn test_delete_user_from_session(pool: sqlx::PgPool) {
    let mut conn = pool.acquire().await.unwrap();

    // 1. Create a session first (since Target needs a session_id)
    let session : SquadSession = create_squad_session("test_room", &mut conn).await.unwrap();
    let user1 : Users = create_user("user1", session.id, &mut conn).await.unwrap();
    let _user2 : Users = create_user("user2", session.id, &mut conn).await.unwrap();

    // 2. Add a target for the User
    let point = (500.0, 600.0);
    let target : Target = upsert_target(user1.id, session.id, point, &mut conn).await.unwrap();

    // 3. Remove the User from the Session
    let removed_user : Users = delete_user(user1.id, &mut conn).await.unwrap();
    assert_eq!(user1.id, removed_user.id);

    // 4. Check that the target was removed
    let target_count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM target WHERE id = $1", target.id)
        .fetch_one(&mut *conn)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(target_count, 0);

    // 5. Check that the user was removed
    let user_count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM users WHERE id = $1", user1.id)
        .fetch_one(&mut *conn)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(user_count, 0);

    // 6. Check that the session was removed
    let session_count: i64 = sqlx::query_scalar!("SELECT COUNT(*) FROM squadsession WHERE id = $1", session.id)
        .fetch_one(&mut *conn)
        .await
        .unwrap()
        .unwrap();

    assert_eq!(session_count, 1);

}
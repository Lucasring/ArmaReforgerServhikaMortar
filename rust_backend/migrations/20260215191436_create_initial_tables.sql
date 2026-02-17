CREATE TABLE squadsession (
    id SERIAL PRIMARY KEY,
    session_name TEXT NOT NULL UNIQUE
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username TEXT NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_activity_time BIGINT NOT NULL,
    session_id INTEGER NOT NULL REFERENCES squadsession(id) ON DELETE CASCADE,

    CONSTRAINT unique_user_in_session UNIQUE (session_id, username)
);

CREATE TABLE target (
    id SERIAL PRIMARY KEY,
    x REAL NOT NULL,
    y REAL NOT NULL,
    session_id INTEGER NOT NULL REFERENCES squadsession(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,

    CONSTRAINT unique_target_per_user UNIQUE (session_id, user_id)
)
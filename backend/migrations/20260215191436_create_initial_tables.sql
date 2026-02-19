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
    session_id INTEGER NOT NULL REFERENCES squadsession(id) ON DELETE CASCADE,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    x REAL NOT NULL,
    y REAL NOT NULL,

    CONSTRAINT unique_target_per_user UNIQUE (session_id, user_id)
);

CREATE FUNCTION delete_empty_session()
RETURNS TRIGGER AS $$
BEGIN
    -- Check if any users remain for the session being left
    IF NOT EXISTS (SELECT 1 FROM users WHERE session_id = OLD.session_id) THEN
        DELETE FROM squadsession WHERE id = OLD.session_id;
    END IF;
    RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_delete_empty_session
AFTER DELETE OR UPDATE OF session_id ON users
FOR EACH ROW
EXECUTE FUNCTION delete_empty_session();
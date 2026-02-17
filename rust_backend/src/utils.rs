use std::time::{SystemTime, UNIX_EPOCH};

pub fn get_unix_timestamp() -> i64 {
    let system_time = SystemTime::now();
    let unix_time = system_time.duration_since(UNIX_EPOCH).expect("Invalid time");
    return unix_time.as_secs() as i64; 
}

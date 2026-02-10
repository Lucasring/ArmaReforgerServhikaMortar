from fastapi.security import APIKeyHeader

session_key = APIKeyHeader(name='X-SESSION-KEY')
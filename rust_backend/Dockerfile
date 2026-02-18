# --- Stage 1: Build ---
FROM rust:slim AS builder

# Create a dummy project to cache dependencies
RUN USER=root cargo new --bin rust_backend
WORKDIR /rust_backend

# Copy manifests and build dependencies (this layer is cached)
COPY ./Cargo.toml ./
COPY ./.sqlx ./.sqlx
ENV SQLX_OFFLINE=true

RUN cargo build --release
RUN rm src/*.rs

# Copy actual source code and build for real
COPY ./src ./src
RUN touch src/main.rs
RUN cargo build --release

# --- Stage 2: Run ---
FROM debian:bookworm-slim

# Install OpenSSL and CA certificates (needed for SQLx/Postgres)
RUN apt-get update && apt-get install -y libssl-dev ca-certificates && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy the binary from the builder stage
COPY --from=builder /rust_backend/target/release/rust_backend .

# Expose the port your Axum app is listening on
EXPOSE 8000

# Run the binary
CMD ["./rust_backend"]
#!/bin/bash

# Setup Python
pip install -r backend/requirements.txt

# Setup Frontend
cd frontend
npm install

# Setup Rust
cargo install sqlx-cli --no-default-features --features postgres

echo "Setup complete! Ready to calculate some mortar trajectories."
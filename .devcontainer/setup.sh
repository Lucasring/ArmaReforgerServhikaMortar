#!/bin/bash

# Setup Python
python -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt

# Setup Frontend
cd mortar-app-frontend
npm install

echo "Setup complete! Ready to calculate some mortar trajectories."
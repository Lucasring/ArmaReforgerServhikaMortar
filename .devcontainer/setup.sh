#!/bin/bash

# Setup Python
pip install -r backend/requirements.txt

# Setup Frontend
cd mortar-app-frontend
npm install

echo "Setup complete! Ready to calculate some mortar trajectories."
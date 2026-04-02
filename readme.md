# Setup Guide

This project uses Python with a virtual environment.  
The following steps describe the installation and execution for **Linux/macOS** and **Windows**.

---

## Prerequisites
- Python 3.9 or newer  
- pip installed  
- Git (optional, if you are cloning the repository)  

---

## Installation & Execution

### Linux / macOS
```bash
# Create virtual environment
python3 -m venv venv

# Activate virtual environment
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initial run (download files)
python agent_worker.py download-files

# Start development mode
python agent_worker.py dev

--------

* Windows (PowerShell)

# Create virtual environment
python -m venv venv

# Activate virtual environment
.\venv\Scripts\Activate.ps1

# Install dependencies
pip install -r requirements.txt

# Initial run (download files)
python agent_worker.py download-files

# Start development mode
python agent_worker.py dev


---------

# Info
In the `requirements.txt` we also install **Rime** and **Deepgram**.  
These are only needed if you want to switch from the Realtime API  
to the standard mode using a transcribing model and a text-to-speech model.

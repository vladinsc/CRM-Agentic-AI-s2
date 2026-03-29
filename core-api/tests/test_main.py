from fastapi.testclient import TestClient
import sys

from main import app 

client = TestClient(app)

def test_app_initializes_and_dependencies_load():

    response = client.get("/")
    assert response.status_code == 200

def test_python_version():
    """Ensures the server is running the expected Python version."""
    assert sys.version_info >= (3, 11)
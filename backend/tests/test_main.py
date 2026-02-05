def test_root(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "running"
    assert "message" in data


def test_health(client):
    response = client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


def test_api_info(client):
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "Microservices CI/CD Demo"
    assert data["version"] == "1.0.0"
    assert "environment" in data


def test_api_items(client):
    response = client.get("/api/items")
    assert response.status_code == 200
    data = response.json()
    assert "items" in data
    assert len(data["items"]) == 4
    assert data["items"][0]["name"] == "Docker"

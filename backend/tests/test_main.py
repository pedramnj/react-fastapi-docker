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
    assert data["database"] == "connected"


def test_api_info(client):
    response = client.get("/api/info")
    assert response.status_code == 200
    data = response.json()
    assert data["app"] == "Microservices CI/CD Demo"
    assert data["version"] == "1.0.0"
    assert "environment" in data
    assert "total_visits" in data


def test_api_items(client):
    response = client.get("/api/items")
    assert response.status_code == 200
    data = response.json()
    assert len(data) == 4
    assert data[0]["name"] == "Docker"


def test_create_item(client):
    response = client.post(
        "/api/items",
        json={"name": "Kubernetes", "description": "Container orchestration"},
    )
    assert response.status_code == 201
    data = response.json()
    assert data["name"] == "Kubernetes"
    assert data["id"] is not None


def test_delete_item(client):
    response = client.delete("/api/items/1")
    assert response.status_code == 204

    response = client.get("/api/items")
    data = response.json()
    assert len(data) == 3


def test_api_stats(client):
    response = client.get("/api/stats")
    assert response.status_code == 200
    data = response.json()
    assert data["total_items"] == 4
    assert data["total_visits"] == 0

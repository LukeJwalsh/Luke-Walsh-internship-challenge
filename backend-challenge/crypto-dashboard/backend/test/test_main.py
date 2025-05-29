import pytest
from httpx import AsyncClient
from httpx._transports.asgi import ASGITransport
from ..main import app 

# Test a valid crypto query
@pytest.mark.asyncio
async def test_valid_crypto_search():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/crypto?query=bitcoin&days=1")
        assert response.status_code == 200
        data = response.json()
        assert "price_usd" in data
        assert "history" in data
        assert isinstance(data["history"], list)

# Test an invalid/non-existent crypto query
@pytest.mark.asyncio
async def test_invalid_crypto_search():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/crypto?query=notarealcoin&days=1")
        assert response.status_code == 404
        assert response.json()["detail"] == "Cryptocurrency not found"

# Test a missing required query parameter
@pytest.mark.asyncio
async def test_missing_query_param():
    async with AsyncClient(
        transport=ASGITransport(app=app),
        base_url="http://test"
    ) as ac:
        response = await ac.get("/crypto")
        assert response.status_code == 422 

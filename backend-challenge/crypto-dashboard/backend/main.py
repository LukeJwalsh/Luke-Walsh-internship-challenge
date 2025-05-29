from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import httpx

app = FastAPI()

# Enable CORS to allow frontend to make API requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/crypto")
async def get_crypto(query: str, days: int = 7):
    """
    Fetches crypto price stats and historical data for the given query.
    Params:
        - query: User input (name, symbol, or ID of the crypto)
        - days: Number of days for historical chart (default = 7)
    """

    async with httpx.AsyncClient() as client:

        # Get full list of supported coins
        coin_list_response = await client.get("https://api.coingecko.com/api/v3/coins/list")
        coin_list = coin_list_response.json()

        # Find the coin that matches the query (by ID, name, or symbol)
        user_query = query.lower()
        matched_coin = next(
            (
                coin for coin in coin_list
                if user_query in [coin["id"].lower(), coin["symbol"].lower(), coin["name"].lower()]
            ),
            None
        )

        if not matched_coin:
            raise HTTPException(status_code=404, detail="Cryptocurrency not found")

        coin_id = matched_coin["id"]

        # Get current price, 24h change and volume
        price_url = "https://api.coingecko.com/api/v3/simple/price"
        price_params = {
            "ids": coin_id,
            "vs_currencies": "usd",
            "include_24hr_change": "true",
            "include_24hr_vol": "true"
        }
        price_response = await client.get(price_url, params=price_params)
        coin_data = price_response.json()

        # Get historical market data for the selected day range
        history_url = f"https://api.coingecko.com/api/v3/coins/{coin_id}/market_chart"
        history_params = {
            "vs_currency": "usd",
            "days": days
        }
        history_response = await client.get(history_url, params=history_params)
        history_data = history_response.json()

        # Handle possible rate limit or API error
        if "status" in history_data:
            print("Unexpected response for historical data:", history_data)
            raise HTTPException(status_code=500, detail="Failed to fetch historical price data")

        # Return structured JSON response to frontend
        return {
            "id": coin_id,
            "symbol": matched_coin["symbol"],
            "name": matched_coin["name"],
            "price_usd": coin_data[coin_id]["usd"],
            "percent_change_24h": coin_data[coin_id]["usd_24h_change"],
            "volume_24h_usd": coin_data[coin_id]["usd_24h_vol"],
            "history": history_data["prices"]
        }

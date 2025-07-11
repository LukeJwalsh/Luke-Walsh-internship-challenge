# Author: Luke Walsh

# Crypto Dashboard API

A lightweight REST API that accepts a cryptocurrency name or symbol, fetches live and historical data from CoinGecko, and returns summary statistics such as current price, 24h change, volume, and historical prices.

---

## Tech Stack

- **Backend Framework**: FastAPI (Python)
- **HTTP Client**: httpx (async)
- **Data Source**: CoinGecko API
- **Testing**: pytest, pytest-asyncio, httpx
- **Frontend/Chart Display**: React + Chart.js

---

## Project Structure

```text
backend-challenge/
├── main.py             # FastAPI application
├── test/
│   └── test_main.py    # Test suite with 3 functional tests
└── requirements.txt    # Dependencies
```


---

## How to Run & Test Locally

### 1. Download the Repository

```text
cd backend-challenge/crypto-dashboard
```
### 2. Install Dependencies

npm install

### 3. Setup the virtual enviroment and Run the FastAPI Server

```text
in a new terminal run:
cd backend-challenge
python -m venv .venv
source .venv/bin/activate  
or 
 .venv\Scripts\activate on Windows
pip install -r requirements.txt
cd crypto-dashboard/backend
uvicorn main:app --reload
```

### 4. Run the App Locally

```text
In the crypto-dashboard folder run:
npm run dev
```
## Example API Usage

### Valid Request

curl "http://localhost:8000/crypto?query=bitcoin&days=7"

Query Parameters:
- query: name, symbol, or ID of a cryptocurrency (e.g., btc, ethereum)
- days: history range in days (1, 7, 30)

### Example Response
```text
{
  "id": "bitcoin",
  "symbol": "btc",
  "name": "Bitcoin",
  "price_usd": 68901.11,
  "percent_change_24h": -1.53,
  "volume_24h_usd": 20541820221,
  "history": [
    [timestamp, price],
    ...
  ]
}
```
## Backend Tests

### Run Tests with Pytest

```text
while in the backend folder, run the next line in the terminal:
pytest
```

### Tests include

- Valid crypto search
- Invalid crypto name
- Missing query parameter

## Dependencies
- fastapi
- uvicorn
- httpx
- pytest
- pytest-asyncio

## If I Had More Time

- Implement local storage to avoid CoinGecko rate limits
- Build a Docker container for deployment
- Add a database for user search history analytics
- Add a history tab so users can quickly look at the coins their interested in 
- Add a notification system to alert the user when the price drops or goes beloe a selected price

## Note
The api limit gets reached very quickly because we're accessing the price history, which causes the server to fail, and if the limit is reached, it will cause the backend   tests to auto fail as well

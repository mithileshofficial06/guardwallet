import openai
from datetime import datetime, timedelta
import json

class CashflowPredictor:
    def __init__(self, api_key):
        self.api_key = api_key
        openai.api_key = api_key
    
    def predict_next_month(self, wallet_address):
        """Predict cashflow for next 30 days using GPT-4"""
        
        # In production, fetch actual transaction history
        # For demo, using mock data
        transaction_history = self._get_transaction_history(wallet_address)
        
        prompt = f"""
        Analyze this wallet's transaction history and predict next 30 days:
        
        Transaction History (last 90 days):
        {json.dumps(transaction_history, indent=2)}
        
        Provide prediction in JSON format:
        {{
            "total_income": <predicted_income>,
            "total_expenses": <predicted_expenses>,
            "recurring_payments": [
                {{"recipient": "address", "amount": <amount>, "frequency": "monthly"}}
            ],
            "suggested_protection": <amount_to_protect>,
            "risk_level": "low/medium/high",
            "reasoning": "explanation"
        }}
        """
        
        try:
            response = openai.ChatCompletion.create(
                model="gpt-4",
                messages=[
                    {"role": "system", "content": "You are a financial analyst specializing in cashflow prediction."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.3
            )
            
            prediction = json.loads(response.choices[0].message.content)
            return prediction
            
        except Exception as e:
            print(f"Prediction error: {e}")
            return self._default_prediction()
    
    def _get_transaction_history(self, wallet_address):
        """Fetch transaction history - mock for demo"""
        # In production, use web3.py to fetch real transactions
        return [
            {
                "date": "2026-05-15",
                "type": "expense",
                "amount": 50,
                "recipient": "Netflix",
                "category": "subscription"
            },
            {
                "date": "2026-05-10",
                "type": "income",
                "amount": 2000,
                "sender": "Salary",
                "category": "income"
            },
            {
                "date": "2026-05-05",
                "type": "expense",
                "amount": 800,
                "recipient": "Rent",
                "category": "recurring"
            }
        ]
    
    def _default_prediction(self):
        """Fallback prediction if AI fails"""
        return {
            "total_income": 2000,
            "total_expenses": 1200,
            "recurring_payments": [],
            "suggested_protection": 800,
            "risk_level": "low",
            "reasoning": "Default prediction based on conservative estimates"
        }
    
    def identify_patterns(self, transactions):
        """Identify spending patterns"""
        patterns = {
            "recurring": [],
            "subscriptions": [],
            "one_time": []
        }
        
        # Simple pattern detection
        frequency_map = {}
        for tx in transactions:
            key = f"{tx['recipient']}_{tx['amount']}"
            frequency_map[key] = frequency_map.get(key, 0) + 1
        
        for key, count in frequency_map.items():
            if count >= 2:
                recipient, amount = key.split('_')
                patterns["recurring"].append({
                    "recipient": recipient,
                    "amount": float(amount),
                    "frequency": count
                })
        
        return patterns

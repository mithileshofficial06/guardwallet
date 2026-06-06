from datetime import datetime, timedelta
from web3 import Web3
import os

class DailyBudgetEngine:
    def __init__(self, wallet_address, contract_address, rpc_url):
        self.wallet_address = wallet_address
        self.contract_address = contract_address
        self.w3 = Web3(Web3.HTTPProvider(rpc_url))
        
    def calculate_daily_budget(self, available_balance, days_until_salary):
        """Calculate safe daily spending amount"""
        if days_until_salary == 0:
            days_until_salary = 1
        
        daily_budget = available_balance / days_until_salary
        
        return {
            'daily_budget': round(daily_budget, 2),
            'days_remaining': days_until_salary,
            'total_available': available_balance,
            'recommended_spending': round(daily_budget * 0.9, 2)  # 90% buffer
        }
    
    def track_daily_spending(self):
        """Track spending for current day"""
        # Get today's transactions
        today_start = datetime.now().replace(hour=0, minute=0, second=0, microsecond=0)
        today_start_timestamp = int(today_start.timestamp())
        
        # In production, fetch actual transactions from blockchain
        # For demo, returning mock data
        today_spending = 45.50
        
        return today_spending
    
    def adjust_budget(self, budget, spent, overspent_amount):
        """Adjust future budgets if user overspent"""
        if overspent_amount > 0:
            # Reduce tomorrow's budget by half the overspent amount
            adjustment = overspent_amount / 2
            new_budget = max(budget - adjustment, budget * 0.5)  # Don't reduce by more than 50%
            
            return {
                'original_budget': budget,
                'adjusted_budget': round(new_budget, 2),
                'adjustment_reason': f'Adjusted due to ${overspent_amount} overspending',
                'savings_needed': round(overspent_amount, 2)
            }
        
        return {
            'original_budget': budget,
            'adjusted_budget': budget,
            'adjustment_reason': 'No adjustment needed',
            'savings_needed': 0
        }
    
    def get_spending_insights(self, transaction_history):
        """Analyze spending patterns"""
        categories = {}
        total_spent = 0
        
        for tx in transaction_history:
            category = tx.get('category', 'other')
            amount = tx.get('amount', 0)
            
            if category not in categories:
                categories[category] = 0
            categories[category] += amount
            total_spent += amount
        
        # Find highest spending category
        if categories:
            highest_category = max(categories.items(), key=lambda x: x[1])
        else:
            highest_category = ('none', 0)
        
        return {
            'total_spent': round(total_spent, 2),
            'categories': categories,
            'highest_spending_category': highest_category[0],
            'highest_spending_amount': round(highest_category[1], 2),
            'average_per_transaction': round(total_spent / len(transaction_history), 2) if transaction_history else 0
        }
    
    def generate_survival_tips(self, budget_status):
        """Generate helpful tips based on budget status"""
        tips = []
        
        if budget_status['percentage_used'] > 80:
            tips.append("You've used 80% of today's budget. Consider postponing non-essential purchases.")
            tips.append("Cook at home instead of ordering food to save money.")
        
        if budget_status['percentage_used'] > 100:
            tips.append("⚠️ You've exceeded today's budget. Tomorrow's budget will be adjusted.")
            tips.append("Try the 24-hour rule: wait 24 hours before making any purchase over $20.")
        
        if budget_status['days_remaining'] <= 3:
            tips.append("Only 3 days until salary! You're almost there. Stay disciplined.")
        
        return tips

if __name__ == "__main__":
    # Example usage
    engine = DailyBudgetEngine(
        wallet_address=os.getenv("WALLET_ADDRESS"),
        contract_address=os.getenv("CONTRACT_ADDRESS"),
        rpc_url=os.getenv("RPC_URL")
    )
    
    budget_info = engine.calculate_daily_budget(
        available_balance=380,
        days_until_salary=12
    )
    
    print("Daily Budget:", budget_info)

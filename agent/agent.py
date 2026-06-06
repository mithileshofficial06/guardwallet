import os
from dotenv import load_dotenv
from cdp_agentkit_core.actions import CdpAction
from langchain_openai import ChatOpenAI
from langchain.agents import AgentExecutor, create_openai_functions_agent
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from predictor import CashflowPredictor
from notifier import NotificationService
from daily_budget_engine import DailyBudgetEngine
import schedule
import time
from web3 import Web3

load_dotenv()

class GuardWalletAgent:
    def __init__(self):
        self.openai_key = os.getenv("OPENAI_API_KEY")
        self.wallet_address = os.getenv("WALLET_ADDRESS")
        self.contract_address = os.getenv("CONTRACT_ADDRESS")
        self.rpc_url = os.getenv("RPC_URL")
        
        self.w3 = Web3(Web3.HTTPProvider(self.rpc_url))
        self.predictor = CashflowPredictor(self.openai_key)
        self.notifier = NotificationService()
        self.budget_engine = DailyBudgetEngine(
            self.wallet_address, 
            self.contract_address, 
            self.rpc_url
        )
        
        self.llm = ChatOpenAI(
            model="gpt-4",
            temperature=0.7,
            api_key=self.openai_key
        )
        
        self.setup_agent()
        
    def setup_agent(self):
        """Initialize the AI agent with tools"""
        prompt = ChatPromptTemplate.from_messages([
            ("system", """You are GuardWallet AI, a smart financial assistant that:
            1. Monitors user's wallet balance and transaction history
            2. Predicts upcoming expenses based on patterns
            3. Recommends how much to protect vs keep available
            4. Alerts user when balance is low or emergency needed
            5. Suggests autopay setups for recurring payments
            
            Be proactive, helpful, and financially responsible."""),
            MessagesPlaceholder(variable_name="chat_history"),
            ("user", "{input}"),
            MessagesPlaceholder(variable_name="agent_scratchpad"),
        ])
        
        # In production, add actual tools from Coinbase AgentKit
        tools = []
        
        self.agent = create_openai_functions_agent(self.llm, tools, prompt)
        self.executor = AgentExecutor(agent=self.agent, tools=tools, verbose=True)
    
    def analyze_wallet(self):
        """Analyze wallet and make recommendations"""
        try:
            balance = self.w3.eth.get_balance(self.wallet_address)
            balance_eth = self.w3.from_wei(balance, 'ether')
            
            print(f"Current balance: {balance_eth} ETH")
            
            # Get cashflow prediction
            prediction = self.predictor.predict_next_month(self.wallet_address)
            
            # Make recommendation
            recommendation = self.make_recommendation(balance_eth, prediction)
            
            # Send notification if needed
            if recommendation['alert']:
                self.notifier.send_alert(
                    self.wallet_address,
                    recommendation['message']
                )
            
            return recommendation
            
        except Exception as e:
            print(f"Error analyzing wallet: {e}")
            return None
    
    def make_recommendation(self, current_balance, prediction):
        """Use AI to make protection recommendation"""
        prompt = f"""
        User's current balance: {current_balance} USDC
        Predicted expenses next 30 days: {prediction['total_expenses']} USDC
        Predicted income next 30 days: {prediction['total_income']} USDC
        
        Based on this data:
        1. How much should user protect in vault?
        2. How much should stay available?
        3. Is there any risk of running low?
        4. Should user set up any autopays?
        
        Provide specific numbers and reasoning.
        """
        
        response = self.llm.invoke(prompt)
        
        # Parse response and structure recommendation
        return {
            'protect_amount': prediction['suggested_protection'],
            'available_amount': current_balance - prediction['suggested_protection'],
            'alert': prediction['risk_level'] == 'high',
            'message': response.content,
            'autopay_suggestions': prediction['recurring_payments']
        }
    
    def monitor_loop(self):
        """Run continuous monitoring"""
        print("Starting GuardWallet AI Agent...")
        
        # Schedule checks every 6 hours
        schedule.every(6).hours.do(self.analyze_wallet)
        
        # Run once immediately
        self.analyze_wallet()
        
        while True:
            schedule.run_pending()
            time.sleep(60)

if __name__ == "__main__":
    agent = GuardWalletAgent()
    agent.monitor_loop()

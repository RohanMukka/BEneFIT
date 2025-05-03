
from web3 import Web3
from datetime import datetime, timedelta
import pandas as pd
import time

# --- Setup ---
RPC_URL = "https://eth-mainnet.g.alchemy.com/v2/YayMjdU1gXV402C7SKDiZdDRrayajaZ4"
web3 = Web3(Web3.HTTPProvider(RPC_URL))

CONTRACTS = {
    "Stepn_GST": "0x473037de59cf9484632f4a27b509cfe8d4a31404",
    "Sweatcoin_SWEAT": "0xb4b9dc1c77bdbb135ea907fd5a08094d98883a35"
}

TRANSFER_TOPIC = "0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef"
STEP = 2000
MAX_EVENTS = 1000

# --- Estimate START_BLOCK from 6 months ago ---
end_block = web3.eth.block_number
end_time = datetime.utcnow()
start_time = end_time - timedelta(days=30*6)

# Use binary search to find block closest to start_time
def find_block_by_timestamp(target_time):
    low = 0
    high = end_block

    while low < high:
        mid = (low + high) // 2
        block = web3.eth.get_block(mid)
        block_time = datetime.utcfromtimestamp(block.timestamp)

        if block_time < target_time:
            low = mid + 1
        else:
            high = mid
    return low

start_block = find_block_by_timestamp(start_time)
print(f"⏱ 6-month block range: {start_block} to {end_block}")

# --- Fast fetch using get_logs ---
def fetch_logs_fast(contract_name, address, max_events=1000):
    events = []
    print(f"🔍 Scanning {contract_name}...")

    for start in range(start_block, end_block, STEP):
        end = min(start + STEP - 1, end_block)
        try:
            logs = web3.eth.get_logs({
                "address": Web3.to_checksum_address(address),
                "fromBlock": start,
                "toBlock": end,
                "topics": [TRANSFER_TOPIC]
            })

            for log in logs:
                tx_hash = log["transactionHash"]
                receipt = web3.eth.get_transaction_receipt(tx_hash)
                tx = web3.eth.get_transaction(tx_hash)
                block = web3.eth.get_block(log["blockNumber"])

                events.append({
                    "contract": contract_name,
                    "block": log["blockNumber"],
                    "timestamp": datetime.fromtimestamp(block.timestamp),
                    "txHash": tx_hash.hex(),
                    "from": tx["from"],
                    "to": tx["to"],
                    "gasUsed": receipt.gasUsed,
                    "gasPrice": tx.gasPrice,
                    "status": receipt.status,
                })

                if len(events) >= max_events:
                    return events
        except Exception as e:
            print(f"⚠️ Error at blocks {start}-{end}: {e}")
            time.sleep(1)
            continue
    return events

# --- Run for all contracts ---
all_logs = []
for name, addr in CONTRACTS.items():
    all_logs += fetch_logs_fast(name, addr, MAX_EVENTS)

df = pd.DataFrame(all_logs)
df.to_csv("erc20_logs_fast.csv", index=False)
print("✅ Saved to erc20_logs_fast.csv")

import pandas as pd

# Load the uploaded ERC20 logs file
file_path = "/content/erc20_logs_fast.csv"
df = pd.read_csv(file_path)

# Display the first few rows and column names to inspect structure
df.head(), df.columns.tolist()

import matplotlib.pyplot as plt

# Create a basic comparison table using pandas DataFrame
comparison_data = {
    "Metric": [
        "Total Transactions",
        "Unique Users",
        "Total Gas Used",
        "Average Gas Used",
        "Total Gas Cost (Gwei)",
        "Average Gas Cost (Gwei)"
    ],
    "StepN GST": [
        len(stepn_df),
        stepn_df['from'].nunique(),
        stepn_df['gasUsed'].sum(),
        stepn_df['gasUsed'].mean(),
        stepn_df['gasCost'].sum(),
        stepn_df['gasCost'].mean()
    ],
    "Sweatcoin SWEAT": [
        len(sweat_df),
        sweat_df['from'].nunique(),
        sweat_df['gasUsed'].sum(),
        sweat_df['gasUsed'].mean(),
        sweat_df['gasCost'].sum(),
        sweat_df['gasCost'].mean()
    ]
}

comparison_df_manual = pd.DataFrame(comparison_data)

# Print the result
comparison_df_manual

# Load the newly uploaded 6-month ERC20 logs file
file_path = "/content/erc20_logs_fast.csv"
df_recent = pd.read_csv(file_path)

# Convert timestamp and inspect structure
df_recent['timestamp'] = pd.to_datetime(df_recent['timestamp'])
df_recent['month'] = df_recent['timestamp'].dt.to_period('M')

# Verify structure and preview
df_recent.head(), df_recent['contract'].unique()

# Recalculate gas cost
df_recent['gasCost'] = df_recent['gasUsed'] * df_recent['gasPrice']

# Monthly transaction count
monthly_tx_counts = df_recent.groupby(['month', 'contract']).size().unstack(level=1).fillna(0)

# Monthly unique users
monthly_unique_users = df_recent.groupby(['month', 'contract'])['from'].nunique().unstack(level=1).fillna(0)

# Monthly total gas used
monthly_gas_used = df_recent.groupby(['month', 'contract'])['gasUsed'].sum().unstack(level=1).fillna(0)

# Monthly total gas cost
monthly_gas_cost = df_recent.groupby(['month', 'contract'])['gasCost'].sum().unstack(level=1).fillna(0)

# Plot all four comparisons
fig, axs = plt.subplots(2, 2, figsize=(15, 10))
monthly_tx_counts.plot(ax=axs[0, 0], title="Monthly Transaction Count", marker='o')
monthly_unique_users.plot(ax=axs[0, 1], title="Monthly Unique Users", marker='o')
monthly_gas_used.plot(ax=axs[1, 0], title="Monthly Gas Used", marker='o')
monthly_gas_cost.plot(ax=axs[1, 1], title="Monthly Gas Cost (Gwei)", marker='o')

for ax in axs.flat:
    ax.set_xlabel("Month")
    ax.set_ylabel("Count")
    ax.grid(True)
    ax.legend()

plt.tight_layout()
plt.show()

import matplotlib.pyplot as plt

# Fix timestamp column and extract month
df_recent['timestamp'] = pd.to_datetime(df_recent['timestamp'])
df_recent['month'] = df_recent['timestamp'].dt.to_period('M')

# Calculate gas cost
df_recent['gasCost'] = df_recent['gasUsed'] * df_recent['gasPrice']

# Grouped aggregations
monthly_tx_counts = df_recent.groupby(['month', 'contract']).size().unstack(level=1).fillna(0)
monthly_unique_users = df_recent.groupby(['month', 'contract'])['from'].nunique().unstack(level=1).fillna(0)
monthly_gas_used = df_recent.groupby(['month', 'contract'])['gasUsed'].sum().unstack(level=1).fillna(0)
monthly_gas_cost = df_recent.groupby(['month', 'contract'])['gasCost'].sum().unstack(level=1).fillna(0)

# Plot using varied styles
fig, axs = plt.subplots(2, 2, figsize=(16, 10))

monthly_tx_counts.plot.area(ax=axs[0, 0], title="Monthly Transaction Volume (Stacked)", alpha=0.7)
monthly_unique_users.plot.bar(ax=axs[0, 1], title="Monthly Unique Users (Bar)", stacked=True)
monthly_gas_used.plot.line(ax=axs[1, 0], title="Monthly Gas Usage Trend", marker='s')
monthly_gas_cost.plot.line(ax=axs[1, 1], title="Monthly Gas Cost (Gwei)", linestyle='--', marker='x')

for ax in axs.flat:
    ax.set_xlabel("Month")
    ax.set_ylabel("Value")
    ax.grid(True)
    ax.legend()

plt.tight_layout()
plt.show()
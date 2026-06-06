"use client";

import { useState } from 'react';
import DailyBudget from './DailyBudget';
import AutopayList from './AutopayList';
import YieldTracker from './YieldTracker';
import ReputationBadge from './ReputationBadge';

interface DashboardProps {
  address: string;
}

export default function Dashboard({ address }: DashboardProps) {
  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          title="Protected Balance"
          value="$1,250"
          subtitle="Earning 4.2% APY"
          color="green"
        />
        <StatCard
          title="Available Balance"
          value="$380"
          subtitle="Safe to spend"
          color="blue"
        />
        <StatCard
          title="Daily Budget"
          value="$25"
          subtitle="12 days remaining"
          color="purple"
        />
        <StatCard
          title="Total Yield Earned"
          value="$47.50"
          subtitle="This month"
          color="yellow"
        />
      </div>

      {/* Daily Budget Alert */}
      <DailyBudget budget={25} spent={12} remaining={13} />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <AutopayList address={address} />
        </div>
        
        <div className="space-y-6">
          <YieldTracker />
          <ReputationBadge cycles={5} />
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">AI Financial Insights</h3>
        <div className="space-y-3">
          <Insight
            type="success"
            message="Your rent autopay is safely protected. Payment will go through on Dec 1st."
          />
          <Insight
            type="warning"
            message="You're spending 15% more than usual this week. Consider reducing non-essential expenses."
          />
          <Insight
            type="info"
            message="Your Netflix subscription is up for renewal in 3 days. Funds will be protected automatically."
          />
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  title: string;
  value: string;
  subtitle: string;
  color: 'green' | 'blue' | 'purple' | 'yellow';
}

function StatCard({ title, value, subtitle, color }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <p className="text-sm text-gray-600 mb-1">{title}</p>
      <p className="text-3xl font-bold text-gray-900">{value}</p>
      <p className="text-sm text-gray-500 mt-1">{subtitle}</p>
    </div>
  );
}

interface InsightProps {
  type: 'success' | 'warning' | 'info';
  message: string;
}

function Insight({ type, message }: InsightProps) {
  const colors = {
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
  };

  return (
    <div className={`border-l-4 p-4 rounded ${colors[type]}`}>
      <p className="text-sm">{message}</p>
    </div>
  );
}

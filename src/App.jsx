import React, { useState, useEffect } from 'react';
import './ExpenseTracker.css';

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState([]);
  const [income, setIncome] = useState([]);
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('food');
  const [type, setType] = useState('expense');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  useEffect(() => {
    const savedExpenses = localStorage.getItem('expenses');
    const savedIncome = localStorage.getItem('income');
    if (savedExpenses) setExpenses(JSON.parse(savedExpenses));
    if (savedIncome) setIncome(JSON.parse(savedIncome));
  }, []);

  useEffect(() => {
    localStorage.setItem('expenses', JSON.stringify(expenses));
  }, [expenses]);

  useEffect(() => {
    localStorage.setItem('income', JSON.stringify(income));
  }, [income]);

  const categories = {
    expense: ['food', 'transport', 'shopping', 'bills', 'entertainment', 'other'],
    income: ['salary', 'freelance', 'investment', 'gift', 'other']
  };

  const addTransaction = () => {
    if (!description || !amount || amount <= 0) return;

    const newTransaction = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      category,
      date,
      timestamp: new Date().toISOString()
    };

    if (type === 'expense') {
      setExpenses([newTransaction, ...expenses]);
    } else {
      setIncome([newTransaction, ...income]);
    }

    setDescription('');
    setAmount('');
    setCategory(type === 'expense' ? 'food' : 'salary');
  };

  const deleteTransaction = (id, transactionType) => {
    if (transactionType === 'expense') {
      setExpenses(expenses.filter(e => e.id !== id));
    } else {
      setIncome(income.filter(i => i.id !== id));
    }
  };

  const totalIncome = income.reduce((sum, i) => sum + i.amount, 0);
  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);
  const balance = totalIncome - totalExpense;

  const getCategoryEmoji = (cat) => {
    const emojis = {
      food: '🍔', transport: '🚗', shopping: '🛍️', bills: '📄',
      entertainment: '🎬', salary: '💰', freelance: '💼',
      investment: '📈', gift: '🎁', other: '📦'
    };
    return emojis[cat] || '📦';
  };

  return (
    <div className="app-container">
      <div className="main-wrapper">
        <div className="header-card">
          <div className="header-title">
            <span className="wallet-icon">💰</span>
            <h1>Expense Tracker</h1>
          </div>

          <div className="stats-grid">
            <div className="stat-card income-card">
              <div className="stat-header">
                <span className="stat-icon">📈</span>
                <span className="stat-label">Income</span>
              </div>
              <p className="stat-amount">₹{totalIncome.toFixed(2)}</p>
            </div>

            <div className="stat-card expense-card">
              <div className="stat-header">
                <span className="stat-icon">📉</span>
                <span className="stat-label">Expenses</span>
              </div>
              <p className="stat-amount">₹{totalExpense.toFixed(2)}</p>
            </div>

            <div className={`stat-card ${balance >= 0 ? 'balance-positive' : 'balance-negative'}`}>
              <div className="stat-header">
                <span className="stat-icon">💳</span>
                <span className="stat-label">Balance</span>
              </div>
              <p className="stat-amount">₹{balance.toFixed(2)}</p>
            </div>
          </div>

          <div className="form-container">
            <h2 className="form-title">Add Transaction</h2>
            
            <div className="type-selector">
              <button
                onClick={() => setType('expense')}
                className={`type-btn ${type === 'expense' ? 'type-btn-active expense-active' : ''}`}
              >
                Expense
              </button>
              <button
                onClick={() => setType('income')}
                className={`type-btn ${type === 'income' ? 'type-btn-active income-active' : ''}`}
              >
                Income
              </button>
            </div>

            <div className="form-grid">
              <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="form-input"
              />
              
              <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="form-input"
              />
              
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="form-input"
              >
                {categories[type].map(cat => (
                  <option key={cat} value={cat}>
                    {getCategoryEmoji(cat)} {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </option>
                ))}
              </select>
              
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="form-input"
              />
            </div>

            <button onClick={addTransaction} className="add-btn">
              ➕ Add Transaction
            </button>
          </div>
        </div>

        <div className="transactions-grid">
          <div className="transaction-card">
            <h2 className="transaction-title expense-title">
              📉 Recent Expenses
            </h2>
            <div className="transaction-list">
              {expenses.length === 0 ? (
                <p className="empty-message">No expenses yet</p>
              ) : (
                expenses.map(exp => (
                  <div key={exp.id} className="transaction-item expense-item">
                    <div className="transaction-content">
                      <span className="transaction-emoji">{getCategoryEmoji(exp.category)}</span>
                      <div className="transaction-details">
                        <p className="transaction-desc">{exp.description}</p>
                        <div className="transaction-meta">
                          <span>📅 {exp.date}</span>
                          <span className="meta-separator">•</span>
                          <span>{exp.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="transaction-actions">
                      <span className="transaction-amount expense-amount">-₹{exp.amount.toFixed(2)}</span>
                      <button
                        onClick={() => deleteTransaction(exp.id, 'expense')}
                        className="delete-btn expense-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="transaction-card">
            <h2 className="transaction-title income-title">
              📈 Recent Income
            </h2>
            <div className="transaction-list">
              {income.length === 0 ? (
                <p className="empty-message">No income yet</p>
              ) : (
                income.map(inc => (
                  <div key={inc.id} className="transaction-item income-item">
                    <div className="transaction-content">
                      <span className="transaction-emoji">{getCategoryEmoji(inc.category)}</span>
                      <div className="transaction-details">
                        <p className="transaction-desc">{inc.description}</p>
                        <div className="transaction-meta">
                          <span>📅 {inc.date}</span>
                          <span className="meta-separator">•</span>
                          <span>{inc.category}</span>
                        </div>
                      </div>
                    </div>
                    <div className="transaction-actions">
                      <span className="transaction-amount income-amount">+₹{inc.amount.toFixed(2)}</span>
                      <button
                        onClick={() => deleteTransaction(inc.id, 'income')}
                        className="delete-btn income-delete"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
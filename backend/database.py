import sqlite3
import json
import os
from datetime import datetime

DB_PATH = os.path.join(os.path.dirname(__file__), '..', 'data', 'history.db')

def get_db_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    data_dir = os.path.dirname(DB_PATH)
    if not os.path.exists(data_dir):
        os.makedirs(data_dir)
        
    conn = get_db_connection()
    conn.execute('''
        CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            career_id TEXT NOT NULL,
            career_title TEXT NOT NULL,
            match_percentage REAL NOT NULL,
            results_json TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

def save_analysis(career_id, career_title, match_percentage, results):
    conn = get_db_connection()
    conn.execute(
        'INSERT INTO history (career_id, career_title, match_percentage, results_json) VALUES (?, ?, ?, ?)',
        (career_id, career_title, match_percentage, json.dumps(results))
    )
    conn.commit()
    conn.close()

def get_history(limit=20):
    conn = get_db_connection()
    rows = conn.execute(
        'SELECT id, timestamp, career_id, career_title, match_percentage, results_json FROM history ORDER BY timestamp DESC LIMIT ?',
        (limit,)
    ).fetchall()
    
    history = []
    for row in rows:
        history.append({
            'id': row['id'],
            'timestamp': row['timestamp'],
            'career_id': row['career_id'],
            'career_title': row['career_title'],
            'match_percentage': row['match_percentage'],
            'results': json.loads(row['results_json'])
        })
    
    conn.close()
    return history

def delete_history_item(item_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM history WHERE id = ?', (item_id,))
    conn.commit()
    conn.close()

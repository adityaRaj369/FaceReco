# backend/database.py
users = {}

def save_user(user_id, pin):
    users[user_id] = pin

def check_user(user_id):
    return users.get(user_id, "No PIN found")

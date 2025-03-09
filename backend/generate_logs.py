import time

LOG_FILE = "backend/log.txt"
i = 1 

while True:
    with open(LOG_FILE, "a") as f:
        f.write(f"Log {i}: Entry at {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
    i += 1 
    time.sleep(1) 

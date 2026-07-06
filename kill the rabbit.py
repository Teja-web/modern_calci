import subprocess
import sys

def kill_calculator():
    try:
        result = subprocess.run(
            ["taskkill", "/F", "/IM", "CalculatorApp.exe"],
            capture_output=True,
            text=True,
        )

        if result.returncode == 0:
            print("Calculator closed successfully.")
            return

        # Fallback for older Windows versions
        result = subprocess.run(
            ["taskkill", "/F", "/IM", "calc.exe"],
            capture_output=True,
            text=True,
        )

        if result.returncode == 0:
            print("Calculator closed successfully.")
        else:
            print("Calculator is not running.")
            print(result.stderr.strip())

    except Exception as e:
        print(f"Error: {e}")
        sys.exit(1)

if __name__ == "__main__":
    kill_calculator()

#!/usr/bin/env python
import os
import re
import sys
import json
from colorama import init, Fore
from datetime import datetime
import cmd

# Initialize colorama
init(autoreset=True)

# Import the generative AI module if it exists
try:
    import google.generativeai as genai
except ImportError:
    print("Please install the generative AI module.")
    print("pip install google-generativeai")
    sys.exit(1)

# Configure generative AI
try:
    genai.configure(api_key=os.environ['API_GEMINI'])
except KeyError:
    print("Please set the API_KEY environment variable.")
    print("You can get the API key from https://aistudio.google.com/app/apikey")
    print("export API_KEY=<your-api-key>")
    sys.exit(1)

# Create a GenerativeModel instance
model = genai.GenerativeModel(model_name='gemini-pro')

# Start a chat session
chat = model.start_chat()

# Function to handle chat interactions
def chat_interaction(prompt):
    try:
        # Send user input to the chat session
        response = chat.send_message(prompt)
        return response.text
    except Exception as e:
        print("Error during chat interaction:", e)
        return None

# Function to save chat history
def save_chat_history(chat_history):
    try:
        with open("chat_history.json", "w") as f:
            json.dump(chat_history, f, indent=4)
    except Exception as e:
        print(Fore.RED + "Error saving chat history:", e)

# Function to load existing chat history
def load_chat_history():
    try:
        with open("chat_history.json", "r") as f:
            return json.load(f)
    except FileNotFoundError:
        return []
    except Exception as e:
        print(Fore.RED + "Error loading chat history:", e)
        return []

# Function to create and code a file
def create_and_code_file(filename, code):
    try:
        # Remove triple backticks and language identifier from the code
        code = re.sub(r'```[a-zA-Z]*', '', code)
        
        # Strip leading and trailing whitespace, including newline characters
        code = code.strip()
        
        with open(filename, "w") as f:
            f.write(code)
        print(Fore.GREEN + f"File '{filename}' created and coded successfully.")
    except Exception as e:
        print(Fore.RED + f"Error creating and coding file '{filename}':", e)

# Custom command interpreter class
class ChatCLI(cmd.Cmd):
    prompt = Fore.BLUE + "You: " + Fore.RESET
    
    def do_exit(self, arg):
        """Exit the chat"""
        print(Fore.RED + "Exiting the chat. Goodbye!")
        return True
    
    def do_clear(self, arg):
        """Clear the screen"""
        os.system("clear")

    def do_ls(self, arg):
        """List files in the current directory"""
        try:
            files = os.listdir(".")
            for file in files:
                print(Fore.GREEN + file)
        except Exception as e:
            print(Fore.RED + "Error listing files:", e)

    def do_cd(self, arg):
        """Change directory"""
        try:
            os.chdir(arg)
            print(Fore.GREEN + "Current directory:", os.getcwd())
        except FileNotFoundError:
            print(Fore.RED + "Directory not found.")
        except Exception as e:
            print(Fore.RED + "Error changing directory:", e)
    
    def do_pwd(self, arg):
        """Print the current working directory"""
        print(Fore.GREEN + "Current directory:", os.getcwd())
    
    def do_touch(self, arg):
        """Create a new file"""
        try:
            with open(arg, "w"):
                print(Fore.GREEN + f"File '{arg}' created successfully.")
        except Exception as e:
            print(Fore.RED + "Error creating file:", e)
    
    def do_rm(self, arg):
        """Remove a file"""
        try:
            os.remove(arg)
            print(Fore.GREEN + f"File '{arg}' removed successfully.")
        except FileNotFoundError:
            print(Fore.RED + f"File '{arg}' not found.")
        except Exception as e:
            print(Fore.RED + "Error removing file:", e)
    
    def do_mkdir(self, arg):
        """Create a new directory"""
        try:
            os.mkdir(arg)
            print(Fore.GREEN + f"Directory '{arg}' created successfully.")
        except Exception as e:
            print(Fore.RED + "Error creating directory:", e)

    def do_edit(self, arg):
        """edit the code in file"""
        try:
            # Extract filename from argument
            filename = arg.split("(")[1].split(")")[0]

            file_contents = ""
            with open(filename, "r") as f:
                file_contents = f.read()

            # Get response from chat session to fix the code in the file
            response = chat_interaction(
                "edit the code in the file " + file_contents + ">" + arg.split(")")[1].strip() +
                " NOTE: You will write the code in the file directly."
                )
            if response:
                # Fix the code in the file
                create_and_code_file(filename, response)
            chat_history.append(
                {
                    "user": f"edit the code in the file {filename} : {arg.split(')')[1].strip()}",
                    "AI": response,
                    "Time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            )
            save_chat_history(chat_history)

        except Exception as e:
            print(Fore.RED + "Error processing edit command:", e) 

    def do_fix(self, arg):
        """Fix the code in file"""
        try:
            # Extract filename from argument
            filename = arg.split("(")[1].split(")")[0]

            file_contents = ""
            with open(filename, "r") as f:
                file_contents = f.read()

            # Get response from chat session to fix the code in the file
            response = chat_interaction(
                "Fix the code in the file " + file_contents + ">" + arg.split(")")[1].strip() +
                " NOTE: You will write the fixed code in the file directly."
                )
            if response:
                # Fix the code in the file
                create_and_code_file(filename, response)
            chat_history.append(
                {
                    "user": f"Fix the code in the file {filename} with {arg.split(')')[1].strip()}",
                    "AI": response,
                    "Time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            )
            save_chat_history(chat_history)

        except Exception as e:
            print(Fore.RED + "Error processing fix command:", e) 

    def do_createFile(self, arg):
        """Create and code a file"""
        try:
            # Extract filename from argument
            filename = arg.split("(")[1].split(")")[0]
            # Get response from chat session to code the file
            response = chat_interaction(
                "Code the file " + filename + ">" + arg.split(")")[1].strip() +
                " NOTE: You will write the code in the file directly."
                )
            if response:
                # Create and code the file
                create_and_code_file(filename, response)
            chat_history.append(
                {
                    "user": f"Create and code the file {filename} with {arg.split(')')[1].strip()}",
                    "AI": response,
                    "Time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            )
            save_chat_history(chat_history)

        except Exception as e:
            print(Fore.RED + "Error processing createFile command:", e)

    def do_readFile(self, arg):
        """Read the contents of a file"""
        try:
            with open(arg, "r") as f:
                # give it to the user 
                print(Fore.GREEN + f"File '{arg}':")
                file_contents = f.read()
                response = chat_interaction(f"Read the file : {file_contents}")
                if response:
                    print(Fore.GREEN + f"Bot: {response}")
                chat_history.append(
                    {
                        "user": f"Read the file {arg}",
                        "AI": response,
                        "Time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    }
                )
                save_chat_history(chat_history)
                

        except FileNotFoundError:
            print(Fore.RED + f"File '{arg}' not found.")
        except Exception as e:
            print(Fore.RED + "Error reading file:", e)

    def default(self, line):
        """Send user input to the chat session"""
        response = chat_interaction(line)
        if response:
            print(Fore.GREEN + "Bot:", response)
            # Add interaction to chat history and save it
            chat_history.append(
                {
                    "user": line,
                    "AI": response,
                    "Time": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                }
            )
            save_chat_history(chat_history)

# Main function
def main():
    # Load existing chat history
    global chat_history
    chat_history = load_chat_history()

    # Start the custom command interpreter
    cli = ChatCLI()
    cli.cmdloop()

if __name__ == "__main__":
    # if there is input from the user
    if len(sys.argv) > 1:
        question = " ".join(sys.argv[1:])
        response = chat_interaction(question)
        if response:
            print(Fore.GREEN + "Bot:", response)
    else:
        main()

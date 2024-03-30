## Generative AI CLI Assistant

This is a command-line interface (CLI) application that allows you to interact with a generative AI model through a text-based chat interface. You can ask the AI questions, get help with coding, or even create and edit files.

### Usage

To use the CLI, simply run the following command:

```bash
python app.py
```


You can also provide a question as a command-line argument:

```bash
python app.py "What is the meaning of life?"
```


### Commands

The following commands are available:

- **exit**: Exit the CLI.
- **clear**: Clear the screen.
- **ls**: List files in the current directory.
- **cd**: Change directory.
- **pwd**: Print the current working directory.
- **touch**: Create a new file.
- **rm**: Remove a file.
- **mkdir**: Create a new directory.
- **edit**: Edit the code in a file.
- **fix**: Fix the code in a file.
- **createFile**: Create and code a file.
- **readFile**: Read the contents of a file.

### Examples

Here are some examples of how to use the CLI:


# Ask the AI a question
> What is the meaning of life?
Bot: The meaning of life is a deeply personal question that has been pondered by philosophers and theologians for centuries. There is no one definitive answer, but some common themes that emerge include finding purpose and fulfillment in one's life, connecting with others, and making a positive contribution to the world.

# Create a new file
> touch myfile.txt
File 'myfile.txt' created successfully.

# Edit the code in a file
> edit myfile.txt(Insert your code here)
File 'myfile.txt' edited successfully.

# Fix the code in a file
> fix myfile.txt(Describe the issue here)
File 'myfile.txt' fixed successfully.

# Create and code a file
> createFile mynewfile.py(Insert your code here)
File 'mynewfile.py' created and coded successfully.

# Read the contents of a file
> readFile myfile.txt


### Notes

- The generative AI model is not perfect and may not always provide accurate or helpful responses.
- The CLI is still under development and new features are being added all the time.
- If you have any questions or feedback, please feel free to create an issue on the GitHub repository.

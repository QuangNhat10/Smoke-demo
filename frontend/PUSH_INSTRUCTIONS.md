# Instructions for Pushing to GitHub

Follow these steps to push your code to GitHub:

## 1. Create a GitHub Account

If you don't already have a GitHub account, visit [GitHub.com](https://github.com/) and sign up.

## 2. Create a New Repository on GitHub

1. Log in to your GitHub account
2. Click the "+" icon in the top-right corner and select "New repository"
3. Enter "breathing-free" (or your preferred name) as the repository name
4. Add a description (optional)
5. Choose if the repository should be public or private
6. Do NOT initialize with a README (we already have one)
7. Click "Create repository"

## 3. Connect Your Local Repository to GitHub

After creating the repository, GitHub will display instructions. Follow the instructions for "…or push an existing repository from the command line":

```bash
# Replace YOUR_USERNAME with your GitHub username
git remote add origin https://github.com/YOUR_USERNAME/breathing-free.git
git branch -M main
git push -u origin main
```

## 4. Authentication

When pushing to GitHub for the first time, you will be prompted to authenticate:

1. You may need to create a personal access token on GitHub:
   - Go to GitHub.com → Settings → Developer settings → Personal access tokens → Generate new token
   - Give it a name, set an expiration, and select the "repo" scope
   - Copy the token and use it as your password when prompted
   
2. Alternatively, set up SSH key authentication for easier access
   
## 5. Verify Your Code Was Pushed

After pushing, visit your GitHub repository URL to confirm your code was successfully pushed.

## Future Updates

For future changes, you can use this workflow:

```bash
# Make your changes
git add .
git commit -m "Description of your changes"
git push
``` 
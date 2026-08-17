# Git Practice Terminal 🚀

An interactive, browser-based Git learning environment that simulates real Git commands without any server-side dependencies. Perfect for beginners learning Git or developers wanting to practice commands in a safe sandbox. Designed to be deployed on [Cloudflare Pages](https://pages.cloudflare.com/).

![Git Practice Terminal](https://img.shields.io/badge/Git-Practice%20Terminal-orange?style=for-the-badge&logo=git)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Cloudflare Pages](https://img.shields.io/badge/Cloudflare%20Pages-F38020?style=for-the-badge&logo=cloudflare&logoColor=white)

## ✨ Features

### 🎯 Interactive Learning
- **Guided Exercises**: 24 progressive exercises from beginner to advanced with progressive hints
- **Real-time Feedback**: Instant visual feedback on command execution
- **Command History**: Navigate through previous commands with arrow keys
- **Tab Completion**: Auto-complete Git commands and filenames
- **Persistent Progress**: Exercise progress and repo state survive page refreshes via localStorage

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark / Light Theme**: Toggle between dark and light themes
- **Terminal Search**: `Ctrl+F` to search output with prev/next navigation
- **Copy Output**: One-click copy of all terminal output
- **Smooth Animations**: Polished transitions and hover effects
- **Visual Feedback**: Success/error indicators for user actions

### 📚 Comprehensive Git Simulation
- Repository initialization and cloning
- Staging and committing files
- Branch management (create, switch, delete, merge)
- Remote repository simulation
- Configuration management (`--global`, `--list`, `--unset`)
- File system operations (ls, cat, touch, echo)
- Built-in text editor (nano/vim simulation)
- Proper quoted-argument parsing (e.g. `git commit -m "my message"`)

## 🚀 Quick Start

### Option 1: Open directly
Simply open `index.html` in any modern web browser - no build step required!

```bash
# Clone the repository
git clone https://github.com/OshekharO/Git-Terminal.git

# Open in browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

### Option 2: Deploy on Cloudflare Pages

1. Push this repo to GitHub
2. In [Cloudflare Pages](https://dash.cloudflare.com/pages), create a new project and connect your repo
3. Use these build settings:
   - **Build command**: `echo 'no build step'`
   - **Build output directory**: `/` (root)
4. Deploy — Cloudflare will serve the static files directly

The `_headers` and `_redirects` files in this repo configure caching, security headers, and SPA fallback for Cloudflare Pages automatically.

## 📖 Available Commands

### Git Commands

| Command | Description |
|---------|-------------|
| `git init` | Initialize a new Git repository |
| `git clone <url>` | Clone a repository |
| `git status` | Show working tree status |
| `git add <file>` | Add file to staging area |
| `git add .` | Add all files to staging |
| `git add "*.ext"` | Add files by glob pattern |
| `git commit -m "msg"` | Commit staged changes |
| `git log` | Show commit history |
| `git log --oneline` | Compact commit history |
| `git log --oneline --graph` | Visual branch graph |
| `git log -n 5` | Show last 5 commits |
| `git branch` | List branches |
| `git branch <name>` | Create new branch |
| `git branch -d <name>` | Delete a branch |
| `git branch -D <name>` | Force delete a branch |
| `git checkout <branch>` | Switch branches |
| `git checkout -b <name>` | Create and switch to branch |
| `git checkout -- <file>` | Restore file from HEAD |
| `git switch <branch>` | Switch branches (modern) |
| `git merge <branch>` | Merge branch into current |
| `git diff` | Show unstaged changes |
| `git diff --staged` | Show staged changes |
| `git remote add <name> <url>` | Add remote repository |
| `git remote -v` | List remotes with URLs |
| `git remote remove <name>` | Remove a remote |
| `git push <remote> <branch>` | Push to remote |
| `git pull` | Pull from remote |
| `git fetch` | Download remote changes |
| `git stash` | Save changes temporarily |
| `git stash list` | List stashed changes |
| `git stash pop` | Restore stashed changes |
| `git stash apply` | Restore stashed changes (keep entry) |
| `git stash drop` | Delete a stash |
| `git stash clear` | Delete all stashes |
| `git restore <file>` | Discard file changes |
| `git restore --staged <file>` | Unstage a file |
| `git restore .` | Discard all changes |
| `git revert <ref>` | Revert an existing commit |
| `git reset --soft` | Undo last commit, keep staging |
| `git reset --mixed` | Undo last commit, unstage changes |
| `git reset --hard` | Discard all uncommitted changes |
| `git reset HEAD <file>` | Unstage a specific file |
| `git rm <file>` | Remove file from Git |
| `git mv <src> <dst>` | Rename/move a tracked file |
| `git config --global <key> <value>` | Set configuration |
| `git config --list` | Show configuration |
| `git config --global --unset <key>` | Remove a config key |
| `git tag` | List all tags |
| `git tag <name>` | Create a lightweight tag |
| `git tag -a <name> -m "msg"` | Create an annotated tag |
| `git tag -d <name>` | Delete a tag |
| `git show` | Show most recent commit |
| `git show <ref>` | Show a commit or tag |
| `git blame <file>` | Show last modification per line |
| `git help` | Show Git help |

### System Commands

| Command | Description |
|---------|-------------|
| `ls` | List files in directory |
| `cat <file>` | Display file contents |
| `touch <file>` | Create or update file |
| `echo "content" > <file>` | Create file with content |
| `nano <file>` | Edit file with nano editor |
| `vim <file>` | Edit file with vim editor |
| `vi <file>` | Edit file with vi (alias for vim) |
| `history` | Show command history |
| `clear` | Clear terminal output |
| `exercise` | Start guided exercises |
| `hint` | Show next hint for current exercise |
| `help` | Show available commands |

## ⌨️ Keyboard Shortcuts

### Terminal
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate command history |
| `Tab` | Auto-complete commands/filenames |
| `Enter` | Execute command |
| `Ctrl+F` | Open search in terminal output |

### Text Editor (nano/vim)
| Shortcut | Action |
|----------|--------|
| `Ctrl+S` or `Ctrl+O` | Save file |
| `Ctrl+X` or `Esc` | Exit editor |
| `Tab` | Insert 4 spaces |

## 🎓 Exercises

The terminal includes **24 progressive exercises** organized by difficulty, with **progressive hints** (type `hint` to reveal more) and **individual skip/reset** from the Help modal.

### Beginner (8 exercises)
1. **Configure Git User** - Set up your name and email
2. **Initialize Repository** - Create a new Git repo
3. **Check Repository Status** - Use git status
4. **Create a New File** - Use touch or echo commands
5. **Stage Files** - Add files to staging area
6. **First Commit** - Make your first commit
7. **View Commit History** - Use git log
8. **List Directory Contents** - Use ls command

### Intermediate (13 exercises)
9. **Create a New Branch** - Create feature branches
10. **Switch Between Branches** - Navigate branches
11. **Create and Switch in One Command** - Use checkout -b
12. **Add Remote Repository** - Connect to GitHub
13. **View Remote Repositories** - List configured remotes
14. **Push to Remote** - Push commits to remote
15. **View Changes with Diff** - Compare file changes
16. **Build a Commit History** - Make multiple commits
17. **Delete a Branch** - Clean up old branches
18. **Edit a File** - Use nano or vim
19. **Stash Your Changes** - Temporarily save work in progress
20. **Tag a Release** - Mark important points in history

### Advanced (4 exercises)
21. **Merge a Branch** - Merge feature branches
22. **Reset Changes** - Discard uncommitted changes
23. **Clone a Repository** - Clone from URL
24. **Complete Feature Workflow** - Full feature branch workflow

Type `exercise` to start the guided learning path!

## 💾 Persistence

Your progress and repository state are automatically saved to your browser's localStorage:

- Git configuration (`user.name`, `user.email`, `init.defaultBranch`)
- Exercise progress and completed exercises
- Commits, branches, stash, remotes, and tags
- Command history (last 500 commands)
- Theme preference

Use the **Reset** button to clear all persisted state and start fresh.

## 🛠️ Extending the Terminal

The codebase is designed for easy extension:

### Adding New Exercises

Edit the `EXERCISES` array in `script.js`:

```javascript
const EXERCISES = [
    {
        id: 'unique-id',
        title: 'Exercise Title',
        desc: 'What the user needs to do',
        hints: [
            'Conceptual hint...',
            'Command syntax hint...',
            'Exact command hint...'
        ],
        difficulty: 'beginner', // or 'intermediate', 'advanced'
        category: 'category-name',
        check: (state) => /* return true when complete */
    },
    // ... more exercises
];
```

### Adding New Tutorials

Edit the `TUTORIALS` object in `script.js`:

```javascript
const TUTORIALS = {
    newCategory: {
        title: 'Category Title',
        icon: 'fa-icon-name',
        color: 'blue', // Tailwind color name
        sections: [
            {
                title: 'Section Title',
                commands: [
                    { cmd: 'command', desc: 'Description' }
                ]
            }
        ]
    }
};
```

### Adding New Files

Edit the `DEFAULT_FILE_SYSTEM` object:

```javascript
const DEFAULT_FILE_SYSTEM = {
    'filename.ext': 'File contents here',
    // ... more files
};
```

## 📱 Responsive Design

The terminal is fully responsive with breakpoints at:
- **Mobile**: < 480px
- **Small Tablets**: 480px - 767px
- **Tablets**: 768px - 1023px
- **Desktop**: 1024px+

## 🎨 Customization

### Color Palette

Colors are defined as CSS custom properties in `src/styles.css`. A light theme is included and can be toggled from the terminal header.

```css
:root {
    --color-bg-primary: #0d1117;
    --color-accent-blue: #58a6ff;
    --color-accent-green: #3fb950;
    /* ... more colors */
}
```

### Spacing System

Consistent spacing using custom properties:

```css
:root {
    --space-xs: 0.25rem;
    --space-sm: 0.5rem;
    --space-md: 1rem;
    /* ... more spacing */
}
```

## 🚢 Cloudflare Pages Deployment

This project is optimized for Cloudflare Pages and is live at **https://gitbash.pages.dev/**.

- **Static-only**: No server-side code required
- **`_headers`**: Configures caching (`max-age=31536000` for assets, `no-cache` for HTML) and security headers
- **`_redirects`**: SPA fallback
- **Offline-ready**: All assets are cached by Cloudflare's edge network

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🙏 Acknowledgments

- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [Font Awesome](https://fontawesome.com/) for icons
- [JetBrains Mono](https://www.jetbrains.com/lp/mono/) for the terminal font

---

Made with ❤️ for the Git learning community

# Git Practice Terminal 🚀

An interactive, browser-based Git learning environment that simulates real Git commands without any server-side dependencies. Perfect for beginners learning Git or developers wanting to practice commands in a safe sandbox.

![Git Practice Terminal](https://img.shields.io/badge/Git-Practice%20Terminal-orange?style=for-the-badge&logo=git)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)

## ✨ Features

### 🎯 Interactive Learning
- **Guided Exercises**: Progressive exercises from beginner to advanced
- **Real-time Feedback**: Instant visual feedback on command execution
- **Command History**: Navigate through previous commands with arrow keys
- **Tab Completion**: Auto-complete Git commands and filenames

### 🎨 Modern UI/UX
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop
- **Dark Theme**: Easy on the eyes with a professional terminal look
- **Smooth Animations**: Polished transitions and hover effects
- **Visual Feedback**: Success/error indicators for user actions

### 📚 Comprehensive Git Simulation
- Repository initialization and cloning
- Staging and committing files
- Branch management (create, switch, delete, merge)
- Remote repository simulation
- Configuration management
- File system operations (ls, cat, touch, echo)
- Built-in text editor (nano/vim simulation)

## 🚀 Quick Start

Simply open `index.html` in any modern web browser - no build step required!

```bash
# Clone the repository
git clone https://github.com/OshekharO/Git-Terminal.git

# Open in browser
open index.html  # macOS
start index.html # Windows
xdg-open index.html # Linux
```

The application uses:
- [Tailwind CSS CDN](https://tailwindcss.com/docs/installation/play-cdn) for utility classes
- Custom CSS in `src/styles.css` for terminal-specific styling

## 📖 Available Commands

### Git Commands

| Command | Description |
|---------|-------------|
| `git init` | Initialize a new Git repository |
| `git clone <url>` | Clone a repository |
| `git status` | Show working tree status |
| `git add <file>` | Add file to staging area |
| `git add .` | Add all files to staging |
| `git commit -m "msg"` | Commit staged changes |
| `git log` | Show commit history |
| `git log --oneline` | Compact commit history |
| `git branch` | List branches |
| `git branch <name>` | Create new branch |
| `git checkout <branch>` | Switch branches |
| `git checkout -b <name>` | Create and switch to branch |
| `git merge <branch>` | Merge branch into current |
| `git diff` | Show changes |
| `git remote add <name> <url>` | Add remote repository |
| `git remote -v` | List remotes |
| `git push <remote> <branch>` | Push to remote |
| `git pull` | Pull from remote |
| `git config --global <key> <value>` | Set configuration |
| `git config --list` | Show configuration |
| `git reset --hard` | Discard all changes |
| `git rm <file>` | Remove file from Git |
| `git help` | Show Git help |

### System Commands

| Command | Description |
|---------|-------------|
| `ls` | List files in directory |
| `cat <file>` | Display file contents |
| `touch <file>` | Create or update file |
| `echo > <file> <content>` | Create file with content |
| `nano <file>` | Edit file with nano editor |
| `vim <file>` | Edit file with vim editor |
| `vi <file>` | Edit file with vi (alias for vim) |
| `history` | Show command history |
| `clear` | Clear terminal output |
| `exercise` | Start guided exercises |
| `help` | Show available commands |

## ⌨️ Keyboard Shortcuts

### Terminal
| Shortcut | Action |
|----------|--------|
| `↑` / `↓` | Navigate command history |
| `Tab` | Auto-complete commands/filenames |
| `Enter` | Execute command |

### Text Editor (nano/vim)
| Shortcut | Action |
|----------|--------|
| `Ctrl+S` or `Ctrl+O` | Save file |
| `Ctrl+X` or `Esc` | Exit editor |
| `Tab` | Insert 4 spaces |

## 🎓 Exercises

The terminal includes 8 progressive exercises:

1. **Configure Git User** (Beginner) - Set up your name and email
2. **Initialize Repository** (Beginner) - Create a new Git repo
3. **Stage Files** (Beginner) - Add files to staging area
4. **First Commit** (Beginner) - Make your first commit
5. **Create Branch** (Intermediate) - Create and switch branches
6. **Add Remote** (Intermediate) - Connect to a remote repository
7. **Multiple Commits** (Intermediate) - Create a commit history
8. **Merge Branch** (Advanced) - Merge branches together

Type `exercise` to start the guided learning path!

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
        hint: 'Helpful hint for the user',
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

Colors are defined as CSS custom properties in `src/styles.css`:

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
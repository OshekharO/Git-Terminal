/**
 * Git Terminal - Interactive Git Learning Environment
 * 
 * Data structures for exercises, tutorials, and simulated commands
 * are designed to be easily extensible.
 */

// =============================================================================
// CONFIGURATION CONSTANTS
// =============================================================================

const DEFAULT_USER_NAME = 'Git Learner';
const DEFAULT_USER_EMAIL = 'learner@example.com';
const DEFAULT_BRANCH = 'main';

// =============================================================================
// EXTENSIBLE DATA STRUCTURES
// =============================================================================

/**
 * Exercises data structure - easily add new exercises here
 * Each exercise has:
 * - id: unique identifier
 * - title: display name
 * - desc: description shown to user
 * - hint: help text for users
 * - check: function that returns true when exercise is complete
 * - difficulty: 'beginner' | 'intermediate' | 'advanced'
 * - category: grouping category
 */
const EXERCISES = [
    {
        id: 'config-user',
        title: 'Configure Git User',
        desc: 'Configure your Git user name and email',
        hint: 'Use: git config --global user.name "Your Name" and git config --global user.email "your@email.com"',
        difficulty: 'beginner',
        category: 'setup',
        check: (state) => state.config['user.name'] !== DEFAULT_USER_NAME
    },
    {
        id: 'init-repo',
        title: 'Initialize Repository',
        desc: 'Initialize a new Git repository',
        hint: 'Use: git init',
        difficulty: 'beginner',
        category: 'setup',
        check: (state) => state.currentRepo !== null
    },
    {
        id: 'add-files',
        title: 'Stage Files',
        desc: 'Add all files to staging area',
        hint: 'Use: git add . or git add <filename>',
        difficulty: 'beginner',
        category: 'basics',
        check: (state) => state.stagingArea.length > 0
    },
    {
        id: 'first-commit',
        title: 'First Commit',
        desc: 'Make your first commit',
        hint: 'Use: git commit -m "Initial commit"',
        difficulty: 'beginner',
        category: 'basics',
        check: (state) => state.commits.length > 0
    },
    {
        id: 'create-branch',
        title: 'Create Branch',
        desc: 'Create and switch to a new branch',
        hint: 'Use: git branch new-feature then git checkout new-feature, or git checkout -b new-feature',
        difficulty: 'intermediate',
        category: 'branching',
        check: (state) => state.branches.length > 1 && state.currentBranch !== 'main'
    },
    {
        id: 'add-remote',
        title: 'Add Remote',
        desc: 'Add a remote repository called "origin"',
        hint: 'Use: git remote add origin https://github.com/user/repo.git',
        difficulty: 'intermediate',
        category: 'collaboration',
        check: (state) => Object.keys(state.remoteRepos).length > 0
    },
    {
        id: 'multiple-commits',
        title: 'Multiple Commits',
        desc: 'Make at least 3 commits in your repository',
        hint: 'Create files with touch, add them with git add, then commit with git commit -m "message"',
        difficulty: 'intermediate',
        category: 'workflow',
        check: (state) => state.commits.length >= 3
    },
    {
        id: 'merge-branch',
        title: 'Merge Branch',
        desc: 'Merge a feature branch into main',
        hint: 'First checkout main, then use: git merge feature-branch',
        difficulty: 'advanced',
        category: 'branching',
        check: (state) => state.commits.some(c => c.message.toLowerCase().includes('merge'))
    }
];

/**
 * Tutorial content data structure
 * Organized by category for easy expansion
 */
const TUTORIALS = {
    basics: {
        title: 'Git Basics',
        icon: 'fa-code-branch',
        color: 'green',
        sections: [
            {
                title: 'Repository Setup',
                commands: [
                    { cmd: 'git init', desc: 'Create a new Git repository' },
                    { cmd: 'git clone <url>', desc: 'Clone a repository from URL' },
                    { cmd: 'git config --global user.name "Name"', desc: 'Set your username' },
                    { cmd: 'git config --global user.email "email"', desc: 'Set your email' }
                ]
            },
            {
                title: 'Basic Workflow',
                commands: [
                    { cmd: 'git add <file>', desc: 'Stage specific file' },
                    { cmd: 'git add .', desc: 'Stage all changes' },
                    { cmd: 'git commit -m "message"', desc: 'Commit staged changes' },
                    { cmd: 'git status', desc: 'Check repository status' }
                ]
            }
        ]
    },
    branching: {
        title: 'Branching & Merging',
        icon: 'fa-code-fork',
        color: 'yellow',
        sections: [
            {
                title: 'Branch Operations',
                commands: [
                    { cmd: 'git branch', desc: 'List all branches' },
                    { cmd: 'git branch <name>', desc: 'Create new branch' },
                    { cmd: 'git checkout <branch>', desc: 'Switch to branch' },
                    { cmd: 'git checkout -b <branch>', desc: 'Create and switch' },
                    { cmd: 'git branch -d <branch>', desc: 'Delete branch' }
                ]
            },
            {
                title: 'Merging',
                commands: [
                    { cmd: 'git merge <branch>', desc: 'Merge branch into current' },
                    { cmd: 'git merge --abort', desc: 'Abort merge in progress' }
                ]
            }
        ]
    },
    history: {
        title: 'History & Inspection',
        icon: 'fa-history',
        color: 'blue',
        sections: [
            {
                title: 'Viewing History',
                commands: [
                    { cmd: 'git log', desc: 'Show commit history' },
                    { cmd: 'git log --oneline', desc: 'Compact history view' },
                    { cmd: 'git diff', desc: 'Show unstaged changes' },
                    { cmd: 'git diff --staged', desc: 'Show staged changes' }
                ]
            }
        ]
    },
    remote: {
        title: 'Remote Repositories',
        icon: 'fa-cloud',
        color: 'purple',
        sections: [
            {
                title: 'Remote Operations',
                commands: [
                    { cmd: 'git remote add origin <url>', desc: 'Add remote' },
                    { cmd: 'git remote -v', desc: 'List remotes' },
                    { cmd: 'git push origin <branch>', desc: 'Push to remote' },
                    { cmd: 'git pull origin <branch>', desc: 'Pull from remote' },
                    { cmd: 'git fetch', desc: 'Download remote changes' }
                ]
            }
        ]
    },
    undoing: {
        title: 'Undoing Changes',
        icon: 'fa-undo',
        color: 'red',
        sections: [
            {
                title: 'Undo Operations',
                commands: [
                    { cmd: 'git reset HEAD <file>', desc: 'Unstage a file' },
                    { cmd: 'git reset --hard', desc: 'Discard all changes' },
                    { cmd: 'git checkout -- <file>', desc: 'Discard file changes' },
                    { cmd: 'git rm <file>', desc: 'Remove file from Git' }
                ]
            }
        ]
    }
};

/**
 * Simulated commands configuration
 * Easy to add new system commands here
 */
const SYSTEM_COMMANDS = {
    ls: {
        description: 'List files in directory',
        usage: 'ls',
        examples: ['ls', 'ls -la']
    },
    cat: {
        description: 'Display file contents',
        usage: 'cat <file>',
        examples: ['cat README.md', 'cat script.js']
    },
    echo: {
        description: 'Create file with content',
        usage: 'echo > <file> [content]',
        examples: ['echo > newfile.txt Hello World']
    },
    nano: {
        description: 'Edit file with nano text editor',
        usage: 'nano <file>',
        examples: ['nano README.md', 'nano newfile.txt']
    },
    vim: {
        description: 'Edit file with vim text editor',
        usage: 'vim <file>',
        examples: ['vim README.md', 'vim script.js']
    },
    vi: {
        description: 'Edit file with vi text editor (alias for vim)',
        usage: 'vi <file>',
        examples: ['vi README.md']
    },
    touch: {
        description: 'Create or update file',
        usage: 'touch <file>',
        examples: ['touch newfile.txt']
    },
    clear: {
        description: 'Clear terminal output',
        usage: 'clear',
        examples: ['clear']
    },
    exercise: {
        description: 'Start interactive exercises',
        usage: 'exercise',
        examples: ['exercise']
    },
    help: {
        description: 'Show available commands',
        usage: 'help',
        examples: ['help']
    },
    history: {
        description: 'Show command history',
        usage: 'history',
        examples: ['history']
    }
};

/**
 * Default file system structure
 * Easily add more default files here
 */
const DEFAULT_FILE_SYSTEM = {
    'README.md': '# My Project\n\nWelcome to Git practice!',
    'index.html': '<!DOCTYPE html>\n<html>\n<head>\n    <title>My Project</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>',
    'style.css': 'body { margin: 0; padding: 20px; font-family: Arial; }',
    'script.js': 'console.log("Hello from Git practice!");'
};

// =============================================================================
// MAIN GIT TERMINAL CLASS
// =============================================================================

class GitTerminal {
    constructor() {
        this.outputEl = document.getElementById('terminal-output');
        this.cmdLine = document.getElementById('cmdline');
        this.branchIndicator = document.getElementById('branch-indicator');
        this.tutorialModal = document.getElementById('tutorial-modal');
        this.tutorialContent = document.getElementById('tutorial-content');
        this.inputContainer = document.querySelector('.input-container');
        
        this.gitState = this.createInitialState();
        this.fileSystem = this.createFileSystem();
        
        this.history = [];
        this.histIdx = null;
        this.currentExercise = null;
        this.exerciseProgress = 0;
        this.completedExercises = new Set();
        
        // Editor state
        this.currentEditingFile = null;
        this.currentEditorType = null;
        this.originalFileContent = null;
        this.editorTextarea = null;
        this.editorKeydownHandler = null;
        
        this.init();
    }
    
    createInitialState() {
        return {
            currentRepo: null,
            currentBranch: DEFAULT_BRANCH,
            branches: [DEFAULT_BRANCH],
            commits: [],
            stagingArea: [],
            workingDirectory: {},
            remoteRepos: {},
            config: {
                'user.name': DEFAULT_USER_NAME,
                'user.email': DEFAULT_USER_EMAIL,
                'init.defaultBranch': DEFAULT_BRANCH
            },
            HEAD: null
        };
    }
    
    createFileSystem() {
        const files = {};
        Object.entries(DEFAULT_FILE_SYSTEM).forEach(([name, content]) => {
            files[name] = this.createFile(content);
        });
        return {
            '/home/user': {
                type: 'dir',
                children: files
            }
        };
    }

    createFile(content = '') {
        return {
            type: 'file',
            content: content,
            originalContent: content,
            modified: false,
            staged: false
        };
    }

    init() {
        this.bindEvents();
        this.updatePrompt();
        this.showWelcomeMessage();
        
        // Initialize working directory
        this.gitState.workingDirectory = { ...this.fileSystem['/home/user'].children };
    }
    
    showWelcomeMessage() {
        this.writeLine('🚀 Welcome to Git Practice Terminal!', 'text-green-400 font-semibold');
        this.writeLine('Type <span class="text-blue-400">git help</span> to see available commands', 'text-gray-400');
        this.writeLine('Type <span class="text-yellow-400">exercise</span> to start guided learning', 'text-gray-400');
        this.writeLine('Type <span class="text-purple-400">ls</span> to see files in repository', 'text-gray-400');
        this.writeLine('');
    }

    bindEvents() {
        this.cmdLine.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        // Add focus feedback
        this.cmdLine.addEventListener('focus', () => {
            this.inputContainer?.classList.add('ring-2', 'ring-blue-500/30');
        });
        
        this.cmdLine.addEventListener('blur', () => {
            this.inputContainer?.classList.remove('ring-2', 'ring-blue-500/30');
        });
        
        document.getElementById('btn-clear').addEventListener('click', () => {
            this.addButtonFeedback('btn-clear');
            this.clearOutput();
        });
        
        document.getElementById('btn-reset').addEventListener('click', () => {
            this.addButtonFeedback('btn-reset');
            this.resetRepository();
        });
        
        document.getElementById('btn-exercise').addEventListener('click', () => {
            this.addButtonFeedback('btn-exercise');
            this.startExercise();
        });
        
        document.getElementById('btn-tutorial').addEventListener('click', () => {
            this.addButtonFeedback('btn-tutorial');
            this.showTutorial();
        });
        
        document.getElementById('close-tutorial').addEventListener('click', () => this.hideTutorial());
        
        document.querySelectorAll('.quick-cmd').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const target = e.target.closest('.quick-cmd');
                const cmd = target.getAttribute('data-cmd');
                
                // Add click feedback
                target.classList.add('scale-95');
                setTimeout(() => target.classList.remove('scale-95'), 150);
                
                this.cmdLine.value = cmd;
                this.executeCommand(cmd);
            });
        });

        // Close modal on outside click
        this.tutorialModal.addEventListener('click', (e) => {
            if (e.target === this.tutorialModal) {
                this.hideTutorial();
            }
        });
        
        // Close modal on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && !this.tutorialModal.classList.contains('hidden')) {
                this.hideTutorial();
            }
        });

        // Focus input when clicking anywhere in terminal
        document.querySelector('.terminal-body')?.addEventListener('click', () => {
            this.cmdLine.focus();
        });
    }
    
    addButtonFeedback(btnId) {
        const btn = document.getElementById(btnId);
        if (btn) {
            btn.classList.add('scale-95');
            setTimeout(() => btn.classList.remove('scale-95'), 150);
        }
    }

    handleKeydown(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const line = this.cmdLine.value.trim();
            if (line) {
                this.executeCommand(line);
                this.histIdx = null;
            }
            this.cmdLine.value = '';
            this.cmdLine.focus();
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (this.history.length > 0) {
                this.histIdx = this.histIdx === null ? this.history.length - 1 : Math.max(0, this.histIdx - 1);
                this.cmdLine.value = this.history[this.histIdx];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (this.history.length > 0 && this.histIdx !== null) {
                this.histIdx = Math.min(this.history.length - 1, this.histIdx + 1);
                this.cmdLine.value = this.history[this.histIdx] || '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            this.autoComplete();
        }
    }

    autoComplete() {
        const input = this.cmdLine.value;
        const words = input.split(' ');
        const lastWord = words[words.length - 1];
        
        if (words[0] === 'git' && words.length === 2) {
            const gitCommands = ['init', 'clone', 'status', 'add', 'commit', 'push', 'pull', 'fetch', 'branch', 
                               'checkout', 'switch', 'log', 'diff', 'rm', 'reset', 'merge', 'remote', 'config', 
                               'stash', 'tag', 'show', 'restore', 'help'];
            const match = gitCommands.find(cmd => cmd.startsWith(lastWord));
            if (match) {
                words[words.length - 1] = match;
                this.cmdLine.value = words.join(' ') + ' ';
                this.showAutocompleteFeedback();
            }
        } else if (words.length >= 2 && (words[0] === 'cat' || words[0] === 'touch' || 
                   (words[0] === 'git' && words[1] === 'add'))) {
            const files = Object.keys(this.gitState.workingDirectory);
            const match = files.find(file => file.startsWith(lastWord));
            if (match) {
                words[words.length - 1] = match;
                this.cmdLine.value = words.join(' ');
                this.showAutocompleteFeedback();
            }
        }
    }
    
    showAutocompleteFeedback() {
        this.cmdLine.classList.add('bg-blue-500/10');
        setTimeout(() => this.cmdLine.classList.remove('bg-blue-500/10'), 200);
    }

    executeCommand(line) {
        this.writeLine(`<span class="text-green-400">${this.getPromptText()}</span> ${this.escapeHtml(line)}`, 'text-gray-300 command-feedback');
        this.history.push(line);
        
        const [command, ...args] = line.split(' ');
        
        if (command === 'git') {
            this.executeGitCommand(args);
        } else {
            this.executeSystemCommand(command, args);
        }
        
        this.checkExercise();
    }
    
    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    executeGitCommand(args) {
        const gitCommand = args[0];
        const gitArgs = args.slice(1);
        
        const commandMap = {
            'init': () => this.gitInit(gitArgs),
            'clone': () => this.gitClone(gitArgs),
            'status': () => this.gitStatus(gitArgs),
            'add': () => this.gitAdd(gitArgs),
            'commit': () => this.gitCommit(gitArgs),
            'log': () => this.gitLog(gitArgs),
            'branch': () => this.gitBranch(gitArgs),
            'checkout': () => this.gitCheckout(gitArgs),
            'switch': () => this.gitSwitch(gitArgs),
            'diff': () => this.gitDiff(gitArgs),
            'remote': () => this.gitRemote(gitArgs),
            'push': () => this.gitPush(gitArgs),
            'pull': () => this.gitPull(gitArgs),
            'config': () => this.gitConfig(gitArgs),
            'rm': () => this.gitRm(gitArgs),
            'reset': () => this.gitReset(gitArgs),
            'merge': () => this.gitMerge(gitArgs),
            'help': () => this.gitHelp(gitArgs)
        };

        if (commandMap[gitCommand]) {
            commandMap[gitCommand]();
        } else if (gitCommand) {
            this.writeError(`git: '${gitCommand}' is not a git command. See 'git help'.`);
        } else {
            this.writeError(`git: missing command. See 'git help'.`);
        }
    }

    executeSystemCommand(command, args) {
        const commandMap = {
            'ls': () => this.ls(args),
            'cat': () => this.cat(args),
            'echo': () => this.echo(args),
            'touch': () => this.touch(args),
            'nano': () => this.openEditor(args, 'nano'),
            'vim': () => this.openEditor(args, 'vim'),
            'vi': () => this.openEditor(args, 'vim'),
            'clear': () => this.clearOutput(),
            'exercise': () => this.startExercise(),
            'help': () => this.showHelp(),
            'history': () => this.showHistory()
        };

        if (commandMap[command]) {
            commandMap[command]();
        } else if (command) {
            this.writeError(`command not found: ${command}`);
        }
    }

    // Git Command Implementations
    gitInit(args) {
        if (this.gitState.currentRepo) {
            this.writeWarning('Reinitialized existing Git repository');
            return;
        }

        this.gitState.currentRepo = '/home/user';
        this.gitState.commits = [];
        this.gitState.stagingArea = [];
        this.gitState.branches = [this.gitState.config['init.defaultBranch'] || 'main'];
        this.gitState.currentBranch = this.gitState.config['init.defaultBranch'] || 'main';
        this.gitState.workingDirectory = JSON.parse(JSON.stringify(this.fileSystem['/home/user'].children));
        
        this.writeSuccess('Initialized empty Git repository in /home/user/.git/');
        this.updatePrompt();
        this.addSuccessFeedback();
    }

    gitAdd(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (args.length === 0) {
            this.writeError('Nothing specified, nothing added.');
            this.writeLine('Maybe you wanted to say \'git add .\'?', 'text-gray-400');
            return;
        }

        const target = args[0];
        const files = this.getFilesByPattern(target);

        if (files.length === 0) {
            this.writeError(`fatal: pathspec '${target}' did not match any files`);
            return;
        }

        files.forEach(filename => {
            if (!this.gitState.stagingArea.includes(filename)) {
                this.gitState.stagingArea.push(filename);
                if (this.gitState.workingDirectory[filename]) {
                    this.gitState.workingDirectory[filename].staged = true;
                }
            }
        });

        this.writeSuccess(`Added ${files.length} file${files.length === 1 ? '' : 's'} to staging area`);
        this.addSuccessFeedback();
    }

    gitCommit(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (this.gitState.stagingArea.length === 0) {
            this.writeWarning('nothing to commit, working tree clean');
            return;
        }

        const messageIndex = args.indexOf('-m');
        if (messageIndex === -1 || !args[messageIndex + 1]) {
            this.writeError('Aborting commit due to empty commit message.');
            this.writeLine('Usage: git commit -m "Your commit message"', 'text-gray-400');
            return;
        }

        const message = args[messageIndex + 1].replace(/["']/g, '');
        const commitHash = this.generateCommitHash();
        
        const commit = {
            hash: commitHash,
            message: message,
            branch: this.gitState.currentBranch,
            files: [...this.gitState.stagingArea],
            timestamp: new Date(),
            author: `${this.gitState.config['user.name']} <${this.gitState.config['user.email']}>`,
            parent: this.gitState.HEAD
        };

        this.gitState.commits.push(commit);
        this.gitState.HEAD = commitHash;
        this.gitState.stagingArea = [];
        
        // Reset staged status for files
        Object.values(this.gitState.workingDirectory).forEach(file => {
            file.staged = false;
            file.modified = false;
        });

        this.writeSuccess(`[${this.gitState.currentBranch} ${commitHash.substring(0, 7)}] ${message}`);
        this.writeLine(` ${commit.files.length} file${commit.files.length === 1 ? '' : 's'} changed`, 'text-gray-400');
        this.addSuccessFeedback();
    }

    gitStatus(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        this.writeLine(`On branch <span class="git-branch font-semibold">${this.gitState.currentBranch}</span>`, 'text-blue-400');
        
        if (this.gitState.commits.length === 0) {
            this.writeWarning('No commits yet');
        } else {
            const ahead = this.gitState.remoteRepos.origin ? 2 : 0;
            if (ahead > 0) {
                this.writeLine(`Your branch is ahead of 'origin/${this.gitState.currentBranch}' by ${ahead} commit${ahead === 1 ? '' : 's'}.`, 'text-green-400');
            }
        }

        // Staged changes
        if (this.gitState.stagingArea.length > 0) {
            this.writeLine('Changes to be committed:', 'text-green-400');
            this.writeLine('  (use "git restore --staged <file>..." to unstage)', 'text-gray-400');
            this.gitState.stagingArea.forEach(filename => {
                this.writeLine(`    <span class="file-icon git-added">A</span> ${filename}`, 'text-green-400');
            });
            this.writeLine('');
        }

        // Unstaged changes
        const unstaged = Object.entries(this.gitState.workingDirectory)
            .filter(([name, file]) => file.modified && !file.staged)
            .map(([name]) => name);

        if (unstaged.length > 0) {
            this.writeError('Changes not staged for commit:');
            this.writeLine('  (use "git add <file>..." to update what will be committed)', 'text-gray-400');
            unstaged.forEach(filename => {
                this.writeLine(`    <span class="file-icon git-modified">M</span> ${filename}`, 'text-red-400');
            });
            this.writeLine('');
        }

        // Untracked files
        const allFiles = Object.keys(this.gitState.workingDirectory);
        const untracked = allFiles.filter(filename => 
            !this.gitState.stagingArea.includes(filename) && 
            !this.gitState.commits.some(commit => commit.files.includes(filename))
        );

        if (untracked.length > 0) {
            this.writeLine('Untracked files:', 'text-gray-400');
            this.writeLine('  (use "git add <file>..." to include in what will be committed)', 'text-gray-400');
            untracked.forEach(filename => {
                this.writeLine(`    <span class="file-icon git-untracked">?</span> ${filename}`, 'text-gray-400');
            });
            this.writeLine('');
        }

        if (this.gitState.stagingArea.length === 0 && unstaged.length === 0 && untracked.length === 0) {
            this.writeSuccess('nothing to commit, working tree clean');
        }
    }

    gitLog(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (this.gitState.commits.length === 0) {
            this.writeWarning('No commits yet');
            return;
        }

        const oneline = args.includes('--oneline');
        
        this.gitState.commits.slice().reverse().forEach(commit => {
            if (oneline) {
                this.writeLine(`<span class="commit-hash">${commit.hash.substring(0, 7)}</span> ${commit.message}`);
            } else {
                this.writeLine(`commit <span class="commit-hash">${commit.hash}</span>`);
                this.writeLine(`Author: ${commit.author}`);
                this.writeLine(`Date:   ${commit.timestamp.toLocaleString()}`);
                this.writeLine('');
                this.writeLine(`    ${commit.message}`);
                this.writeLine('');
            }
        });
    }

    gitBranch(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (args.length === 0) {
            this.gitState.branches.forEach(branch => {
                const current = branch === this.gitState.currentBranch ? '<span class="text-green-400 font-semibold">*</span>' : ' ';
                this.writeLine(`${current} ${branch}`);
            });
        } else if (args[0] === '-d' && args[1]) {
            const branchToDelete = args[1];
            if (branchToDelete === this.gitState.currentBranch) {
                this.writeError(`error: Cannot delete branch '${branchToDelete}' checked out at '/home/user'`);
            } else if (this.gitState.branches.includes(branchToDelete)) {
                this.gitState.branches = this.gitState.branches.filter(b => b !== branchToDelete);
                this.writeSuccess(`Deleted branch ${branchToDelete}`);
            } else {
                this.writeError(`error: branch '${branchToDelete}' not found.`);
            }
        } else {
            const newBranch = args[0];
            if (this.gitState.branches.includes(newBranch)) {
                this.writeError(`fatal: A branch named '${newBranch}' already exists.`);
            } else {
                this.gitState.branches.push(newBranch);
                this.writeSuccess(`Created branch '${newBranch}'`);
                this.addSuccessFeedback();
            }
        }
    }

    gitCheckout(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (args.length === 0) {
            this.writeError('error: you must specify a branch to checkout');
            return;
        }

        const target = args[0];
        
        if (args[0] === '-b' && args[1]) {
            // Create and switch to new branch
            const newBranch = args[1];
            if (this.gitState.branches.includes(newBranch)) {
                this.writeError(`fatal: A branch named '${newBranch}' already exists.`);
            } else {
                this.gitState.branches.push(newBranch);
                this.gitState.currentBranch = newBranch;
                this.writeSuccess(`Switched to a new branch '${newBranch}'`);
                this.updatePrompt();
                this.addSuccessFeedback();
            }
        } else if (this.gitState.branches.includes(target)) {
            this.gitState.currentBranch = target;
            this.writeSuccess(`Switched to branch '${target}'`);
            this.updatePrompt();
            this.addSuccessFeedback();
        } else {
            this.writeError(`error: pathspec '${target}' did not match any file(s) known to git`);
        }
    }

    gitSwitch(args) {
        this.gitCheckout(args);
    }

    gitDiff(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        this.writeLine('diff --git a/file.txt b/file.txt', 'text-gray-400');
        this.writeLine('index 1234567..89abcde 100644', 'text-gray-400');
        this.writeLine('--- a/file.txt', 'text-red-400');
        this.writeLine('+++ b/file.txt', 'text-green-400');
        this.writeLine('@@ -1,3 +1,4 @@', 'text-purple-400');
        this.writeLine(' Hello, World!', 'text-gray-400');
        this.writeLine('<span class="text-green-400">+This is a new line</span>', 'text-gray-400');
        this.writeLine(' Some existing content', 'text-gray-400');
        this.writeLine('<span class="text-green-400">+Another addition</span>', 'text-gray-400');
        this.writeLine('', 'text-gray-400');
        this.writeLine('(Simulated diff output)', 'text-yellow-400 text-sm');
    }

    gitConfig(args) {
        if (args[0] === '--global' && args[1] && args[2]) {
            const key = args[1];
            const value = args.slice(2).join(' ').replace(/["']/g, '');
            if (key === 'user.name' || key === 'user.email' || key === 'init.defaultBranch') {
                this.gitState.config[key] = value;
                this.writeSuccess(`Set global ${key} to "${value}"`);
                this.addSuccessFeedback();
            } else {
                this.writeError(`error: key '${key}' is not supported in this simulation`);
            }
        } else if (args[0] === '--list') {
            Object.entries(this.gitState.config).forEach(([key, value]) => {
                this.writeLine(`${key}=${value}`);
            });
        } else {
            this.writeError('usage: git config [--global] <key> <value>');
            this.writeLine('   or: git config --list', 'text-gray-400');
        }
    }

    gitRemote(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (args[0] === 'add' && args[1] && args[2]) {
            const name = args[1];
            const url = args[2];
            this.gitState.remoteRepos[name] = url;
            this.writeSuccess(`Added remote '${name}' with URL '${url}'`);
            this.addSuccessFeedback();
        } else if (args[0] === '-v') {
            if (Object.keys(this.gitState.remoteRepos).length === 0) {
                this.writeLine('No remotes configured', 'text-gray-400');
            } else {
                Object.entries(this.gitState.remoteRepos).forEach(([name, url]) => {
                    this.writeLine(`${name}\t${url} (fetch)`);
                    this.writeLine(`${name}\t${url} (push)`);
                });
            }
        } else {
            this.writeError('usage: git remote add <name> <url>');
            this.writeLine('   or: git remote -v', 'text-gray-400');
        }
    }

    gitPush(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (Object.keys(this.gitState.remoteRepos).length === 0) {
            this.writeError('fatal: No configured push destination.');
            this.writeLine('Either specify the URL or set a remote repository using', 'text-gray-400');
            this.writeLine('git remote add <name> <url>', 'text-gray-400');
            return;
        }

        const remote = args[0] || 'origin';
        const branch = args[1] || this.gitState.currentBranch;

        if (!this.gitState.remoteRepos[remote]) {
            this.writeError(`fatal: '${remote}' does not appear to be a git repository`);
            return;
        }

        this.writeLine(`Enumerating objects: ${this.gitState.commits.length}, done.`, 'text-gray-400');
        this.writeLine(`Counting objects: 100% (${this.gitState.commits.length}/${this.gitState.commits.length}), done.`, 'text-gray-400');
        this.writeLine(`Writing objects: 100% (${this.gitState.commits.length}/${this.gitState.commits.length}), done.`, 'text-gray-400');
        this.writeLine(`Total ${this.gitState.commits.length} (delta 0), reused 0 (delta 0)`, 'text-gray-400');
        this.writeLine(`To ${this.gitState.remoteRepos[remote]}`);
        this.writeSuccess(` * [new branch]      ${branch} -> ${branch}`);
        this.addSuccessFeedback();
    }

    gitPull(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        this.writeSuccess('Already up to date.');
    }

    gitClone(args) {
        if (this.gitState.currentRepo) {
            this.writeError('fatal: destination path already exists and is not an empty directory.');
            return;
        }

        if (!args[0]) {
            this.writeError('usage: git clone <repository> [<directory>]');
            return;
        }

        this.gitState.currentRepo = '/home/user';
        this.gitState.commits = [
            {
                hash: 'a1b2c3d4',
                message: 'Initial commit',
                branch: 'main',
                files: ['README.md'],
                timestamp: new Date(),
                author: 'Other User <other@example.com>'
            }
        ];
        this.gitState.branches = ['main'];
        this.gitState.currentBranch = 'main';
        this.gitState.remoteRepos['origin'] = args[0];

        this.writeLine(`Cloning into '/home/user'...`, 'text-gray-400');
        this.writeLine('remote: Enumerating objects: 1, done.', 'text-gray-400');
        this.writeLine('remote: Counting objects: 100% (1/1), done.', 'text-gray-400');
        this.writeLine('remote: Total 1 (delta 0), reused 0 (delta 0), pack-reused 0', 'text-gray-400');
        this.writeLine('Receiving objects: 100% (1/1), done.', 'text-gray-400');
        this.updatePrompt();
        this.addSuccessFeedback();
    }

    gitRm(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (!args[0]) {
            this.writeError('usage: git rm <file>');
            return;
        }

        const filename = args[0];
        const stagedIndex = this.gitState.stagingArea.indexOf(filename);
        
        if (stagedIndex !== -1) {
            this.gitState.stagingArea.splice(stagedIndex, 1);
            delete this.gitState.workingDirectory[filename];
            this.writeSuccess(`rm '${filename}'`);
        } else {
            this.writeError(`fatal: pathspec '${filename}' did not match any files`);
        }
    }

    gitReset(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (args[0] === '--hard') {
            this.gitState.stagingArea = [];
            Object.values(this.gitState.workingDirectory).forEach(file => {
                file.staged = false;
                file.modified = false;
            });
            this.writeSuccess('HEAD is now at latest commit');
            this.addSuccessFeedback();
        } else {
            this.writeError('usage: git reset [--hard]');
        }
    }

    gitMerge(args) {
        if (!this.gitState.currentRepo) {
            this.writeError('fatal: not a git repository');
            return;
        }

        if (!args[0]) {
            this.writeError('usage: git merge <branch>');
            return;
        }

        const targetBranch = args[0];
        if (!this.gitState.branches.includes(targetBranch)) {
            this.writeError(`error: branch '${targetBranch}' not found.`);
            return;
        }

        // Create a merge commit
        const commitHash = this.generateCommitHash();
        const commit = {
            hash: commitHash,
            message: `Merge branch '${targetBranch}' into ${this.gitState.currentBranch}`,
            branch: this.gitState.currentBranch,
            files: [],
            timestamp: new Date(),
            author: `${this.gitState.config['user.name']} <${this.gitState.config['user.email']}>`,
            parent: this.gitState.HEAD
        };
        this.gitState.commits.push(commit);
        this.gitState.HEAD = commitHash;

        this.writeSuccess(`Merge made by the 'ort' strategy.`);
        this.addSuccessFeedback();
    }

    gitHelp(args) {
        this.writeLine('These are common Git commands used in various situations:', 'text-blue-400');
        this.writeLine('');
        this.writeLine('<span class="font-semibold">Start a working area</span>', 'text-yellow-400');
        this.writeLine('  clone     Clone a repository into a new directory');
        this.writeLine('  init      Create an empty Git repository');
        this.writeLine('');
        this.writeLine('<span class="font-semibold">Work on the current change</span>', 'text-yellow-400');
        this.writeLine('  add       Add file contents to the index');
        this.writeLine('  restore   Restore working tree files');
        this.writeLine('  rm        Remove files from the working tree and index');
        this.writeLine('');
        this.writeLine('<span class="font-semibold">Examine the history and state</span>', 'text-yellow-400');
        this.writeLine('  log       Show commit logs');
        this.writeLine('  status    Show the working tree status');
        this.writeLine('  diff      Show changes between commits');
        this.writeLine('');
        this.writeLine('<span class="font-semibold">Grow, mark and tweak your common history</span>', 'text-yellow-400');
        this.writeLine('  branch    List, create, or delete branches');
        this.writeLine('  commit    Record changes to the repository');
        this.writeLine('  merge     Join two or more development histories together');
        this.writeLine('  switch    Switch branches');
        this.writeLine('  tag       Create, list, delete or verify a tag object');
        this.writeLine('');
        this.writeLine('<span class="font-semibold">Collaborate</span>', 'text-yellow-400');
        this.writeLine('  fetch     Download objects and refs from another repository');
        this.writeLine('  pull      Fetch from and integrate with another repository');
        this.writeLine('  push      Update remote refs along with associated objects');
        this.writeLine('  remote    Manage set of tracked repositories');
    }

    getFilesByPattern(pattern) {
        const allFiles = Object.keys(this.gitState.workingDirectory);
        
        if (pattern === '.') {
            return allFiles.filter(filename => 
                this.gitState.workingDirectory[filename].modified || 
                !this.gitState.commits.some(commit => commit.files.includes(filename))
            );
        } else if (pattern === '*') {
            return allFiles;
        } else {
            return allFiles.filter(filename => filename.includes(pattern.replace('*', '')));
        }
    }

    generateCommitHash() {
        return Math.random().toString(36).substring(2, 10) + Math.random().toString(36).substring(2, 10);
    }

    updatePrompt() {
        const branchText = this.gitState.currentRepo ? 
            `<span class="git-branch">(${this.gitState.currentBranch})</span>` : '';
        this.branchIndicator.innerHTML = branchText;
    }

    getPromptText() {
        return `git-practice ${this.gitState.currentRepo ? `(${this.gitState.currentBranch})` : ''}:~$`;
    }

    // Output helper methods with visual feedback
    writeLine(text, className = 'text-gray-300') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        this.outputEl.appendChild(line);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }
    
    writeSuccess(text) {
        this.writeLine(text, 'text-green-400');
    }
    
    writeError(text) {
        this.writeLine(text, 'text-red-400');
        this.addErrorFeedback();
    }
    
    writeWarning(text) {
        this.writeLine(text, 'text-yellow-400');
    }
    
    addSuccessFeedback() {
        this.inputContainer?.classList.add('success-feedback');
        setTimeout(() => {
            this.inputContainer?.classList.remove('success-feedback');
        }, 600);
    }
    
    addErrorFeedback() {
        this.inputContainer?.classList.add('error-feedback');
        setTimeout(() => {
            this.inputContainer?.classList.remove('error-feedback');
        }, 300);
    }

    clearOutput() {
        this.outputEl.innerHTML = '';
        this.writeSuccess('Terminal cleared');
    }

    resetRepository() {
        this.gitState = this.createInitialState();
        this.gitState.workingDirectory = JSON.parse(JSON.stringify(this.fileSystem['/home/user'].children));
        this.exerciseProgress = 0;
        this.currentExercise = null;
        this.completedExercises.clear();
        this.updatePrompt();
        this.writeSuccess('Repository has been reset');
        this.addSuccessFeedback();
    }

    // System commands
    ls(args) {
        const files = Object.keys(this.gitState.workingDirectory);
        if (files.length === 0) {
            this.writeLine('No files in directory', 'text-gray-400');
        } else {
            const fileList = files.map(f => `<span class="text-blue-400">${f}</span>`).join('  ');
            this.writeLine(fileList);
        }
    }

    cat(args) {
        if (!args[0]) {
            this.writeError('usage: cat <file>');
            return;
        }

        const filename = args[0];
        const file = this.gitState.workingDirectory[filename];
        
        if (file && file.type === 'file') {
            this.writeLine(file.content.replace(/\n/g, '<br>'), 'text-gray-300');
        } else {
            this.writeError(`cat: ${filename}: No such file or directory`);
        }
    }

    echo(args) {
        if (args[0] === '>' && args[1]) {
            const filename = args[1];
            const content = args.slice(2).join(' ') || 'New file content';
            this.gitState.workingDirectory[filename] = this.createFile(content);
            this.gitState.workingDirectory[filename].modified = true;
            this.writeSuccess(`Created file "${filename}"`);
            this.addSuccessFeedback();
        } else {
            this.writeLine(args.join(' '), 'text-gray-300');
        }
    }

    touch(args) {
        if (!args[0]) {
            this.writeError('usage: touch <file>');
            return;
        }

        const filename = args[0];
        if (!this.gitState.workingDirectory[filename]) {
            this.gitState.workingDirectory[filename] = this.createFile();
        }
        this.gitState.workingDirectory[filename].modified = true;
        this.writeSuccess(`Updated "${filename}"`);
        this.addSuccessFeedback();
    }

    // Text Editor Implementation (nano/vim simulation)
    openEditor(args, editorType = 'nano') {
        if (!args[0]) {
            this.writeError(`usage: ${editorType} <file>`);
            return;
        }

        const filename = args[0];
        let file = this.gitState.workingDirectory[filename];
        
        // Create file if it doesn't exist
        if (!file) {
            this.gitState.workingDirectory[filename] = this.createFile('');
            file = this.gitState.workingDirectory[filename];
        }

        this.currentEditingFile = filename;
        this.currentEditorType = editorType;
        this.originalFileContent = file.content;
        
        // Get editor elements
        const modal = document.getElementById('editor-modal');
        const textarea = document.getElementById('editor-textarea');
        const filenameEl = document.getElementById('editor-filename');
        const editorTypeEl = document.getElementById('editor-type');
        const lineNumbers = document.getElementById('editor-line-numbers');
        const cursorPos = document.getElementById('editor-cursor-pos');
        const modifiedIndicator = document.getElementById('editor-modified');
        const statusMsg = document.getElementById('editor-status-msg');
        
        // Set editor type display
        if (editorType === 'vim') {
            editorTypeEl.textContent = 'VIM';
            editorTypeEl.className = 'text-green-400 font-semibold text-sm';
        } else {
            editorTypeEl.textContent = 'GNU nano';
            editorTypeEl.className = 'text-green-400 font-semibold text-sm';
        }
        
        // Set filename
        filenameEl.textContent = filename;
        
        // Set content
        textarea.value = file.content;
        modifiedIndicator.classList.add('hidden');
        statusMsg.textContent = '';
        
        // Update line numbers
        this.updateLineNumbers(textarea, lineNumbers);
        
        // Show modal
        modal.classList.remove('hidden');
        textarea.focus();
        
        // Bind editor events
        this.bindEditorEvents(textarea, lineNumbers, cursorPos, modifiedIndicator, statusMsg);
        
        this.writeLine(`Opening ${filename} with ${editorType}...`, 'text-gray-400');
    }
    
    bindEditorEvents(textarea, lineNumbers, cursorPos, modifiedIndicator, statusMsg) {
        const modal = document.getElementById('editor-modal');
        
        // Remove old listeners by cloning
        const newTextarea = textarea.cloneNode(true);
        textarea.parentNode.replaceChild(newTextarea, textarea);
        textarea = newTextarea;
        
        // Store reference
        this.editorTextarea = textarea;
        
        // Update line numbers on input
        textarea.addEventListener('input', () => {
            this.updateLineNumbers(textarea, lineNumbers);
            modifiedIndicator.classList.remove('hidden');
        });
        
        // Update cursor position
        textarea.addEventListener('keyup', () => this.updateCursorPosition(textarea, cursorPos));
        textarea.addEventListener('click', () => this.updateCursorPosition(textarea, cursorPos));
        
        // Scroll sync for line numbers
        textarea.addEventListener('scroll', () => {
            lineNumbers.scrollTop = textarea.scrollTop;
        });
        
        // Handle keyboard shortcuts
        const keydownHandler = (e) => {
            // Ctrl+S or Ctrl+O to save
            if ((e.ctrlKey || e.metaKey) && (e.key === 's' || e.key === 'o')) {
                e.preventDefault();
                this.saveEditorContent(textarea, statusMsg, modifiedIndicator);
            }
            // Escape or Ctrl+X to exit
            else if (e.key === 'Escape' || ((e.ctrlKey || e.metaKey) && e.key === 'x')) {
                e.preventDefault();
                this.closeEditor(modal);
            }
            // Tab for indentation
            else if (e.key === 'Tab') {
                e.preventDefault();
                const start = textarea.selectionStart;
                const end = textarea.selectionEnd;
                textarea.value = textarea.value.substring(0, start) + '    ' + textarea.value.substring(end);
                textarea.selectionStart = textarea.selectionEnd = start + 4;
                this.updateLineNumbers(textarea, lineNumbers);
                modifiedIndicator.classList.remove('hidden');
            }
        };
        
        textarea.addEventListener('keydown', keydownHandler);
        
        // Store handler for cleanup
        this.editorKeydownHandler = keydownHandler;
        
        // Initial cursor position
        this.updateCursorPosition(textarea, cursorPos);
    }
    
    updateLineNumbers(textarea, lineNumbers) {
        const lines = textarea.value.split('\n').length;
        let lineNumbersHtml = '';
        for (let i = 1; i <= Math.max(lines, 20); i++) {
            lineNumbersHtml += i + '\n';
        }
        lineNumbers.textContent = lineNumbersHtml.trim();
    }
    
    updateCursorPosition(textarea, cursorPos) {
        const text = textarea.value.substring(0, textarea.selectionStart);
        const lines = text.split('\n');
        const line = lines.length;
        const col = lines[lines.length - 1].length + 1;
        cursorPos.textContent = `Line ${line}, Col ${col}`;
    }
    
    saveEditorContent(textarea, statusMsg, modifiedIndicator) {
        const content = textarea.value;
        const filename = this.currentEditingFile;
        
        if (this.gitState.workingDirectory[filename]) {
            this.gitState.workingDirectory[filename].content = content;
            this.gitState.workingDirectory[filename].modified = true;
            
            modifiedIndicator.classList.add('hidden');
            statusMsg.textContent = `Saved "${filename}"`;
            statusMsg.className = 'text-green-400';
            
            setTimeout(() => {
                statusMsg.textContent = '';
            }, 2000);
        }
    }
    
    closeEditor(modal) {
        const textarea = this.editorTextarea;
        const filename = this.currentEditingFile;
        
        // Check if content was modified
        if (textarea && this.gitState.workingDirectory[filename]) {
            const currentContent = textarea.value;
            if (currentContent !== this.originalFileContent) {
                // Auto-save on close
                this.gitState.workingDirectory[filename].content = currentContent;
                this.gitState.workingDirectory[filename].modified = true;
                this.writeSuccess(`File "${filename}" saved and closed`);
            } else {
                this.writeLine(`Closed ${filename}`, 'text-gray-400');
            }
        }
        
        modal.classList.add('hidden');
        this.currentEditingFile = null;
        this.currentEditorType = null;
        this.originalFileContent = null;
        
        // Refocus terminal input
        this.cmdLine.focus();
    }
    
    // Command history display
    showHistory() {
        if (this.history.length === 0) {
            this.writeLine('No commands in history', 'text-gray-400');
            return;
        }
        
        this.writeLine('Command history:', 'text-blue-400');
        this.history.forEach((cmd, index) => {
            this.writeLine(`  ${(index + 1).toString().padStart(4)}  ${cmd}`, 'text-gray-300');
        });
    }

    showHelp() {
        this.writeLine('Available commands:', 'text-blue-400');
        this.writeLine('');
        
        // Git commands
        this.writeLine('<span class="font-semibold text-green-400">Git Commands:</span>');
        this.writeLine('  git [command]    - Execute Git commands (git help for more)');
        this.writeLine('');
        
        // System commands from config
        this.writeLine('<span class="font-semibold text-yellow-400">System Commands:</span>');
        Object.entries(SYSTEM_COMMANDS).forEach(([cmd, info]) => {
            this.writeLine(`  ${cmd.padEnd(15)} - ${info.description}`);
        });
    }

    // Enhanced Exercise system using EXERCISES data structure
    startExercise() {
        // Check if current exercise is complete
        if (this.currentExercise) {
            const exercise = EXERCISES.find(e => e.id === this.currentExercise);
            if (exercise && exercise.check(this.gitState)) {
                this.completedExercises.add(this.currentExercise);
                this.exerciseProgress++;
                this.writeSuccess(`✅ Exercise "${exercise.title}" completed!`);
                this.addSuccessFeedback();
                this.currentExercise = null;
            }
        }

        // Find next uncompleted exercise
        const nextExercise = EXERCISES.find(e => !this.completedExercises.has(e.id));
        
        if (!nextExercise) {
            this.writeLine('🎉 All exercises completed! You are now a Git master!', 'text-green-400 font-semibold');
            this.writeLine('Type "reset" and "exercise" to start over, or keep practicing!', 'text-gray-400');
            return;
        }

        this.currentExercise = nextExercise.id;
        const exerciseNum = EXERCISES.findIndex(e => e.id === nextExercise.id) + 1;
        const total = EXERCISES.length;
        
        this.writeLine('');
        this.writeLine(`🎯 Exercise ${exerciseNum}/${total}: ${nextExercise.title}`, 'text-yellow-400 font-semibold');
        this.writeLine(`   ${nextExercise.desc}`, 'text-gray-300');
        this.writeLine(`💡 Hint: ${nextExercise.hint}`, 'text-blue-400');
        this.writeLine(`📊 Difficulty: ${nextExercise.difficulty}`, 'text-purple-400');
        this.writeLine('');
    }

    checkExercise() {
        if (!this.currentExercise) return;
        
        const exercise = EXERCISES.find(e => e.id === this.currentExercise);
        if (exercise && exercise.check(this.gitState)) {
            this.completedExercises.add(this.currentExercise);
            this.exerciseProgress++;
            this.writeLine('');
            this.writeSuccess(`✅ Exercise completed! Moving to next...`);
            this.addSuccessFeedback();
            this.currentExercise = null;
            setTimeout(() => this.startExercise(), 1000);
        }
    }

    // Enhanced Tutorial using TUTORIALS data structure
    showTutorial() {
        const completedCount = this.completedExercises.size;
        const totalExercises = EXERCISES.length;
        const progressPercent = (completedCount / totalExercises) * 100;
        
        let tutorialHTML = `
            <div class="space-y-6">
                <!-- Progress Section -->
                <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <h4 class="text-lg font-semibold mb-3 text-green-400 flex items-center">
                        <i class="fas fa-chart-line mr-2"></i>Exercise Progress
                    </h4>
                    <div class="flex justify-between mb-2 text-sm">
                        <span>Completion</span>
                        <span class="font-semibold">${completedCount}/${totalExercises}</span>
                    </div>
                    <div class="w-full bg-gray-600 rounded-full h-3 overflow-hidden">
                        <div class="bg-gradient-to-r from-green-500 to-green-400 h-3 rounded-full transition-all duration-500" 
                             style="width: ${progressPercent}%"></div>
                    </div>
                    <div class="mt-2 text-xs text-gray-400">
                        ${completedCount === totalExercises ? 
                            '🎉 All exercises completed!' : 
                            `${totalExercises - completedCount} exercises remaining`}
                    </div>
                </div>
                
                <!-- Exercise List -->
                <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <h4 class="text-lg font-semibold mb-3 text-yellow-400 flex items-center">
                        <i class="fas fa-list-check mr-2"></i>Exercises
                    </h4>
                    <div class="space-y-2 max-h-48 overflow-y-auto">
                        ${EXERCISES.map((ex, i) => {
                            const isCompleted = this.completedExercises.has(ex.id);
                            const isCurrent = this.currentExercise === ex.id;
                            return `
                                <div class="flex items-center justify-between p-2 rounded ${
                                    isCompleted ? 'bg-green-500/20' : 
                                    isCurrent ? 'bg-blue-500/20' : 'bg-gray-600/50'
                                }">
                                    <div class="flex items-center">
                                        <span class="w-6 h-6 flex items-center justify-center rounded-full ${
                                            isCompleted ? 'bg-green-500' : 
                                            isCurrent ? 'bg-blue-500' : 'bg-gray-500'
                                        } text-xs mr-2">${isCompleted ? '✓' : i + 1}</span>
                                        <span class="${isCompleted ? 'text-green-300' : ''}">${ex.title}</span>
                                    </div>
                                    <span class="text-xs px-2 py-0.5 rounded ${
                                        ex.difficulty === 'beginner' ? 'bg-green-500/30 text-green-300' :
                                        ex.difficulty === 'intermediate' ? 'bg-yellow-500/30 text-yellow-300' :
                                        'bg-red-500/30 text-red-300'
                                    }">${ex.difficulty}</span>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>

                <!-- Tutorial Sections -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${Object.entries(TUTORIALS).map(([key, tutorial]) => `
                        <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600 hover:border-gray-500 transition-colors">
                            <h5 class="font-semibold text-${tutorial.color}-400 mb-3 flex items-center">
                                <i class="fas ${tutorial.icon} mr-2"></i>${tutorial.title}
                            </h5>
                            ${tutorial.sections.map(section => `
                                <div class="mb-3">
                                    <div class="text-xs text-gray-400 mb-1">${section.title}</div>
                                    ${section.commands.map(cmd => `
                                        <code class="text-xs block mb-1 text-gray-300 hover:text-white transition-colors cursor-pointer" 
                                              onclick="navigator.clipboard.writeText('${cmd.cmd}')" 
                                              title="Click to copy">
                                            ${cmd.cmd}
                                        </code>
                                    `).join('')}
                                </div>
                            `).join('')}
                        </div>
                    `).join('')}
                </div>

                <!-- Quick Start -->
                <div class="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                    <h4 class="text-lg font-semibold mb-3 text-purple-400 flex items-center">
                        <i class="fas fa-rocket mr-2"></i>Quick Start Workflow
                    </h4>
                    <div class="bg-gray-800 rounded-lg p-4 font-mono text-sm">
                        <code class="text-gray-400 block"># Initialize repository</code>
                        <code class="text-green-400 block">git init</code>
                        <code class="text-gray-400 block mt-2"># Stage all files</code>
                        <code class="text-green-400 block">git add .</code>
                        <code class="text-gray-400 block mt-2"># Create first commit</code>
                        <code class="text-green-400 block">git commit -m "Initial commit"</code>
                        <code class="text-gray-400 block mt-2"># View history</code>
                        <code class="text-green-400 block">git log --oneline</code>
                    </div>
                </div>
            </div>
        `;
        
        this.tutorialContent.innerHTML = tutorialHTML;
        this.tutorialModal.classList.remove('hidden');
        
        // Add entrance animation
        requestAnimationFrame(() => {
            this.tutorialModal.style.opacity = '1';
        });
    }

    hideTutorial() {
        this.tutorialModal.classList.add('hidden');
    }
}

// Initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    window.gitTerminal = new GitTerminal();
});

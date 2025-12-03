class GitTerminal {
    constructor() {
        this.outputEl = document.getElementById('terminal-output');
        this.cmdLine = document.getElementById('cmdline');
        this.branchIndicator = document.getElementById('branch-indicator');
        this.tutorialModal = document.getElementById('tutorial-modal');
        this.tutorialContent = document.getElementById('tutorial-content');
        
        this.gitState = {
            currentRepo: null,
            currentBranch: 'main',
            branches: ['main'],
            commits: [],
            stagingArea: [],
            workingDirectory: {},
            remoteRepos: {},
            config: {
                'user.name': 'Git Learner',
                'user.email': 'learner@example.com',
                'init.defaultBranch': 'main'
            },
            HEAD: null
        };

        this.fileSystem = {
            '/home/user': {
                type: 'dir',
                children: {
                    'README.md': this.createFile('# My Project\n\nWelcome to Git practice!'),
                    'index.html': this.createFile('<!DOCTYPE html>\n<html>\n<head>\n    <title>My Project</title>\n</head>\n<body>\n    <h1>Hello World</h1>\n</body>\n</html>'),
                    'style.css': this.createFile('body { margin: 0; padding: 20px; font-family: Arial; }'),
                    'script.js': this.createFile('console.log("Hello from Git practice!");')
                }
            }
        };

        this.history = [];
        this.histIdx = null;
        this.currentExercise = null;
        this.exerciseProgress = 0;
        
        this.init();
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
        this.writeLine('🚀 Welcome to Git Practice Terminal!', 'text-green-400 font-semibold');
        this.writeLine('Type <span class="text-blue-400">git help</span> to see available commands', 'text-gray-400');
        this.writeLine('Type <span class="text-yellow-400">exercise</span> to start guided learning', 'text-gray-400');
        this.writeLine('Type <span class="text-purple-400">ls</span> to see files in repository', 'text-gray-400');
        this.writeLine('');
        
        // Initialize working directory
        this.gitState.workingDirectory = { ...this.fileSystem['/home/user'].children };
    }

    bindEvents() {
        this.cmdLine.addEventListener('keydown', (e) => this.handleKeydown(e));
        
        document.getElementById('btn-clear').addEventListener('click', () => this.clearOutput());
        document.getElementById('btn-reset').addEventListener('click', () => this.resetRepository());
        document.getElementById('btn-exercise').addEventListener('click', () => this.startExercise());
        document.getElementById('btn-tutorial').addEventListener('click', () => this.showTutorial());
        document.getElementById('close-tutorial').addEventListener('click', () => this.hideTutorial());
        
        document.querySelectorAll('.quick-cmd').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const cmd = e.target.getAttribute('data-cmd');
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

        // Focus input when clicking anywhere
        document.addEventListener('click', () => {
            this.cmdLine.focus();
        });
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
            }
        } else if (words.length === 1 && (words[0] === 'cat' || words[0] === 'touch')) {
            const files = Object.keys(this.gitState.workingDirectory);
            const match = files.find(file => file.startsWith(lastWord));
            if (match) {
                this.cmdLine.value = words[0] + ' ' + match + ' ';
            }
        }
    }

    executeCommand(line) {
        this.writeLine(`<span class="text-green-400">${this.getPromptText()}</span> ${line}`, 'text-gray-300');
        this.history.push(line);
        
        const [command, ...args] = line.split(' ');
        
        if (command === 'git') {
            this.executeGitCommand(args);
        } else {
            this.executeSystemCommand(command, args);
        }
        
        this.checkExercise();
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
            this.writeLine(`git: '${gitCommand}' is not a git command. See 'git help'.`, 'text-red-400');
        } else {
            this.writeLine(`git: missing command. See 'git help'.`, 'text-red-400');
        }
    }

    executeSystemCommand(command, args) {
        const commandMap = {
            'ls': () => this.ls(args),
            'cat': () => this.cat(args),
            'echo': () => this.echo(args),
            'touch': () => this.touch(args),
            'clear': () => this.clearOutput(),
            'exercise': () => this.startExercise(),
            'help': () => this.showHelp()
        };

        if (commandMap[command]) {
            commandMap[command]();
        } else if (command) {
            this.writeLine(`command not found: ${command}`, 'text-red-400');
        }
    }

    // Git Command Implementations
    gitInit(args) {
        if (this.gitState.currentRepo) {
            this.writeLine('Reinitialized existing Git repository', 'text-yellow-400');
            return;
        }

        this.gitState.currentRepo = '/home/user';
        this.gitState.commits = [];
        this.gitState.stagingArea = [];
        this.gitState.branches = [this.gitState.config['init.defaultBranch'] || 'main'];
        this.gitState.currentBranch = this.gitState.config['init.defaultBranch'] || 'main';
        this.gitState.workingDirectory = JSON.parse(JSON.stringify(this.fileSystem['/home/user'].children));
        
        this.writeLine('Initialized empty Git repository in /home/user/.git/', 'text-green-400');
        this.updatePrompt();
    }

    gitAdd(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (args.length === 0) {
            this.writeLine('Nothing specified, nothing added.', 'text-red-400');
            this.writeLine('Maybe you wanted to say \'git add .\'?', 'text-gray-400');
            return;
        }

        const target = args[0];
        const files = this.getFilesByPattern(target);

        if (files.length === 0) {
            this.writeLine(`fatal: pathspec '${target}' did not match any files`, 'text-red-400');
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

        this.writeLine(`Added ${files.length} file${files.length === 1 ? '' : 's'} to staging area`, 'text-green-400');
    }

    gitCommit(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (this.gitState.stagingArea.length === 0) {
            this.writeLine('nothing to commit, working tree clean', 'text-yellow-400');
            return;
        }

        const messageIndex = args.indexOf('-m');
        if (messageIndex === -1 || !args[messageIndex + 1]) {
            this.writeLine('Aborting commit due to empty commit message.', 'text-red-400');
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

        this.writeLine(`[${this.gitState.currentBranch} ${commitHash.substring(0, 7)}] ${message}`, 'text-green-400');
        this.writeLine(` ${commit.files.length} file${commit.files.length === 1 ? '' : 's'} changed`, 'text-gray-400');
    }

    gitStatus(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        this.writeLine(`On branch <span class="git-branch font-semibold">${this.gitState.currentBranch}</span>`, 'text-blue-400');
        
        if (this.gitState.commits.length === 0) {
            this.writeLine('No commits yet', 'text-yellow-400');
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
            this.writeLine('Changes not staged for commit:', 'text-red-400');
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
            this.writeLine('nothing to commit, working tree clean', 'text-green-400');
        }
    }

    gitLog(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (this.gitState.commits.length === 0) {
            this.writeLine('No commits yet', 'text-yellow-400');
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
            this.writeLine('fatal: not a git repository', 'text-red-400');
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
                this.writeLine(`error: Cannot delete branch '${branchToDelete}' checked out at '/home/user'`, 'text-red-400');
            } else if (this.gitState.branches.includes(branchToDelete)) {
                this.gitState.branches = this.gitState.branches.filter(b => b !== branchToDelete);
                this.writeLine(`Deleted branch ${branchToDelete}`, 'text-green-400');
            } else {
                this.writeLine(`error: branch '${branchToDelete}' not found.`, 'text-red-400');
            }
        } else {
            const newBranch = args[0];
            if (this.gitState.branches.includes(newBranch)) {
                this.writeLine(`fatal: A branch named '${newBranch}' already exists.`, 'text-red-400');
            } else {
                this.gitState.branches.push(newBranch);
                this.writeLine(`Created branch '${newBranch}'`, 'text-green-400');
            }
        }
    }

    gitCheckout(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (args.length === 0) {
            this.writeLine('error: you must specify a branch to checkout', 'text-red-400');
            return;
        }

        const target = args[0];
        
        if (args[0] === '-b' && args[1]) {
            // Create and switch to new branch
            const newBranch = args[1];
            if (this.gitState.branches.includes(newBranch)) {
                this.writeLine(`fatal: A branch named '${newBranch}' already exists.`, 'text-red-400');
            } else {
                this.gitState.branches.push(newBranch);
                this.gitState.currentBranch = newBranch;
                this.writeLine(`Switched to a new branch '${newBranch}'`, 'text-green-400');
                this.updatePrompt();
            }
        } else if (this.gitState.branches.includes(target)) {
            this.gitState.currentBranch = target;
            this.writeLine(`Switched to branch '${target}'`, 'text-green-400');
            this.updatePrompt();
        } else {
            this.writeLine(`error: pathspec '${target}' did not match any file(s) known to git`, 'text-red-400');
        }
    }

    gitSwitch(args) {
        this.gitCheckout(args);
    }

    gitDiff(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
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
            const value = args[2];
            if (key === 'user.name' || key === 'user.email') {
                gitState.config[key] = value;
                this.writeLine(`Set global ${key} to "${value}"`, 'text-green-400');
            }
        } else if (args[0] === '--list') {
            Object.entries(this.gitState.config).forEach(([key, value]) => {
                this.writeLine(`${key}=${value}`);
            });
        } else {
            this.writeLine('usage: git config [--global] <key> <value>', 'text-red-400');
            this.writeLine('   or: git config --list', 'text-gray-400');
        }
    }

    gitRemote(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (args[0] === 'add' && args[1] && args[2]) {
            const name = args[1];
            const url = args[2];
            this.gitState.remoteRepos[name] = url;
            this.writeLine(`Added remote '${name}' with URL '${url}'`, 'text-green-400');
        } else if (args[0] === '-v') {
            Object.entries(this.gitState.remoteRepos).forEach(([name, url]) => {
                this.writeLine(`${name}\t${url} (fetch)`);
                this.writeLine(`${name}\t${url} (push)`);
            });
        } else {
            this.writeLine('usage: git remote add <name> <url>', 'text-red-400');
            this.writeLine('   or: git remote -v', 'text-gray-400');
        }
    }

    gitPush(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (Object.keys(this.gitState.remoteRepos).length === 0) {
            this.writeLine('fatal: No configured push destination.', 'text-red-400');
            this.writeLine('Either specify the URL or set a remote repository using', 'text-gray-400');
            this.writeLine('git remote add <name> <url>', 'text-gray-400');
            return;
        }

        const remote = args[0] || 'origin';
        const branch = args[1] || this.gitState.currentBranch;

        if (!this.gitState.remoteRepos[remote]) {
            this.writeLine(`fatal: '${remote}' does not appear to be a git repository`, 'text-red-400');
            return;
        }

        this.writeLine(`Enumerating objects: ${this.gitState.commits.length}, done.`, 'text-gray-400');
        this.writeLine(`Counting objects: 100% (${this.gitState.commits.length}/${this.gitState.commits.length}), done.`, 'text-gray-400');
        this.writeLine(`Writing objects: 100% (${this.gitState.commits.length}/${this.gitState.commits.length}), done.`, 'text-gray-400');
        this.writeLine(`Total ${this.gitState.commits.length} (delta 0), reused 0 (delta 0)`, 'text-gray-400');
        this.writeLine(`To ${this.gitState.remoteRepos[remote]}`);
        this.writeLine(` * [new branch]      ${branch} -> ${branch}`, 'text-green-400');
    }

    gitPull(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        this.writeLine('Already up to date.', 'text-green-400');
    }

    gitClone(args) {
        if (this.gitState.currentRepo) {
            this.writeLine('fatal: destination path already exists and is not an empty directory.', 'text-red-400');
            return;
        }

        if (!args[0]) {
            this.writeLine('usage: git clone <repository> [<directory>]', 'text-red-400');
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
    }

    gitRm(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (!args[0]) {
            this.writeLine('usage: git rm <file>', 'text-red-400');
            return;
        }

        const filename = args[0];
        const stagedIndex = this.gitState.stagingArea.indexOf(filename);
        
        if (stagedIndex !== -1) {
            this.gitState.stagingArea.splice(stagedIndex, 1);
            delete this.gitState.workingDirectory[filename];
            this.writeLine(`rm '${filename}'`, 'text-green-400');
        } else {
            this.writeLine(`fatal: pathspec '${filename}' did not match any files`, 'text-red-400');
        }
    }

    gitReset(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (args[0] === '--hard') {
            this.gitState.stagingArea = [];
            Object.values(this.gitState.workingDirectory).forEach(file => {
                file.staged = false;
                file.modified = false;
            });
            this.writeLine('HEAD is now at latest commit', 'text-green-400');
        } else {
            this.writeLine('usage: git reset [--hard]', 'text-red-400');
        }
    }

    gitMerge(args) {
        if (!this.gitState.currentRepo) {
            this.writeLine('fatal: not a git repository', 'text-red-400');
            return;
        }

        if (!args[0]) {
            this.writeLine('usage: git merge <branch>', 'text-red-400');
            return;
        }

        const targetBranch = args[0];
        if (!this.gitState.branches.includes(targetBranch)) {
            this.writeLine(`error: branch '${targetBranch}' not found.`, 'text-red-400');
            return;
        }

        this.writeLine(`Merge made by the 'ort' strategy.`, 'text-green-400');
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

    writeLine(text, className = 'text-gray-300') {
        const line = document.createElement('div');
        line.className = className;
        line.innerHTML = text;
        this.outputEl.appendChild(line);
        this.outputEl.scrollTop = this.outputEl.scrollHeight;
    }

    clearOutput() {
        this.outputEl.innerHTML = '';
    }

    resetRepository() {
        this.gitState = {
            currentRepo: null,
            currentBranch: 'main',
            branches: ['main'],
            commits: [],
            stagingArea: [],
            workingDirectory: JSON.parse(JSON.stringify(this.fileSystem['/home/user'].children)),
            remoteRepos: {},
            config: {
                'user.name': 'Git Learner',
                'user.email': 'learner@example.com',
                'init.defaultBranch': 'main'
            },
            HEAD: null
        };
        this.updatePrompt();
        this.writeLine('Repository has been reset', 'text-green-400');
    }

    // System commands
    ls(args) {
        const files = Object.keys(this.gitState.workingDirectory);
        if (files.length === 0) {
            this.writeLine('No files in directory', 'text-gray-400');
        } else {
            this.writeLine(files.join('  '), 'text-blue-400');
        }
    }

    cat(args) {
        if (!args[0]) {
            this.writeLine('usage: cat <file>', 'text-red-400');
            return;
        }

        const filename = args[0];
        const file = this.gitState.workingDirectory[filename];
        
        if (file && file.type === 'file') {
            this.writeLine(file.content, 'text-gray-300');
        } else {
            this.writeLine(`cat: ${filename}: No such file or directory`, 'text-red-400');
        }
    }

    echo(args) {
        if (args[0] === '>' && args[1]) {
            const filename = args[1];
            const content = args.slice(2).join(' ') || 'New file content';
            this.gitState.workingDirectory[filename] = this.createFile(content);
            this.gitState.workingDirectory[filename].modified = true;
            this.writeLine(`Created file "${filename}"`, 'text-green-400');
        } else {
            this.writeLine(args.join(' '), 'text-gray-300');
        }
    }

    touch(args) {
        if (!args[0]) {
            this.writeLine('usage: touch <file>', 'text-red-400');
            return;
        }

        const filename = args[0];
        if (!this.gitState.workingDirectory[filename]) {
            this.gitState.workingDirectory[filename] = this.createFile();
        }
        this.gitState.workingDirectory[filename].modified = true;
        this.writeLine(`Updated "${filename}"`, 'text-green-400');
    }

    showHelp() {
        this.writeLine('Available commands:', 'text-blue-400');
        this.writeLine('  git [command]    - Execute Git commands');
        this.writeLine('  ls               - List files');
        this.writeLine('  cat <file>       - Show file content');
        this.writeLine('  echo > <file>    - Create file with content');
        this.writeLine('  touch <file>     - Create empty file');
        this.writeLine('  clear            - Clear terminal');
        this.writeLine('  exercise         - Start exercises');
        this.writeLine('  help             - Show this help');
    }

    // Exercise system
    startExercise() {
        const exercises = [
            {
                desc: 'Configure your Git user name and email',
                check: () => this.gitState.config['user.name'] !== 'Git Learner',
                hint: 'Use: git config --global user.name "Your Name" and git config --global user.email "your@email.com"'
            },
            {
                desc: 'Initialize a new Git repository',
                check: () => this.gitState.currentRepo !== null,
                hint: 'Use: git init'
            },
            {
                desc: 'Add all files to staging area',
                check: () => this.gitState.stagingArea.length > 0,
                hint: 'Use: git add . or git add <filename>'
            },
            {
                desc: 'Make your first commit',
                check: () => this.gitState.commits.length > 0,
                hint: 'Use: git commit -m "Initial commit"'
            },
            {
                desc: 'Create and switch to a new branch',
                check: () => this.gitState.branches.length > 1 && this.gitState.currentBranch !== 'main',
                hint: 'Use: git branch new-feature then git checkout new-feature'
            }
        ];

        if (this.currentExercise && this.currentExercise.check()) {
            this.exerciseProgress++;
            this.writeLine(`✅ Exercise ${this.exerciseProgress} completed!`, 'text-green-400 font-semibold');
            this.currentExercise = null;
        }

        if (this.exerciseProgress >= exercises.length) {
            this.writeLine('🎉 All exercises completed! You are now a Git master!', 'text-green-400 font-semibold');
            return;
        }

        this.currentExercise = exercises[this.exerciseProgress];
        this.writeLine(`🎯 Exercise ${this.exerciseProgress + 1}/${exercises.length}: ${this.currentExercise.desc}`, 'text-yellow-400 font-semibold');
        this.writeLine(`💡 Hint: ${this.currentExercise.hint}`, 'text-blue-400');
    }

    checkExercise() {
        if (this.currentExercise && this.currentExercise.check()) {
            this.exerciseProgress++;
            this.writeLine(`✅ Exercise completed! Moving to next...`, 'text-green-400');
            this.currentExercise = null;
            setTimeout(() => this.startExercise(), 1000);
        }
    }

    showTutorial() {
        this.tutorialContent.innerHTML = `
            <div class="space-y-4 md:space-y-6">
                <div>
                    <h4 class="text-lg md:text-xl font-semibold mb-3 text-blue-400">Git Basics Tutorial</h4>
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                        <div class="bg-gray-700 p-3 md:p-4 rounded-lg">
                            <h5 class="font-semibold text-green-400 mb-2">Repository Setup</h5>
                            <code class="text-xs md:text-sm block mb-1">git init</code>
                            <code class="text-xs md:text-sm block mb-1">git config --global user.name "Name"</code>
                            <code class="text-xs md:text-sm block">git config --global user.email "email"</code>
                        </div>
                        <div class="bg-gray-700 p-3 md:p-4 rounded-lg">
                            <h5 class="font-semibold text-yellow-400 mb-2">Basic Workflow</h5>
                            <code class="text-xs md:text-sm block mb-1">git add .</code>
                            <code class="text-xs md:text-sm block mb-1">git commit -m "message"</code>
                            <code class="text-xs md:text-sm block">git status</code>
                        </div>
                    </div>
                </div>
                
                <div>
                    <h4 class="text-lg md:text-xl font-semibold mb-3 text-green-400">Exercise Progress</h4>
                    <div class="bg-gray-700 rounded-lg p-3 md:p-4">
                        <div class="flex justify-between mb-2 text-sm">
                            <span>Completion</span>
                            <span>${this.exerciseProgress}/5</span>
                        </div>
                        <div class="w-full bg-gray-600 rounded-full h-2">
                            <div class="bg-green-500 h-2 rounded-full transition-all duration-500" style="width: ${(this.exerciseProgress/5)*100}%"></div>
                        </div>
                        <div class="mt-2 text-xs text-gray-400">
                            ${this.exerciseProgress === 5 ? 'All exercises completed! 🎉' : `${5 - this.exerciseProgress} exercises remaining`}
                        </div>
                    </div>
                </div>

                <div>
                    <h4 class="text-lg md:text-xl font-semibold mb-3 text-purple-400">Quick Start</h4>
                    <div class="bg-gray-700 rounded-lg p-3 md:p-4">
                        <code class="text-xs md:text-sm block mb-2"># Initialize repository</code>
                        <code class="text-xs md:text-sm block mb-2">git init</code>
                        <code class="text-xs md:text-sm block mb-2">git add .</code>
                        <code class="text-xs md:text-sm block mb-2">git commit -m "First commit"</code>
                        <code class="text-xs md:text-sm block">git log --oneline</code>
                    </div>
                </div>
            </div>
        `;
        this.tutorialModal.classList.remove('hidden');
    }

    hideTutorial() {
        this.tutorialModal.classList.add('hidden');
    }
}

// Initialize the terminal when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new GitTerminal();
});

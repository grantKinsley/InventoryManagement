# InventoryManagement

## Dependency Resolution

To ensure we are all using the same versions of python, pandas, etc. we will opt to use poetry.
If you worked with Node.js before, poetry has a similar method of resolution as Node with node_modules.

<b>Note that for all poetry operations, you will need to be in the main project folder (contains poetry.lock and pyproject.toml) or a child folder of said folder</b>

### Install:

Install <a href="https://pypa.github.io/pipx/">pipx</a> and then use pipx to install <a href="https://python-poetry.org/docs/#installing-with-pipx">poetry</a>. Install project dependencies with ```$ poetry install```

### Basic Usage:

See <a href="https://python-poetry.org/docs/basic-usage/">the docs</a> for more info.
Run any script using the project dependencies using `$ poetry run SCRIPT HERE`

Examples:

```$ poetry run python3 script.py```

```$ poetry run pip list```

Add dependencies as follows:

```$ poetry add pandas```

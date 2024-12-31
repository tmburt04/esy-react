const { readJsonSync } = require('fs-extra');

class ProjectProvider {
    constructor(filePath = '') {
        if (filePath.endsWith('package.json')) {
            this.filePath = filePath;
        } else {
            this.filePath = filePath + '/package.json';
        }
        this.filePath = filePath + '/package.json';
        this.content = null;
    }

    /**
     * Loads and parses the package.json file
     * @returns {Object} Parsed package.json content
     * @throws {Error} If file cannot be read or parsed
     */
    async load() {
        try {
            const rawData = await readJsonSync(this.filePath, { throws: false });
            this.content = rawData;
            return this.content;
        } catch (error) {
            if (error.code === 'ENOENT') {
                throw new Error(`package.json not found at ${this.filePath}`);
            }
            throw new Error(`Error reading package.json: ${error.message}`);
        }
    }

    /**
     * Gets a specific value from package.json using dot notation
     * @param {string} path - Dot notation path (e.g., 'dependencies.react')
     * @returns {any} Value at the specified path
     */
    get(path) {
        if (!this.content) {
            this.load();
        }

        return path.split('.').reduce((obj, key) => {
            return obj && obj[key];
        }, this.content);
    }

    /**
     * Gets all dependencies (including devDependencies)
     * @returns {Object} Combined dependencies
     */
    getAllDependencies() {
        if (!this.content) {
            this.load();
        }

        return {
            ...this.content.dependencies,
            ...this.content.devDependencies
        };
    }

    /**
     * Checks if a specific package is installed
     * @param {string} packageName - Name of the package to check
     * @returns {boolean} True if package exists in dependencies or devDependencies
     */
    hasPackage(packageName) {
        const allDeps = this.getAllDependencies();
        return !!allDeps[packageName];
    }

    /**
     * Gets the version of a specific package
     * @param {string} packageName - Name of the package
     * @returns {string|null} Version of the package or null if not found
     */
    getPackageVersion(packageName) {
        const allDeps = this.getAllDependencies();
        return allDeps[packageName] || null;
    }
}

module.exports = { ProjectProvider };
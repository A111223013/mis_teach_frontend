export class SourceService {

    constructor(inspector, dependencyService, options) {
        this.inspector = inspector;
        this.dependencyService = dependencyService;
        this.sources = {}; // { [key: string]: { source: sourceOption, updateFunction: (sourceResult) => void, initialized: boolean }}
        this.options = options || {};
    }

    add(path, source, updateFunction) {
        this.sources[path] = {
            sourceOption: source,
            updateFunction: updateFunction,
            initialized: false
        };

        if (source.dependencies) {
            const dependencies = source.dependencies.map((dep) => {
                return {
                    name: dep,
                    path: this.resolveDependency(path, dep)
                }
            });
            this.dependencyService.subscribe(dependencies, (dep, changedPath) => {
                const dependencies = {};
                dependencies[dep.name] = {
                    path: dep.path,
                    changedPath: changedPath
                };
                this.refresh(path, {
                    dependencies: dependencies
                });
            });
        }
    }

    initSources() {
        for (const path in this.sources) {
            const source = this.sources[path];
            if (!source.initialized) {
                this.refresh(path, { initialized: true });
                source.initialized = true;
            }
        }
    }

    refresh(path, options = {}) {
        const sourceContainer = this.sources[path];
        if (sourceContainer) {
            const model = this.inspector.getModel();
            const dependencies = options.dependencies || {};
            if (sourceContainer.sourceOption.dependencies) {
                sourceContainer.sourceOption.dependencies.forEach(depPath => {
                    // Get value from model for dependencies
                    const resolvedDependency = this.resolveDependency(path, depPath);
                    if (!dependencies[depPath]) {
                        dependencies[depPath] = {
                            path: resolvedDependency,
                            changedPath: null
                        };
                    }
                    dependencies[depPath].value = model.prop(resolvedDependency);
                });
            }

            const sourceResult = sourceContainer.sourceOption.source({
                dependencies: dependencies,
                inspector: this.inspector,
                model: model,
                initialized: Boolean(options.initialized),
                path
            })

            if (sourceResult instanceof Promise) {
                sourceResult.then((result) => {
                    sourceContainer.updateFunction(result);
                }).catch((error) => { console.error('Inspector source resolving: ' + error); });
            } else {
                sourceContainer.updateFunction(sourceResult);
            }
        }
    }

    refreshAll() {
        for (const path in this.sources) {
            this.refresh(path);
        }
    }

    resolveDependency(path, dependencyPath) {
        const wildcard = this.options.wildcard;
        const depElements = dependencyPath.split('/');
        const pathElements = path.split('/');
        return depElements.reduce((result, el, i) => {
            if (el === wildcard) {
                return result + pathElements[i] + '/';
            } else {
                return result + el + '/';
            }
        }, '').slice(0, -1);
    }

    clear() {
        this.sources = {};
    }
}

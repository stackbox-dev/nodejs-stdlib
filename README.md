# Stackbox Nodejs Standard Utility

- Graph Algorithms

  - Detect Cycles
  - Topological Sort
  - Distance Matrix using Floyd Warshal
  - Closure

- Lang (SortBy, groupBy, maxBy, etc, etc)

- BinPack
  - First-Fit Decreasing

### Install

- All stackbox nodejs libraries are hosted in GCP Artifact NPM Registry
- Paste the following snippet in the `.npmrc` file

```
@stackbox:registry=https://us-npm.pkg.dev/sbx-ci-cd/npm-public/
//us-npm.pkg.dev/sbx-ci-cd/npm-public/:always-auth=true%
```

- If the npm registry is private, authentication token needs to be generated using
  `npx google-artifactregistry-auth --repo-config=.npmrc`
- You can have that as a npm-script in package.json and run it whenever you need to run `npm install` or `npm upgrade`
- `npm install @stackbox/stdlib`

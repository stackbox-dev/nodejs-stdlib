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

- All stackbox nodejs libraries are hosted in Github Packages
- Paste the following snippet in the `.npmrc` file
  ```
  @stackbox-dev:registry=https://npm.pkg.github.com
  ```
- 
  Use PAT (Personal Access Tokens) [Github Help](https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry#authenticating-with-a-personal-access-token)
  1. generate PAT from github
  2. Run npm login like the following
  ```
  npm login --scope=@OWNER --registry=https://npm.pkg.github.com

  > Username: USERNAME
  > Password: TOKEN
  > Email: PUBLIC-EMAIL-ADDRESS
  ```

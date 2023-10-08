# create-repository action

This workflow creates a GitHub repository if it does not already exist.

## Example workflow

```yml
name: Create Repo
on: 
  workflow_dispatch:
    inputs:
      repo-name: 
        description: 'What is the name of the repository?'
        required: true
        default: ''
      private: 
        description: 'Is private repository?'
        type: boolean
        default: false

jobs:
  create-repository:
    runs-on: ubuntu-latest
    name: Create repository
    steps:
      - name: Use Node.js
        uses: actions/setup-node@v3
      - name: Creating GitHub Organization Repository
        uses: actions-github/create-repository@v1
        id: create-repo
        with:
          repo-name: '${{ github.event.inputs.repo-name }}'
          token: '${{ secrets.PERSONAL_ACCESS_TOKEN }}'
          private: '${{ github.event.inputs.private }}'
      - name: Log URL to the repo
        run: echo "The new repo is ${{ steps.create-repo.outputs.repo-url }}"
```

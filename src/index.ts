import { callApi } from "./api.js";

import core from "@actions/core";
import github from "@actions/github";

const targetRepoName = core.getInput("repo-name");
const ghToken = core.getInput("token");
const isPrivate = core.getInput("private");
const targetOrgName = github.context.payload.repository?.owner.login;

(async function () {
  // Check if the repository already exists
  try {
    console.log(
      `Checking if repository ${targetRepoName} is already exists...`
    );
    const checkRepoExists = await callApi({
      hostname: "api.github.com",
      path: `/repos/${targetOrgName}/${targetRepoName}`,
      method: "GET",
      headers: {
        Accept: "application/vnd.github.v3+json",
        Authorization: "token " + ghToken,
        "User-Agent": "nodejs", // GitHub API requires a user-agent header
      },
    });
    if (checkRepoExists.statusCode === 200) {
      // Reepository already exists
      console.log(`Repository ${targetRepoName} already exists.`);
      core.setOutput(
        "repo-url",
        "https://github.com/" + targetOrgName + "/" + targetRepoName
      );
    } else if (checkRepoExists.statusCode === 404) {
      // Create the repository
      console.log(`Repository ${targetRepoName} does not exist.`);
      console.log(
        `Creating repository ${targetRepoName} ${
          isPrivate == "true" ? "(private)" : "(public)"
        } ...`
      );
      const createRepoData = JSON.stringify({
        name: targetRepoName,
        private: isPrivate == "true" ? true : false,
      });

      const createRepoResponse = await callApi(
        {
          hostname: "api.github.com",
          path: `/orgs/${targetOrgName}/repos`,
          method: "POST",
          headers: {
            Accept: "application/vnd.github.v3+json",
            Authorization: "token " + ghToken,
            "Content-Type": "application/json",
            "User-Agent": "nodejs", // GitHub API requires a user-agent header
          },
        },
        createRepoData
      );

      if (createRepoResponse.statusCode === 201) {
        console.log(
          `Repository ${targetRepoName} ${
            isPrivate == "true" ? "(private)" : "(public)"
          } created successfully!`
        );
        core.setOutput(
          "repo-url",
          "https://github.com/" + targetOrgName + "/" + targetRepoName
        );
      } else {
        core.setOutput("repo-url", "");
        core.setFailed(
          `Failed to create repository: ${createRepoResponse.statusCode}`
        );
      }
    } else {
      core.setOutput("repo-url", "");
      core.setFailed(
        `Failed to check repository: ${checkRepoExists.statusCode}`
      );
    }
  } catch (error: any) {
    // failed
    core.setOutput("repo-url", "");
    core.setFailed(error?.message ?? "Failed");
  }
})();
